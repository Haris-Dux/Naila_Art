import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  transactionType: {
    type: String,
    required: [true, "Transaction Type is required"],
    enum: ["Deposit", "WithDraw"],
  },
  payment_Method: {
    type: String,
    required: [true, "Payment Method is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount Value is required"],
  },
  new_balance: {
    type: Number,
    required: [true, "New balance Value is required"],
  },
  note: {
    type: String,
    required: [true, "Note is required"],
  },
  deleted:{
    type: Boolean,
    default: false,
  }
},{ timestamps: true });

export const VA_HistoryModal = mongoose.model(
  "V.A Transactions",
  historySchema
);


const AccountsSchema = new mongoose.Schema(
  {
    cashInMeezanBank: {
      type: Number,
      default: 0,
    },
    cashInJazzCash: {
      type: Number,
      default: 0,
    },
    cashInEasyPaisa: {
      type: Number,
      default: 0,
    },
    Transaction_History: [historySchema],
  }
);

export const VirtalAccountModal = mongoose.model(
  "Virtual Accounts",
  AccountsSchema
);
