import { SuitsModel } from "../../models/Stock/Suits.Model.js";

export const addSuitsInStock = async (req, res, next) => {
  try {
    const { category, color, quantity, cost_price, sale_price, d_no } =
      req.body;
    if (!category || !color || !quantity || !cost_price || !sale_price || !d_no)
      throw new Error("All Fields Required");
    const checkExistingD_no = await SuitsModel.findOne({ d_no });
    if (checkExistingD_no) throw new Error("Already Exists D-No.");
    await SuitsModel.create({
      category,
      color,
      quantity,
      cost_price,
      sale_price,
      d_no
    });
    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSuits = async (req, res, next) => {
  try {
    const data = await SuitsModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};