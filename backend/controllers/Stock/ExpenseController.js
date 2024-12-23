import moment from "moment-timezone";
import { BranchModel } from "../../models/Branch.Model.js";
import mongoose from "mongoose";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ExpenseModel } from "../../models/Stock/ExpenseModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { VirtalAccountModal } from "../../models/DashboardData/VirtalAccountsModal.js";

export const addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { name, reason, Date, rate, branchId, payment_Method } = req.body;
      if (!name || !reason || !Date || !rate || !branchId)
        throw new Error("Missing Fields");
      const branch = await BranchModel.findOne({ _id: branchId }).session(
        session
      );
      if (!branch) throw new Error("Branch Not Found");
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");

      let existingDailySaleData = await DailySaleModel.findOne({
        branchId,
        date: { $eq: today },
      });
      if (!existingDailySaleData) throw new Error("Daily Sale Not Found Error");

      //UPDATING DAILY SALE
      if (payment_Method) {
        existingDailySaleData.saleData.totalExpense += rate;
        if (payment_Method === "cashSale") {
          existingDailySaleData.saleData.totalCash -= rate;
          //HADLE LOW CASH
          if (existingDailySaleData.saleData.totalCash < 0)
            throw new Error("Not Enough Cash");
          await existingDailySaleData.save({ session });
        } else {
          let virtualAccounts = await VirtalAccountModal.find({})
            .select("-Transaction_History")
            .session(session);
          let updatedAccount = {
            ...virtualAccounts,
            [payment_Method]: (virtualAccounts[0][payment_Method] -= rate),
          };
          const new_balance = updatedAccount[0][payment_Method];
          if (new_balance < 0)
            throw new Error("Not Enough Cash In Payment Method");
          virtualAccounts = updatedAccount;
          await virtualAccounts[0].save({ session });
          await existingDailySaleData.save({ session });
        }
      } else {
        existingDailySaleData.saleData.totalExpense += rate;
        existingDailySaleData.saleData.totalCash -= rate;
        //HADLE LOW CASH
        if (existingDailySaleData.saleData.totalCash < 0) {
          throw new Error("Not Enough Cash");
        }
        await existingDailySaleData.save({ session });
      }

      //GET LAST SERIAL NUMBER
      const lastExpenseS_N = await ExpenseModel.find({
        branchId,
      })
        .sort({ createdAt: -1 })
        .select("serial_no")
        .session(session);
      await ExpenseModel.create(
        [
          {
            branchId,
            name,
            reason,
            Date,
            rate,
            serial_no: lastExpenseS_N[0]?.serial_no + 1 || 1,
            ...(payment_Method && {payment_Method} ),
          },
        ],
        { session }
      );

      return res.status(200).json({ success: true, message: "Expense Added" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllExpenses = async (req, res, next) => {
  try {
    const id = req.query.branchId;
    if (!id) throw new Error("Missing Branch Id");
    const name = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    let query = {
      branchId: id,
      name: { $regex: name, $options: "i" },
    };
    const totalDocuments = await ExpenseModel.countDocuments(query);
    const data = await ExpenseModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const response = {
      data,
      page,
      total_Expense: totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id } = req.body;
      if (!id) throw new Error("Missing Expense Id");
      const ExpenseData = await ExpenseModel.findById(id).session(session);
      if (!ExpenseData) throw new Error("Expense Data Not Found");
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");

      let dailySaleForToday = await DailySaleModel.findOne({
        branchId: ExpenseData.branchId,
        date: { $eq: today },
      }).session(session);
      if (!dailySaleForToday) throw new Error("Daily Sale Not Found Error");

      //UPDATING DAILY SALE AND VIRTUAL ACCOUNTS
      const payment_Method = ExpenseData.payment_Method;
      const rate = ExpenseData.rate;
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({})
          .select("-Transaction_History")
          .session(session);
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] += rate),
        };

        virtualAccounts = updatedAccount;
        await virtualAccounts[0].save({ session });
      } else {
        dailySaleForToday.saleData.totalCash += rate;
        if (dailySaleForToday.saleData.totalCash < 0) {
          throw new Error("Not Enough Cash");
        }
        await dailySaleForToday.save({ session });
      };

      //DEDUCTING EXPENSE FROM THE ACTUAL EXPENSE DATE
      const actualDailySale = await DailySaleModel.findOne({
        branchId: ExpenseData.branchId,
        date: ExpenseData.Date,
      }).session(session);
      if (!actualDailySale) throw new Error("Daily Sale Not Found Error");
      actualDailySale.saleData.totalExpense -= rate;
      await actualDailySale.save({ session }); 

      //DELETE EXPENSE 
      await ExpenseModel.findByIdAndDelete(id).session(session);

      return res.status(200).json({ success: true, message: "Deleted Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getExpensesForBranch = async (req, res, next) => {
  try {
    const { branchId } = req.body;
    if (!branchId) throw new Error("Branch Id required");
    const data = await ExpenseModel.find({ branchId: branchId }).sort({
      createdAt: -1,
    });
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
