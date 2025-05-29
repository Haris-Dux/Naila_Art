import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: [true, "branchId required"],
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Expense Categories",
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
    payment_Method: {
      type: String,
      default: "cashSale",
    },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model("Expense", expenseSchema);

const expenseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name required"],
      unique:true
    },
    branches: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Branches",
      },
    ],
  },
  { timestamps: true }
);

export const ExpenseCategoriesModel = mongoose.model(
  "Expense Categories",
  expenseCategorySchema
);
