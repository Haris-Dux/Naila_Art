import mongoose from "mongoose";
import { BranchModel } from "../models/Branch.Model.js";
import { BagsAndBoxModel } from "../models/Stock/BagsAndBoxModel.js";
import { SuitsModel } from "../models/Stock/Suits.Model.js";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { BuyersModel } from "../models/BuyersModel.js";


export const generateBuyersBillandAddBuyer = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        branchId,
        serialNumber,
        name,
        city,
        cargo,
        phone,
        date,
        bill_by,
        payment_Method,
        packaging,
        discount,
        suits_data,
        total,
        paid,
        remaining,
      } = req.body;

      //VALIDATING FIELDS DATA
      const requiredFields = [
        "branchId",
        "serialNumber",
        "name",
        "city",
        "cargo",
        "phone",
        "date",
        "bill_by",
        "payment_Method",
        "packaging",
        "discount",
        "suits_data",
        "total",
        "paid",
        "remaining",
      ];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        } else if (field === "suits_data") {
          if (suits_data.length < 1)
            throw new Error("Please Add Atleat 1 Suit");
          req.body.suits_data.forEach((suit, index) => {
            const requiredSuitFields = [
              "id",
              "d_no",
              "color",
              "quantity",
              "price",
            ];
            requiredSuitFields.forEach((suit_field) => {
              if (!suit[suit_field]) {
                missingFields.push(`${suit_field} for suit ${index + 1}`);
              }
            });
          });
        }
      });
      if (missingFields.length > 0)
        throw new Error(`Missing Fields ${missingFields}`);
      const branch = await BranchModel.findOne({ _id: branchId });
      if (!branch) throw new Error("Branch Not Found");

      //DEDUCTING BAGS OR BOXES FROM STOCK
      const bagsorBoxStock = await BagsAndBoxModel.findById(
        packaging.id
      ).session(session);
      if (!bagsorBoxStock) throw new Error("Packaging Not Found");
      const updatedBagsorBoxQuantity =
        bagsorBoxStock.totalQuantity - parseInt(packaging.quantity);
      if (updatedBagsorBoxQuantity < 0)
        throw new Error(`Not Enough ${bagsorBoxStock.name} in Stock`);
      bagsorBoxStock.totalQuantity = updatedBagsorBoxQuantity;
      // await bagsorBoxStock.save({ session });

      //DEDUCTING SUITS FROM STOCK
      const suitsIdsToDeduct = suits_data.map((suit) => suit.id);
      const suitsStock = await SuitsModel.find({
        _id: { $in: suitsIdsToDeduct },
      }).session(session);
      const updatePromises = suitsStock.map((suit) => {
        const suitToUpdate = suits_data.find((item) => item.id == suit._id);
        const updatedSuitQuantity = suit.quantity - suitToUpdate.quantity;
        if (updatedSuitQuantity < 0) throw new Error(`Not enough stock for suit with Design No: ${suit.d_no}`);
        suit.quantity = updatedSuitQuantity;
        // return suit.save({ session });
      });
      // await Promise.all(updatePromises);

      //ADDING IN DAILY SALE 
      const dailySaleForToday = await DailySaleModel.findOne({branchId,date:{$eq:date}}).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      };

      //calculating profit
        let TotalProfit = 0;
        suits_data.forEach((suit) => {
          const suitInStock = suitsStock.find((item) => item._id == suit.id);
          const profitOnSale = suit.price - suitInStock.cost_price;
          TotalProfit += profitOnSale * suit.quantity;
          if(profitOnSale < 0) throw new Error('Sale Price Must Be Greater Then Cost Price')
        });
  
      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method:dailySaleForToday.saleData[payment_Method] += paid,
        totalSale:dailySaleForToday.saleData.totalSale += paid,
        todayBuyerCredit:dailySaleForToday.saleData.todayBuyerCredit += paid,
        todayBuyerDebit:dailySaleForToday.saleData.todayBuyerDebit += remaining,
        totalProfit:dailySaleForToday.saleData.totalProfit += TotalProfit,
      };

      if(payment_Method === 'cashSale'){
        dailySaleForToday.saleData.totalCash += paid;
      };

      dailySaleForToday.saleData = updatedSaleData;
      console.log(updatedSaleData);
      // await dailySaleForToday.save({ session });

      // //DATA FOR VIRTUAL ACCOUNT
      // const virtualAccountData = {
      //   let total_debit = 0 ,
      //   let total_credit = 0 ,
      //   let total_balance = 0 ,
      //  let  status = ""
      // }


      //CREATING BUYER
      await BuyersModel.create({
        branchId,
        serialNumber,
        name,
        city,
        cargo,
        phone,
        date,
        bill_by,
        payment_Method,
        packaging,
        discount,
        suits_data,
        virtual_account:virtualAccountData
      })
      

      return res.status(200).json({ message: "request successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
