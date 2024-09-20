import { BagsAndBoxModel } from "../../models/Stock/BagsAndBoxModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addBagsAndBoxInStock = async ({name, bill_no, r_Date, quantity,session}) => {
  try {
    if (!name || !bill_no || !quantity || !r_Date)
      throw new Error("All Fields Required");
    // Ensure name is either 'Bags' or 'Box'
  if (name !== "Bags" && name !== "Box") {
    throw new Error("Name must be either 'Bags' or 'Box'");
  }
    const checkExistingStock = await BagsAndBoxModel.findOne({
      name: name,
    }).session(session);
    let recordData = { bill_no, name, quantity, date: r_Date };
    if (checkExistingStock) {
      const updatedTotalQuantity = checkExistingStock.totalQuantity + parseInt(quantity);
      checkExistingStock.recently = parseInt(quantity),
        checkExistingStock.r_Date = r_Date,
        checkExistingStock.bill_no = bill_no,
        checkExistingStock.totalQuantity = updatedTotalQuantity;
      checkExistingStock.all_Records.push(recordData);
      await checkExistingStock.save({session});
    } else {
      await BagsAndBoxModel.create([{
        name,
        bill_no,
        recently: parseInt(quantity),
        totalQuantity: quantity,
        r_Date,
        all_Records: [recordData],
      }],{session});
    }

    return { message: "Successfully Added" };
  } catch (error) {
    return { error: error.message };
  }
};

export const getAllBagsAndBox = async (req, res, next) => {
  try {
   

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = req.query.search || "";
 
    let query = {
      name: { $regex: search, $options: "i" },
      
    };
  
 
    const data = await BagsAndBoxModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

 
    const total = await BagsAndBoxModel.countDocuments(query);
 
    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      totalBagBox:total,
      data
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
