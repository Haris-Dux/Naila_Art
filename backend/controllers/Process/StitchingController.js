import { StitchingModel } from "../../models/Process/StitchingModel.js";
import { LaceModel } from "../../models/Stock/Lace.Model.js";
import { SuitsModel } from "../../models/Stock/Suits.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";
import mongoose from "mongoose";
import { addBPair } from "./B_PairController.js";
import { BagsAndBoxModel } from "../../models/Stock/BagsAndBoxModel.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import { PicruresModel } from "../../models/Process/PicturesModel.js";
import { getTodayDate } from "../../utils/Common.js";

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
          throw new Error("Party name already in use");
        }
      }

      const lace = await LaceModel.findOne({ category: lace_category }).session(
        session
      );
      if (!lace) throw new Error("Please select valid lace category");
      if (parseInt(lace_quantity) > lace.totalQuantity)
        throw new Error("Not enough lace in stock");
      const newLaceTotalQuantity =
        parseInt(lace.totalQuantity) - parseInt(lace_quantity);
      await LaceModel.updateOne(
        { category: lace_category },
        { totalQuantity: newLaceTotalQuantity }
      ).session(session);

      //GET MAIN EMBROIDERY DATA
      const mainEmbroidery = await EmbroideryModel.findById(
        embroidery_Id
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
            Manual_No:mainEmbroidery.Manual_No
          },
        ],
        { session }
      );

      //UPDATE MAIN EMBROIDERY NextStep
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
    const Manual_No = req.query.Manual_No || "";
    const project_status = req.query.project_status || "";
    const design_no = req.query.design_no || "";
    const partyName = req.query.partyName || "";
    const limit = 40;
    let query = {};

    if (Manual_No) query.Manual_No = Manual_No;
    if (project_status) query.project_status = project_status;
    if (design_no) query.design_no = design_no;
    if (partyName) {
      query.partyName = { $regex: partyName, $options: "i" };
    }
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
    const data = await StitchingModel.findById(id);
    if (!data) throw new Error("Stitching Not Found");
    const embData = await EmbroideryModel.findById(data.embroidery_Id);
    if (!embData) throw new Error("No embroidery record found for this cutting.");
    embData.next_steps.stitching = false;
    if (data.bill_generated) {
      throw new Error("Deletion not permitted. This stitching step bill has already been generated.");
    }
    if (data.packed) {
      throw new Error("Deletion not permitted. This stitching step has already been packed.");
    }
    if(data.lace_quantity >= 0) {
      const lace = await LaceModel.findOne({category:data.lace_category});
      lace.totalQuantity += data.lace_quantity;
      await lace.save();
    };
    await StitchingModel.findByIdAndDelete(id);
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
    let stitchingData = await StitchingModel.find(StitchingQuery, [
      "partyName",
    ]);
    stitchingData = Array.from(
      new Map(stitchingData.map((item) => [item.partyName, item])).values()
    );
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
    const { category, color, quantity, cost_price, sale_price, d_no,useBags, Manual_No, serial_No, includes_pictures, embroidery_Id } = data;
    if (!category || !color || !quantity || !cost_price || !sale_price || !d_no || !Manual_No || !serial_No || !embroidery_Id || includes_pictures === undefined || useBags === undefined)
      throw new Error("Missing fields for adding suits in stock");
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

    if(useBags){
      const bagsStock = await BagsAndBoxModel.findOne({ name: "Bags" }).session(
        session
      );
      if (!bagsStock) throw new Error("Bags Stock Not Found");
      const updatedBagsQuantity = bagsStock.totalQuantity - quantity;
      if (updatedBagsQuantity < 0) throw new Error("Not Enough Bags In Stock");
      bagsStock.totalQuantity = updatedBagsQuantity;
      await bagsStock.save({ session });
    };
  
    const today = getTodayDate();
    let recordData = { date: today, quantity, cost_price, sale_price, Manual_No, embroidery_Id, serial_No, bags_used:useBags, includes_pictures, is_stock_source_packing:true };
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
      const { suits_category,dupatta_category, d_no,embroidery_Id,useBags,packing_Id, Manual_No, serial_No } = req.body;
      //CHECK PICTURES ORDER
      const checkPicturesOrder = await PicruresModel.findOne({embroidery_Id:embroidery_Id});
      if(checkPicturesOrder && checkPicturesOrder.status === 'Pending'){
        throw new Error("Please complete the pictures order to add suits stock");
      }
      if (suits_category && suits_category.length > 0) {
        for (const item of suits_category) {
          const data = {
            ...item,
            useBags,
            d_no: d_no,
            quantity: item.return_quantity,
            Manual_No,
            serial_No,
            includes_pictures:!!checkPicturesOrder,
            embroidery_Id
          };
          const res = await addSuitsInStock(data, session);
          if (res.error) {
            throw new Error(res.error);
          }
        }
      };
      if (dupatta_category && dupatta_category.length > 0) {
        for (const item of dupatta_category) {
          const data = {
            ...item,
            useBags,
            d_no: d_no,
            quantity: item.return_quantity,
            Manual_No,
            serial_No,
            includes_pictures:checkPicturesOrder,
            embroidery_Id
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

       //UPDATING PACKING STATUS FOR STITCHING
       if(packing_Id){
        const stitching = await StitchingModel.findById(packing_Id).session(session);
        if(stitching.packed){
          throw new Error("This Stitching Is Already Packed");
        };
        stitching.packed = true;
        await stitching.save({session});
       };
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
