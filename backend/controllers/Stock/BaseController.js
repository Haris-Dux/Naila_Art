import { BaseModel } from "../../models/Stock/Base.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addBaseInStock = async (req, res, next) => {
  try {
    let { category, colors, r_Date, quantity } = req.body;
    if (!category || !colors || !quantity || !r_Date)
      throw new Error("All Fields Required");
    category =
      category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    colors = colors.charAt(0).toUpperCase() + colors.slice(1).toLowerCase();
    const checkExistingStock = await BaseModel.findOne({
      category: { $regex: new RegExp(category, "i") },
      colors: { $regex: new RegExp(colors, "i") },
    });
    let recordData = { category, colors, Date: r_Date, quantity };
    if (checkExistingStock) {
      const updatedTYm = checkExistingStock.TYm + quantity;
      (checkExistingStock.recently = quantity),
        (checkExistingStock.r_Date = r_Date),
        (checkExistingStock.TYm = updatedTYm),
        checkExistingStock.all_Records.push(recordData);
      await checkExistingStock.save();
    } else {
      await BaseModel.create({
        category,
        colors,
        recently: quantity,
        r_Date,
        TYm: quantity,
        all_Records: [recordData],
      });
    }

    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllBases = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = req.query.search || "";
    let category = req.query.category || "";

    let query = {};
    if (search) {
      query.colors = { $regex: search, $options: "i" };
    }
    if (category) {
      query = { ...query, category: category };
    }
    const data = await BaseModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const total = await BaseModel.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      Base: total,
      data,
    };

    return res.status(200).json(response);
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
      new Set(data?.map((item) => item.category))
    );
    setMongoose();
    return res.status(200).json(categoryNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllBasesForEmbroidery = async (req, res, next) => {
  try {
    const baseData = await BaseModel.find({});
    return res.status(200).json(baseData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteBaseStock = async (req, res, next) => {
  try {
    const { baseId, itemId } = req.body;

    if (!baseId || !itemId) {
      throw new Error("Required Missing Fields");
    }

    const base = await BaseModel.findById(baseId);
    if (!base) {
      throw new Error("Base Not Found");
    }

    const item = base.all_Records.find((record) => record._id.toString() === itemId);
    if (!item) {
      throw new Error("Item Not Found in Base");
    }

    const itemQuantity = parseInt(item.quantity, 10);

    if (base.TYm < itemQuantity) {
      throw new Error("Not Enough Quantity in Stock");
    }

    base.TYm -= itemQuantity;

    item.quantity = `Deleted/${item.quantity}`;

    await base.save();

    return res.status(200).json({success:true , message: "Successfully Deleted Base Stock" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

