import { BaseModel } from "../../models/Stock/Base.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";


export const addBaseInStock = async (req, res, next) => {
  try {
    const { category, colors, r_Date, quantity } = req.body;
    if (!category || !colors || !quantity || !r_Date)
      throw new Error("All Fields Required");
    const checkExistingStock = await BaseModel.findOne({
      category: { $regex: new RegExp(category, 'i') },
      colors: { $regex: new RegExp(colors, 'i') },
    });
    let recordData = { category, colors, Date: r_Date, quantity };
    if (checkExistingStock) {
      const updatedTYm = checkExistingStock.TYm + quantity;
      checkExistingStock.recently = quantity,
        checkExistingStock.r_Date = r_Date,
        checkExistingStock.TYm = updatedTYm,
        checkExistingStock.all_Records.push(recordData)
      await checkExistingStock.save();
    } else {
      await BaseModel.create({
        category,
        colors,
        recently: quantity,
        r_Date,
        TYm: quantity,
        all_Records: [recordData]
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

export const getAllCategoriesForbase = async (req, res, next) => {
  try {
    const data = await BaseModel.find({})
      .sort({ createdAt: -1 })
      .select("category");
    const categoryNames = Array.from(
      new Set(data.map((item) => item.category))
    );
    setMongoose();
    return res.status(200).json(categoryNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
