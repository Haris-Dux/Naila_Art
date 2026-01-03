import mongoose from "mongoose";
import { CashbookTransactionAccounts } from "../../enums/cashbookk.enum.js";

const cashBookServiceSchema = new mongoose.Schema(
  {
    pastDate: {
      type: String, 
      default:null,
    },
    pastTransaction: {
      type: Boolean,
      default:false,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Branch",
      required: [true,"Branch id is required"],
    },
    amount: {
      type: Number,
      required: [true,"Transaction amount is required"],
    },
    tranSactionType: {
      type: String, 
      required: [true,"Transaction type is required"],
    },
    transactionFrom: {
      type: String, 
      required: [true,"Transaction source is required"],
    },
    partyName: {
      type: String, 
      required: [true,"Party Name is required"],
    },
    payment_Method: {
      type: String,
      required: [true,"Payment Method name is required"],
    },
    currentDate:{
        type:String,
        default:null
    },
    transactionTime:{
        type: String,
        required: [true,"Transaction time is required"],  
    },
    sourceId: {
      type: mongoose.Types.ObjectId,
      default: null
      // required: [true,"Cash book transaction source data is required"],
    },
    category: {
      type:String,
      default:null
      // enum:[CashbookTransactionAccounts],
      // required: [true,"Cash book transaction account category data is required"],  
    }
  },
  { timestamps: true }
);

export const cashBookServiceModel = mongoose.model(
  "Cash Book",
  cashBookServiceSchema
);