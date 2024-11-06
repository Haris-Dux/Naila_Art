import { B_PairModel } from "../../models/Process/B_PairModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { UserModel } from "../../models/User.Model.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import {
  VA_HistoryModal,
  VirtalAccountModal,
} from "../../models/DashboardData/VirtalAccountsModal.js";

export const addBPair = async (data, session = null) => {
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

    await B_PairModel.create(
      [
        {
          b_PairCategory,
          quantity,
          rate,
          partyName,
          serial_No,
          design_no,
        },
      ],
      { session }
    );

    return { success: true, message: "B Pair added successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

export const saleBPair = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, amount, contact, name, sold_quantity, payment_Method } =
        req.body;
      if (!id || !amount || !contact || !name || !sold_quantity) {
        throw new Error("Missing required fields for B Pair Sale Data");
      }

      //VERIFYING ROLE
      const userId = req.session.userId;
      const user = await UserModel.findById(userId).session(session);
      if (user.role !== "admin") {
        throw new Error("Unauthorized : Login with Admin Account");
      }

      const bPair = await B_PairModel.findById(id).session(session);
      if (!bPair) throw new Error("B Pair Data not found");
      if (bPair.status === "Sold") throw new Error("B Pair Sold");
      const date = moment().tz("Asia/Karachi").format("YYYY-MM-DD");

      //UPDATING DATA
      bPair.sold_quantity += sold_quantity;
      //SETTTING STATUS
      switch (true) {
        case bPair.sold_quantity === bPair.quantity:
          bPair.status = "Sold";
          break;
        case bPair.sold_quantity > 0:
          bPair.status = "Partially Sold";
          break;
        case bPair.sold_quantity === 0:
          bPair.status = "UnSold";
          break;
      }

      const seller_Details = {
        amount,
        contact,
        name,
        date,
        quantity: sold_quantity,
        payment_Method,
      };

      bPair.seller_Details.push(seller_Details);
      await bPair.save({ session });

      //ADDING IN DAILY SALE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId: user.branchId,
        date: date,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily Sale Not Found");
      }
      let updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] += amount),
        totalSale: (dailySaleForToday.saleData.totalSale += amount),
      };

      if (payment_Method === "cashSale") {
        updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
          amount;
      }

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS

      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({}).session(
          session
        );
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] += amount),
        };
        virtualAccounts = updatedAccount;
        await virtualAccounts[0].save({ session });

        //updating transaction history
        await VA_HistoryModal.create(
          [
            {
              date,
              transactionType: "Deposit",
              payment_Method,
              amount,
              note: `B Pair Sale To ${name}`,
              new_balance: updatedAccount[0][payment_Method],
            },
          ],
          { session }
        );
      }

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
    const limit = 30;
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

export const reverseBpairSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, saleId } = req.body;
      if (!id || !saleId) {
        throw new Error("Required Fields Are Missing");
      }

      //VERIFYING ROLE
      const userId = req.session.userId;
      const user = await UserModel.findById(userId).session(session);
      if (user.role !== "admin") {
        throw new Error("Unauthorized : Login with Admin Account");
      }

      const bPair = await B_PairModel.findById(id).session(session);
      const saleData = bPair.seller_Details.find((s) => s._id === saleId);
      if (!bPair || !saleData) throw new Error("B Pair Data not found");
      const date = moment().tz("Asia/Karachi").format("YYYY-MM-DD");

      //UPDATING DATA
      bPair.quantity += saleData.quantity;
      //SETTTING STATUS
      switch (true) {
        case bPair.sold_quantity === bPair.quantity:
          bPair.status = "Sold";
          break;
        case bPair.sold_quantity > 0:
          bPair.status = "Partially Sold";
          break;
        case bPair.sold_quantity === 0:
          bPair.status = "UnSold";
          break;
      }

      saleData.deleted = true;
      await bPair.save({ session });

      const amount = saleData.amount;
      const payment_Method = saleData.payment_Method;

      //ADDING IN DAILY SALE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId: user.branchId,
        date: date,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily Sale Not Found");
      }

      let updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] -= amount),
        totalSale: (dailySaleForToday.saleData.totalSale -= amount),
      };

      if (payment_Method === "cashSale") {
        updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash -=
          amount;
      }

      function validateUpdatesaleData(updatedSaleData) {
        let errors = [];
        if (updatedSaleData.totalCash < 0) {
          errors.push("Insufficient Cash in Total Cash");
        };
        if (updatedSaleData.totalSale < 0) {
          errors.push("Insufficient Sale in Total Sale");
        };
        if (updatedSaleData.saleData[payment_Method] < 0) {
          errors.push("Insufficient Sale in Selected Payment Method");
        };
        return errors;
      }

      // Validate the transaction
      const transactionErrors = validateUpdatesaleData(updatedSaleData);

      if (transactionErrors.length > 0) {
        throw new Error(`Transaction failed:${transactionErrors}`);
      };

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({}).session(
          session
        );
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] -= amount),
        };
        if (updatedAccount[0][payment_Method] < 0) {
          throw new Error("Insufficient Account Balance");
        }
        virtualAccounts = updatedAccount;
        await virtualAccounts[0].save({ session });
        //updating transaction history
        await VA_HistoryModal.create(
          [
            {
              date,
              transactionType: "WithDraw",
              payment_Method,
              amount,
              note: `Deleted B Pair Sale For ${saleData.name}`,
              new_balance: updatedAccount[0][payment_Method],
            },
          ],
          { session }
        );
      }

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
