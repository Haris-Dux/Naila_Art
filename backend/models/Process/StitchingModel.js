import mongoose from "mongoose";

const suit_schema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category Name Required"],
  },
  color: {
    type: String,
    required: [true, "Color Value Required"],
  },
  quantity_in_no: {
    type: Number,
    required: [true, "Qunatity Vlaue Required"],
  },
  recieved: {
   type:Number,
   default:0
  },
},{ timestamps: true });

const dupatta_schema = new mongoose.Schema({
    category: {
      type: String,
      required: [true, "Category Name Required"],
    },
    color: {
      type: String,
      required: [true, "Color Value Required"],
    },
    quantity_in_no: {
      type: Number,
      required: [true, "Qunatity Vlaue Required"],
    },
    recieved: {
     type:Number,
     default:0
    },
  },{ timestamps: true });

const stitchingSchema = new mongoose.Schema(
  {
    embroidery_Id: {
      type: mongoose.Types.ObjectId,
      required: [true, "Embroidery Id required"],
    },
    serial_No: {
      type: Number,
      required: [true, "Serial No required"],
    },
    Quantity: {
      type: Number,
      required: [true, "Quantity value required"],
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
    lace_quantity:{
        type:Number,
        required: [true, "Lace Quantity required"],
    },
    lace_category:{
        type:String,
        required: [true, "Lace Category required"],
    },
    r_quantity: {
      type: Number,
      default: 0,
    },
    project_status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    suits_category: {
      type: [suit_schema],
      required: [true, "Suits Data required"],
    },
    dupatta_category: {
        type: [dupatta_schema],
        required: [true, "Dupatta Data required"],
      },
  },
  { timestamps: true }
);

export const StitchingModel = mongoose.model("Stitchings", stitchingSchema);
