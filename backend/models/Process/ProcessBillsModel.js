import mongoose from "mongoose";

const financialDetails = new mongoose.Schema({
    total_debit: {
      type: Number,
      default:null,
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
      enum: ["Paid", "Unpaid", "Partially Paid"],
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
      default:null
    },
    credit: {
      type: Number,
      default:null
    },
    balance: {
      type: Number,
      required: [true, "Balance value is required"],
    },
  });

const processBillsSchema = new mongoose.Schema(
  {
    process_Category: {
      type: String,
      required: [true, "Process Category Value required"],
      enum: ["Embroidery", "Calender", "Cutting", "Stone", "Stitching"],
    },
    serial_No: {
      type: Number,
      required: [true, "Serial No required"],
    },
    partyName: {
      type: String,
      required: [true, "Party Name required"],
    },
    design_no: {
      type: String,
      required: [true, "Design no value required"],
    },
    date: {
      type: String,
      required: [true, "date required"],
    },
    T_Quantity: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Partially Paid"],
      default:"Unpaid"
    },
    rate: {
      type: Number,
      required: [true, "Rate value required"],
    },
    r_quantity: {
      type: Number,
      default: null,
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
