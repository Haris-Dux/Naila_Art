import moment from "moment-timezone";
import { BranchModel } from "../../models/Branch.Model.js";
import mongoose from "mongoose";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ExpenseModel } from "../../models/Stock/ExpenseModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addExpense = async (req, res, next) => {
  try {
    const { name, reason, Date, rate, branchId, payment_Method } = req.body;
    if (!name || !reason || !Date || !rate || !branchId)
      throw new Error("Missing Fields");
    const branch = await BranchModel.findOne({ _id: branchId });
    if (!branch) throw new Error("Branch Not Found");
    const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");

    const existingDailySaleData = await DailySaleModel.findOne({
      branchId,
      date: { $eq: today },
    });
    if (!existingDailySaleData) throw new Error("Daily Sale Not Found");

    const id = new mongoose.Types.ObjectId(branchId)

    const existingExpenseData = await ExpenseModel.findOne({ branchId });
    const result = await ExpenseModel.aggregate([
      { $match : {branchId: new mongoose.Types.ObjectId(branchId)}},
      { $unwind: "$brannchExpenses" },
      { $sort: { "brannchExpenses._id": -1 } },
      { $limit: 1 },
      { $project: { "brannchExpenses.serial_no": 1, _id: 0 } }
    ]);
    const lastSerialNo = result.length > 0 ? result[0].brannchExpenses.serial_no : 0;
    let expenseData = { name, reason, Date, rate, serial_no:lastSerialNo + 1 };
    //UPDATING DAILY SALE
    if (payment_Method) {
      existingDailySaleData.saleData.totalExpense += rate;
      if (payment_Method === "cashSale") {
        existingDailySaleData.saleData.totalCash -= rate;
      } else {
        existingDailySaleData.saleData[payment_Method] -= rate;
      }
    } else {
      existingDailySaleData.saleData.totalExpense += rate;
      existingDailySaleData.saleData.totalCash -= rate;
    }
    if (existingDailySaleData.saleData[payment_Method] < 0)
      throw new Error("Not Enough Cash In Selected Payment Method");
    if (existingDailySaleData.saleData.totalCash < 0)
      throw new Error("Not Enough Total Cash");
    if (existingExpenseData) {
      existingExpenseData.brannchExpenses.push(expenseData);
      await Promise.all([
        existingExpenseData.save(),
        existingDailySaleData.save(),
      ]);
    } else {
      await Promise.all([
        ExpenseModel.create({ branchId, brannchExpenses: [expenseData] }),
        existingDailySaleData.save(),
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

    const limit = 10;
    let search = req.query.search || "";
    let branchId = req.query.branchId || "";
    const matchStage = {
      $match: {
        branchId: branchId
          ? new mongoose.Types.ObjectId(branchId)
          : { $exists: true },
        "brannchExpenses.name": { $regex: search, $options: "i" },
      },
    };

    const unwindStage = { $unwind: "$brannchExpenses" };
    const sortStage = { $sort: { "brannchExpenses.createdAt": -1 } };

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
