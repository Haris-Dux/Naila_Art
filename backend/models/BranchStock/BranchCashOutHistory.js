

import mongoose from "mongoose";

const branchCashOutSchema = new mongoose.Schema(
  {
    branchId:{
        type: mongoose.Types.ObjectId,
        required : [true,"BranchId is required"],
    },
    amount : {
        type : Number,
        required : [true,"Amount is required"],
    },
    payment_Method: {
        type: String,
        required: [true, "Payment method is required"],
    },
    date: {
        type:String,
        required : [true,"Date is required"],
    },
    cash_after_transaction : {
        type : Number,
        required : [true,"Cash after transaction is required"],
    }
  },
  { timestamps: true }
);

export const BranchCashOutHistoryModel = mongoose.model("Branch CashOut History", branchCashOutSchema);
