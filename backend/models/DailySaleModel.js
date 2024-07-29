
import mongoose from "mongoose";
import moment from 'moment-timezone';


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
        type: String,
        default: function() {
            return moment.tz('Asia/Karachi').format('YYYY-MM-DD');
        }
      },
    saleData:dailySaleData
});

export const DailySaleModel = mongoose.model('Daily Sale',DailySaleSchema);