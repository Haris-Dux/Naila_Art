import mongoose from "mongoose";
import moment from 'moment-timezone';

const B_PairSchema = new mongoose.Schema(
  {
    b_PairCategory: {
      type: String,
      required: [true, "B Pair Category is Required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is Required"],
    },
    sold_quantity: {
      type: Number,
     default:0
    },
    rate: {
      type: Number,
      required: [true, "Rate is Required"],
    },
    date: {
      type: String,
      default : function(){
        return moment().tz('Asia/Karachi').format('YYYY-MM-DD');
      }
    },
    partyName: {
      type: String,
      required: [true, "Party Name is Required"],
    },
    design_no: {
      type: String,
      required: [true, "Design No is Required"],
    },
    serial_No: {
      type: Number,
      required: [true, "Serial No is Required"],
    },
    status:{
      type: String,
      enum: ["Sold", "UnSold","Partially Sold"],
      default: "UnSold",
    },
    seller_Details: [{
      name: {
        type: String,
        required: [true, "Name is Required"],
      },
      contact: {
        type: String,
        required: [true, "Contact No is Required"],
      },
      amount: {
        type: Number,
        required: [true, "Amount is Required"],
      },
      quantity:{
        type: Number,
        required: [true, "Quantity No is Required"],
      },
      payment_Method:{
        type: String,
        required: [true, "Payment Method is Required"],
      },
      date: {
        type: String,
        required: [true, "Date is Required"],
      },
      deleted : {
        type: Boolean,
        default: false,
      }
    }],
  },
  { timestamps: true }
);

export const B_PairModel = mongoose.model("B_Pair", B_PairSchema);
