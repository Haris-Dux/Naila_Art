import mongoose from 'mongoose';

const previousDataSchema = new mongoose.Schema({
  colors: {
    type: String,
    required: [true,"color required"],
  },
  category: {
    type: String,
    required: [true,"Category required"]  },
  Date: {
    type: Date,
    required: [true,"date required"],
  },
  quantity: {
    type: String,
    required: [true,"Recently quantity required"],
  }
})


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
  },
  all_Records: [previousDataSchema]
}, { timestamps: true });

export const BaseModel = mongoose.model('Base', baseSchema);

