import moment from "moment-timezone";
import { SuitsModel } from "../../models/Stock/Suits.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";
import CustomError from "../../config/errors/CustomError.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BagsAndBoxModel } from "../../models/Stock/BagsAndBoxModel.js";
import { StitchingModel } from "../../models/Process/StitchingModel.js";
import mongoose from "mongoose";
import { getPaginationParams, getTodayDate } from "../../utils/Common.js";
import { verifyrequiredparams } from "../../middleware/Common.js";
import { purchasing_History_model } from "../../models/sellers/PurchasingHistoryModel.js";
import { SellersModel } from "../../models/sellers/SellersModel.js";
import { calculateAccountBalance } from "../../utils/accounting.js";


export const getAllSuits = async (req, res, next) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    let search = parseInt(req.query.search) || "";
    let category = req.query.category || "";

    let query = {};
    if (search) {
      query = { ...query, d_no: search };
    }

    if (category) {
      query = { ...query, category: category };
    }

    //CALCULATE TOTAL QUANTITY FOR DESIGN NO
    const aggregatedData = await SuitsModel.aggregate([
      {
        $facet: {
          d_no_quantity: [
            {
              $group: {
                _id: "$d_no",
                quantity: { $sum: "$quantity" },
              },
            },
          ],
          category_data: [
            {
              $group: {
                _id: "$category",
                quantity: { $sum: "$quantity" },
              },
            },
          ],
          total_stock: [
            {
              $group: {
                _id: null,
                total_quantity: { $sum: "$quantity" },
              },
            },
          ],
        },
      },
    ]);

    const result = await SuitsModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ quantity: -1, createdAt: -1 });

    const total = await SuitsModel.countDocuments(query);

    //MERGING TOTAL QUANTITY

    const data = result.map((suit) => {
      const palinSuit = suit.toObject();
      const requiredObj = aggregatedData[0].d_no_quantity.find(
        (item) => item._id === palinSuit.d_no
      );
      return {
        ...palinSuit,
        TotalQuantity: requiredObj?.quantity,
      };
    });

    setMongoose();

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      limit,
      Suits: total,
      totalRecords: total,
      data,
      category_data: aggregatedData[0].category_data,
      total_stock: aggregatedData[0]?.total_stock[0]?.total_quantity || 0,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllCategoriesForSuits = async (req, res, next) => {
  try {
    const data = await SuitsModel.find({})
      .sort({ createdAt: -1 })
      .select("category");

    const categoryNames = Array.from(
      new Set(data?.map((item) => item.category))
    )

    setMongoose();
    return res.status(200).json(categoryNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProcessSuitStock = async (req,res,next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { suit_id, record_id } = req.body;

      if(!suit_id || !record_id) {
        throw new CustomError("Missing required fields",400)
      };

      const suitRecord = await SuitsModel.findById(suit_id).session(session);
      let recordToDelete = null;
      if(suitRecord){
        recordToDelete = suitRecord.all_records.find((item) => item._id.equals(record_id));
      };

      //UPDATING SUIT RECORD QUANTITY
      const updatedQuantity = suitRecord.quantity - recordToDelete.quantity;
      if(updatedQuantity < 0) {
        throw new CustomError("Not enough quantity in stock",400)
      };
      suitRecord.quantity = updatedQuantity;


      //UPDATING NEXT STEP IN EMBROIDERY
       const embroideryData = await EmbroideryModel.findById(recordToDelete.embroidery_Id).session(session);
       embroideryData.next_steps.packing = false;

       //UPDATE BAGS STOCK
       if(recordToDelete.bags_used) {
         await BagsAndBoxModel.findOneAndUpdate(
        {name: "Bags"}, 
        { $inc:  {totalQuantity: recordToDelete.quantity } },
        {new:true,session});
       };
     
       //UPDATING PACKING STATUS FOR STITCHING
       if(embroideryData.next_steps.stitching){
        const stitchingUpdate = await StitchingModel.findOneAndUpdate(
          {embroidery_Id:recordToDelete.embroidery_Id},
          {$set: {packed:false}},
           {new:true,session}
        );
        console.log('stitchingUpdate', stitchingUpdate)
       };

        await embroideryData.save({ session });
        suitRecord.all_records = suitRecord.all_records.filter((r) => r._id.toString() !== record_id)
        await suitRecord.save({session});
    });
    return res
    .status(200)
    .json({ success: true, message: "Stock deleted successfully" });
  } catch (error) {
    next(error)
  } finally {
    session.endSession();
  }
};

