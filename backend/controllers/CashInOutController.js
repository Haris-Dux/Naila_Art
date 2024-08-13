import mongoose from "mongoose";
import { BranchModel } from "../models/Branch.Model.js";
import { BuyersModel } from "../models/BuyersModel.js";
import { SellersModel } from "../models/sellers/SellersModel.js";
import { UserModel } from "../models/User.Model.js";
import { setMongoose } from "../utils/Mongoose.js";

export const validatePartyNameForMainBranch = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const projection = "name phone _id";
    const Data = await Promise.all([
      BuyersModel.find({ name: { $regex: name, $options: "i" } }, projection),
      SellersModel.find({ name: { $regex: name, $options: "i" } }, projection),
    ]);
    if (!Data) throw new Error("No Data Found With For This Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validatePartyNameForOtherBranches = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    const projection = "name phone _id";
    const oldBuyerData = await BuyersModel.find(
      { name: { $regex: name, $options: "i" } },
      projection
    );
    if (!oldBuyerData) throw new Error("No Data Found With This Buyer Name");
    setMongoose();
    return res.status(200).json({ success: true, oldBuyerData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cashIn = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { cash, partyId, branchId , payment_Method, date } = req.body;
      if (!cash || !partyId || !payment_Method || !date || !branchId )
        throw new Error("All Fields Required");
      const userDataToUpdate = await Promise.all([
        BuyersModel.findById(partyId),
        SellersModel.findById(partyId),
      ]);
      if (!userDataToUpdate)
        throw new Error("No Data Found With This Party Id");

      //DAILY SLAE UPDATE

      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      };

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] += cash),
        totalSale: (dailySaleForToday.saleData.totalSale += cash),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit += cash),
        totalCash: (dailySaleForToday.saleData.totalCash += cash),
      };

      dailySaleForToday.saleData = updatedSaleData;
      // await dailySaleForToday.save({ session });

      //DATA FOR VIRTUAL ACCOUNT
      const new_total_debit = userDataToUpdate.virtual_account.total_debit - cash;
      const new_total_credit = userDataToUpdate.virtual_account.total_credit + cash;
      const new_total_balance =
      userDataToUpdate.virtual_account.total_balance - cash;
      let new_status = "";

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_debit && new_total_credit > 0:
          new_status = "Partially Paid";
          break;
        case new_total_credit === 0 && new_total_balance === new_total_debit:
          new_status = "Unpaid";
          break;
      }

      const virtualAccountData = {
        total_debit: new_total_debit,
        total_credit: new_total_credit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY

      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${payment_Method}`,
          credit: cash,
          balance: userDataToUpdate.virtual_account.total_balance - cash,
        },
      ];

      //UPDATING USER DATA IN DB

      userDataToUpdate.virtual_account = virtualAccountData;
      userDataToUpdate.credit_debit_history.push(credit_debit_history_details);

      await userDataToUpdate.save({session})
      return res
        .status(200)
        .json({ sucess: true, message: "Cash In Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
