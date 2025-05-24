import mongoose, { Mongoose } from "mongoose";

const suits_sale_details = new mongoose.Schema({
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
    enum: ["Paid", "Unpaid", "Partially Paid", "Advance Paid"],
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
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    required: [true, "Balance value is required"],
  },
});

const BuyersSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Branch Id required"],
    },
    serialNumber: {
      type: String,
      required: [true, "Serial Number is required"],
    },
    autoSN: {
      type: Number,
      required: [true, "Auto Serial Number is required"],
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
    },
    packaging: {
      name: {
        type: String,
        enum: ["Bags", "Box"],
      },
      quantity: {
        type: Number,
      },
    },
    discount: {
      type: Number,
      required: [true, "discount value is required"],
    },
    suits_data: [suits_sale_details],
    virtual_account: financialDetails,
    credit_debit_history: [transaction_details],
  },
  { timestamps: true }
);

export const BuyersModel = mongoose.model("Buyers", BuyersSchema);

//BUYERS BILLS HISTORY

const historyData = new mongoose.Schema({
  d_no: {
    type: Number,
    required: [true, "d_no value is required"],
  },
  color: {
    type: String,
    required: [true, "color value required"],
  },
  category: {
    type: String,
    required: [true, "category valuerequired"],
  },
  suitId: {
    type: String,
    required: [true, "Suit Id required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity value is required"],
  },
  suitSalePrice: {
    type: Number,
    required: [true, "Suit Sale Price value is required"],
  },
  profit: {
    type: Number,
    required: [true, "Profit value is required"],
  },
  quantity_for_return:{
    type: Number,
    required: [true, "Quantity for return value is required"],
  },
});

const historySchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: [true, "Branch Id required"],
    },
    buyerId: {
      type: String,
      required: [true, "Buyer Id required"],
    },
    serialNumber: {
      type: String,
      required: [true, "Serial Number is required"],
    },
    autoSN: {
      type: Number,
      required: [true, "Auto Serial Number is required"],
    },
    name: {
      type: String,
      required: [true, "Name Value is required"],
    },
    date: {
      type: String,
      required: [true, "Date value is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone value is required"],
    },
    total: {
      type: Number,
      required: [true, "Total value is required"],
    },
    paid: {
      type: Number,
      required: [true, "Paid value is required"],
    },
    remaining: {
      type: Number,
      required: [true, "Remaining Value is required"],
    },
    TotalProfit: {
      type: Number,
      required: [true, "Total Profit Number is required"],
    },
     city: {
      type: String,
      required: [true, "City value is required"],
    },
     payment_Method: {
      type: String,
      required: [true, "Payment meyhod vaalue is required"],
    },
    profitDataForHistory: [historyData],
    other_Bill_Data:{
      o_b_quantity: {
        type: Number,
      },
      o_b_amount: {
        type: Number,
      },
      o_b_note: {
        type: String,
      },
      show: {
        type: Boolean,
      },
    }
  },
  {
    timestamps: true,
  }
);

export const BuyersBillsModel = mongoose.model("Buyers Bills", historySchema);