export const deleteSuitBillPartAndReverseStock = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { billId, rowId, scope, category } = req.body;
      await verifyrequiredparams(req.body, ["billId", "scope"]);

      const billData = await purchasing_History_model
        .findById(billId)
        .session(session);
      if (!billData) throw new Error("Bill data not found");
      if (billData.seller_stock_category !== "Suits") {
        throw new Error("Invalid bill category");
      }

      const rows = billData.measurementData || [];
      const suitCategories = [
        ...new Set(rows.map((row) => String(row.category || "").toLowerCase())),
      ];
      if (rows.length === 1 && suitCategories.length === 1) {
        throw new Error(
          "Only one suit row is remaining. Please delete the full bill instead.",
        );
      }

      const rowsToDelete = rows.filter((row) => {
        if (scope === "color") {
          return row.id.toString() === rowId;
        }
        if (scope === "category") {
          return (
            String(row.category).toLowerCase() ===
            String(category || "").toLowerCase()
          );
        }
        throw new Error("Invalid delete scope");
      });

      if (!rowsToDelete.length) throw new Error("No matching suit rows found");

      const result = await removeSuitPurchaseStockRows({
        billId,
        rows: rowsToDelete,
        session,
      });
      if (result.error) throw new Error(result.error);

      const removedTotal = rowsToDelete.reduce(
        (sum, row) =>
          sum + Number(Number(row.quantity || 0) * Number(row.cost_price || 0)),
        0,
      );
      const removedQuantity = rowsToDelete.reduce(
        (sum, row) => sum + Number(row.quantity || 0),
        0,
      );

      const oldSellerData = await SellersModel.findOne({
        name: billData.name,
      }).session(session);
      if (!oldSellerData) throw new Error("Seller data not found");

      const remainingRows = rows.filter(
        (row) =>
          !rowsToDelete.some((deleted) => {
            if (scope === "color") {
              return row.id.toString() === rowId;
            }
            if (scope === "category") {
              return (
                String(row.category).toLowerCase() ===
                String(category || "").toLowerCase()
              );
            }
          }),
      );

      const partialAccountUpdate = await updateSellerAfterBillReduction({
        seller: oldSellerData,
        billId,
        amount: removedTotal,
        session,
        billNo: billData.bill_no,
        removeBillHistory: remainingRows.length === 0 ?? false,
      });
      if (result.error) throw new Error(result.error);

      if (remainingRows.length === 0) {
        await purchasing_History_model
          .findByIdAndDelete(billId)
          .session(session);
      } else {
        billData.measurementData = remainingRows;
        billData.quantity = Number(billData.quantity || 0) - removedQuantity;
        billData.total = Number(billData.total || 0) - removedTotal;
        await billData.save({ session });
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

const updateSellerAfterBillReduction = async ({
  seller,
  billId,
  amount,
  session,
  billNo,
  removeBillHistory
}) => {
  try {
     const {
       new_total_debit,
       new_total_credit,
       new_total_balance,
       new_status,
     } = calculateAccountBalance({
       amount,
       oldAccountData: seller,
       credit: true,
       add: false,
     });

     const updateQuery = {
       $set: {
         virtual_account: {
           total_credit: new_total_credit,
           total_debit: new_total_debit,
           total_balance: new_total_balance,
           status: new_status,
         },
       },
     };

     if (removeBillHistory) {
       updateQuery.$pull = {
         credit_debit_history: { bill_id: billId },
       };
     } else {
       const recordData = {
         date: getTodayDate(),
         particular: `Partial stock delete adjustment for Bill No:${billNo}`,
         credit: - amount,
         debit: new_total_debit,
         balance: new_total_balance,
         bill_id: billId,
       };

       updateQuery.$push = {
         credit_debit_history: recordData,
       };
     }

     await SellersModel.findByIdAndUpdate(seller._id, updateQuery, { session });
     return { message: "success" };
  } catch (error) {
    throw error
  }
 
};

export const normalizeSuitStockRows = (rows = []) => {
  if (!rows || !rows.length) {
    throw new Error("Missing suit stock rows");
  }

  const designCategoryMap = new Map();

  return rows.map((row) => {
    const design_no = Number(row.design_no ?? row.d_no);
    const category = String(row.category || "").trim();
    const colour = String(row.color || "").trim();
    const quantity = Number(row.quantity);
    const cost_price = Number(row.cost_price);
    const sale_price = Number(row.sale_price);
    const rowTotal = Number(quantity * cost_price);
    const rowId = new mongoose.Types.ObjectId();

    if (!design_no || !category || !colour || !quantity || !cost_price || !sale_price) {
      throw new Error("Missing suit row fields");
    }

    const previousCategory = designCategoryMap.get(design_no);
    if (previousCategory && previousCategory.toLowerCase() !== category.toLowerCase()) {
      throw new Error(`Design No ${design_no} can only have one category in a bill`);
    }
    designCategoryMap.set(design_no, category);

    return { _id: rowId, design_no, category, colour, quantity, cost_price, sale_price, rowTotal };
  });
};

export const addSuitsPurchaseInStock = async ({ billId, rows, r_Date, session }) => {
  try {
     const suitRows = rows || [];

  for (const row of suitRows) {
    const existingSuitWithDNo = await SuitsModel.findOne({
      d_no: row.design_no,
    }).session(session);

    if (
      existingSuitWithDNo &&
      existingSuitWithDNo.category.toLowerCase() !== row.category.toLowerCase()
    ) {
      throw new Error(
        `The Design No ${row.design_no} is already assigned to the category '${existingSuitWithDNo.category}'`
      );
    }

    const checkExistingSuitStock = await SuitsModel.findOne({
      d_no: row.design_no,
      category: { $regex: new RegExp(`^${row.category}$`, "i") },
      color: { $regex: new RegExp(`^${row.colour}$`, "i") },
    }).session(session);

    const recordData = {
      _id: row._id,
      date: r_Date,
      quantity: row.quantity,
      cost_price: row.cost_price,
      sale_price: row.sale_price,
      bill_id: billId,
      is_stock_source_packing: false,
    };

    if (checkExistingSuitStock) {
      checkExistingSuitStock.quantity += row.quantity;
      checkExistingSuitStock.cost_price = row.cost_price;
      checkExistingSuitStock.sale_price = row.sale_price;
      checkExistingSuitStock.all_records.push(recordData);
      await checkExistingSuitStock.save({ session });
    } else {
      await SuitsModel.create(
        [
          {
            category: row.category,
            color: row.colour,
            quantity: row.quantity,
            cost_price: row.cost_price,
            sale_price: row.sale_price,
            d_no: row.design_no,
            all_records: [recordData],
          },
        ],
        { session }
      );
    }
  }

   return { message: "Successfully Added" };
  } catch (error) {
     throw error;
  }
};

export const removeSuitPurchaseStockRows = async ({ billId, rows, session }) => {
  try {
    const suitRows = rows || [];

    for (const row of suitRows) {
      const rowColour = row.colour || row.color;
      const suitStock = await SuitsModel.findOne({
        d_no: row.design_no,
        category: { $regex: new RegExp(`^${row.category}$`, "i") },
        color: { $regex: new RegExp(`^${rowColour}$`, "i") },
      }).session(session);

      if (!suitStock) {
        throw new Error(`Suit stock not found for D# ${row.design_no}, ${row.category}, ${rowColour}`);
      }

      const updatedQuantity = Number(suitStock.quantity) - Number(row.quantity);
      if (updatedQuantity < 0) {
        throw new Error(`Not enough suit stock for D# ${row.design_no}, ${row.category}, ${rowColour}`);
      }

      suitStock.quantity = updatedQuantity;
      suitStock.all_records = suitStock.all_records.filter(
        (record) => record._id.toString() !== row._id.toString()
      );

      const latestRecord = suitStock.all_records
        .slice()
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        })[0];

      suitStock.cost_price = latestRecord ? Number(latestRecord.cost_price || 0) : 0;
      suitStock.sale_price = latestRecord ? Number(latestRecord.sale_price || 0) : 0;

      await suitStock.save({ session });
    }
    return { message: "Successfully deleted" };
  } catch (error) {
    throw error;
  }
}
  
