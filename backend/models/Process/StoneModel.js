import mongoose from "mongoose";

const category_schema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category Name Required"],
    enum: [
      "Front",
      "Back",
      "Bazo",
      "Duppata",
      "Gala",
      "Front Patch",
      "Trouser",
    ],
  },
  color: {
    type: String,
    required: [true, "Color Value Required"],
  },
  quantity: {
    type: Number,
    required: [true, "Qunatity Vlaue Required"],
  },
  recieved_Data: {
    first: {
      quantity: {
        type: Number,
        default: 0,
      },
      date: {
        type: String,
        default: '',
      },
    },
    second: {
        quantity: {
          type: Number,
          default: 0,
        },
        date: {
          type: String,
          default: '',
        },
      },
    third: {
        quantity: {
          type: Number,
          default: 0,
        },
        date: {
          type: String,
          default: '',
        },
      },
    r_total: {
      type: Number,
      default: 0,
    },
    r_date: {
        type: String,
        default: '',
      },
  },
},{ timestamps: true });

const stoneSchema = new mongoose.Schema(
  {
    embroidery_Id: {
      type: mongoose.Types.ObjectId,
      required: [true, "Embroidery Id required"],
    },
    cuttingId: {
      type:String
    },
    serial_No: {
      type: Number,
      required: [true, "Serial No required"],
    },
    Manual_No: {
      type: String,
    },
    T_Quantity: {
      type: Number,
    },
    design_no: {
      type: String,
      required: [true, "Design no value required"],
    },
    date: {
      type: String,
      required: [true, "date required"],
    },
    partyName: {
      type: String,
      required: [true, "Party Name required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate value required"],
    },
    r_quantity: {
      type: Number,
      default: null,
    },
    project_status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    category_quantity: {
      type: [category_schema],
      required: [true, "Quantity required"],
    },
    bill_generated : {
      type: Boolean,
      default: false
    },
    updated : {
      type: Boolean,
      default: false
    },
     additionalExpenditure: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const StoneModel = mongoose.model("Stone", stoneSchema);
