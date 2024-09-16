
import { CuttingModel } from "../../models/Process/CuttingModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { addBPair } from "./B_PairController.js";

export const addCutting = async (req, res, next) => {
  try {
    const { embroidery_Id, partyName, rate, serial_No, T_Quantity, date, design_no } =
      req.body;
    const requiredFields = [
      "embroidery_Id",
      "partyName",
      "rate",
      "design_no",
      "serial_No",
      "T_Quantity",
      "date",
    ];
    const missingFields = [];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
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
      design_no
    });
    return res
    .status(200)
    .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCutting = async (req,res,next) => {
    try {
        const {id,r_quantity,project_status} = req.body;
        if(!id) throw new Error("Id not Found");
        const cutting = await CuttingModel.findById(id);
        if(!cutting) throw new Error("cutting not Found");
        let updateQuery = {};
        if(r_quantity){
            updateQuery = {...updateQuery,r_quantity};
        };
        if(project_status){
            updateQuery = {...updateQuery,project_status};
        };
        const result = await CuttingModel.findByIdAndUpdate(id,updateQuery,{ new: true });
        if (result.project_status === "Completed") {
          const quantity = result.T_Quantity - result.r_quantity;
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
        return res.status(200).json({ success:true,message:"Updated Successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllCutting = async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const search = req.query.search || "";
      const limit = 2;
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
    const data = await CuttingModel.findOne({embroidery_Id});
    if(!data)throw new Error("No Calender Data For This Embroidery")
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
