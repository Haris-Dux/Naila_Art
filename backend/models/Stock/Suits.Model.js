import mongoose from 'mongoose';

const record_data = new mongoose.Schema({
  date:{
    type:String
  },
  quantity:{
    type:Number
  },
  cost_price:{
    type:Number
  },
  sale_price:{
    type:Number
  }
},{ timestamps: true });

const suitsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true,"Category required"],
  },
  color: {
    type: String,
    required: [true,"Color required"],
  },
  quantity: {
    type: Number,
    required: [true,"Quantity required"],
  },
  cost_price: {
    type: Number,
    required: [true,"cost price required"],
  },
  sale_price: {
    type: Number,
    required: [true,"sale price required"],
  },
  d_no: {
    type: Number,
    required: [true,"D number required"],
  },
  all_records:[record_data]
}, { timestamps: true });

export const SuitsModel = mongoose.model('Suit', suitsSchema);


