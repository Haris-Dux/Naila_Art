import mongoose from "mongoose";

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
        required:[true,"Current date for transaction is required"]
    },
    transactionTime:{
        type: String,
        required: [true,"Transaction time is required"],  
    }

  },
  { timestamps: true }
);

export const cashBookServiceModel = mongoose.model(
  "Cash Book",
  cashBookServiceSchema
);