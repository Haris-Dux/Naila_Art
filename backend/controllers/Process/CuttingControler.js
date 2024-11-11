import { CuttingModel } from "../../models/Process/CuttingModel.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { addBPair } from "./B_PairController.js";

export const addCutting = async (req, res, next) => {
  try {
    const {
      embroidery_Id,
      partyName,
      partytype,
      rate,
      serial_No,
      T_Quantity,
      date,
      design_no,
    } = req.body;
    const requiredFields = [
      "embroidery_Id",
      "partytype",
      "partyName",
      "rate",
      "design_no",
      "serial_No",
      "T_Quantity",
      "date",
    ];

    if (partytype === "newParty") {
      const checkExistingCutting = await CuttingModel.findOne({
        partyName: { $regex: partyName, $options: "i" },
      }).session(session);
      if (checkExistingCutting) {
        throw new Error("Duplicate Party Name Error");
      }
    };

    const missingFields = [];
    requiredFields.forEach((field) => {
      if (req.body[field] === undefined || req.body[field] === null) {
        missingFields.push(field);
      }
      if (missingFields.length > 0) {
        throw new Error(`Missing Fields ${field}`);
      }
    });

     await CuttingModel.create({
      embroidery_Id,
      partyName,
      rate,
      serial_No,
      T_Quantity,
      date,
      design_no,
    });

    //UPDATE MAIN EMBROIDERY NextStep
    const mainEmbroidery = await EmbroideryModel.findById(embroidery_Id);
    mainEmbroidery.next_steps.cutting = true;
    await mainEmbroidery.save();
    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCutting = async (req, res, next) => {
  try {
    const { id, r_quantity, project_status } = req.body;
    if (!id) throw new Error("Id not Found");
    const cutting = await CuttingModel.findById(id);
    if (!cutting) throw new Error("cutting not Found");
    let updateQuery = {};
    if (r_quantity) {
      if(r_quantity > cutting.T_Quantity){
        throw new Error("Invalid Recieved quantity")
      }
      updateQuery = { ...updateQuery, r_quantity };
    }
    if (project_status) {
      updateQuery = { ...updateQuery, project_status };
    }
    const result = await CuttingModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });
    const quantity = result.T_Quantity - result.r_quantity;
    if (result.project_status === "Completed" && quantity > 0) {
      const rate = quantity * result.rate;
      const data = {
        design_no: result.design_no,
        serial_No: result.serial_No,
        partyName: result.partyName,
        quantity,
        rate,
        b_PairCategory: "Cutting",
      };
      const response = await addBPair(data);
      if (response.error) throw new Error(response.error);
    }
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllCutting = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = 20;
    let query = {
      partyName: { $regex: search, $options: "i" },
    };
    const data = await CuttingModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await CuttingModel.countDocuments(query);
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

export const getCuttingById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Required");
    const data = await CuttingModel.findById(id);
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCuttingByEmbroideryId = async (req, res, next) => {
  try {
    const { embroidery_Id } = req.body;
    if (!embroidery_Id) throw new Error("Embroidery Id Required");
    const data = await CuttingModel.findOne({ embroidery_Id });
    if (!data) throw new Error("No Calender Data For This Embroidery");
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCutting = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Cutting Id Required");
    const data = await CuttingModel.findByIdAndDelete(id);
    if (!data) throw new Error("Cutting Not Found");
    if(data.bill_generated) throw new Error("Bill Generated Cannot Delete This Cutting");
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCuttingDataBypartyName = async (req, res, next) => {
  try {
    const { partyName } = req.body;
    if (!partyName) throw new Error("No Party Name found");
    const cuttingQuery = {
      partyName: { $regex: partyName, $options: "i" },
    };
    const billQuery = {
      partyName: { $regex: partyName, $options: "i" },
      process_Category: "Cutting",
    };
    const cuttingData = await CuttingModel.find(cuttingQuery, ["partyName"]);
    const accountData = await processBillsModel.find(billQuery, [
      "virtual_account",
      "partyName",
    ]);
    const data = {
      cuttingData: cuttingData,
      accountData: accountData,
    };
    setMongoose();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
