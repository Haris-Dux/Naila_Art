import mongoose from 'mongoose';

const calenderSchema = new mongoose.Schema({
  embroidery_Id:{
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
  r_quantity:{
    type:Number,
    default:null
  },
  project_status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  bill_generated : {
    type: Boolean,
    default: false
  },
  updated : {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

export const CalenderModel = mongoose.model('Calender', calenderSchema);


