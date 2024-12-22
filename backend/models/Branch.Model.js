import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      unique: true,
    },
    stockData: [
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
          default: 0,
        },
        cost_price: {
          type: Number,
          default: 0,
        },
        sale_price: {
          type: Number,
          default: 0,
        },
        d_no: {
          type: Number,
          required: [true, "Design number required"],
          unique: true,
        },
        Item_Id: {
          type: mongoose.Types.ObjectId,
          required: [true, "Suit Id is Required"],
        },
        last_updated: {
          type: String,
          default: "",
        },
        all_records: [
          {
            date: {
              type: String,
              required: [true, "date required"],
            },
            quantity: {
              type: Number,
              required: [true, "quantity required"],
            },
            cost_price: {
              type: Number,
              required: [true, "cost_price required"],
            },
            sale_price: {
              type: Number,
              required: [true, "sale_price required"],
            },
            stock_status: {
              type: String,
              enum: ["Received", "Pending", "Returned"],
              default: "Pending",
            },
          },
        ],
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

export const BranchModel = mongoose.model("Branch", branchSchema);
