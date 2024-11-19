import { StitchingModel } from "../../models/Process/StitchingModel.js";
import { LaceModel } from "../../models/Stock/Lace.Model.js";
import { SuitsModel } from "../../models/Stock/Suits.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";
import mongoose from "mongoose";
import { addBPair } from "./B_PairController.js";
import moment from "moment-timezone";
import { BagsAndBoxModel } from "../../models/Stock/BagsAndBoxModel.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import { PicruresModel } from "../../models/Process/PicturesModel.js";

export const addStitching = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        embroidery_Id,
        Quantity,
        partyName,
        partytype,
        serial_No,
        design_no,
        date,
        rate,
        lace_quantity,
        lace_category,
        suits_category,
        dupatta_category,
      } = req.body;
      const requiredFields = [
        "partytype",
        "embroidery_Id",
        "partyName",
        "rate",
        "design_no",
        "serial_No",
        "date",
        "lace_category",
        "lace_quantity",
        "Quantity",
      ];

      const missingFields = [];
      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        }
        if (suits_category) {
          for (let item of suits_category) {
            if (!item.category || !item.color || !item.quantity_in_no) {
              throw new Error(
                "Each suits category item must have category, color, and quantity"
              );
            }
          }
        }
        if (dupatta_category) {
          for (let item of dupatta_category) {
            if (!item.category || !item.color || !item.quantity_in_no) {
              throw new Error(
                "Each dupatta category item must have category, color, and quantity"
              );
            }
          }
        }
        if (missingFields.length > 0) {
          throw new Error(`Missing Fields ${field}`);
        }
      });

      if (partytype === "newParty") {
        const checkExistingStitching = await StitchingModel.findOne({
          partyName: { $regex: partyName, $options: "i" },
        }).session(session);
        if (checkExistingStitching) {
          throw new Error("Party Name Already In Use");
        }
      }

      const lace = await LaceModel.findOne({ category: lace_category }).session(
        session
      );
      if (!lace) throw new Error("Lace Not found");
      if (parseInt(lace_quantity) > lace.totalQuantity)
        throw new Error("Not Enough Lace In Stock");
      const newLaceTotalQuantity =
        parseInt(lace.totalQuantity) - parseInt(lace_quantity);
      await LaceModel.updateOne(
        { category: lace_category },
        { totalQuantity: newLaceTotalQuantity }
      ).session(session);

      await StitchingModel.create(
        [
          {
            embroidery_Id,
            Quantity,
            partyName,
            serial_No,
            design_no,
            date,
            rate,
            lace_quantity,
            lace_category,
            suits_category,
            dupatta_category,
          },
        ],
        { session }
      );
      //UPDATE MAIN EMBROIDERY NextStep
      const mainEmbroidery = await EmbroideryModel.findById(
        embroidery_Id
      ).session(session);
      mainEmbroidery.next_steps.stitching = true;
      await mainEmbroidery.save({ session });
    });

    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllStitching = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = 20;
    let query = {
      partyName: { $regex: search, $options: "i" },
    };
    const data = await StitchingModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await StitchingModel.countDocuments(query);
    const response = {
      totalPages: Math.ceil(total / limit),
      data,
      page,
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getStitchingById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Required");
    const data = await StitchingModel.findById(id);
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getStitchingByEmbroideryId = async (req, res, next) => {
  try {
    const { embroidery_Id } = req.body;
    if (!embroidery_Id) throw new Error("Embroidery Id Required");
    const data = await StitchingModel.findOne({ embroidery_Id });
    if (!data) throw new Error("No Stitching Data For This Embroidery");
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateStitching = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, suits_category, dupatta_category, project_status } = req.body;
      if (!id) throw new Error("Id not Found");
      const stitching = await StitchingModel.findById(id).session(session);
      if (!stitching) throw new Error("Stitching not Found");

      //UPDATING PROJECT STATUS
      if (project_status === "Completed") {
        stitching.project_status = project_status;
        let salePrice = 0;
        if (suits_category) {
          for (const item of suits_category) {
            salePrice = item.sale_price;
          }

          const bpair_Quantity = stitching.Quantity - stitching.r_quantity;
          //ADD BPAIR
          if (bpair_Quantity > 0) {
            const b_pairData = {
              b_PairCategory: "Stitching",
              quantity: bpair_Quantity,
              rate: (stitching.Quantity - stitching.r_quantity) * salePrice,
              partyName: stitching.partyName,
              serial_No: stitching.serial_No,
              design_no: stitching.design_no,
            };
            const res = await addBPair(b_pairData, session);
            if (res.error) {
              throw new Error(res.error);
            }
          }
        }
      }

      //UPDATING RECIEVED QUANTITY
      const updateFunction = (data, updateStitchingRQuantity = true) => {
        for (const category in data) {
          const items = data[category];
          items &&
            items.forEach((item) => {
              const { return_quantity, id, sale_price, cost_price } = item;
              let toUpdate = stitching[category].find((obj) => obj._id == id);
              let new_r_quantity = stitching.r_quantity - toUpdate.recieved;
              if (toUpdate) {
                toUpdate.recieved = return_quantity;
                toUpdate.sale_price = sale_price;
                toUpdate.cost_price = cost_price;
              }
              if (updateStitchingRQuantity) {
                stitching.r_quantity = new_r_quantity + toUpdate.recieved;
                stitching.updated = true;
              }
            });
        }
      };

      if (suits_category && dupatta_category) {
        updateFunction({ suits_category });
        updateFunction({ dupatta_category }, false);
      } else if (suits_category) {
        updateFunction({ suits_category });
      } else if (dupatta_category) {
        updateFunction({ dupatta_category });
      }

      if (stitching.r_quantity > stitching.Quantity) {
        throw new Error("Invalid Update Quantity");
      }

      await stitching.save({ session });
      return res
        .status(200)
        .json({ success: true, message: "Updated Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const deleteStitching = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Stitching Id Required");
    const data = await StitchingModel.findByIdAndDelete(id);
    if (!data) throw new Error("Stitching Not Found");
    if (data.bill_generated)
      throw new Error("Bill Generated Cannot Delete This stitching");
    const embData = await EmbroideryModel.findById(data.embroidery_Id);
    if (!embData) throw new Error("Embroidery Data not Found For this Cutting");
    embData.next_steps.stitching = false;
    await embData.save();
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getStitchingDataBypartyName = async (req, res, next) => {
  try {
    const { partyName } = req.body;
    if (!partyName) throw new Error("No Party Name found");
    const StitchingQuery = {
      partyName: { $regex: partyName, $options: "i" },
    };
    const billQuery = {
      partyName: { $regex: partyName, $options: "i" },
      process_Category: "Stitching",
    };
    const stitchingData = await StitchingModel.find(StitchingQuery, [
      "partyName",
    ]);
    const accountData = await processBillsModel.find(billQuery, [
      "virtual_account",
      "partyName",
    ]);
    const data = {
      stitchingData: stitchingData,
      accountData: accountData,
    };
    setMongoose();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSuitsInStock = async (data, session) => {
  try {
    const { category, color, quantity, cost_price, sale_price, d_no } = data;
    if (!category || !color || !quantity || !cost_price || !sale_price || !d_no)
      throw new Error("Missing Fields For Adding Suits Stock");
    const existingSuitWithDNo = await SuitsModel.findOne({ d_no }).session(
      session
    );

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
    }).session(session);
    //DEDUCTING BAGS FROM STOCK
    const bagsStock = await BagsAndBoxModel.findOne({ name: "Bags" }).session(
      session
    );
    if (!bagsStock) throw new Error("Bags Stock Not Found");
    const updatedBagsQuantity = bagsStock.totalQuantity - quantity;
    if (updatedBagsQuantity < 0) throw new Error("Not Enough Bags In Stock");
    bagsStock.totalQuantity = updatedBagsQuantity;
    await bagsStock.save({ session });

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
      await checkExistingSuitStock.save({ session });
    } else {
      await SuitsModel.create(
        [
          {
            category,
            color,
            quantity,
            cost_price,
            sale_price,
            d_no,
            all_records: [recordData],
          },
        ],
        { session }
      );
    }
    return { success: true, message: "Successfully Added" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addInStockFromPackaging = async (req,res,next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, suits_category,dupatta_category, d_no,embroidery_Id } = req.body;
      if (!id) throw new Error("Id not Found");
      //CHECK PICTURES ORDER
      const checkPicturesOrder = await PicruresModel.findOne({embroidery_Id:embroidery_Id});
      if(checkPicturesOrder && checkPicturesOrder.status === 'Pending'){
        throw new Error("Please Complete the Pictures Order First");
      }
      if (suits_category && suits_category.length > 0) {
        console.log('adding suit');
        for (const item of suits_category) {
          const data = {
            ...item,
            d_no: d_no,
            quantity: item.return_quantity,
          };
          const res = await addSuitsInStock(data, session);
          if (res.error) {
            throw new Error(res.error);
          }
        }
      };
      if (dupatta_category && dupatta_category.length > 0) {
        console.log('adding duppata');
        for (const item of dupatta_category) {
          const data = {
            ...item,
            d_no: d_no,
            quantity: item.return_quantity,
          };
          const res = await addSuitsInStock(data, session);
          if (res.error) {
            throw new Error(res.error);
          }
        }
      };
      
      //UPDATING NEXT STEP IN EMBROIDERY
       const EmbroideryData = await EmbroideryModel.findById(embroidery_Id).session(session);
       EmbroideryData.next_steps.packing = true;
       await EmbroideryData.save({ session });
    });
    return res
    .status(200)
    .json({ success: true, message: "Stock Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
