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

const SellersSchema = new mongoose.Schema({
  bill_no: {
    type: String,
    required: [true, "Bill Number is required"],
  },
  name: {
    type: String,
    required: [true, "Name Value is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone value is required"],
  },
  date: {
    type: String,
    required: [true, "Date value is required"],
  },
  payment_Method: {
    type: String,
    enum: ["cashInMeezanBank", "cashInJazzCash", "cashInEasyPaisa", "cashSale"],
  },
  seller_stock_category : {
    type: String,
    required:[true,'Seller Stock Category Required'],
    enum:['Base','Lace','Bag/box','Accessories']
  },
  category: {
    type: String,
    required: [true, "category Value is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity Value is required"],
  },
  rate: {
    type: Number,
    required: [true, "Rate Value is required"],
  },
  total: {
    type: Number,
    required: [true, "Numnber Value is required"],
  },
  virtual_account: financialDetails,
  credit_debit_history: [transaction_details],
},
{timestamps:true});

export const SellersModel = mongoose.model("Sellers", SellersSchema);
