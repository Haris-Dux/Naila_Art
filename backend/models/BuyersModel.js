import mongoose, { Mongoose } from "mongoose";

const suits_sale_details = new mongoose.Schema({
  suit_id: {
    type: mongoose.Types.ObjectId,
    required: [true, "Suit Id is required"],
  },
  d_no: {
    type: Number,
    required: [true, "Design No is required"],
  },
  color: {
    type: String,
    required: [true, "color value is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity value is required"],
  },
  price: {
    type: Number,
    required: [true, "Price value is required"],
  },
});

const financialDetails = new mongoose.Schema({
  total_debit: {
    type: Number,
    required: [true, "Total Debit value is required"],
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
    type: Date,
    required: [true, "Date is required"],
  },
  particular: {
    type: String,
    required: [true, "Particular is required"],
  },
  debit: {
    type: Number,
    required: [true, "Debit value is required"],
  },
  credit: {
    type: Number,
    required: [true, "Credit value is required"],
  },
  balance: {
    type: Number,
    required: [true, "Balance value is required"],
  },
});

const BuyersSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Branch Id required"],
  },
  serialNumber: {
    type: String,
    required: [true, "Serial Number is required"],
  },
  name: {
    type: String,
    required: [true, "Name Value is required"],
  },
  city: {
    type: String,
    required: [true, "City value is required"],
  },
  cargo: {
    type: String,
    required: [true, "Cargo value is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone value is required"],
  },
  date: {
    type: Date,
    required: [true, "Date value is required"],
  },
  bill_by: {
    type: String,
    required: [true, "billBy value is required"],
  },
  payment_Method: {
    type: String,
    required: [true, "paymentMethod value is required"],
    enum: ["cashInMeezanBank", "cashInJazzCash", "cashInEasyPaisa", "cashSale"],
  },
  packaging: {
    name: {
      type: String,
      required: [true, "packaging value is required"],
      enum:['Bags','Box']
    },
    quantity: {
      type: Number,
      required: [true, "quantity value is required"],
    },
  },
  discount: {
    type: Number,
    required: [true, "discount value is required"],
  },
  suits_data: [suits_sale_details],
  virtual_account: financialDetails,
  credit_debit_history: [transaction_details],
});

export const BuyersModel = mongoose.model("Buyers", BuyersSchema);
