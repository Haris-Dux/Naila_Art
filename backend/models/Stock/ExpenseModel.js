import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: [true, "branchId required"],
    },
    name: {
      type: String,
      required: [true, "name required"],
    },
    reason: {
      type: String,
      required: [true, "reason required"],
    },
    Date: {
      type: String,
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
    payment_Method:{
      type: String,
      default:"cashSale"
    }
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model("Expense", expenseSchema);
