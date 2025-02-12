import mongoose from "mongoose";

const suits_return_details = new mongoose.Schema({
  id: {
    type: String,
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
  category: {
    type: String,
    required: [true, "category valuerequired"],
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

const returnSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Branch Id required"],
    },
    buyerId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Buyer Id required"],
    },
    partyName: {
      type: String,
      required: [true, "Party Name is Required"],
    },
    serialNumber: {
      type: String,
      required: [true, "Serial Number is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone value is required"],
    },
    date: {
      type: String,
      required: [true, "Date value is required"],
    },
    T_Return_Amount: {
      type: Number,
      required: [true, "Total Return Amount required"],
    },
    Amount_From_Balance: {
      type: Number,
      required: [true, "Amount From Balance required"],
    },
    Amount_Payable: {
      type: Number,
      required: [true, "Amount From Total Cash required"],
    },
    suits_data: [suits_return_details],
  },
  { timestamps: true }
);

export const ReturnSuitModel = mongoose.model("Return Bills", returnSchema);
