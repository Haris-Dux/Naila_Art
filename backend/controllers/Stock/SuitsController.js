import moment from "moment-timezone";
import { SuitsModel } from "../../models/Stock/Suits.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";
import CustomError from "../../config/errors/CustomError.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BagsAndBoxModel } from "../../models/Stock/BagsAndBoxModel.js";
import { StitchingModel } from "../../models/Process/StitchingModel.js";
import mongoose from "mongoose";

export const addSuitsInStock = async (req, res, next) => {
  try {
    const { category, color, quantity, cost_price, sale_price, d_no } =
      req.body;
    if (!category || !color || !quantity || !cost_price || !sale_price || !d_no)
      throw new Error("Missing Fields For Adding Suits Stock");

    const existingSuitWithDNo = await SuitsModel.findOne({ d_no });

    if (
      existingSuitWithDNo &&
      existingSuitWithDNo.category.toLowerCase() !== category.toLowerCase()
    ) {
      throw new Error(
        `The Design No ${d_no} is already assigned to the category '${existingSuitWithDNo.category}'`
      );
    }

    const checkExistingSuitStock = await SuitsModel.findOne({
      d_no,
      category: { $regex: new RegExp(`^${category}$`, "i") },
      color: { $regex: new RegExp(`^${color}$`, "i") },
    });

    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
    let recordData = { date: today, quantity, cost_price, sale_price };
    if (
      checkExistingSuitStock &&
      checkExistingSuitStock.color.toLowerCase() === color.toLowerCase()
    ) {
      (checkExistingSuitStock.quantity += parseInt(quantity)),
        (checkExistingSuitStock.cost_price = cost_price),
        (checkExistingSuitStock.sale_price = sale_price);
      checkExistingSuitStock.all_records.push(recordData);
      await checkExistingSuitStock.save();
    } else {
      await SuitsModel.create({
        category,
        color,
        quantity,
        cost_price,
        sale_price,
        d_no,
        all_records: [recordData],
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSuits = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
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
      Suits: total,
      data,
      category_data: aggregatedData[0].category_data,
      total_stock: aggregatedData[0].total_stock[0].total_quantity,
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