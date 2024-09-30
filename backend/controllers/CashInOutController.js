import mongoose from "mongoose";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { BuyersModel } from "../models/BuyersModel.js";
import { SellersModel } from "../models/sellers/SellersModel.js";
import { setMongoose } from "../utils/Mongoose.js";
import { CashInOutModel } from "../models/CashInOutModel.js";
import moment from "moment-timezone";
import corn from "node-cron";
import { BranchModel } from "../models/Branch.Model.js";
import { processBillsModel } from "../models/Process/ProcessBillsModel.js";
import { sendEmail } from "../utils/nodemailer.js";
import { UserModel } from "../models/User.Model.js";
import { VirtalAccountModal } from "../models/DashboardData/VirtalAccountsModal.js";

export const validatePartyNameForMainBranch = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const projection = "name phone _id";
    const projectionForProcess = "partyName _id serial_No";
    const Data = await Promise.all([
      BuyersModel.find({ name: { $regex: name, $options: "i" } }, projection),
      SellersModel.find({ name: { $regex: name, $options: "i" } }, projection),
      processBillsModel.find(
        { partyName: { $regex: name, $options: "i" } },
        projectionForProcess
      ),
    ]);
    if (!Data) throw new Error("No Data Found With For This Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validatePartyNameForAdminBranch = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const id = req.session.userId;
    if (!id) {
      throw new Error("Please Login Again");
    }
    const user = await UserModel.findById({ _id: id });
    if (user.role !== "admin") throw new Error("User UnAuthorized");
    const projection = "name phone _id";
    const projectionForProcess = "partyName _id serial_No";
    const Data = await Promise.all([
      BuyersModel.find(
        { branchId: user.branchId, name: { $regex: name, $options: "i" } },
        projection
      ),
      SellersModel.find({ name: { $regex: name, $options: "i" } }, projection),
      processBillsModel.find(
        { partyName: { $regex: name, $options: "i" } },
        projectionForProcess
      ),
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
    const id = req.session.userId;
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    if (!id) {
      throw new Error("Please Login Again");
    }
    const user = await UserModel.findById({ _id: id });
    const projection = "name phone _id";
    const Data = await BuyersModel.find(
      { branchId: user.branchId, name: { $regex: name, $options: "i" } },
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
      const userDataToUpdate = await BuyersModel.findById(partyId).session(
        session
      );

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
      };

      if (payment_Method === "cashSale") {
        updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
          cash;
      }

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({})
          .select("-Transaction_History")
          .session(session);
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] += cash),
        };
        virtualAccounts = updatedAccount;
        await virtualAccounts[0].save({ session });
      }

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

      //Sending Email
      const branch = await BranchModel.findById(branchId)
        .select("branchName")
        .session(session);

      const CashInEmailData = {
        branchName: branch.branchName,
        name: userDataToUpdate.name,
        phone: userDataToUpdate.phone,
        amount: cash,
        date: date,
        payment_Method: payment_Method,
      };

      await sendEmail({
        branchName: branch.branchName,
        email: "Nailaarts666@gmail.com",
        email_Type: "Cash In",
        CashInEmailData,
      });

      return res
        .status(200)
        .json({ sucess: true, message: "Cash In Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const cashOut = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { cash, partyId, branchId, payment_Method, date } = req.body;
      if (!cash || !partyId || !payment_Method || !date || !branchId)
        throw new Error("All Fields Required");
      const userDataToUpdate =
        (await SellersModel.findById(partyId).session(session)) ||
        (await processBillsModel.findById(partyId).session(session));

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

      if (payment_Method === "cashSale") {
        dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash -=
          cash;
      }

      if (dailySaleForToday.totalCash < 0)
        throw new Error("Not Enough Total Cash");

      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({}).session(session);
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] -= cash),
        };
        const new_balance = updatedAccount[0][payment_Method];
       const historyData = {
          date,
          transactionType:"WithDraw",
          payment_Method,
          new_balance,
          amount:cash,
          note:"Cash Out Transaction",
        };
        if (new_balance < 0)
          throw new Error("Not Enough Cash In Payment Method");
        virtualAccounts = updatedAccount;
        virtualAccounts[0].Transaction_History.push(historyData);
        await virtualAccounts[0].save({ session });
      }

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

      //SEND EMAIL
      const branch = await BranchModel.findById(branchId)
        .select("branchName")
        .session(session);
      const CashOutEmailData = {
        branchName: branch.branchName,
        name: userDataToUpdate.name,
        phone: userDataToUpdate.phone,
        amount: cash,
        date: date,
        payment_Method: payment_Method,
      };
      await sendEmail({
        email: "Nailaarts666@gmail.com",
        email_Type: "Cash Out",
        CashOutEmailData,
      });

      return res
        .status(200)
        .json({ sucess: true, message: "Cash Out Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
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
        try {
          const verifyDuplicateData = await CashInOutModel.findOne({
            branchId: branch._id,
            date: today,
          });
          if (verifyDuplicateData) {
            console.error(
              `Cash In Out Already Exists for ${branch.branchName} on ${today}`
            );
            return null;
          }
          return await CashInOutModel.create({
            branchId: branch._id,
            date: today,
            todayCashIn: 0,
            todayCashOut: 0,
          });
        } catch (error) {
          console.error(
            `Failed to process branch ${branch.branchName}: ${error.message}`
          );
          return null;
        }
      });
      await Promise.allSettled(dailyCashInOutPromises);
    } catch (error) {
      console.error(`Error in scheduled task: ${error.message}`);
    }
  },
  {
    timezone: "Asia/Karachi",
  }
);
