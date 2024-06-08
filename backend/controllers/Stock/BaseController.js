import { BaseModel } from "../../models/Stock/Base.Model.js";

export const addBaseInStock = async (req, res, next) => {
  try {
    const { category, colors, r_Date, quantity } = req.body;
    if (!category || !colors || !quantity || !r_Date)
      throw new Error("All Fields Required");
    const checkExistingStock = await BaseModel.findOne({
      category: { $regex: new RegExp(category, 'i') },
      colors: { $regex: new RegExp(colors, 'i') },
    });
    if (checkExistingStock) {
      const updatedTYm = checkExistingStock.TYm + quantity;
      await BaseModel.updateOne(
        { _id: checkExistingStock._id },
        { recently: quantity, r_Date: r_Date, TYm: updatedTYm }
      );
    } else {
      await BaseModel.create({
        category,
        colors,
        recently: quantity,
        r_Date,
        TYm: quantity,
      });
    }

    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllBases = async (req, res, next) => {
  try {
    const data = await BaseModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};