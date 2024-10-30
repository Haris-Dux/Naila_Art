import mongoose from "mongoose";

const financialDetails = new mongoose.Schema({
    total_debit: {
      type: Number,
      default:0,
    },
    total_credit: {
      type: Number,
      required: [true, "Paid Credit is required"],
    },
    total_balance: {
      type: Number,
      required: [true, "Total Balance value is required"],
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Partially Paid","Advance Paid"],
      default: "Unpaid"
    },
  });
  
  const transaction_details = new mongoose.Schema({
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    particular: {
      type: String,
      required: [true, "Particular is required"],
    },
    debit: {
      type: Number,
      default:0
    },
    credit: {
      type: Number,
      default:0
    },
    balance: {
      type: Number,
      required: [true, "Balance value is required"],
    },
    orderId: {
      type: String,
      required: [true, "Order Id required"],
    },
  });

const processBillsSchema = new mongoose.Schema(
  {
    process_Category: {
      type: String,
      required: [true, "Process Category Value required"],
      enum: ["Embroidery", "Calender", "Cutting", "Stone", "Stitching"],
    },
    partyName: {
      type: String,
      required: [true, "Party Name required"],
    },
    virtual_account: financialDetails,
    credit_debit_history: [transaction_details],
  },
  { timestamps: true }
);

export const processBillsModel = mongoose.model(
  "Process Bills",
  processBillsSchema
);
