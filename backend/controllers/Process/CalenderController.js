import { CalenderModel } from "../../models/Process/CalenderModel.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { addBPair } from "./B_PairController.js";

export const addCalender = async (req, res, next) => {
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
      const checkExistingCalender = await CalenderModel.findOne({
        partyName: { $regex: partyName, $options: "i" },
      })
      if (checkExistingCalender) {
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
     await CalenderModel.create({
      embroidery_Id,
      partyName,
      rate,
      serial_No,
      T_Quantity,
      date,
      design_no,
    });

    //UPDATE MAIN EMBROIDERY NextStep
    const mainEmbroidery = await EmbroideryModel.findById(embroidery_Id)
    mainEmbroidery.next_steps.calender = true;
    await mainEmbroidery.save();
    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCalender = async (req, res, next) => {
  try {
    let { id, r_quantity, project_status, r_unit } = req.body;
    if (!id) throw new Error("Id not Found");
    const calender = await CalenderModel.findById(id);
    if (!calender) throw new Error("Calender not Found");
    let updateQuery = {};
    if (r_quantity) {
      if (r_unit === "y") {
        r_quantity = (r_quantity * 1.09361).toFixed(2);
      }
      updateQuery = { ...updateQuery, r_quantity, updated: true, r_unit };
    }
    if (project_status) {
      if (project_status === "Completed" && calender.updated === true) {
        updateQuery = { ...updateQuery, project_status };
      } else throw new Error("Project status Can Not be Updated");
    }
    const result = await CalenderModel.findByIdAndUpdate(id, updateQuery, {
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
        b_PairCategory: "Calender",
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

export const getAllCalender = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = 20;
    let query = {
      partyName: { $regex: search, $options: "i" },
    };
    const data = await CalenderModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await CalenderModel.countDocuments(query);
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

export const getCalenderById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Required");
    const data = await CalenderModel.findById(id);
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCalenderByEmbroideryId = async (req, res, next) => {
  try {
    const { embroidery_Id } = req.body;
    if (!embroidery_Id) throw new Error("Embroidery Id Required");
    const data = await CalenderModel.findOne({ embroidery_Id });
    if (!data) throw new Error("No Calender Data For This Embroidery");
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCalender = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Calender Id Required");
    const data = await CalenderModel.findByIdAndDelete(id);
    if (!data) throw new Error("Calender Not Found");
    if(data.bill_generated) throw new Error("Bill Generated Cannot Delete This calender");
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCalenderDataBypartyName = async (req, res, next) => {
  try {
    const { partyName } = req.body;
    if (!partyName) throw new Error("No Party Name found");
    const CalenderQuery = {
      partyName: { $regex: partyName, $options: "i" },
    };
    const billQuery = {
      partyName: { $regex: partyName, $options: "i" },
      process_Category: "Calender",
    };
    const calenderData = await CalenderModel.find(CalenderQuery, ["partyName"]);
    const accountData = await processBillsModel.find(billQuery, [
      "virtual_account",
      "partyName",
    ]);
    const data = {
      calenderData: calenderData,
      accountData: accountData,
    };
    setMongoose();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

