import moment from "moment-timezone";
import { BranchModel } from "../../models/Branch.Model.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ExpenseModel } from "../../models/Stock/ExpenseModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import mongoose from "mongoose";

export const addExpense = async (req, res, next) => {
  try {
    const { name, reason, Date, rate, serial_no, branchId } = req.body;
    if (!name || !reason || !Date || !rate || !serial_no || !branchId)
      throw new Error("Missing Fields");
    const branch = await BranchModel.findOne({ _id: branchId });
    if (!branch) throw new Error("Branch Not Found");
    const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");

    const existingDailySaleData = await DailySaleModel.findOne({
      branchId,
      date: { $eq: today },
    });
    if (!existingDailySaleData) throw new Error("Daily Sale Not Found");

    const existingExpenseData = await ExpenseModel.findOne({ branchId });
    let expenseData = { name, reason, Date, rate, serial_no };
    if (existingExpenseData) {
      existingExpenseData.brannchExpenses.push(expenseData);
      existingDailySaleData.saleData.totalExpense += rate;
      existingDailySaleData.saleData.totalSale += rate;
      await Promise.all([
        existingExpenseData.save(),
        existingDailySaleData.save(),
      ]);
    } else {
      await Promise.all([
        ExpenseModel.create({ branchId, brannchExpenses: [expenseData] }),
      ]);
    }
    return res.status(200).json({ success: true, message: "Expense Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllExpenses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = 6;
    let search = req.query.search || "";
    let branchId = req.query.branchId || "";

    const matchStage = {
      $match: {
        branchId: branchId ? new mongoose.Types.ObjectId(branchId) : { $exists: true },
        "brannchExpenses.name": { $regex: search, $options: "i" },
      },
    };

    const unwindStage = { $unwind: "$brannchExpenses" };
    const sortStage = { $sort: { "brannchExpenses.Date": -1 } };

    const paginationStage = [{ $skip: (page - 1) * limit }, { $limit: limit }];

    const pipeLine = [unwindStage, matchStage, sortStage, ...paginationStage];

    const data = await ExpenseModel.aggregate(pipeLine);

    const totalPipeline = [unwindStage, matchStage, { $count: "total" }];

    const totalResult = await ExpenseModel.aggregate(totalPipeline);
    const response = {
      totalPages: Math.ceil(totalResult[0].total / limit),
      page,
      total_Expense: totalResult[0].total,
      data,

    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
