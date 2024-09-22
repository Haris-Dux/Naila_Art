import { BranchModel } from "../models/Branch.Model.js";
import { CashInOutModel } from "../models/CashInOutModel.js";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { SuitsModel } from "../models/Stock/Suits.Model.js";
import { UserModel } from "../models/User.Model.js";
import { setMongoose } from "../utils/Mongoose.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { sendEmail } from "../utils/nodemailer.js";

export const createBranch = async (req, res) => {
  try {
    const { branchName } = req.body;
    if (!branchName) throw new Error("Invalid branch name");
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

    const existingBranch = await BranchModel.findOne({
      branchName: { $regex: new RegExp(branchName, "i") },
    });
    if (existingBranch) {
      throw new Error("This branch already exists");
    }
    const branchData = await BranchModel.create({ branchName });
    await CashInOutModel.create({
      branchId: branchData._id,
      date: today,
      todayCashIn: 0,
      todayCashOut: 0,
    });
    await DailySaleModel.create({
      branchId: branchData._id,
      date: today,
      saleData: {},
    });

    return res.status(201).json({ success: true, message: "Success" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { branchName, branchId } = req.body;
    if (!branchName || !branchId) throw new Error("Invalid Update Data");
    const foundBranch = BranchModel.findById(branchId);
    if (!foundBranch) throw new Error("Invalid Branch Id");
    const existingBranch = await BranchModel.findOne({
      branchName: { $regex: new RegExp(branchName, "i") },
    });
    if (existingBranch && existingBranch._id !== branchId) {
      throw new Error("This branch already exists");
    }
    await BranchModel.findByIdAndUpdate(
      { _id: branchId },
      { branchName: branchName }
    );
    return res
      .status(201)
      .json({ success: true, message: "updated successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId) throw new Error("Invalid branch ID");
    await BranchModel.findByIdAndDelete(branchId);
    return res
      .status(201)
      .json({ success: true, message: "deleted successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("User Id Required");
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User Not Found");
    let response;
    if (user?.role === "superadmin") {
      const branches = await BranchModel.find({});
      response = branches;
    } else {
      const branch = await BranchModel.findOne({ _id: user.branchId });
      response = [branch];
    }
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

//STOCK

export const assignStockToBranch = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { branchId, stock_Details } = req.body;
      const requiredFields = ["branchId", "stock_Details"];
      const stockFields = [
        "category",
        "color",
        "quantity",
        "cost_price",
        "sale_price",
        "d_no",
        "Item_Id",
        "date",
      ];
      const missingFields = [];

      //CHECKING FOR REQUIRED FIELDS
      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(`${field}`);
        } else if (field === "stock_Details" && req.body[field].length === 0) {
          missingFields.push(`${field} Cannot be empty)`);
        }
      });

      //CHECKING FOR STOCK DETAILS FIELDS
      if (stock_Details && stock_Details.length > 0) {
        stock_Details.forEach((obj, index) => {
          const missingStockFields = [];
          stockFields.forEach((item) => {
            if (!obj[item]) {
              missingStockFields.push(item);
            }
          });
          if (missingStockFields.length > 0) {
            missingFields.push(`${missingStockFields} for Item ${index + 1}`);
          }
        });
      }
      if (missingFields.length > 0) {
        throw new Error(`Missing Fields ${missingFields}`);
      }

      //ADDING STOCK IN BRANCH
      const branch = await BranchModel.findById(branchId).session(session);
      if (!branch) throw new Error("Branch Not Found");

      stock_Details.forEach((stock) => {
        const {
          Item_Id,
          quantity,
          cost_price,
          sale_price,
          date,
          category,
          color,
          d_no,
        } = stock;
        const existingStock = branch.stockData.find((item) =>
          item.Item_Id.equals(Item_Id)
        );
        const record_data = { date, quantity, cost_price, sale_price };

        if (existingStock) {
          existingStock.all_records.push(record_data);
        } else {
          branch.stockData.push({
            d_no,
            category,
            color,
            Item_Id,
            all_records: [record_data],
          });
        }
      });

      //DEDUCTING SUITS FROM STOCK
      const suitsIdsToDeduct = stock_Details.map((suit) => suit.Item_Id);
      const suitsStock = await SuitsModel.find({
        _id: { $in: suitsIdsToDeduct },
      }).session(session);
      const updatePromises = suitsStock.map(async (suit) => {
        const suitToUpdate = stock_Details.find(
          (item) => item.Item_Id == suit._id
        );
        const updatedSuitQuantity = suit.quantity - suitToUpdate.quantity;
        if (updatedSuitQuantity < 0)
          throw new Error(
            `Not enough stock For Design No: ${suit.d_no} Category: ${suit.category}`
          );
        suit.quantity = updatedSuitQuantity;
        return suit.save({ session });
      });

      await Promise.all(updatePromises);
      await branch.save({ session });

      return res
        .status(200)
        .json({ success: true, message: "Stock Sent Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllBranchStockHistory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Branch Id Required");
    const branch = await BranchModel.findById(id);
    if (!branch) throw new Error("Branch Not Found");

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = parseInt(req.query.search) || "";

    let query = {};
    if (search) {
      query = { ...query, "stockData.d_no": search };
    }

    const branchId = new mongoose.Types.ObjectId(id);

    const data = await BranchModel.aggregate([
      { $match: { _id: branchId } },
      { $unwind: "$stockData" },
      { $unwind: "$stockData.all_records" },
      { $match: query },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { "stockData.createdAt": -1 } },
      {
        $project: {
          category: "$stockData.category",
          color: "$stockData.color",
          quantity: "$stockData.all_records.quantity",
          cost_price: "$stockData.all_records.cost_price",
          sale_price: "$stockData.all_records.sale_price",
          date: "$stockData.all_records.date",
          d_no: "$stockData.d_no",
          stock_status: "$stockData.all_records.stock_status",
        },
      },
    ]);
    let total = 0;
    if (search) {
      branch?.stockData?.forEach((item) => {
        if (item.d_no === search) {
          total += item.all_records.length;
        }
      });
    } else {
      total = branch?.stockData?.reduce(
        (inc, item) => inc + item.all_records.length,
        0
      );
    }

    setMongoose();

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      data,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSuitsStockForBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Branch Id Required");
    const branch = await BranchModel.findById(id);
    if (!branch) throw new Error("Branch Not Found");

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = parseInt(req.query.search) || "";
    let category = req.query.category || "";

    let query = {};
    if (search) {
      query = { ...query, "stockData.d_no": search };
    }

    if (category) {
      query = { ...query, "stockData.category": category };
    }

    const branchId = new mongoose.Types.ObjectId(id);

    //CALCULATE TOTAL QUANTITY FOR DESIGN NO
    const totalQuantity = await BranchModel.aggregate([
      {
        $match: { _id: branchId },
      },
      {
        $unwind: "$stockData",
      },
      {
        $group: {
          _id: "$stockData.d_no",
          totalQuantity: { $sum: "$stockData.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          d_no: "$_id",
          totalQuantity: 1,
        },
      },
    ]);

    //GETTING CATEGORY NAMES
    const categoryNames = Array.from(
      new Set(branch?.stockData.map((item) => item.category))
    );

    const result = await BranchModel.aggregate([
      { $match: { _id: branchId } },
      { $unwind: "$stockData" },
      { $match: query },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { "stockData.createdAt": -1 } },
      {
        $project: {
          _id: 0,
          id: "$stockData._id",
          category: "$stockData.category",
          color: "$stockData.color",
          quantity: "$stockData.quantity",
          cost_price: "$stockData.cost_price",
          sale_price: "$stockData.sale_price",
          d_no: "$stockData.d_no",
          Item_Id: "$stockData.Item_Id",
          last_updated: "$stockData.last_updated",
          stock_status: "$stockData.stock_status",
          all_records: "$stockData.all_records",
        },
      },
    ]);

    const total = branch.stockData.length;

    // Merge total quantity into the result
    const data = result.map((suit) => {
      const requiredObj = totalQuantity.find((item) => item.d_no === suit.d_no);
      return {
        ...suit,
        TotalQuantity: requiredObj ? requiredObj.totalQuantity : 0,
      };
    });

    setMongoose();

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      categoryNames,
      data,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const approveOrRejectStock = async (req, res) => {
  try {
    const { _id, Item_Id, status, branchId } = req.body;
    if (!_id || !Item_Id || !status || !branchId)
      throw new Error("All Fields Required");
    const branch = await BranchModel.findById(branchId);
    if (!branch) throw new Error("Branch Not Found");

    const stockItem = branch.stockData.find((item) =>
      item.all_records.some((record) => record._id.equals(_id))
    );
    if (!stockItem) throw new Error("stockItem To Update Not Found");
    const stockToUpdate = stockItem.all_records.find((record) =>
      record._id.equals(_id)
    );
    if (!stockToUpdate) throw new Error("stockToUpdate Not Found");

    //UPDATING STATUS AND STOCK
    stockToUpdate.stock_status = status;
    let MainStock = {};
    if (status === "Received") {
       MainStock = branch.stockData.find((item) =>
        item.Item_Id.equals(Item_Id)
      );
      if (!MainStock) throw new Error("MainStock To Update Not Found");
      MainStock.quantity += stockToUpdate.quantity;
      MainStock.cost_price = stockToUpdate.cost_price;
      MainStock.sale_price = stockToUpdate.sale_price;
      MainStock.last_updated = stockToUpdate.date;
    } else if (status === "Returned") {
      MainStock = branch.stockData.find((item) =>
        item.Item_Id.equals(Item_Id)
      );
      const suitToUpdate = await SuitsModel.findOne({
        id: branch.stockData.Item_Id,
      });
      if (suitToUpdate) {
        suitToUpdate.quantity += stockToUpdate.quantity;
        await suitToUpdate.save();
      } else throw new Error("Suit Stock Not Found");
    }
    await branch.save();
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
    const StockEmailData = {
      send_date:stockToUpdate.date,
      recieveDate:today,
      d_no:MainStock.d_no,
      category:MainStock.category,
      color:MainStock.color,
      quantity:stockToUpdate.quantity,
      branchName:branch.branchName,
      stockStatus:status
    };
    await sendEmail({email:"Nailaarts666@gmail.com",email_Type:"Stock Update",StockEmailData});
    return res
      .status(200)
      .json({ success: true, message: "Stock Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
