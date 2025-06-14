import mongoose from "mongoose";
import { BuyersBillsModel, BuyersModel } from "../../models/BuyersModel.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ReturnSuitModel } from "../../models/Returns/ReturnModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { branchStockModel } from "../../models/BranchStock/BranchSuitsStockModel.js";
import { cashBookService } from "../../services/CashbookService.js";
import moment from "moment-timezone";

export const createReturn = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // CHECKING FOR REQUIRED FIELDS
      const {
        branchId,
        buyerId,
        bill_Id,
        partyName,
        serialNumber,
        phone,
        date,
        bill_Date,
        T_Return_Amount,
        Amount_From_Balance,
        Amount_Payable,
        suits_data,
        method,
      } = req.body;

      const requiredFields = [
        "branchId",
        "buyerId",
        "method",
        "bill_Id",
        "partyName",
        "serialNumber",
        "phone",
        "date",
        "bill_Date",
        "T_Return_Amount",
        "Amount_From_Balance",
        "Amount_Payable",
        "suits_data",
      ];

      const requiredSuitsFields = [
        "id",
        "d_no",
        "color",
        "category",
        "quantity",
        "price",
      ];
      const missingFields = [];

      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        }
        if (field === "suits_data") {
          suits_data.forEach((suit, index) => {
            const missingSuitFields = [];
            requiredSuitsFields.forEach((requiredField) => {
              if (!suit[requiredField]) {
                missingSuitFields.push(requiredField);
              }
            });
            if (missingSuitFields.length > 0) {
              missingFields.push(
                `Suit No ${index + 1} is missing: ${missingSuitFields}`
              );
            }
          });
        }
      });

      if (missingFields.length > 0) {
        throw new Error(`Missing Fields: ${missingFields}`);
      }

      if (Amount_Payable > 0 && method === "default-account") {
        throw new Error("Please Select a Valid Method");
      }

      //ADDING RETURN QUANTITY BACK INTO STOCK
      const updateBranchStock = await branchStockModel.bulkWrite(
        suits_data.map((suit) => ({
          updateOne: {
            filter: { _id: suit.id },
            update: {
              $inc: {
                total_quantity: suit.quantity,
                sold_quantity: -suit.quantity,
              },
            },
          },
        })),
        { session }
      );

      if (updateBranchStock.modifiedCount === 0) {
        throw new Error("Failed to update stock");
      }

      //DEDUCTING TOTAL PROFIT FROM SALE DAY
      const dailySaleForSaleDay = await DailySaleModel.findOne({
        branchId,
        date: bill_Date,
      }).session(session);

      if (!dailySaleForSaleDay) {
        throw new Error("Daily sale record not found for Sale Day");
      }
      const buyerBill = await BuyersBillsModel.findById(bill_Id).session(
        session
      );
      let profitToDeduct = 0;
      let amounttodeductFromBillSale = 0;
      suits_data.forEach((suit) => {
        buyerBill.profitDataForHistory.forEach((record) => {
          if (record.suitId === suit.id) {
            const amount = record.profit * suit.quantity;
            profitToDeduct += amount;
            amounttodeductFromBillSale += record.suitSalePrice;
            record.quantity_for_return -= suit.quantity;
            if (record.quantity_for_return < 0) {
              throw new Error(
                `Not Enough Returnable Quantity For (Category/${record.category},Color/${record.color})`
              );
            }
          }
        });
      });
      dailySaleForSaleDay.saleData.totalProfit -= profitToDeduct;
      dailySaleForSaleDay.saleData.totalSale -= amounttodeductFromBillSale;
      if (dailySaleForSaleDay.saleData.totalSale < 0) {
        throw new Error(
          `Invalid Return Request.Total Sale for ${bill_Date} cannot be less then 0`
        );
      }
      await buyerBill.save({ session });
      await dailySaleForSaleDay.save({ session });

      //GET BUYER DETAILS
      const buyer = await BuyersModel.findById(buyerId).session(session);

      const futureDate = moment.tz(date, "Asia/Karachi").startOf("day");
      const now = moment.tz("Asia/Karachi").startOf("day");
      const isFutureDate = futureDate.isAfter(now);
      const isPastDate = futureDate.isBefore(now);
      if (isFutureDate) {
        throw new Error("Invalid Future Date");
      }

      //UPDATE BUYERS ACCOUNT
      if (Amount_Payable <= 0 && method === "default-account") {
        const new_total_debit =
          buyer.virtual_account.total_debit - Amount_From_Balance;
        const new_total_credit =
          buyer.virtual_account.total_credit + Amount_From_Balance;
        const new_total_balance =
          buyer.virtual_account.total_balance - Amount_From_Balance;
        let new_status = "";

        switch (true) {
          case new_total_balance === 0:
            new_status = "Paid";
            break;
          case new_total_balance === new_total_debit &&
            new_total_credit > 0 &&
            new_total_balance > 0:
            new_status = "Partially Paid";
            break;
          case new_total_credit === 0 && new_total_balance === new_total_debit:
            new_status = "Unpaid";
            break;
          case new_total_balance < 0:
            new_status = "Advance Paid";
            break;
          default:
            new_status = "";
        }

        const virtualAccountData = {
          total_debit: new_total_debit,
          total_credit: new_total_credit,
          total_balance: new_total_balance,
          status: new_status,
        };

        //DATA FOR CREDIT DEBIT HISTORY
        const credit_debit_history_details = {
          date: date,
          particular: `Return Payment for Bill: A.S.N-${buyerBill.autoSN}/S.N-${buyerBill.serialNumber}`,
          credit: Amount_From_Balance,
          balance: buyer.virtual_account.total_balance - Amount_From_Balance,
        };

        //UPDATING Buyer DATA IN DB
        buyer.virtual_account = virtualAccountData;
        buyer.credit_debit_history.push(credit_debit_history_details);
        await buyer.save({ session });
      } else if (Amount_Payable > 0 && method === "account") {
        const new_total_debit =
          buyer.virtual_account.total_debit >= 0
            ? -Amount_Payable
            : buyer.virtual_account.total_debit - Amount_Payable;
        const new_total_credit = buyer.virtual_account.total_credit;
        const new_total_balance =
          buyer.virtual_account.total_balance >= 0
            ? -Amount_Payable
            : buyer.virtual_account.total_balance - Amount_Payable;
        let new_status = "Advance Paid";

        const virtualAccountData = {
          total_debit: new_total_debit,
          total_credit: new_total_credit,
          total_balance: new_total_balance,
          status: new_status,
        };

        //DATA FOR CREDIT DEBIT HISTORY

        const credit_debit_history_details = {
          date,
          particular: `Return Payment for Bill: A.S.N-${buyerBill.autoSN}/S.N-${buyerBill.serialNumber}`,
          credit: Amount_Payable,
          balance: buyer.virtual_account.total_balance - Amount_Payable,
        };

        //UPDATING USER DATA IN DB

        buyer.virtual_account = virtualAccountData;
        buyer.credit_debit_history.push(credit_debit_history_details);

        await buyer.save({ session });
      } else if (Amount_Payable > 0 && method === "cash") {
        //CURRENT DAY CASH DEDUCTION
        if (!isPastDate && !isFutureDate) {
          const dailySaleForToday = await DailySaleModel.findOne({
            branchId,
            date: date,
          }).session(session);
          if (!dailySaleForToday) {
            throw new Error("Daily sale record not found for Today");
          }
          dailySaleForToday.saleData.totalCash -= Amount_Payable;
          if (dailySaleForToday.saleData.totalCash < 0) {
            throw new Error("Not Enough Total Cash");
          }
          await dailySaleForToday.save({ session });
        }
        //PAST DATE CASH DEDUCTION
        else if (isPastDate) {
          const targetDate = moment.tz(date, "Asia/Karachi").startOf("day");
          const today = moment.tz("Asia/Karachi").startOf("day");

          const dateList = [];
          const current = moment(targetDate);
          while (current.isSameOrBefore(today)) {
            dateList.push(current.format("YYYY-MM-DD"));
            current.add(1, "day");
          }

          const dailySales = await DailySaleModel.find({
            branchId,
            date: { $in: dateList },
          }).session(session);

          if (dailySales.length !== dateList.length) {
            const foundDates = dailySales.map((d) => d.date);
            const missing = dateList.filter((d) => !foundDates.includes(d));
            throw new Error(
              `Missing Daily Sale records for: ${missing.join(", ")}`
            );
          }

          // Prepare bulk operations
          const bulkOps = dailySales.map((saleDoc) => {
            const update = {
              $inc: {
                "saleData.totalCash": -Amount_Payable,
              },
            };

            const futureCash = saleDoc.saleData.totalCash - Amount_Payable;
            if (futureCash < 0) {
              throw new Error(`Not enough cash on ${saleDoc.date}`);
            }

            return {
              updateOne: {
                filter: { _id: saleDoc._id },
                update,
              },
            };
          });

          await DailySaleModel.bulkWrite(bulkOps, { session });
        }

        if (Amount_From_Balance > 0) {
          const new_total_debit =
            buyer.virtual_account.total_debit - Amount_From_Balance;
          const new_total_credit =
            buyer.virtual_account.total_credit + Amount_From_Balance;
          const new_total_balance =
            buyer.virtual_account.total_balance - Amount_From_Balance;
          let new_status = "Paid";

          const virtualAccountData = {
            total_debit: new_total_debit,
            total_credit: new_total_credit,
            total_balance: new_total_balance,
            status: new_status,
          };

          //DATA FOR CREDIT DEBIT HISTORY
          const credit_debit_history_details = {
            date: date,
            particular: `Return Payment for Bill: A.S.N-${buyerBill.autoSN}/S.N-${buyerBill.serialNumber}`,
            credit: Amount_From_Balance,
            balance: buyer.virtual_account.total_balance - Amount_From_Balance,
          };

          //UPDATING Buyer DATA IN DB
          buyer.virtual_account = virtualAccountData;
          buyer.credit_debit_history.push(credit_debit_history_details);
          await buyer.save({ session });
        }

        //PUSH DATA FOR CASH BOOK
        const dataForCashBook = {
          pastTransaction: isPastDate,
          branchId,
          amount: Amount_Payable,
          tranSactionType: "WithDraw",
          transactionFrom: "Return bills",
          partyName: buyerBill.name,
          payment_Method: "cashSale",
          session,
          ...(isPastDate && { pastDate: date }),
        };

        await cashBookService.createCashBookEntry(dataForCashBook);
      }

      //CREATING RETURN SUIT  BILL
      await ReturnSuitModel.create(
        [
          {
            branchId,
            buyerId,
            bill_Id,
            partyName,
            serialNumber,
            phone,
            date,
            bill_Date,
            T_Return_Amount,
            Amount_From_Balance,
            Amount_Payable,
            suits_data,
          },
        ],
        { session }
      );

      return res
        .status(200)
        .json({ success: true, message: "Return Successfull" });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllReturnsForBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Branch Id Required Found");
    const name = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    const limit = 20;
    let query = {
      branchId: id,
    };
    if (name) {
      query = { ...query, partyName: { $regex: name, $options: "i" } };
    }

    const totalDocuments = await ReturnSuitModel.countDocuments(query);
    const data = await ReturnSuitModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const response = {
      data,
      page,
      totalPages: Math.ceil(totalDocuments / limit),
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
