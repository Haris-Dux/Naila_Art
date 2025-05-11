import { BranchModel } from "../models/Branch.Model.js";
import { CashInOutModel } from "../models/CashInOutModel.js";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { SuitsModel } from "../models/Stock/Suits.Model.js";
import { setMongoose } from "../utils/Mongoose.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { branchStockHistoryModel } from "../models/BranchStock/BranchStockHistoryModel.js";
import { getTodayDate } from "../utils/Common.js";
import { branchStockModel } from "../models/BranchStock/BranchSuitsStockModel.js";

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
    const branchId = req.branch_id;
    const role = req.user_role;
    if (role !== "superadmin" && !branchId)
      throw new Error("Branch Id Required");
    if (!role) throw new Error("User Role Not Found");
    let response;
    if (role === "superadmin") {
      const branches = await BranchModel.find({});
      response = branches;
    } else {
      const branch = await BranchModel.findOne({ _id: branchId });
      response = [branch];
    }
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const assignStockToBranch = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { branchId, bundles,note} = req.body;
      const requiredFields = ["branchId", "bundles","note"];
      const bundleFields = [
        "category",
        "color",
        "quantity",
        "cost_price",
        "sale_price",
        "d_no",
        "Item_Id",
      ];
      const missingFields = [];

      //CHECKING FOR REQUIRED FIELDS
      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(`${field}`);
        } else if (field === "bundles" && req.body[field].length === 0) {
          missingFields.push(`${field} Cannot be empty)`);
        }
      });

      //CHECKING FOR BUNDLE DETAILS FIELDS
      const structuredArray = bundles.flat();

      structuredArray.forEach((obj, index) => {
        const missingStockFields = [];
        bundleFields.forEach((item) => {
          if (!obj[item]) {
            missingStockFields.push(item);
          }
        });
        if (missingStockFields.length > 0) {
          missingFields.push(
            `${missingStockFields} for suit item ${index + 1}`
          );
        }
      });

      if (missingFields.length > 0) {
        throw new Error(`Missing Fields ${missingFields}`);
      }

      //DEDUCTING SUITS FROM MAIN STOCK
      const result = await SuitsModel.bulkWrite(
        structuredArray.map((item) => ({
          updateOne: {
            filter: {
              _id: item.Item_Id,
              quantity: { $gte: item.quantity },
            },
            update: {
              $inc: { quantity: -item.quantity },
            },
          },
        })),
        { session }
      );

      if (result.modifiedCount !== structuredArray.length) {
        throw new Error("One or more items have insufficient stock.");
      }

      //WRITING TO BRANCH STOCK HISTORY
      await branchStockHistoryModel.create(
        [
          {
            branchId: branchId,
            issueDate: getTodayDate(),
            note,
            bundles,
          },
        ],
        { session }
      );

      return res.status(200).json({
        success: true,
        message: "Stock updated for branch successfully",
      });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllBranchStockHistory = async (req, res) => {
  try {
    const branchId = req.query.branchId;
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    let query = {};
    if (branchId) {
      query.branchId = branchId;
    };

    const data = await branchStockHistoryModel.find(query)
    .skip((page - 1) * limit)
    .sort({createdAt : -1})
    .limit(limit)

    const total = await branchStockHistoryModel.countDocuments(query);

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
    
    const branchId = req.branch_id;
    if (!branchId) throw new Error("Branch Id Required");
    const page = parseInt(req.query.page) || 1;
    let d_no = parseInt(req.query.search) || "";
    let category = req.query.category || "";
    const limit = 50;

    let query = {};
    if (d_no) {
      query = { ...query, d_no };
    };

    if (category) {
      query = { ...query, category };
    };

    const total = await branchStockModel.countDocuments(query);
    const data = await branchStockModel.find(query)
    .skip((page - 1) * limit)
    .sort({createdAt : -1})
    .limit(limit)

    const categoryNames = await branchStockModel.distinct('category')
    
    setMongoose();
    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      data,
      categoryNames
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const approveOrRejectStock = async (req, res) => {
  try {
    const { stockId, status } = req.body;
    if (
      !stockId ||
      (!status && (status !== "Approved" || status !== "Rejected"))
    )
      throw new Error("Invalid Fields");

    const pendingtockData = await branchStockHistoryModel.findById(stockId);
    if (!pendingtockData) throw new Error("No pending stock found");
    if (pendingtockData.bundleStatus !== "Pending")
      throw new Error("Error updating stock.Stock is not pending");
    const bundles = pendingtockData.bundles;
    const structuredArray = bundles.flat();
    if (status === "Approved") {
      structuredArray.forEach(async (suit) => {
        const branchsuitStock = await branchStockModel.findOne({
          main_stock_Id: suit.Item_Id,
          branchId: pendingtockData.branchId,
        });
        if (branchsuitStock) {
          branchsuitStock.total_quantity += suit.quantity;
          branchsuitStock.lastUpdated = getTodayDate();
          branchsuitStock.cost_price = suit.cost_price;
          branchsuitStock.sale_price = suit.sale_price;
          await branchsuitStock.save();
        } else if (!branchsuitStock) {
          await branchStockModel.create({
            branchId: pendingtockData.branchId,
            lastUpdated: getTodayDate(),
            category: suit.category,
            color: suit.color,
            total_quantity: suit.quantity,
            cost_price: suit.cost_price,
            sale_price: suit.sale_price,
            d_no: suit.d_no,
            main_stock_Id: suit.Item_Id,
          });
        }
      });
      pendingtockData.bundleStatus = "Approved";
      await pendingtockData.save();
    } else if (status === "Rejected") {
      await SuitsModel.bulkWrite(
        structuredArray.map((item) => ({
          updateOne: {
            filter: {
              _id: item.Item_Id,
            },
            update: {
              $inc: { quantity: item.quantity },
            },
          },
        }))
      );
      pendingtockData.bundleStatus = "Rejected";
      pendingtockData.updatedOn = getTodayDate();
      await pendingtockData.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Stock Updated Successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getPendingStockForBranch = async (req,res) => {
  try {
    const branchId = req.branch_id;
    const data = await branchStockHistoryModel.find({branchId:branchId,bundleStatus:"Pending"});
    return res.status(200).json(data);
  } catch (error) {
        return res.status(400).json({ error: error.message });

  }
}
