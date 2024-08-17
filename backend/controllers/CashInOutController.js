import mongoose from "mongoose";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { BuyersModel } from "../models/BuyersModel.js";
import { SellersModel } from "../models/sellers/SellersModel.js";
import { setMongoose } from "../utils/Mongoose.js";
import { CashInOutModel } from "../models/CashInOutModel.js";
import moment from "moment-timezone";
import corn from "node-cron";
import { BranchModel } from "../models/Branch.Model.js";

export const validatePartyNameForMainBranch = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const projection = "name phone _id";
    const Data = await Promise.all([
      BuyersModel.find({ name: { $regex: name, $options: "i" } }, projection),
      SellersModel.find({ name: { $regex: name, $options: "i" } }, projection),
    ]);
    if (!Data) throw new Error("No Data Found With For This Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validatePartyNameForOtherBranches = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const projection = "name phone _id";
    const Data = await BuyersModel.find(
      { name: { $regex: name, $options: "i" } },
      projection
    );
    if (!Data) throw new Error("No Data Found With This Buyer Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cashIn = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { cash, partyId, branchId, payment_Method, date } = req.body;
      if (!cash || !partyId || !payment_Method || !date || !branchId)
        throw new Error("All Fields Required");
      const userDataToUpdate = await BuyersModel.findById(partyId);

      if (userDataToUpdate.virtual_account.total_balance === 0)
        throw new Error("Balance Cleared");

      if (!userDataToUpdate)
        throw new Error("No Data Found With This Party Id");

      //DAILY SLAE UPDATE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] += cash),
        totalSale: (dailySaleForToday.saleData.totalSale += cash),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit += cash),
        totalCash: (dailySaleForToday.saleData.totalCash += cash),
      };

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //DATA FOR VIRTUAL ACCOUNT
      const new_total_debit =
        userDataToUpdate.virtual_account.total_debit - cash;
      const new_total_credit =
        userDataToUpdate.virtual_account.total_credit + cash;
      const new_total_balance =
        userDataToUpdate.virtual_account.total_balance - cash;
      let new_status = "";

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_debit && new_total_credit > 0:
          new_status = "Partially Paid";
          break;
        case new_total_credit === 0 && new_total_balance === new_total_debit:
          new_status = "Unpaid";
          break;
      }

      if (new_total_balance < 0)
        throw new Error("Invalid Balance Amount For This Party");

      const virtualAccountData = {
        total_debit: new_total_debit,
        total_credit: new_total_credit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY

      const credit_debit_history_details = {
        date,
        particular: payment_Method,
        credit: cash,
        balance: userDataToUpdate.virtual_account.total_balance - cash,
      };

      //UPDATING USER DATA IN DB

      userDataToUpdate.virtual_account = virtualAccountData;
      userDataToUpdate.credit_debit_history.push(credit_debit_history_details);

      await userDataToUpdate.save({ session });

      //UPDATING CASH IN OUT
      const todayCashInOut = await CashInOutModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!todayCashInOut) throw new Error("Cash In Out Not Found For Today");
      todayCashInOut.todayCashIn += cash;
      await todayCashInOut.save({ session });

      return res
        .status(200)
        .json({ sucess: true, message: "Cash In Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cashOut = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { cash, partyId, branchId, payment_Method, date } = req.body;
      if (!cash || !partyId || !payment_Method || !date || !branchId)
        throw new Error("All Fields Required");
      const userDataToUpdate = await SellersModel.findById(partyId);

      if (userDataToUpdate.virtual_account.total_balance === 0)
        throw new Error("Balance Cleared");

      if (!userDataToUpdate)
        throw new Error("No Data Found With This Party Id");

      //DAILY SLAE UPDATE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        totalCash: (dailySaleForToday.saleData.totalCash -= cash),
      };

      if (updatedSaleData.totalCash < 0)
        throw new Error("Not Enough Total Cash");

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //DATA FOR VIRTUAL ACCOUNT
      const new_total_debit =
        userDataToUpdate.virtual_account.total_debit + cash;
      const new_total_credit =
        userDataToUpdate.virtual_account.total_credit - cash;
      const new_total_balance =
        userDataToUpdate.virtual_account.total_balance - cash;
      let new_status;

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_credit && new_total_debit > 0:
          new_status = "Partially Paid";
          break;
        case new_total_debit === 0 && new_total_balance === new_total_credit:
          new_status = "Unpaid";
          break;
      }

      if (new_total_balance < 0)
        throw new Error("Invalid Balance Amount For This Party");

      const virtualAccountData = {
        total_debit: new_total_debit,
        total_credit: new_total_credit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY

      const credit_debit_history_details = {
        date,
        particular: payment_Method,
        debit: cash,
        balance: userDataToUpdate.virtual_account.total_balance - cash,
      };

      //UPDATING USER DATA IN DB

      userDataToUpdate.virtual_account = virtualAccountData;
      userDataToUpdate.credit_debit_history.push(credit_debit_history_details);

      await userDataToUpdate.save({ session });

      //UPDATING CASH IN OUT
      const todayCashInOut = await CashInOutModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!todayCashInOut) throw new Error("Cash In Out Not Found For Today");
      todayCashInOut.todayCashOut += cash;
      await todayCashInOut.save({ session });

      return res
        .status(200)
        .json({ sucess: true, message: "Cash Out Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTodaysCashInOut = async (req, res, next) => {
  try {
    const { branchId } = req.body;
    if (!branchId) throw new Error("Branch Id Not Found");
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
    const projection = "saleData.totalCash";
    const TodaysCashInOut = await CashInOutModel.findOne({
      date: { $eq: today },
      branchId,
    });
    const TodaysDailySale = await DailySaleModel.findOne(
      { date: { $eq: today }, branchId },
      projection
    );
 
    const data = { ...TodaysCashInOut._doc, ...TodaysDailySale._doc };
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

corn.schedule(
  "01 00 * * *",
  async () => {
    try {
      const branchData = await BranchModel.find({});
      const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      const dailyCashInOutPromises = branchData?.map(async (branch) => {
        const verifyDuplicateData = await CashInOutModel.findOne({
          branchId: branch._id,
          date: today,
        });
        if (verifyDuplicateData)
          throw new Error(
            `Cash In Out Data Already Exists for ${verifyDuplicateData.date}`
          );
        return await CashInOutModel.create({
          branchId: branch._id,
          date: today,
          todayCashIn: 0,
          todayCashOut: 0,
        });
      });
      await Promise.all(dailyCashInOutPromises);
    } catch (error) {
      throw new Error({ error: error.message });
    }
  },
  {
    timezone: "Asia/Karachi",
  }
);
