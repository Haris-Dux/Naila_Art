import { B_PairModel } from "../../models/Process/B_PairModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { UserModel } from "../../models/User.Model.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import moment from "moment-timezone";
import mongoose from "mongoose";

export const addBPair = async (data,session = null) => {
  try {
    const { b_PairCategory, quantity, rate, partyName, serial_No, design_no } =
      data;
      
      if (
        !b_PairCategory ||
        !partyName ||
        !serial_No ||
        !design_no ||
        quantity === undefined || 
        rate === undefined         
      ) {
        throw new Error("Missing required fields for B Pair Data");
      }

    await B_PairModel.create([{
      b_PairCategory,
      quantity,
      rate,
      partyName,
      serial_No,
      design_no,
    }],{session});

    return { success: true, message: "B Pair added successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

export const saleBPair = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, status, amount, contact, name } = req.body;
      if (!id || !status || !amount || !contact || !name) {
        throw new Error("Missing required fields for B Pair Sale Data");
      }
      const bPair = await B_PairModel.findById(id).session(session);
      if (!bPair) throw new Error("B Pair not found");
      const date = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
      //UPDATING DATA
      bPair.status = status;
      bPair.seller_Details.amount = amount;
      bPair.seller_Details.contact = contact;
      bPair.seller_Details.name = name;
      bPair.seller_Details.date = date;
      await bPair.save({ session });
      //ADDING IN DAILY SALE
      const userId = req.session.userId;
      const user = await UserModel.findById(userId).session(session);
      if (user.role !== "admin") {
        throw new Error("Unauthorized : Login with Admin Account");
      }
      const dailySale = await DailySaleModel.findOne({
        branchId:user.branchId,
        date:date
      }).session(
        session
      );
      if (!dailySale) {
        throw new Error("Daily Sale Not Found")
      };
      dailySale.saleData.totalSale += amount;
      dailySale.saleData.totalCash += amount;
      dailySale.saleData.cashSale += amount;
      await dailySale.save({ session });
      return res
        .status(200)
        .json({ success: true, message: "B Pair Sale successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllBPairs = async (req, res, next) => {
  try {
    const limit = 20;
    const search = req.query.search;
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    let query = {};
    if (search) {
      query = {
        $or: [
          { design_no: { $regex: search, $options: "i" } },
          { partyName: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (category) {
      query.b_PairCategory = category;
    }
    const skip = (page - 1) * limit;
    const total = await B_PairModel.countDocuments(query);
    const data = await B_PairModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const b_PairData = {
      totalPages: Math.ceil(total / limit),
      page: page,
      data,
    };
    setMongoose();
    return res.status(200).json(b_PairData);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
