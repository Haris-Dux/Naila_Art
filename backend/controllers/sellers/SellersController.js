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
import {
  addBagsAndBoxInStock,
  removeBagsAndBoxFromStock,
} from "../Stock/BagsAndBoxController.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { purchasing_History_model } from "../../models/sellers/PurchasingHistoryModel.js";
import moment from "moment-timezone";
import { BaseModel } from "../../models/Stock/Base.Model.js";
import { calculateAccountBalance } from "../../utils/accounting.js";

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
        measurementData,
        toAddinStock,
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
      const total_debit = 0;
      const total_balance = total_credit - total_debit;
      let status = "Unpaid";

      const virtualAccountData = {
        total_credit,
        total_debit,
        total_balance,
        status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const billId = new mongoose.Types.ObjectId();
      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${bill_no}`,
          credit: total,
          balance: total,
          bill_id: billId,
        },
      ];

      //ADDING BASE DATA IN  SELLER
      if (seller_stock_category === "Base") {
        let stockData = [];
        if (toAddinStock === true) {
          measurementData.forEach((item) => {
            let { colour, measurement, roleQuantity } = item;
            if (!colour || !measurement || !roleQuantity)
              throw new Error("Missing data for stock");
            const totalQuantity = item.roleQuantity * item.measurement;
            const formattedCategory =
              category.charAt(0).toUpperCase() +
              category.slice(1).toLowerCase();
            const formattedColour =
              colour.charAt(0).toUpperCase() + colour.slice(1).toLowerCase();
            const duplicate = stockData.find(
              (stockItem) => stockItem.formattedColour === formattedColour
            );
            if (!duplicate) {
              stockData.push({
                formattedColour,
                totalQuantity,
                formattedCategory,
              });
            } else {
              duplicate.totalQuantity += totalQuantity;
            }
          });

          for (const stock of stockData) {
            const checkExistingStock = await BaseModel.findOne({
              category: stock.formattedCategory,
              colors: stock.formattedColour,
            }).session(session);
            let recordData = {
              category: stock.formattedCategory,
              colors: stock.formattedColour,
              Date: date,
              quantity: stock.totalQuantity,
            };
            if (checkExistingStock) {
              const updatedTYm = checkExistingStock.TYm + stock.totalQuantity;
              (checkExistingStock.recently = stock.totalQuantity),
                (checkExistingStock.r_Date = date),
                (checkExistingStock.TYm = updatedTYm),
                checkExistingStock.all_Records.push(recordData);
              await checkExistingStock.save({ session });
            } else {
              await BaseModel.create(
                [
                  {
                    category: stock.formattedCategory,
                    colors: stock.formattedColour,
                    recently: stock.totalQuantity,
                    r_Date: date,
                    TYm: stock.totalQuantity,
                    all_Records: [recordData],
                  },
                ],
                { session }
              );
            }
          }
        }
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
                _id: billId,
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
              billId,
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
              billId,
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
              billId,
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
                _id: billId,
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
    return res
      .status(200)
      .json({ success: true, message: "Bill generated successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyValue.bill_no) {
      return res.status(409).json({
        error: "Bill No already in use. Please use another one",
      });
    } 
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
        measurementData,
        toAddinStock,
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
      const {new_total_debit,new_total_credit,new_total_balance,new_status} = calculateAccountBalance({amount:total,oldAccountData:oldSellerData,credit:true});

      const virtualAccountData = {
        total_credit: new_total_credit,
        total_debit: new_total_debit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const billId = new mongoose.Types.ObjectId();
      const credit_debit_history_details = [
        {
          date,
          particular: `Bill No ${bill_no}`,
          credit: total,
          balance: new_total_balance,
          bill_id:billId
        },
      ];

      //ADDING BASE DATA IN  SEELER
      if (
        seller_stock_category === "Base" &&
        oldSellerData.seller_stock_category === "Base"
      ) {
        let stockData = [];
        if (toAddinStock === true) {
          measurementData.forEach((item) => {
            let { colour, measurement, roleQuantity } = item;
            if (!colour || !measurement || !roleQuantity)
              throw new Error("Missing data for stock");
            const totalQuantity = item.roleQuantity * item.measurement;
            const formattedCategory =
              category.charAt(0).toUpperCase() +
              category.slice(1).toLowerCase();
            const formattedColour =
              colour.charAt(0).toUpperCase() + colour.slice(1).toLowerCase();
            const duplicate = stockData.find((stockItem) => (
              stockItem.formattedColour === formattedColour
            ));
            if (!duplicate) {
              stockData.push({
                formattedColour,
                totalQuantity,
                formattedCategory,
              });
            } else {
              duplicate.totalQuantity += totalQuantity;
            }
          });
          for (const stock of stockData) {
            const checkExistingStock = await BaseModel.findOne({
              category: stock.formattedCategory,
              colors: stock.formattedColour,
            }).session(session);
            let recordData = {
              category: stock.formattedCategory,
              colors: stock.formattedColour,
              Date:date,
              quantity: stock.totalQuantity,
            };
            if (checkExistingStock) {
              const updatedTYm = checkExistingStock.TYm + stock.totalQuantity;
              (checkExistingStock.recently = stock.totalQuantity),
                (checkExistingStock.r_Date = date),
                (checkExistingStock.TYm = updatedTYm),
                checkExistingStock.all_Records.push(recordData);
              await checkExistingStock.save({session});
            } else {
              await BaseModel.create([{
                category: stock.formattedCategory,
                colors: stock.formattedColour,
                recently: stock.totalQuantity,
                r_Date: date,
                TYm: stock.totalQuantity,
                all_Records: [recordData],
              }],{session});
            }
          }
        };
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
                _id:billId,
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
              billId,
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
              billId,
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
              billId,
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
                _id:billId,
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
    return res.status(200).json({ success: true, message: "Bill generated successfully" });
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
      const oldSellerData = await SellersModel.findOne({ name: billData.name });
      if (!oldSellerData) throw new Error("Seller Not Found");

      const sellerId = oldSellerData._id;
      //DATA FOR VIRTUAL ACCOUNT
      const {new_total_debit,new_total_credit,new_total_balance,new_status} = calculateAccountBalance({amount:billData.total,oldAccountData:oldSellerData,credit:true,add:false});

      const virtualAccountData = {
        total_credit: new_total_credit,
        total_debit: new_total_debit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const updated_credit_debit_history = oldSellerData.credit_debit_history.filter(
          (item) => item?.bill_id?.toString() !== billId
        );

      //ADDING BASE DATA IN  SEELER
      if (billData.seller_stock_category === "Base") {
        await Promise.all([
          SellersModel.findByIdAndUpdate(
            sellerId,
            {
              virtual_account: virtualAccountData,         
              credit_debit_history: updated_credit_debit_history,
              
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
              billId,
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
              billId,
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
              billId,
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
              credit_debit_history: updated_credit_debit_history,
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
