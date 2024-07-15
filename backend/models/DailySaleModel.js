
import mongoose from "mongoose";

const dailySaleData = new mongoose.Schema({
    totalSale:{
        type:Number,
        default:0
    },
    cashInMeezanBank:{
        type:Number,
        default:0
    },
    cashInJazzCash:{
        type:Number,
        default:0
    },
    cashInEasyPaisa:{
        type:Number,
        default:0
    },
    totalExpense:{
        type:Number,
        default:0
    },
    todayBuyerCredit:{
        type:Number,
        default:0
    },
    todayBuyerDebit:{
        type:Number,
        default:0
    },
    cashSale:{
        type:Number,
        default:0
    },
    totalProfit:{
        type:Number,
        default:0
    },
    // remainingCash:{
    //     type:Number,
    //     default:0
    // },
    totalCash:{
        type:Number,
        default:0
    }
});

const DailySaleSchema = new mongoose.Schema({
    branchId:{
        type:mongoose.Types.ObjectId,
        required:[true,"Branch Id required"]
    },
    date: {
        type: Date,
        required: [true, "Date required"],
        default: Date.now
    },
    saleData:dailySaleData
});

export const DailySaleModel = mongoose.model('Daily Sale',DailySaleSchema);