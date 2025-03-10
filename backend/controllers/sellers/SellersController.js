import mongoose from "mongoose";
import { SellersModel } from "../../models/sellers/SellersModel.js";
import {
  addLaceInStock,
  removeLaceFromStock,
} from "../Stock/LaceController.js";
import {
  addAccesoriesInStock,
  removeAccesoriesFromStock,
} from "../Stock/AccessoriesController.js";
import { addBagsAndBoxInStock, removeBagsAndBoxFromStock } from "../Stock/BagsAndBoxController.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { purchasing_History_model } from "../../models/sellers/PurchasingHistoryModel.js";
import moment from "moment-timezone";

//TODAY
const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

export const addInStockAndGeneraeSellerData_NEW = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        bill_no,
        date,
        name,
        phone,
        category,
        quantity,
        rate,
        total,
        seller_stock_category,
      } = req.body;

      //VALIDATING FIELDS
      const requiredFields = [
        "bill_no",
        "phone",
        "date",
        "name",
        "category",
        "quantity",
        "rate",
        "total",
        "seller_stock_category",
      ];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        }
      });
      if (missingFields.length > 0)
        throw new Error(`Missing Fields ${missingFields}`);

      //VALIDATING EXISTING SELLER
      const existingSeller = await SellersModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });

      if (existingSeller) {
        throw new Error(`The name "${name}" already exists.`);
      }

      //DATA FOR VIRTUAL ACCOUNT
      const total_credit = total;
      const total_balance = total;
      let status = "Unpaid";

      const virtualAccountData = {
        total_credit,
        total_balance,
        status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${bill_no}`,
          credit: total,
          balance: total,
        },
      ];

      //ADDING BASE DATA IN  SEELER
      if (seller_stock_category === "Base") {
        await Promise.all([
          SellersModel.create(
            [
              {
                bill_no,
                date,
                name,
                phone,
                category,
                quantity,
                rate,
                total,
                seller_stock_category,
                credit_debit_history: credit_debit_history_details,
                virtual_account: virtualAccountData,
              },
            ],
            { session }
          ),
          purchasing_History_model.create(
            [
              {
                seller_stock_category,
                bill_no,
                date,
                name,
                category,
                quantity,
                rate,
                total,
              },
            ],
            { session }
          ),
        ]);
      } else if (
        ["Lace", "Bag/box", "Accessories"].includes(seller_stock_category)
      ) {
        //ADDING LACE OR BAG/BOX OR ACCESSORIES DATA IN STOCK
        switch (seller_stock_category) {
          case "Lace":
            const laceResult = await addLaceInStock({
              bill_no,
              name,
              category,
              quantity,
              r_Date: date,
              session,
            });
            if (laceResult.error) throw new Error(laceResult.error);
            break;
          case "Accessories":
            const accessoriesResult = await addAccesoriesInStock({
              serial_No: bill_no,
              name,
              r_Date: date,
              quantity,
              session,
              category,
            });
            if (accessoriesResult.error)
              throw new Error(accessoriesResult.error);
            break;
          case "Bag/box":
            const bagBoxResult = await addBagsAndBoxInStock({
              name: category,
              bill_no,
              r_Date: date,
              quantity,
              session,
            });
            if (bagBoxResult.error) throw new Error(bagBoxResult.error);
            break;
          default:
            throw new Error("Invalid Category");
        }
        //ADDING SELLERS DATA
        await Promise.all([
          SellersModel.create(
            [
              {
                bill_no,
                date,
                name,
                phone,
                category,
                quantity,
                rate,
                total,
                seller_stock_category,
                credit_debit_history: credit_debit_history_details,
                virtual_account: virtualAccountData,
              },
            ],
            { session }
          ),
          purchasing_History_model.create(
            [
              {
                seller_stock_category,
                bill_no,
                date,
                name,
                category,
                quantity,
                rate,
                total,
              },
            ],
            { session }
          ),
        ]);
      }
    });
    return res.status(200).json({ success: true, message: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getSelleForPurchasingById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Seller Id Required");
    const seller = await SellersModel.findById(id);
    if (!seller) throw new Error("Buyer Not Found");
    setMongoose();
    return res.status(200).json(seller);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSellersForPurchasing = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = 30;
    let search = req.query.search || "";
    let category = req.query.category || "";
    const status = req.query.status || "";

    let query = {};

    if (category) {
      query.seller_stock_category = category;
    }

    if (status) {
      query["virtual_account.status"] = status;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const totalSellers = await SellersModel.countDocuments(query);

    const sellers = await SellersModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const response = {
      sellers,
      page,
      totalSellers,
      totalPages: Math.ceil(totalSellers / limit),
    };
    setMongoose();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validateAndGetOldSellerData = async (req, res, next) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) throw new Error("Missing Required fields");
    const query = {
      name: { $regex: name, $options: "i" },
      seller_stock_category: category,
    };
    const oldSellerData = await SellersModel.find(query);
    if (!oldSellerData) throw new Error("No Data Found With This Seller Name");
    setMongoose();
    return res.status(200).json({ success: true, oldSellerData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addInStockAndGeneraeSellerData_OLD = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        sellerId,
        bill_no,
        date,
        name,
        phone,
        category,
        quantity,
        rate,
        total,
        seller_stock_category,
      } = req.body;

      //VALIDATING FIELDS
      const requiredFields = [
        "sellerId",
        "bill_no",
        "phone",
        "date",
        "name",
        "category",
        "quantity",
        "rate",
        "total",
        "seller_stock_category",
      ];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        }
      });
      if (missingFields.length > 0)
        throw new Error(`Missing Fields ${missingFields}`);

      //GETTING OLD SELLER DATA
      const oldSellerData = await SellersModel.findById({ _id: sellerId });
      if (oldSellerData.seller_stock_category !== seller_stock_category)
        throw new Error("Invalid Stock Category For This Seller");

      //DATA FOR VIRTUAL ACCOUNT
      const new_total_credit =
        oldSellerData.virtual_account.total_credit + total;
      const new_total_debit = oldSellerData.virtual_account.total_debit;
      const new_total_balance =
        oldSellerData.virtual_account.total_balance + total;
      let new_status = "";

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_credit && new_total_debit > 0:
          new_status = "Partially Paid";
          break;
        case new_total_debit === 0 && new_total_balance === new_total_credit:
          new_status = "Unpaid";
          break;
        case new_total_balance < 0:
          new_status = "Advance Paid";
          break;
        default:
          new_status = "";
      }

      const virtualAccountData = {
        total_credit: new_total_credit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${bill_no}`,
          credit: total,
          balance: new_total_balance,
        },
      ];

      //ADDING BASE DATA IN  SEELER
      if (
        seller_stock_category === "Base" &&
        oldSellerData.seller_stock_category === "Base"
      ) {
        await Promise.all([
          SellersModel.findByIdAndUpdate(
            sellerId,
            {
              bill_no,
              date,
              name,
              phone,
              category,
              quantity,
              rate,
              total,
              seller_stock_category,
              virtual_account: virtualAccountData,
              $push: {
                credit_debit_history: { $each: credit_debit_history_details },
              },
            },
            { session }
          ),
          purchasing_History_model.create(
            [
              {
                seller_stock_category,
                bill_no,
                date,
                name,
                category,
                quantity,
                rate,
                total,
              },
            ],
            { session }
          ),
        ]);
      } else if (
        ["Lace", "Bag/box", "Accessories"].includes(seller_stock_category)
      ) {
        //ADDING LACE OR BAG/BOX OR ACCESSORIES DATA IN STOCK
        switch (true) {
          case seller_stock_category === "Lace":
            const laceResult = await addLaceInStock({
              bill_no,
              name,
              category,
              quantity,
              r_Date: date,
              session,
            });
            if (laceResult.error) throw new Error(laceResult.error);
            break;
          case seller_stock_category === "Accessories":
            const accessoriesResult = await addAccesoriesInStock({
              serial_No: bill_no,
              name,
              r_Date: date,
              quantity,
              session,
              category,
            });
            if (accessoriesResult.error)
              throw new Error(accessoriesResult.error);
            break;
          case seller_stock_category === "Bag/box":
            const bagBoxResult = await addBagsAndBoxInStock({
              name: category,
              bill_no,
              r_Date: date,
              quantity,
              session,
            });
            if (bagBoxResult.error) throw new Error(bagBoxResult.error);
            break;
          default:
            throw new Error("Invalid Category");
        }

        //ADDING SELLERS DATA
        await Promise.all([
          SellersModel.findByIdAndUpdate(
            sellerId,
            {
              bill_no,
              date,
              name,
              phone,
              category,
              quantity,
              rate,
              total,
              seller_stock_category,
              $push: {
                credit_debit_history: { $each: credit_debit_history_details },
              },
              virtual_account: virtualAccountData,
            },

            { session }
          ),
          purchasing_History_model.create(
            [
              {
                seller_stock_category,
                bill_no,
                date,
                name,
                category,
                quantity,
                rate,
                total,
              },
            ],
            { session }
          ),
        ]);
      }
    });
    return res.status(200).json({ success: true, message: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllPurchasingHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = 30;
    let search = req.query.search || "";
    let category = req.query.category || "";

    let query = {};

    if (category) {
      query.seller_stock_category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sellerHistory = await purchasing_History_model.countDocuments(query);

    const sellers = await purchasing_History_model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const response = {
      sellerHistory,
      page,
      sellers,
      totalPages: Math.ceil(sellerHistory / limit),
    };
    setMongoose();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSellerBillAndReverseStock = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { billId } = req.body;

      //VALIDATING FIELDS
      const requiredFields = ["billId"];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        }
      });
      if (missingFields.length > 0)
        throw new Error(`Missing Fields ${missingFields}`);

      //GETTING BILL DATA
      const billData = await purchasing_History_model.findById({ _id: billId });
      if (!billData) throw new Error("Bill Not Found");

      //GETTING OLD SELLER DATA
      const oldSellerData = await SellersModel.findOne({name:billData.name});
      if (!oldSellerData) throw new Error("Seller Not Found");
      
      const sellerId = oldSellerData._id;
      //DATA FOR VIRTUAL ACCOUNT
      const new_total_credit =
        oldSellerData.virtual_account.total_credit - billData.total;
      const new_total_debit = oldSellerData.virtual_account.total_debit;
      const new_total_balance =
        oldSellerData.virtual_account.total_balance - billData.total;
      let new_status = "";

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_credit &&
          new_total_debit > 0 &&
          new_total_balance > 0:
          new_status = "Partially Paid";
          break;
        case new_total_debit === 0 && new_total_balance === new_total_credit:
          new_status = "Unpaid";
          break;
        case new_total_balance < 0:
          new_status = "Advance Paid";
          break;
        default:
          new_status = "";
      }

      const virtualAccountData = {
        total_credit: new_total_credit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const credit_debit_history_details = [
        {
          date:today,
          particular: `Bill Deleted/B.N${billData.bill_no}/B.Q/${billData.quantity}`,
          debit: billData.total,
          balance: new_total_balance,
        },
      ];


      //ADDING BASE DATA IN  SEELER
      if (billData.seller_stock_category === "Base") {
        await Promise.all([
          SellersModel.findByIdAndUpdate(
            sellerId,
            {
              virtual_account: virtualAccountData,
              $push: {
                credit_debit_history: { $each: credit_debit_history_details },
              },
            },
            { session }
          ),
          
          purchasing_History_model.findByIdAndDelete(billId).session(session),
        ]);
      } else if (
        ["Lace", "Bag/box", "Accessories"].includes(
          billData.seller_stock_category
        )
      ) {
        //ADDING LACE OR BAG/BOX OR ACCESSORIES DATA IN STOCK
        switch (true) {
          case billData.seller_stock_category === "Lace":
            const laceResult = await removeLaceFromStock({
              bill_no: billData.bill_no,
              name: billData.name,
              category: billData.category,
              quantity: billData.quantity,
              r_Date: today,
              session,
            });
            if (laceResult.error) throw new Error(laceResult.error);
            break;
          case billData.seller_stock_category === "Accessories":
            const accessoriesResult = await removeAccesoriesFromStock({
              serial_No: billData.bill_no,
              name: billData.name,
              r_Date: today,
              quantity: billData.quantity,
              session,
              category: billData.category,
            });
            if (accessoriesResult.error)
              throw new Error(accessoriesResult.error);
            break;
          case billData.seller_stock_category === "Bag/box":
            const bagBoxResult = await removeBagsAndBoxFromStock({
              name: billData.category,
              bill_no: billData.bill_no,
              r_Date: today,
              quantity: billData.quantity,
              session,
            });
            if (bagBoxResult.error) throw new Error(bagBoxResult.error);
            break;
          default:
            throw new Error("Invalid Category");
        }

        //ADDING SELLERS DATA
        await Promise.all([
          SellersModel.findByIdAndUpdate(
            sellerId,
            {
              $push: {
                credit_debit_history: { $each: credit_debit_history_details },
              },
              virtual_account: virtualAccountData,
            },

            { session }
          ),
          purchasing_History_model.findByIdAndDelete(billId).session(session),
        ]);
      }
    });

    return res
      .status(200)
      .json({ success: true, message: "Successfully Deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
