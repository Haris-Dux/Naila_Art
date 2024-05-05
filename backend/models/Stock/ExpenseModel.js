import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
  },
  reason: {
    type: String,
    required: [true, "reason required"],
  },
  Date: {
    type: Date,
    required: [true, "Date required"],
  },
  rate: {
    type: Number,
    required: [true, "rate required"],
  },
  serial_no: {
    type: Number,
    required: [true, "serial_no required"],
  },
});

const expenseSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Types.ObjectId,
      required: [true, "branchId required"],
    },
    brannchExpenses: [dataSchema],
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model("Expense", expenseSchema);
