import moment from "moment-timezone";
import { SuitsModel } from "../../models/Stock/Suits.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addSuitsInStock = async (req, res, next) => {
  try {
    const { category, color, quantity, cost_price, sale_price, d_no } =
      req.body;
    if (!category || !color || !quantity || !cost_price || !sale_price || !d_no)
      throw new Error("Missing Fields For Adding Suits Stock");

    const existingSuitWithDNo = await SuitsModel.findOne({ d_no });

    if (existingSuitWithDNo && existingSuitWithDNo.category.toLowerCase() !== category.toLowerCase()) {
      throw new Error(`The Design No ${d_no} is already assigned to the category '${existingSuitWithDNo.category}'`);
    }
    
    const checkExistingSuitStock = await SuitsModel.findOne({
      d_no,
      category: { $regex: new RegExp(`^${category}$`, "i") },
      color: {$regex : new RegExp(`^${color}$`,"i")}
    });
  
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
    let recordData = { date: today, quantity, cost_price, sale_price };
    if (
      checkExistingSuitStock &&
      checkExistingSuitStock.color.toLowerCase() === color.toLowerCase()
    ) {
      (checkExistingSuitStock.quantity += parseInt(quantity)),
        (checkExistingSuitStock.cost_price = cost_price),
        (checkExistingSuitStock.sale_price = sale_price);
      checkExistingSuitStock.all_records.push(recordData);
      await checkExistingSuitStock.save();
    } else {
      await SuitsModel.create({
        category,
        color,
        quantity,
        cost_price,
        sale_price,
        d_no,
        all_records: [recordData],
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSuits = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    let search = parseInt(req.query.search) || "";
    let category = req.query.category || "";

    let query = {};
    if (search) {
      query = { ...query, d_no: search };
    }

    if (category) {
      query = { ...query, category: category };
    }

    //CALCULATE TOTAL QUANTITY FOR DESIGN NO
    const totalQuantity = await SuitsModel.aggregate([
      {
        $group: {
          _id: "$d_no",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          d_no: "$_id",
          totalQuantity: 1,
        },
      },
    ]);

    const result = await SuitsModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ quantity: -1, createdAt: -1});

    const total = await SuitsModel.countDocuments(query);

    //MERGING TOTAL QUANTITY
    const data = result.map((suit) => {
      const palinSuit = suit.toObject();
      const requiredObj = totalQuantity.find((item) => item.d_no === palinSuit.d_no);
      return { ...palinSuit, TotalQuantity: requiredObj.totalQuantity };
    
    });

    setMongoose();

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
      new Set(data?.map((item) => item.category))
    );
    setMongoose();
    return res.status(200).json(categoryNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
