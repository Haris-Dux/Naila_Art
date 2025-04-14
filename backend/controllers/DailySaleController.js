import { BranchModel } from "../models/Branch.Model.js";
import { setMongoose } from "../utils/Mongoose.js";
import corn from "node-cron";
import moment from "moment-timezone";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { VA_HistoryModal, VirtalAccountModal } from "../models/DashboardData/VirtalAccountsModal.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/nodemailer.js";
import { PaymentMethodModel } from "../models/PaymentMethods/PaymentMethodModel.js";

export const getTodaysdailySaleforBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Not Found");
    const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
    const dailySale = await DailySaleModel.findOne({
      branchId: id,
      date: { $eq: today },
    });
    if (!dailySale) throw new Error("daily Sale Not Found");
    setMongoose();
    return res.status(200).json(dailySale);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDailySaleHistoryForBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Not Found");
    const date = req.query.search || "";

    const page = req.query.page || 1;
    const limit = 30;

    let query = {
      branchId: id,
      date: { $regex: date, $options: "i" },
    };
    const totalDocuments = await DailySaleModel.countDocuments(query);
    const dailySaleHistory = await DailySaleModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const response = {
      dailySaleHistory,
      page,
      totalPages: Math.ceil(totalDocuments / limit),
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDailySaleById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id not Found");
    const dailySale = await DailySaleModel.findById(id);
    if (!dailySale) throw new Error("Daily Sale Not Found");
    setMongoose();
    return res.status(200).json(dailySale);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cashOutForBranch = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { branchId, amount, payment_Method } = req.body;
      if (!branchId || !amount || !payment_Method)
        throw new Error("Missing Required Fields");
      const branch = await BranchModel.findById(branchId).session(session);
      const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      //DEDUCTING AMOUNT FROM DAILY SALE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: today,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }
      dailySaleForToday.saleData.totalCash -= amount;
      if (dailySaleForToday.saleData.totalCash < 0) {
        throw new Error("Insufficient Cash");
      }
      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({}).session(
          session
        );
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] += amount),
        };
        const new_balance = updatedAccount[0][payment_Method];
        const historyData = {
          date: today,
          transactionType: "Deposit",
          payment_Method,
          new_balance,
          amount,
          note: `Recieved Amount From ${branch.branchName}`,
        };
        virtualAccounts = updatedAccount;
        await virtualAccounts[0].save({ session });
        await VA_HistoryModal.create([historyData], { session });
      } else if (payment_Method === "cashSale") {
        //UPDATING TOTAL CASH FOR HEAD OFFICE
        const headOffice = await BranchModel.findOne({
          branchName: "Head Office",
        });
        if (!headOffice) throw new Error("Cannot find head office data ");
        const dailySaleForHeadOffice = await DailySaleModel.findOne({
          branchId:headOffice._id,
          date: today,
        }).session(session);
        if (!dailySaleForHeadOffice)
          throw new Error("Cannot find daily sales for head office");
        dailySaleForHeadOffice.saleData.totalCash += amount;
        await dailySaleForHeadOffice.save({ session });
      }

      //SEND EMAIL
      const branchCashOutData = {
        branchName: branch.branchName,
        amount: amount,
        date: today,
        payment_Method: payment_Method,
      };
      await sendEmail({
        email: "offical@nailaarts.com",
        email_Type: "Branch Cash Out",
        branchCashOutData,
      });

      return res.status(200).json({ success: true, message: "Success" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession(session);
  }
};

corn.schedule(
  "51 00 * * *",
  async () => {
    try {
      const branchData = await BranchModel.find({});
      const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      const yesterday = moment
        .tz("Asia/Karachi")
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      const dailySalePromises = branchData?.map(async (branch) => {
        try {
          const verifyDuplicateSaleData = await DailySaleModel.findOne({
            branchId: branch._id,
            date: today,
          });
          if (verifyDuplicateSaleData) {
            console.error(
              `Daily Sale Already Exists for ${branch.branchName} on ${today}`
            );
            return null;
          }
          const previousDaySale = await DailySaleModel.findOne({
            branchId: branch._id,
            date: yesterday,
          });
          const activeMethods = await PaymentMethodModel.find({active:{$ne:false}});
          const dynamicMethods = activeMethods.reduce((acc, method) => {
            acc[method.name] = 0;
            return acc;
          }, {});
          return await DailySaleModel.create({
            branchId: branch._id,
            date: today,
            saleData: {
              totalCash: previousDaySale
                ? previousDaySale.saleData.totalCash
                : 0,
                ...dynamicMethods
            },
          });
        } catch (error) {
          console.error(
            `Failed to process branch ${branch.branchName}: ${error.message}`
          );
          return null;
        }
      });
      await Promise.allSettled(dailySalePromises);
    } catch (error) {
      console.error(`Error in scheduled task: ${error.message}`);
    }
  },
  {
    timezone: "Asia/Karachi",
  }
);
