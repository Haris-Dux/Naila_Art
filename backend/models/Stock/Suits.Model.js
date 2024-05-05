import mongoose from 'mongoose';

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
    unique: true
  }
}, { timestamps: true });

export const SuitsModel = mongoose.model('Suit', suitsSchema);


