
import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Payment Method Name'],
        unique:true
    },
    active:{
        type:Boolean,
        default:true
    }
},
{timestamps:true}
);

export const PaymentMethodModel = mongoose.model("PaymentMethods", paymentMethodSchema);