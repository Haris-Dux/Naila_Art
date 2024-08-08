import { BranchModel } from "../models/Branch.Model.js";
import { setMongoose } from "../utils/Mongoose.js";
import corn from "node-cron";
import moment from 'moment-timezone';
import { DailySaleModel } from "../models/DailySaleModel.js";


export const getTodaysdailySaleforBranch = async (req,res,next) => {
    try {
        const {id} = req.body;
        if(!id) throw new Error("Id Not Found");
        const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
        const dailySale = await DailySaleModel.findOne({branchId:id , date : { $eq:today }});
        if(!dailySale) throw new Error("daily Sale Not Found");
        setMongoose();
        return res.status(200).json(dailySale);   
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
};

export const getDailySaleHistoryForBranch = async (req,res,next) => {
    try {
        const {id} = req.body;
        if(!id) throw new Error("Id Not Found");
        const date = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        let query = {
            branchId:id,
            date:{ $regex:date, $options:"i" }
        };
        const totalDocuments = await DailySaleModel.countDocuments(query);
        const dailySaleHistory = await DailySaleModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt : -1})
        const response = {
            dailySaleHistory,
            page,
            totalPages: Math.ceil(totalDocuments / limit)
        }
        setMongoose();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
};

export const getDailySaleById = async (req,res,next) => {
    try {
        const {id} = req.body;
        if(!id) throw new Error("Id not Found");
        const dailySale = await DailySaleModel.findById(id);
        if(!dailySale) throw new Error("Daily Sale Not Found");
        setMongoose();
        return res.status(200).json(dailySale);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
};

corn.schedule("01 00 * * *",async () => {
   try {
    const branchData = await BranchModel.find({});
    const today = moment.tz('Asia/Karachi').format('YYYY-MM-DD');
    const yesterday = moment.tz('Asia/Karachi').subtract(1,'day').format('YYYY-MM-DD');
    const dailySalePromises = branchData?.map(async (branch) => {
    const verifyDuplicateSaleData = await DailySaleModel.findOne({branchId:branch._id,date:today});
    if(verifyDuplicateSaleData) throw new Error(`Daily Sale Already Exists for ${verifyDuplicateSaleData.date}`)
    const previousDaySale = await DailySaleModel.findOne({branchId:branch._id,date:yesterday})
        return await DailySaleModel.create({
        branchId:branch._id,
        date:today,
        saleData:{
            totalCash:previousDaySale ? previousDaySale.saleData.totalCash : 0
        }
       })
    });
    await Promise.all(dailySalePromises);
   } catch (error) {
    console.log({error:error.message});
    throw new Error({error:error.message});
   }
    
},{
    timezone:"Asia/Karachi"
});

