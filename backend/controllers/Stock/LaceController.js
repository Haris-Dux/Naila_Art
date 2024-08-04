import { LaceModel } from "../../models/Stock/Lace.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addLaceInStock = async (req, res, next) => {
  try {
    const { bill_no, name, category, r_Date, quantity } = req.body;
    if (!category || !bill_no || !quantity || !r_Date || !name)
      throw new Error("All Fields Required");
    const checkExistingStock = await LaceModel.findOne({
      category: category,
    });
    let recordData = {bill_no,name,category,quantity,date:r_Date};
    if (checkExistingStock) {
      const updatedTotalQuantity = checkExistingStock.totalQuantity + quantity;
          checkExistingStock.recently = quantity,
          checkExistingStock.r_Date = r_Date,
          checkExistingStock.totalQuantity = updatedTotalQuantity,
          checkExistingStock.bill_no = bill_no,
          checkExistingStock.all_Records.push(recordData)
          await checkExistingStock.save();     
    } else {
      await LaceModel.create({
        bill_no,
        name,
        recently: quantity,
        r_Date,
        totalQuantity: quantity,
        category,
        all_Records:[recordData]
      });
    }

    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllLaceStock = async (req,res,next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 2;
        let search = req.query.search || "";
     
        let query = {
          name: { $regex: search, $options: "i" },
          
        };
      
     
        const data = await LaceModel.find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });
    
     
        const total = await LaceModel.countDocuments(query);
     
        const response = {
          totalPages: Math.ceil(total / limit),
          page,
          Lace:total,
          data
        };
        setMongoose();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};