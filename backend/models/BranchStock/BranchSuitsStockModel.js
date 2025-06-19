import mongoose from "mongoose";

const branchStockSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Branch id is required"],
  },
  lastUpdated: {
    type: String,
    required: [true, "Issue date is required"],
  },
  category: {
    type: String,
    required: [true, "Category required"],
  },
  color: {
    type: String,
    required: [true, "Color required"],
  },
  total_quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  sold_quantity: {
    type: Number,
    default:0,
  },
  cost_price: {
    type: Number,
    required: [true, "Cost price is required"],
  },
  sale_price: {
    type: Number,
    required: [true, "Sale price is required"],
  },
  d_no: {
    type: Number,
    required: [true, "Design number required"],
  },
  main_stock_Id: {
    type: mongoose.Types.ObjectId,
    required: [true, "Suit Id is Required"],
  },
},
{timestamps:true}
);

export const branchStockModel = mongoose.model(
  "Branch Stock",
  branchStockSchema
);


// SUIT SALE HISTORY SCHEMA 

const suitSaleHistorySchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Branch id is required"],
  },
  category: {
    type: String,
    required: [true, "Category required"],
  },
  color: {
    type: String,
    required: [true, "Color required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  d_no: {
    type: Number,
    required: [true, "Design number required"],
  }
},
{timestamps:true}
);

export const suitSaleHistoryModel = mongoose.model(
  "Suit Sales History",
  suitSaleHistorySchema
);

