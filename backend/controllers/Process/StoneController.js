import { StoneModel } from "../../models/Process/StoneModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { addBPair } from "./B_PairController.js";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import { CuttingModel } from "../../models/Process/CuttingModel.js";

export const addStone = async (req, res, next) => {
  try {
    const {
      embroidery_Id,
      partyName,
      serial_No,
      design_no,
      date,
      rate,
      category_quantity,
      partyType,
    } = req.body;
    const requiredFields = [
      "embroidery_Id",
      "partyType",
      "partyName",
      "rate",
      "design_no",
      "serial_No",
      "category_quantity",
      "date",
    ];

    const missingFields = [];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
      for (let item of category_quantity) {
        if (!item.category || !item.color || !item.quantity) {
          throw new Error(
            "Each category item must have category, color, and quantity"
          );
        }
      }
      if (missingFields.length > 0) {
        throw new Error(`Missing Fields ${field}`);
      }
    });
    //CHECK PARTY NAME ERROR 
    if (partyType === "newParty") {
      const checkExistingStone = await StoneModel.findOne({
        partyName: { $regex: partyName, $options: "i" },
      });
      if (checkExistingStone) {
        throw new Error("Party Name Already In Use");
      }
    };
    //UPDATE AVAILABLE QUANTITY 
    let totalQuantityToAdd = 0;
    for (let item of category_quantity) {
      if (item.category || item.color || item.quantity) {
        totalQuantityToAdd += item.quantity;
      }
    };
    const cuttingData = await CuttingModel.findOne({embroidery_Id:embroidery_Id});
    const availableQuantity = cuttingData.Available_Quantity - totalQuantityToAdd;
    if(availableQuantity < 0){
      throw new Error("Not Enough Quantity For Stone");
    };
    cuttingData.Available_Quantity = availableQuantity;
    await cuttingData.save();

    await StoneModel.create({
      embroidery_Id,
      partyName,
      rate,
      serial_No,
      category_quantity,
      date,
      design_no,
    });
    //UPDATE MAIN EMBROIDERY NextStep
    const mainEmbroidery = await EmbroideryModel.findById(embroidery_Id);
    mainEmbroidery.next_steps.stones = true;
    await mainEmbroidery.save();
    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllStone = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = 20;
    let query = {
      partyName: { $regex: search, $options: "i" },
    };
    const data = await StoneModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await StoneModel.countDocuments(query);
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

export const getStoneById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Required");
    const data = await StoneModel.findById(id);
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getStoneByEmbroideryId = async (req, res, next) => {
  try {
    const { embroidery_Id } = req.body;
    if (!embroidery_Id) throw new Error("Embroidery Id Required");
    const data = await StoneModel.findOne({ embroidery_Id });
    if (!data) throw new Error("No Stone Data For This Embroidery");
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateStone = async (req, res, next) => {
  try {
    const { id, category_quantity, project_status, T_Quantity, totalQuantity } = req.body;
    if (!id) throw new Error("Id not Found");
    const stone = await StoneModel.findById(id);
    if (!stone) throw new Error("Stone not Found");
    if (project_status) {
      stone.project_status = project_status;
    };
    if (category_quantity && category_quantity.length > 0) {
      category_quantity.forEach((item) => {
        const { first, second, third, id } = item;
        const date = new Date().toLocaleString("en-PK");
        let toUpdate = stone.category_quantity.find((obj) => obj._id == id);
        let new_r_quantity = stone.r_quantity - toUpdate.recieved_Data.r_total;
        if (toUpdate) {

          if (first !== undefined && first !== null) {
            let total =
              toUpdate.recieved_Data.r_total - toUpdate.recieved_Data.first.quantity;
            toUpdate.recieved_Data.first.quantity = first;
            toUpdate.recieved_Data.first.date = date;
            toUpdate.recieved_Data.r_total = first + total;
          };

          if (second !== undefined && first !== null) {
            let total =
              toUpdate.recieved_Data.r_total - toUpdate.recieved_Data.second.quantity;
            toUpdate.recieved_Data.second.quantity = second;
            toUpdate.recieved_Data.second.date = date;
            toUpdate.recieved_Data.r_total = second + total;
          };

          if (third !== undefined && first !== null) {
            let total =
              toUpdate.recieved_Data.r_total - toUpdate.recieved_Data.third.quantity;
            toUpdate.recieved_Data.third.quantity = third;
            toUpdate.recieved_Data.third.date = date;
            toUpdate.recieved_Data.r_total = third + total;
          };

        }
        stone.r_quantity = new_r_quantity + toUpdate.recieved_Data.r_total;
        if (stone.r_quantity > totalQuantity) {
          throw new Error("Invalid Update Quantity Value");
        };
        toUpdate.recieved_Data.r_date = date;
        stone.updated = true;
      });
    };

    //B PAIR 
    const quantity = T_Quantity - stone.r_quantity;
    if (stone.project_status === "Completed" && quantity > 0) {
      const rate = quantity * stone.rate;
      const data = {
        design_no: stone.design_no,
        serial_No: stone.serial_No,
        partyName: stone.partyName,
        quantity,
        rate,
        b_PairCategory: "Stone",
      };
      const response = await addBPair(data);
      if (response.error) throw new Error(response.error);
    }
    await stone.save();
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getColorsForCurrentEmbroidery = async (req, res, next) => {
  try {
    const { serial_No } = req.body;
    if (!serial_No) throw new Error("Serial No required");
    const embroidery = await EmbroideryModel.findOne({ serial_No });
    if (embroidery.length == 0)
      throw new Error("No Data found On This serial Number");
    const allItems = [
      ...embroidery.shirt,
      ...embroidery.duppata,
      ...embroidery.trouser,
    ];

    const colors = [...new Set(allItems.map((item) => item.color))];
    return res.status(200).json({ success: true, colors: colors });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteStone = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Stone Id Required");
    const data = await StoneModel.findByIdAndDelete(id);
    if (!data) throw new Error("Stone Not Found");
    if (data.bill_generated)
      throw new Error("Bill Generated Cannot Delete This Stone");
    const checkAnotherStoneExists = await StoneModel.findOne({
      embroidery_Id: data.embroidery_Id,
    });
    if (!checkAnotherStoneExists) {
      const embData = await EmbroideryModel.findById(data.embroidery_Id);
      if (!embData) throw new Error("Embroidery Data not Found For this Stone");
      embData.next_steps.stones = false;
      await embData.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getStoneDataBypartyName = async (req, res, next) => {
  try {
    const { partyName } = req.body;
    if (!partyName) throw new Error("No Party Name found");
    const StoneQuery = {
      partyName: { $regex: partyName, $options: "i" },
    };
    const billQuery = {
      partyName: { $regex: partyName, $options: "i" },
      process_Category: "Stone",
    };
    const stoneData = await StoneModel.find(StoneQuery, ["partyName"]);
    const accountData = await processBillsModel.find(billQuery, [
      "virtual_account",
      "partyName",
    ]);
    const data = {
      stoneData: stoneData,
      accountData: accountData,
    };
    setMongoose();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
