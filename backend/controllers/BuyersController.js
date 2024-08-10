import mongoose from "mongoose";
import { BranchModel } from "../models/Branch.Model.js";
import { BagsAndBoxModel } from "../models/Stock/BagsAndBoxModel.js";
import { SuitsModel } from "../models/Stock/Suits.Model.js";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { BuyersModel } from "../models/BuyersModel.js";
import { UserModel } from "../models/User.Model.js";
import { setMongoose } from "../utils/Mongoose.js";

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
        if (req.body[field] === undefined || req.body[field] === null) {
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
      await bagsorBoxStock.save({ session });

      //DEDUCTING SUITS FROM STOCK
      const suitsIdsToDeduct = suits_data.map((suit) => suit.id);
      const suitsStock = await SuitsModel.find({
        _id: { $in: suitsIdsToDeduct },
      }).session(session);
      const updatePromises = suitsStock.map((suit) => {
        const suitToUpdate = suits_data.find((item) => item.id == suit._id);
        const updatedSuitQuantity = suit.quantity - suitToUpdate.quantity;
        if (updatedSuitQuantity < 0)
          throw new Error(
            `Not enough stock for suit with Design No: ${suit.d_no}`
          );
        suit.quantity = updatedSuitQuantity;
        return suit.save({ session });
      });
      await Promise.all(updatePromises);

      //ADDING IN DAILY SALE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }

      //calculating profit
      let TotalProfit = 0;
      suits_data.forEach((suit) => {
        const suitInStock = suitsStock.find((item) => item._id == suit.id);
        const profitOnSale = suit.price - suitInStock.cost_price;
        TotalProfit += profitOnSale * suit.quantity;
        if (profitOnSale < 0)
          throw new Error("Sale Price Must Be Greater Then Cost Price");
      });

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] += paid),
        totalSale: (dailySaleForToday.saleData.totalSale += paid),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit += paid),
        todayBuyerDebit: (dailySaleForToday.saleData.todayBuyerDebit +=
          remaining),
        totalProfit: (dailySaleForToday.saleData.totalProfit += TotalProfit),
        totalCash:dailySaleForToday.saleData.totalCash += paid
      };

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //DATA FOR VIRTUAL ACCOUNT
      const total_debit = remaining;
      const total_credit = paid;
      const total_balance = remaining;
      let status = "";

      switch (true) {
        case total_balance === 0:
          status = "Paid";
          break;
        case total_balance === total_debit &&  total_credit > 0:
          status = "Partially Paid";
          break;
        case total_credit === 0 && total_balance === total_debit:
          status = "Unpaid";
          break;
      }
      
      const virtualAccountData = {
        total_debit,
        total_credit,
        total_balance,
        status,
      };

      //DATA FOR CREDIT DEBIT HISTORY

      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${serialNumber}`,
          debit: total,
          balance: total,
        },
      ];
      if (paid > 0) {
        credit_debit_history_details.push({
          date,
          particular: payment_Method,
          credit: paid,
          balance: remaining,
        });
      }

      //CREATING BUYER
      await BuyersModel.create(
        [
          {
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
            virtual_account: virtualAccountData,
            credit_debit_history: credit_debit_history_details,
          },
        ],
        { session }
      );

      return res
        .status(200)
        .json({ succes: true, message: "Bill Generated Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getBuyersForBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    const page = parseInt(req.query.page) || 1;
    let limit = 6;
    let search = req.query.search || "";
    let branchQuery = req.query.branchId || "";
    const status = req.query.status || "";

    if (!id) throw new Error("User Id Required");
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User Not Found");

    let query = {};

    if(user.role === "superadmin" && branchQuery){
      query.branchId = branchQuery
    } else if(user.role !== "superadmin"){
      query.branchId = user.branchId
    };

    if(status){
      query['virtual_account.status'] = status
    };

    if(search){
      query.name = { $regex: search, $options: "i" }
    };

    const totalBuyers =  await BuyersModel.countDocuments(query);

    const buyers = await BuyersModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({createdAt : -1})

    const response = {
      buyers,
      page,
      totalBuyers,
      totalPages: Math.ceil(totalBuyers / limit)
    };
    setMongoose();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBuyerById = async (req,res,next) => {
  try {
    const {id} = req.body;
    if (!id) throw new Error("Buyer Id Required");
    const buyer = await BuyersModel.findById(id);
    if (!buyer) throw new Error("Buyer Not Found");
    setMongoose();
    return res.status(200).json(buyer);
    } catch (error) {
    return res.status(500).json({error:error.message})
  }
};

export const validateD_NoAndGetSuitData = async (req,res,next) => {
  try {
    const {d_no} = req.body;
    if (!d_no) throw new Error("D No Required");
    const suitData = await SuitsModel.find({d_no});
    if(!suitData) throw new Error("Suit Data Not Found");
    setMongoose();
    return res.status(200).json(suitData);
  } catch (error) {
    return res.status(500).json({error:error.message})
  }
};

export const validateAndGetOldBuyerData = async (req,res,next) => {
  try {
    const {name} = req.body;
    if(!name) throw new Error('Buyer Name Required');
    const oldBuyerData = await BuyersModel.find({name:{$regex:name,$options:'i'}});
    if(!oldBuyerData) throw new Error('No Data Found With This Buyer Name');
    setMongoose();
    return res.status(200).json({success:true,oldBuyerData});
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}

export const generateBillForOldbuyer = async (req,res,nex) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        buyerId,
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
        "buyerId",
        'branchId',
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
        if (req.body[field] === undefined || req.body[field] === null) {
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
        if (updatedSuitQuantity < 0)
          throw new Error(
            `Not enough stock for suit with Design No: ${suit.d_no}`
          );
        suit.quantity = updatedSuitQuantity;
        // return suit.save({ session });
      });
      // await Promise.all(updatePromises);

      //ADDING IN DAILY SALE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: { $eq: date },
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }

      //calculating profit
      let TotalProfit = 0;
      suits_data.forEach((suit) => {
        const suitInStock = suitsStock.find((item) => item._id == suit.id);
        const profitOnSale = suit.price - suitInStock.cost_price;
        TotalProfit += profitOnSale * suit.quantity;
        if (profitOnSale < 0)
          throw new Error("Sale Price Must Be Greater Then Cost Price");
      });

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] += paid),
        totalSale: (dailySaleForToday.saleData.totalSale += paid),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit += paid),
        todayBuyerDebit: (dailySaleForToday.saleData.todayBuyerDebit +=

          remaining),
        totalProfit: (dailySaleForToday.saleData.totalProfit += TotalProfit),
        totalCash:dailySaleForToday.saleData.totalCash += paid
      };

      dailySaleForToday.saleData = updatedSaleData;
      // await dailySaleForToday.save({ session });

      //GETTING BUYERS PREVIOUS DATA
      const buyerData = await BuyersModel.findById({_id:buyerId});
      console.log(buyerData);
      if (!buyerData)  throw new Error("Buyer Data Not Found");


      //DATA FOR VIRTUAL ACCOUNT
      const new_total_debit = buyerData.virtual_account.total_debit + remaining;
      const new_total_credit = buyerData.virtual_account.total_credit + paid;
      const new_total_balance = buyerData.virtual_account.total_balance + remaining;
      let new_status = "";

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_debit &&  new_total_credit > 0:
          new_status = "Partially Paid";
          break;
        case new_total_credit === 0 && new_total_balance === new_total_debit:
          new_status = "Unpaid";
          break;
      }
      
      const virtualAccountData = {
        total_debit:new_total_debit,
        total_credit:new_total_credit,
        total_balance:new_total_balance,
        status:new_status
      };

      //DATA FOR CREDIT DEBIT HISTORY

      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${serialNumber}`,
          debit: total,
          balance: total,
        },
      ];
      if (paid > 0) {
        credit_debit_history_details.push({
          date,
          particular: payment_Method,
          credit: paid,
          balance: remaining,
        });
      }

      //CREATING BUYER
      // await BuyersModel.create(
      //   [
      //     {
      //       branchId,
      //       serialNumber,
      //       name,
      //       city,
      //       cargo,
      //       phone,
      //       date,
      //       bill_by,
      //       payment_Method,
      //       packaging,
      //       discount,
      //       suits_data,
      //       virtual_account: virtualAccountData,
      //       credit_debit_history: credit_debit_history_details,
      //     },
      //   ],
      //   { session }
      // );

      return res
        .status(200)
        .json({ succes: true, message: "Bill Generated Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
}


