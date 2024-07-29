import moment from "moment-timezone";
import { BranchModel } from "../../models/Branch.Model.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ExpenseModel } from "../../models/Stock/ExpenseModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addExpense = async (req, res, next) => {
  try {
    const { name, reason, Date, rate, serial_no, branchId } = req.body;
    if (!name || !reason || !Date || !rate || !serial_no || !branchId)
      throw new Error("Missing Fields");
    const branch = await BranchModel.findOne({ _id: branchId });
    if (!branch) throw new Error("Branch Not Found");
    const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
    const existingDailySaleData = await DailySaleModel.findOne({ branchId , date : { $eq:today } });
    const existingExpenseData = await ExpenseModel.findOne({ branchId });
    let expenseData = { name, reason, Date, rate, serial_no };
    let dailySaleData = { branchId, totalExpense: rate, totalSale: rate };
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
        DailySaleModel.create({ branchId, saleData: dailySaleData }),
      ]);
    }
    return res.status(200).json({success:true, message: "Expense Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllExpenses = async (req, res, next) => {
  try {
    const data = await ExpenseModel.find({}).sort({ createdAt: -1 });
    setMongoose();
    return res.status(200).json(data);
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
