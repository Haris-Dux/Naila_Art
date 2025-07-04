import mongoose from "mongoose";
import { BranchModel } from "../models/Branch.Model.js";
import { BagsAndBoxModel } from "../models/Stock/BagsAndBoxModel.js";
import { DailySaleModel } from "../models/DailySaleModel.js";
import {
  BuyersBillsModel,
  BuyersModel
} from "../models/BuyersModel.js";
import { UserModel } from "../models/User.Model.js";
import { setMongoose } from "../utils/Mongoose.js";
import generatePDF from "../utils/GeneratePdf.js";
import { sendEmail } from "../utils/nodemailer.js";
import moment from "moment-timezone";
import { virtualAccountsService } from "../services/VirtualAccountsService.js";
import { cashBookService } from "../services/CashbookService.js";
import { branchStockModel } from "../models/BranchStock/BranchSuitsStockModel.js";

//TODAY
const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

export const generateBuyersBillandAddBuyer = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        branchId,
        serialNumber,
        name,
        city,
        cargo,
        phone,
        date,
        bill_by,
        payment_Method,
        packaging,
        discount,
        suits_data,
        total,
        paid,
        remaining,
        other_Bill_Data,
        pastBill
      } = req.body;

      //VALIDATING FIELDS DATA
      const requiredFields = [
        "branchId",
        "serialNumber",
        "name",
        "city",
        "cargo",
        "phone",
        "date",
        "bill_by",
        "payment_Method",
        "discount",
        "suits_data",
        "total",
        "paid",
        "remaining",
      ];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        } else if (field === "suits_data") {
          if (suits_data.length < 1)
            throw new Error("Please Add Atleat 1 Suit");
          req.body.suits_data.forEach((suit, index) => {
            const requiredSuitFields = [
              "id",
              "d_no",
              "color",
              "quantity",
              "price",
            ];
            requiredSuitFields.forEach((suit_field) => {
              if (!suit[suit_field]) {
                missingFields.push(`${suit_field} for suit ${index + 1}`);
              }
            });
          });
        }
      });
      if (missingFields.length > 0)
        throw new Error(`Missing Fields ${missingFields}`);
      const branch = await BranchModel.findOne({ _id: branchId }).session(
        session
      );

      //DEDUCTING BOXES FROM STOCK
      if (packaging) {
        const bagsorBoxStock = await BagsAndBoxModel.findById(
          packaging.id
        ).session(session);
        if (!bagsorBoxStock) throw new Error("Packaging Not Found");
        const updatedBagsorBoxQuantity =
          bagsorBoxStock.totalQuantity - parseInt(packaging.quantity);
        if (updatedBagsorBoxQuantity < 0)
          throw new Error(`Not Enough ${bagsorBoxStock.name} in Stock`);
        bagsorBoxStock.totalQuantity = updatedBagsorBoxQuantity;
        await bagsorBoxStock.save({ session });
      }

      //DEDUCTING SUITS FROM STOCK
      const suitsIdsToDeduct = suits_data.map((suit) => suit.id);
      const suitsStock = await branchStockModel.find({_id:suitsIdsToDeduct});
      if (!suitsStock.length) throw new Error("No suitsStock found");
       const bulkOps = suitsStock.map((suit) => {
        const suitToUpdate = suits_data.find((item) => item.id == suit._id);
        const updatedSuitQuantity = suit.total_quantity - suitToUpdate.quantity;
        const updatedSoldQuantity = suit.sold_quantity + suitToUpdate.quantity;
        if (updatedSuitQuantity < 0)
          throw new Error(
            `Not enough stock for suit with Design No: ${suit.d_no}`
          );
        return {
          updateOne : {
            filter: {_id:suit._id},
            update : { $set : {total_quantity : updatedSuitQuantity,sold_quantity:updatedSoldQuantity}}
          }
        }
      });

      await branchStockModel.bulkWrite(bulkOps, {session})

      //CHECK FUTURE DATE
      const isFutureDate = moment
        .tz(date, "Asia/Karachi")
        .isAfter(moment.tz(today, "Asia/Karachi"));

      //ADDING IN DAILY SALE AND HANDLING PAST SALE
      let dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);

      //PAST SALE HANDLING
      if (date !== today && !isFutureDate) {
        if (!dailySaleForToday) {
          //GET LAST CREATED SALE TOTAL CASH
          const totalCashFromLastSale = await findLastSaleBeforeDate(
            branchId,
            date,
            session
          );

          //CREATE NEW DAILY SALE FOR PAST DATE
          const newDailySale = new DailySaleModel({
            branchId,
            date,
            saleData: {
              totalCash: totalCashFromLastSale,
            },
          });
          await newDailySale.save({ session });
          dailySaleForToday = newDailySale;

          //UPDATING THE SALE BETWEEN PAST DATE AND TODAY

          if (payment_Method === "cashSale") {
            let currentDate = moment(date);
            const endDate = moment(today);

            while (currentDate.isBefore(endDate)) {
              currentDate.add(1, "days");
              const formattedDate = currentDate.format("YYYY-MM-DD");

              const dailySale = await DailySaleModel.findOne({
                branchId,
                date: formattedDate,
              }).session(session);

              if (dailySale) {
                // Step 4: Update existing sales
                console.log(`Updated existing sale for ${formattedDate}`);
                // Example update
                dailySale.saleData.totalCash +=
                  paid + (other_Bill_Data?.o_b_amount ?? 0);
                await dailySale.save({ session });
              } else {
                console.log(`No sale found for ${formattedDate}, skipping.`);
              }
            }
          }
        } else if (dailySaleForToday) {
          //IF DAILY SALE EXISTS FOR THAT PAST DATE

          //UPDATING THE SALE BETWEEN PAST DATE AND TODAY

          if (payment_Method === "cashSale") {
            let currentDate = moment(date);
            const endDate = moment(today);

            while (currentDate.isSameOrBefore(endDate)) {
              // Use `isSameOrBefore` for inclusive comparison
              const formattedDate = currentDate.format("YYYY-MM-DD");

              const dailySale = await DailySaleModel.findOne({
                branchId,
                date: formattedDate,
              }).session(session);

              if (dailySale) {
                // Update existing sales
                console.log(`Updated existing sale for ${formattedDate}`);
                dailySale.saleData.totalCash +=
                  paid + (other_Bill_Data?.o_b_amount ?? 0);
                await dailySale.save({ session });
              } else {
                console.log(`No sale found for ${formattedDate}, skipping.`);
              }

              currentDate.add(1, "days"); // Increment to the next day
            }
          }
        }
      } else if (!dailySaleForToday && date === today) {
        throw new Error("Daily Sale Not Found For Today");
      } else if (!dailySaleForToday && isFutureDate) {
        throw new Error("Invalid future date error");
      }

      //calculating profit
      let TotalProfit = 0;
      let profitDataForHistory = [];
      suits_data.forEach((suit) => {
        const suitInStock = suitsStock.find((item) => item._id == suit.id);
        const profitOnSale = suit.price - suitInStock.cost_price;
        profitDataForHistory.push({
          d_no: suit.d_no,
          color: suit.color,
          category: suitInStock.category,
          suitId: suit.id,
          quantity: suit.quantity,
          suitSalePrice: suit.price,
          profit: profitOnSale,
          quantity_for_return: suit.quantity,
        });
        TotalProfit += profitOnSale * suit.quantity;
      });

      let updatedSaleData = {
        ...dailySaleForToday.saleData,
        [payment_Method]: (dailySaleForToday.saleData[payment_Method] +=
          paid + (other_Bill_Data?.o_b_amount ?? 0)),
        totalSale: (dailySaleForToday.saleData.totalSale += paid),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit += paid),
        todayBuyerDebit: (dailySaleForToday.saleData.todayBuyerDebit +=
          remaining > 0 ? remaining : 0),
        totalProfit: (dailySaleForToday.saleData.totalProfit += TotalProfit),
      };

      if (payment_Method === "cashSale") {
        updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
          paid + (other_Bill_Data?.o_b_amount ?? 0);
      }

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //TOTAL AMOUNT PAID + OTHER BILL
      const totalAmount = paid + (other_Bill_Data?.o_b_amount ?? 0);

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount: totalAmount,
          transactionType: "Deposit",
          date,
          note: `Bill Generated For : ${name}`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      };

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: pastBill,
        branchId,
        amount: totalAmount,
        tranSactionType: "Deposit",
        transactionFrom: "Buyer Bills",
        partyName: name,
        payment_Method,
        session,
        ...(pastBill && { pastDate: date }),
      };

      await cashBookService.createCashBookEntry(dataForCashBook);

      //DATA FOR VIRTUAL ACCOUNT OF BUYER
      const total_debit = remaining;
      const total_credit = paid;
      const total_balance = remaining;
      let status = "";

      switch (true) {
        case total_balance === 0:
          status = "Paid";
          break;
        case total_balance === total_debit &&
          total_credit > 0 &&
          total_balance > 0:
          status = "Partially Paid";
          break;
        case total_credit === 0 &&
          (total_balance === total_credit || total_balance === total_debit):
          status = "Unpaid";
          break;
        case total_balance < 0:
          status = "Advance Paid";
          break;
        default:
          status = "";
      }

      const virtualAccountData = {
        total_debit,
        total_credit,
        total_balance,
        status,
      };

      //DATA FOR CREDIT DEBIT HISTORY

      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${serialNumber}`,
          debit: total,
          balance: total,
        },
      ];
      if (paid > 0) {
        credit_debit_history_details.push({
          date,
          particular: payment_Method,
          credit: paid,
          balance: remaining,
        });
      }

      //GENERATING AUTO SERIAL NUMBER
      const lastDocument = await BuyersModel.findOne()
        .sort({ _id: -1 })
        .select("autoSN")
        .session(session);

      const lastAutoSN = lastDocument ? lastDocument.autoSN : 0;

      //CREATING BUYER
      const buyerResult = await BuyersModel.create(
        [
          {
            branchId,
            serialNumber,
            autoSN: lastAutoSN + 1,
            name,
            city,
            cargo,
            phone,
            date,
            bill_by,
            payment_Method,
            packaging,
            discount,
            suits_data,
            virtual_account: virtualAccountData,
            credit_debit_history: credit_debit_history_details,
          },
        ],
        { session }
      );

      //CREATING BILL HISTORY
      await BuyersBillsModel.create(
        [
          {
            branchId,
            buyerId: buyerResult[0]._id,
            serialNumber,
            autoSN: lastAutoSN + 1,
            date,
            name,
            phone,
            total,
            paid,
            remaining,
            TotalProfit,
            payment_Method,
            city,
            profitDataForHistory,
            ...(other_Bill_Data ? { other_Bill_Data } : {}),
          },
        ],
        { session }
      );

      //SEND EMAIL
      const BillEmailData = {
        serialNumber,
        branchName: branch.branchName,
        name,
        phone,
        date,
        bill_by,
        payment_Method,
        debit: virtualAccountData.total_debit,
        credit: virtualAccountData.total_credit,
        balance: virtualAccountData.total_balance,
        status: virtualAccountData.status,
      };

      await sendEmail({
        email: "offical@nailaarts.com",
        email_Type: "Buyer Bill",
        BillEmailData,
      });

      return res
        .status(200)
        .json({ succes: true, message: "Bill Generated Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const generateBillForOldbuyer = async (req, res, nex) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        buyerId,
        branchId,
        serialNumber,
        name,
        city,
        cargo,
        phone,
        date,
        bill_by,
        payment_Method,
        packaging,
        discount,
        suits_data,
        total,
        paid,
        remaining,
        other_Bill_Data,
        pastBill
      } = req.body;

      //VALIDATING FIELDS DATA
      const requiredFields = [
        "buyerId",
        "branchId",
        "serialNumber",
        "name",
        "city",
        "cargo",
        "phone",
        "date",
        "bill_by",
        "payment_Method",
        "discount",
        "suits_data",
        "total",
        "paid",
        "remaining",
      ];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        } else if (field === "suits_data") {
          if (suits_data.length < 1)
            throw new Error("Please Add Atleat 1 Suit");
          req.body.suits_data.forEach((suit, index) => {
            const requiredSuitFields = [
              "id",
              "d_no",
              "color",
              "quantity",
              "price",
            ];
            requiredSuitFields.forEach((suit_field) => {
              if (!suit[suit_field]) {
                missingFields.push(`${suit_field} for suit ${index + 1}`);
              }
            });
          });
        }
      });
      if (missingFields.length > 0)
        throw new Error(`Missing Fields ${missingFields}`);
      const branch = await BranchModel.findOne({ _id: branchId }).session(
        session
      );
      if (!branch) throw new Error("Branch Not Found");

      //DEDUCTING BAGS OR BOXES FROM STOCK
      if (packaging) {
        const bagsorBoxStock = await BagsAndBoxModel.findById(
          packaging.id
        ).session(session);
        if (!bagsorBoxStock) throw new Error("Packaging Not Found");
        const updatedBagsorBoxQuantity =
          bagsorBoxStock.totalQuantity - parseInt(packaging.quantity);
        if (updatedBagsorBoxQuantity < 0)
          throw new Error(`Not Enough ${bagsorBoxStock.name} in Stock`);
        bagsorBoxStock.totalQuantity = updatedBagsorBoxQuantity;
        await bagsorBoxStock.save({ session });
      }

      //DEDUCTING SUITS FROM STOCK
      const suitsIdsToDeduct = suits_data.map((suit) => suit.id);
      const suitsStock = await branchStockModel.find({_id:suitsIdsToDeduct});
      if (!suitsStock.length) throw new Error("No suitsStock found");
       const bulkOps = suitsStock.map((suit) => {
        const suitToUpdate = suits_data.find((item) => item.id == suit._id);
        const updatedSuitQuantity = suit.total_quantity - suitToUpdate.quantity;
        const updatedSoldQuantity = suit.sold_quantity + suitToUpdate.quantity;
        if (updatedSuitQuantity < 0)
          throw new Error(
            `Not enough stock for suit with Design No: ${suit.d_no}`
          );
        return {
          updateOne : {
            filter: {_id:suit._id},
            update : { $set : {total_quantity : updatedSuitQuantity,sold_quantity:updatedSoldQuantity} }
          }
        }
      });

      await branchStockModel.bulkWrite(bulkOps, {session})

      //CHECK FUTURE DATE
      const isFutureDate = moment
        .tz(date, "Asia/Karachi")
        .isAfter(moment.tz(today, "Asia/Karachi"));

      //ADDING IN DAILY SALE
      let dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (date !== today && !isFutureDate) {
        //IF NO DAILY SALE EXIST FOR THAT PAST DATE
        if (!dailySaleForToday) {
          //GET LAST CREATED SALE TOTAL CASH
          const totalCashFromLastSale = await findLastSaleBeforeDate(
            branchId,
            date,
            session
          );

          //CREATE NEW DAILY SALE FOR PAST DATE
          const newDailySale = new DailySaleModel({
            branchId,
            date,
            saleData: {
              totalCash: totalCashFromLastSale,
            },
          });
          await newDailySale.save({ session });
          dailySaleForToday = newDailySale;

          //UPDATING THE SALE BETWEEN PAST DATE AND TODAY

          if (payment_Method === "cashSale") {
            let currentDate = moment(date);
            const endDate = moment(today);

            while (currentDate.isBefore(endDate)) {
              currentDate.add(1, "days");
              const formattedDate = currentDate.format("YYYY-MM-DD");

              const dailySale = await DailySaleModel.findOne({
                branchId,
                date: formattedDate,
              }).session(session);

              if (dailySale) {
                // Step 4: Update existing sales
                console.log(`Updated existing sale for ${formattedDate}`);
                // Example update
                dailySale.saleData.totalCash +=
                  paid + (other_Bill_Data?.o_b_amount ?? 0);
                await dailySale.save({ session });
              } else {
                console.log(`No sale found for ${formattedDate}, skipping.`);
              }
            }
          }
        } else if (dailySaleForToday) {
          //IF DAILY SALE EXISTS FOR THAT PAST DATE

          //UPDATING THE SALE BETWEEN PAST DATE AND TODAY

          if (payment_Method === "cashSale") {
            let currentDate = moment(date); // Start from the current date
            const endDate = moment(today); // Subtract 1 day to include up to `endDate - 1`

            while (currentDate.isSameOrBefore(endDate)) {
              // Use `isSameOrBefore` for inclusive comparison
              const formattedDate = currentDate.format("YYYY-MM-DD");

              const dailySale = await DailySaleModel.findOne({
                branchId,
                date: formattedDate,
              }).session(session);

              if (dailySale) {
                // Update existing sales
                console.log(`Updated existing sale for ${formattedDate}`);
                dailySale.saleData.totalCash +=
                  paid + (other_Bill_Data?.o_b_amount ?? 0);
                await dailySale.save({ session });
              } else {
                console.log(`No sale found for ${formattedDate}, skipping.`);
              }

              currentDate.add(1, "days"); // Increment to the next day
            }
          }
        }
      } else if (!dailySaleForToday && date === today) {
        throw new Error("Daily Sale Not Found For Today");
      } else if (!dailySaleForToday && isFutureDate) {
        throw new Error("Invalid future date error");
      }

      //calculating profit
      let TotalProfit = 0;
      let profitDataForHistory = [];
      suits_data.forEach((suit) => {
        const suitInStock = suitsStock.find((item) => item._id == suit.id);
        const profitOnSale = suit.price - suitInStock.cost_price;
        profitDataForHistory.push({
          d_no: suit.d_no,
          color: suit.color,
          category: suitInStock.category,
          suitId: suit.id,
          quantity: suit.quantity,
          suitSalePrice: suit.price,
          profit: profitOnSale,
          quantity_for_return: suit.quantity,
        });
        TotalProfit += profitOnSale * suit.quantity;
      });

      //TOTAL AMOUNT PAID + OTHER BILL
      const totalAmount = paid + (other_Bill_Data?.o_b_amount ?? 0);

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount: totalAmount,
          transactionType: "Deposit",
          date,
          note: `Bill Generated For : ${name}`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      };

          //PUSH DATA FOR CASH BOOK
          const dataForCashBook = {
            pastTransaction: pastBill,
            branchId,
            amount:totalAmount,
            tranSactionType: "Deposit",
            transactionFrom: "Buyer Bills",
            partyName: name,
            payment_Method,
            session,
            ...(pastBill && { pastDate: date }),
          };

          await cashBookService.createCashBookEntry(dataForCashBook);

      //UPDATING DAILY SALE

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        [payment_Method]: (dailySaleForToday.saleData[payment_Method] +=
          paid + (other_Bill_Data?.o_b_amount ?? 0)),
        totalSale: (dailySaleForToday.saleData.totalSale += paid),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit += paid),
        todayBuyerDebit: (dailySaleForToday.saleData.todayBuyerDebit +=
          remaining > 0 ? remaining : 0),
        totalProfit: (dailySaleForToday.saleData.totalProfit += TotalProfit),
      };

      if (payment_Method === "cashSale") {
        updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
          paid + (other_Bill_Data?.o_b_amount ?? 0);
      }

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //GETTING BUYERS PREVIOUS DATA
      const buyerData = await BuyersModel.findById({ _id: buyerId }).session(
        session
      );
      if (!buyerData) throw new Error("Buyer Data Not Found");

      //DATA FOR VIRTUAL ACCOUNT
      const new_total_debit = buyerData.virtual_account.total_debit + remaining;
      const new_total_credit = buyerData.virtual_account.total_credit + paid;
      const new_total_balance =
        buyerData.virtual_account.total_balance + remaining;
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
        case new_total_credit === 0 &&
          (new_total_balance === new_total_credit ||
            new_total_balance === new_total_debit):
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

      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${serialNumber}`,
          debit: total,
          balance: buyerData.virtual_account.total_balance + total,
        },
      ];
      if (paid > 0) {
        credit_debit_history_details.push({
          date,
          particular: payment_Method,
          credit: paid,
          balance: new_total_balance,
        });
      }

      // UPDATING BUYER DATA
      await BuyersModel.findByIdAndUpdate(
        buyerId,
        {
          branchId,
          serialNumber,
          name,
          city,
          cargo,
          phone,
          date,
          bill_by,
          payment_Method,
          packaging,
          discount,
          virtual_account: virtualAccountData,
          $push: {
            credit_debit_history: { $each: credit_debit_history_details },
            suits_data: { $each: suits_data },
          },
        },
        { session }
      );

      //CREATING BILL HISTORY
      await BuyersBillsModel.create(
        [
          {
            branchId,
            buyerId: buyerData._id,
            serialNumber,
            autoSN: buyerData.autoSN,
            date,
            name,
            phone,
            total,
            paid,
            remaining,
            TotalProfit,
            payment_Method,
            city,
            profitDataForHistory,
            ...(other_Bill_Data ? { other_Bill_Data } : {}),
          },
        ],
        { session }
      );

      //SEND EMAIL
      const BillEmailData = {
        serialNumber,
        branchName: branch.branchName,
        name,
        phone,
        date,
        bill_by,
        payment_Method,
        debit: virtualAccountData.total_debit,
        credit: virtualAccountData.total_credit,
        balance: virtualAccountData.total_balance,
        status: virtualAccountData.status,
      };

      await sendEmail({
        email: "offical@nailaarts.com",
        email_Type: "Buyer Bill",
        BillEmailData,
      });

      return res
        .status(200)
        .json({ succes: true, message: "Bill Generated Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getBuyersForBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    const page = parseInt(req.query.page) || 1;
    let limit = 20;
    let search = req.query.search || "";
    let branchQuery = req.query.branchId || "";
    const status = req.query.status || "";

    if (!id) throw new Error("User Id Required");
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User Not Found");

    let query = {};

    if (user.role === "superadmin" && branchQuery) {
      query.branchId = branchQuery;
    } else if (user.role !== "superadmin") {
      query.branchId = user.branchId;
    }

    if (status) {
      query["virtual_account.status"] = status;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const totalBuyers = await BuyersModel.countDocuments(query);

    const buyers = await BuyersModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const response = {
      buyers,
      page,
      totalBuyers,
      totalPages: Math.ceil(totalBuyers / limit),
    };
    setMongoose();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBuyerById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Buyer Id Required");
    const buyer = await BuyersModel.findById(id);
    if (!buyer) throw new Error("Buyer Not Found");
    setMongoose();
    return res.status(200).json(buyer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validateD_NoAndGetSuitData = async (req, res, next) => {
  try {
    const { d_no, branchId } = req.body;
    if (!d_no) throw new Error("D No Required");
    if (!branchId) throw new Error("Please Select Branch First");
    const branch = await BranchModel.findById(branchId);
    if (!branch) throw new Error("Branch Not Found");
    const suitData = branch.stockData.filter(
      (item) => item.d_no === parseInt(d_no)
    );
    if (!suitData) throw new Error("Suit Data Not Found");
    setMongoose();
    return res.status(200).json(suitData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validateAndGetOldBuyerData = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const oldBuyerData = await BuyersModel.find({
      name: { $regex: name, $options: "i" },
    });
    if (!oldBuyerData) throw new Error("No Data Found With This Buyer Name");
    setMongoose();
    return res.status(200).json({ success: true, oldBuyerData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const generatePdfFunction = async (req, res, next) => {
  try {
    const data = req.body;
    const pdfBuffer = await generatePDF(data.modifiedBillData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${data.modifiedBillData.name}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.status(200).end(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBuyerBillHistoryForBranch = async (req, res, next) => {
  try {
    const id  = req.query.id;
    if (!id) throw new Error("Branch Id Required");
    const name = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    let query = {
      branchId: id,
      name: { $regex: name, $options: "i" },
    };

    const totalDocuments = await BuyersBillsModel.countDocuments(query);
    const data = await BuyersBillsModel.find(query)
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

//COMMON
const findLastSaleBeforeDate = async (branchId, providedDate, session) => {
  const lastSale = await DailySaleModel.findOne({
    branchId,
    date: { $lt: providedDate },
  })
    .sort({ date: -1 })
    .session(session);

  if (!lastSale) {
    return 0;
  }
  return lastSale.saleData.totalCash || 0;
};
