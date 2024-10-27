import mongoose from "mongoose";
import { PicruresModel } from "../../models/Process/PicturesModel.js";
import { verifyrequiredparams } from "../../middleware/Common.js";
import CustomError from "../../config/errors/CustomError.js";

// Create a new picture document
export const createPictureOrder = async (req, res) => {
  try {
    const {
      embroidery_Id,
      T_Quantity,
      design_no,
      date,
      partyName,
      rate,
    } = req.body;
    await verifyrequiredparams(req.body, [
      "embroidery_Id",
      "T_Quantity",
      "design_no",
      "date",
      "partyName",
      "rate",
    ]);
    const orderExists = await PicruresModel.findOne(embroidery_Id);
    if (orderExists) {
      throw new CustomError(403, "Picrure Order Already Exists ");
    }

    // Create the new picture
    const newPictureOrder = new PicruresModel({
      embroidery_Id,
      T_Quantity,
      design_no,
      date,
      partyName,
      rate,
    });

    const savedPictureOrder = await newPictureOrder.save();
    res.status(201).json({ success: true, data: savedPictureOrder });
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

// Get all pictures or filter by embroidery_Id
export const getPictures = async (req, res) => {
  try {
    const { embroidery_Id } = req.query;
    const query = embroidery_Id ? { embroidery_Id } : {};

    const pictures = await PicruresModel.find(query).populate("embroidery_Id");
    res.status(200).json({ success: true, data: pictures });
  } catch (error) {
    handleErrorResponse(res, error, "Error retrieving pictures");
  }
};

// Get a single picture by ID
export const getPictureById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid picture ID" });
    }

    const picture = await PicruresModel.findById(id).populate("embroidery_Id");
    if (!picture) {
      return res
        .status(404)
        .json({ success: false, message: "Picture not found" });
    }

    res.status(200).json({ success: true, data: picture });
  } catch (error) {
    handleErrorResponse(res, error, "Error retrieving picture by ID");
  }
};

// Update a picture by ID
export const updatePictureById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid picture ID" });
    }

    // Optionally validate embroidery_Id if it's being updated
    if (updateData.embroidery_Id) {
      const embroideryExists = await EmbroideryModel.findById(
        updateData.embroidery_Id
      );
      if (!embroideryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Embroidery ID not found" });
      }
    }

    const updatedPicture = await PicruresModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("embroidery_Id");

    if (!updatedPicture) {
      return res
        .status(404)
        .json({ success: false, message: "Picture not found" });
    }

    res.status(200).json({ success: true, data: updatedPicture });
  } catch (error) {
    handleErrorResponse(res, error, "Error updating picture by ID");
  }
};

// Delete a picture by ID
export const deletePictureById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid picture ID" });
    }

    const deletedPicture = await PicruresModel.findByIdAndDelete(id);
    if (!deletedPicture) {
      return res
        .status(404)
        .json({ success: false, message: "Picture not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Picture deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, error, "Error deleting picture by ID");
  }
};
