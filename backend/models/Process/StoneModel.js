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
        default: null,
      },
      date: {
        type: String,
        default: null,
      },
    },
    second: {
        quantity: {
          type: Number,
          default: null,
        },
        date: {
          type: String,
          default: null,
        },
      },
    third: {
        quantity: {
          type: Number,
          default: null,
        },
        date: {
          type: String,
          default: null,
        },
      },
    r_total: {
      type: Number,
      default: null,
    },
    r_date: {
        type: String,
        default: null,
      },
  },
},{ timestamps: true });

const stoneSchema = new mongoose.Schema(
  {
    embroidery_Id: {
      type: mongoose.Types.ObjectId,
      required: [true, "Embroidery Id required"],
    },
    serial_No: {
      type: Number,
      required: [true, "Serial No required"],
    },
    T_Quantity: {
      type: Number,
    },
    design_no: {
      type: String,
      required: [true, "Design no value required"],
    },
    date: {
      type: Date,
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
    }
  },
  { timestamps: true }
);

export const StoneModel = mongoose.model("Stone", stoneSchema);
