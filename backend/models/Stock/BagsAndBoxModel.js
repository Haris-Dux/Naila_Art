import mongoose from 'mongoose';

const previousDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"category required"],
  },
  bill_no: {
    type: Number,
    required: [true,"color required"],
  },
  date: {
    type: Date,
    required: [true,"R_Date required"],
  },
  quantity: {
    type: Number,
    required: [true,"Recently required"],
  },
})

const bagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"name required"],
    enum:['Bags','Box']
  },
  bill_no: {
    type: Number,
    required: [true,"bill_no required"],
  },
  r_Date: {
    type: Date,
    required: [true,"R_Date required"],
  },
  recently: {
    type: Number,
    required: [true,"Recently required"],
  },
  totalQuantity: {
    type: Number,
    required: [true,"Quantity required"],
  },
  all_Records : [previousDataSchema]
}, { timestamps: true });

export const BagsAndBoxModel = mongoose.model('Bags', bagsSchema);

