import mongoose from 'mongoose';

const record_data = new mongoose.Schema({
  date:{
    type:String,
  },
  quantity:{
    type:Number
  },
  cost_price:{
    type:Number
  },
  sale_price:{
    type:Number
  },
  bill_id: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  embroidery_Id: {
    type: mongoose.Types.ObjectId
  },
  Manual_No: {
    type:String,
  },
  serial_No: {
    type:Number
  },
  bags_used:{
    type:Boolean
  }, 
  includes_pictures:{
    type: Boolean
  }, 
  is_stock_source_packing: {
    type:Boolean
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

suitsSchema.index({ d_no: 1 });
suitsSchema.index({ quantity: -1, createdAt: -1 });
suitsSchema.index({ category: 1, quantity: -1, createdAt: -1 });
suitsSchema.index({ d_no: 1, category: 1, color: 1 });

export const SuitsModel = mongoose.model('Suit', suitsSchema);
