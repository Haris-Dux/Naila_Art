import { StitchingModel } from "../../models/Process/StitchingModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addStitching = async (req, res, next) => {
  try {
    const {
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
    } = req.body;
    const requiredFields = [
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
      if (!req.body[field]) {
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
    await StitchingModel.create({
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
    });
    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
  try {
    const { id, suits_category, dupatta_category, project_status } = req.body;
    if (!id) throw new Error("Id not Found");
    const stitching = await StitchingModel.findById(id);
    if (!stitching) throw new Error("Stitching not Found");
    if (project_status) {
      stitching.project_status = project_status;
    }
    const updateFunction = (data) => {
      for (const category in data) {
        const items = data[category];
        items.forEach((item) => {
          const { return_quantity, id } = item;
          let toUpdate = stitching[category].find((obj) => obj._id == id);
          let new_r_quantity = stitching.r_quantity - toUpdate.recieved;
          if (toUpdate) {
            toUpdate.recieved = return_quantity;
          }
          stitching.r_quantity = new_r_quantity + toUpdate.recieved;
        });
      }
    };
    updateFunction({ suits_category });
    updateFunction({ dupatta_category });
    await stitching.save();
    return res
      .status(500)
      .json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
