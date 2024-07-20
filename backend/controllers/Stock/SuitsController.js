import { SuitsModel } from "../../models/Stock/Suits.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";

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
      d_no,
    });
    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSuits = async (req, res, next) => {
  try {
  
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = req.query.search || "";

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

   

    const data = await SuitsModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SuitsModel.countDocuments(query);

  
    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      Suits: total,
      data,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllCategoriesForSuits = async (req, res, next) => {
  try {
    const data = await SuitsModel.find({})
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
