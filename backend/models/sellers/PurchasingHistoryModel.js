import mongoose from "mongoose";


const purchasing_History_Schema = new mongoose.Schema({
  bill_no: {
    type: String,
    required: [true, "Bill Number is required"],
  },
  name: {
    type: String,
    required: [true, "Name Value is required"],
  },
  category: {
    type: String,
    required: [true, "category Value is required"],
  },
  date: {
    type: String,
    required: [true, "Date value is required"],
  },
  seller_stock_category : {
    type: String,
    required:[true,'Seller Stock Category Required'],
    enum:['Base','Lace','Bag/box','Accessories']
  },
  quantity: {
    type: Number,
    required: [true, "Quantity Value is required"],
  },
  rate: {
    type: Number,
    required: [true, "Rate Value is required"],
  },
  total: {
    type: Number,
    required: [true, "Numnber Value is required"],
  }
},
{timestamps:true});

export const purchasing_History_model = mongoose.model("Purchasing History", purchasing_History_Schema);
