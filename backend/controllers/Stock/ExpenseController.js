import { ExpenseModel } from "../../models/Stock/ExpenseModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addExpense =async (req, res, next) => {
  try {
    const { name, reason, Date, rate, serial_no, branchId } = req.body;
    if (!name || !reason || !Date || !rate || !serial_no || !branchId)
      throw new Error("Missing Fields");
    let expenseData = { name, reason, Date, rate, serial_no } ;
    const existingData = await ExpenseModel.findOne({branchId});
    if(existingData){
        existingData.brannchExpenses.push(expenseData);
        await existingData.save();
    } else {
        await ExpenseModel.create({branchId,brannchExpenses:[expenseData]})
    }
    return res.status(200).json({message:"Expense Added"})
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllExpenses = async (req,res,next) => {
    try {
        const data = await ExpenseModel.find({}).sort({ createdAt: -1 });
        setMongoose();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message }); 
    }
};

export const getExpensesForBranch = async (req,res,next) => {
    try {
        const {branchId} = req.body;
        if(!branchId) throw new Error('Branch Id required');
        const data = await ExpenseModel.find({branchId:branchId}).sort({ createdAt: -1 });
        setMongoose();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message }); 
    }
};
