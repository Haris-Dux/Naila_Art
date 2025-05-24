import mongoose from "mongoose";

const branchHistorySchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Branch id is required"],
  },
  bundleStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default:"Pending"
  },
  issueDate: {
    type: String,
    required: [true, "Issue date is required"],
  },
  updatedOn: {
    type: String,
    default:null
  },
  note:{
    type:String,
    required: [true, "Note is required"],
  },
  bundles: [
    [
      {
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
        cost_price: {
          type: Number,
          required: [true, "Cost price is required"],
        },
        sale_price: {
          type: Number,
          required: [true, "Sale price is required"]
        },
        d_no: {
          type: Number,
          required: [true, "Design number required"],
        },
        Item_Id: {
          type: mongoose.Types.ObjectId,
          required: [true, "Suit Id is Required"],
        },
      },
    ],
  ],
},
{timestamps:true}
);

export const branchStockHistoryModel = mongoose.model("Branch Stock History",branchHistorySchema)
