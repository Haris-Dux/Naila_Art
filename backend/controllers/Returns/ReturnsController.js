import mongoose from "mongoose";
import { BranchModel } from "../../models/Branch.Model.js";
import { BuyersBillsModel, BuyersModel } from "../../models/BuyersModel.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ReturnSuitModel } from "../../models/Returns/ReturnModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { CalenderModel } from "../../models/Process/CalenderModel.js";
import { CuttingModel } from "../../models/Process/CuttingModel.js";
import { StoneModel } from "../../models/Process/StoneModel.js";
import { StitchingModel } from "../../models/Process/StitchingModel.js";

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
      const branch = await BranchModel.findById(branchId).session(session);
      const suitsIds = suits_data.map((suit) => suit.id);
      const suitsStockToUpdate = branch.stockData.filter((mainStock) =>
        suitsIds.some((id) => mainStock.Item_Id.equals(id))
      );
      suitsStockToUpdate.forEach((suit) => {
        const suitToUpdate = suits_data.find((item) => item.id == suit.Item_Id);
        const updatedSuitQuantity = suit.quantity + suitToUpdate.quantity;
        suit.quantity = updatedSuitQuantity;
        return suit;
      });
      await branch.save({ session });

      //GETTING DAILY SALE FOR CURRENT DAY
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: date,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for Today");
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
      suits_data.forEach((suit) => {
        buyerBill.profitDataForHistory.forEach((record) => {
          if (record.suitId === suit.id) {
            const amount = record.profit * suit.quantity;
            profitToDeduct += amount;
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
      dailySaleForSaleDay.saleData.totalSale -= T_Return_Amount;
      if (dailySaleForSaleDay.saleData.totalSale < 0) {
        throw new Error(
          `Invalid Return Request.Total Sale for ${bill_Date} cannot be less then 0`
        );
      }
      await buyerBill.save({ session });
      await dailySaleForSaleDay.save({ session });

      //GET BUYER DETAILS
      const buyer = await BuyersModel.findById(buyerId).session(session);

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
          particular: "Return Payment",
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
          particular: `Return Payment`,
          credit: Amount_Payable,
          balance: buyer.virtual_account.total_balance - Amount_Payable,
        };

        //UPDATING USER DATA IN DB

        buyer.virtual_account = virtualAccountData;
        buyer.credit_debit_history.push(credit_debit_history_details);

        await buyer.save({ session });
      } else if (Amount_Payable > 0 && method === "cash") {
        dailySaleForToday.saleData.totalCash -= Amount_Payable;
        if (dailySaleForToday.saleData.totalCash < 0) {
          throw new Error("Not Enough Total Cash");
        }
        await dailySaleForToday.save({ session });
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

export const temporaryendpoint = async (req, res, next) => {
  try {
    const { serial_No, category, Manual_No } = req.body;
    if (!serial_No || !category || !Manual_No) {
      throw new Error("Missing Fields");
    }

    let Data = {};

    switch (true) {
      case category === "Embroidery":
        Data = await EmbroideryModel.findOne({ serial_No: serial_No });
        break;
      case category === "Calender":
        Data = await CalenderModel.findOne({ serial_No: serial_No });
        break;
      case category === "Cutting":
        Data = await CuttingModel.findOne({ serial_No: serial_No });
        break;
      case category === "Stones":
        Data = await StoneModel.findOne({ serial_No: serial_No });
        break;
      case category === "Stitching":
        Data = await StitchingModel.findOne({ serial_No: serial_No });
        break;

      default:
        throw new Error("Invalid category");
    }

    if (!Data) throw new Error("No Data Found With For This Name");

    Data.Manual_No = Manual_No;
    await Data.save();
    return res.status(200).json({ success: true, message: "Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
