import { BagsAndBoxModel } from "../../models/Stock/BagsAndBoxModel.js";
import { BaseModel } from "../../models/Stock/Base.Model.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addBagsAndBoxInStock = async (req, res, next) => {
  try {
    const { name, bill_no, r_Date, quantity } = req.body;
    if (!name || !bill_no || !quantity || !r_Date)
      throw new Error("All Fields Required");
    const checkExistingStock = await BagsAndBoxModel.findOne({
      name: name,
    });
    let recordData = { bill_no, name, quantity, date: r_Date };
    if (checkExistingStock) {
      const updatedTotalQuantity = checkExistingStock.totalQuantity + quantity;
      checkExistingStock.recently = quantity,
        checkExistingStock.r_Date = r_Date,
        checkExistingStock.totalQuantity = updatedTotalQuantity;
      checkExistingStock.all_Records.push(recordData);
      await checkExistingStock.save();
    } else {
      await BagsAndBoxModel.create({
        name,
        bill_no,
        recently: quantity,
        totalQuantity: quantity,
        r_Date,
        all_Records: [recordData],
      });
    }

    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllBagsAndBox = async (req, res, next) => {
  try {
    const data = await BaseModel.find({}).sort({ createdAt: -1 });


    setMongoose()
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
