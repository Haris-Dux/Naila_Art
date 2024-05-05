import mongoose from 'mongoose';

const baseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true,"category required"],
  },
  colors: {
    type: String,
     required: [true,"color required"],
  },
  r_Date: {
    type: Date,
    required: [true,"R_Date required"],
  },
  recently: {
    type: Number,
    required: [true,"Recently required"],
  },
  TYm: {
    type: Number,
    required: [true,"TYm required"],
  }
}, { timestamps: true });

export const BaseModel = mongoose.model('Base', baseSchema);

