import { EmployeModel } from "../models/EmployModel.js";

export const addEmploye = async () => {
  try {
    const {
      name,
      father_Name,
      CNIC,
      phone_number,
      address,
      father_phone_number,
      last_work_place,
      designation,
      salary,
      joininig_date,
    } = req.body;
    const requiredFields = [
      "name",
      "father_Name",
      "CNIC",
      "phone_number",
      "address",
      "father_phone_number",
      "last_work_place",
      "designation",
      "salary",
      "joininig_date",
    ];
    let missingFields = [];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0)
      throw new Error(`Missing fields ${missingFields}`);
    await EmployeModel.create({
        name,
        father_Name,
        CNIC,
        phone_number,
        address,
        father_phone_number,
        last_work_place,
        designation,
        salary,
        joininig_date,
        financeData
    });
    return res.status(200).json({ success:true, message:"Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
