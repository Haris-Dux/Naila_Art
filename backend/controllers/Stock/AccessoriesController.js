import { AccssoriesModel } from "../../models/Stock/AccssoriesModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addAccesoriesInStock = async (req, res, next) => {
  try {
    const { serial_No, name, r_Date, quantity } = req.body;
    if (!serial_No || !quantity || !r_Date || !name)
      throw new Error("All Fields Required");
    const lowerCaseName = name.toLowerCase();
    const checkExistingStock = await AccssoriesModel.findOne({
      name: lowerCaseName,
    });
    let recordData = { serial_No, name: lowerCaseName, quantity, date: r_Date };
    if (checkExistingStock) {
      const updatedTotalQuantity = checkExistingStock.totalQuantity + quantity;
      (checkExistingStock.recently = quantity),
        (checkExistingStock.r_Date = r_Date),
        (checkExistingStock.totalQuantity = updatedTotalQuantity),
        (checkExistingStock.serial_No = serial_No),
        checkExistingStock.all_Records.push(recordData);
      await checkExistingStock.save();
    } else {
      await AccssoriesModel.create({
        serial_No,
        name: lowerCaseName,
        recently: quantity,
        r_Date,
        totalQuantity: quantity,
        all_Records: [recordData],
      });
    }

    return res.status(200).json({ message: "Successfully Added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllAccesoriesInStock = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = req.query.search || "";
 
    let query = {
      name: { $regex: search, $options: "i" },
      
    };
  
 
    const data = await AccssoriesModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

      console.log('data',data)
 
    const total = await AccssoriesModel.countDocuments(query);
 
    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      totatAccssories:total,
      data
    };
    setMongoose();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateAllAccesoriesInStock = async (req, res, next) => {
  try {
    const { id, quantity, date, note } = req.body;
    if (!id) throw new Error("Id required");
    const record = await AccssoriesModel.findById(id);
    if (!record) throw new Error("Record not found");
    if(record.totalQuantity <= 0 || quantity > record.totalQuantity ) throw new Error("Stock Amount Error")
    const updatedTotalQuantity = record.totalQuantity - quantity;
    await AccssoriesModel.updateOne(
      { _id: id },
      { totalQuantity: updatedTotalQuantity }
    );

    let Data = { note, quantityRemoved: quantity, date, name:record.name };
    record.accessoriesUsed_Records.push(Data);
    await record.save();
    return res.status(200).json({ message: "Update Successfull" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
