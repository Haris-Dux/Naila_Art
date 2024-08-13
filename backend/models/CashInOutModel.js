

import mongoose from "mongoose";

const cashInOutSchema = new mongoose.Schema({
    todayCashIn : {
        type: Number,
        required: [true,'Today Cash In required']
    },
    todayCashOut : {
        type: Number,
        required: [true,'Today Cash Out required']
    }
},{timestamps:true});

export const CashInOutSchema = mongoose.model('Cash In Out',cashInOutSchema);