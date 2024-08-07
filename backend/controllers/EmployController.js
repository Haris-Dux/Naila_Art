import { EmployeModel } from "../models/EmployModel.js";
import { setMongoose } from "../utils/Mongoose.js";

export const addEmploye = async (req, res, next) => {
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
    });
    return res.status(200).json({ success: true, message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const creditDebitBalance = async (req, res, next) => {
  try {
    const { id, credit, debit, date , particular } = req.body;
    if (!id) throw new Error("Employ Id Fequired");
    const employe = await EmployeModel.findById(id);
    if (!employe) throw new Error("Employe Not Found");
    let newBalance =
      employe.financeData.length > 0
        ? employe.financeData[employe.financeData.length - 1].balance
        : 0;

    if (credit >= 0) {
      newBalance += credit;
      employe.financeData.push({
        credit: credit,
        debit: 0,
        balance: newBalance,
        particular: particular || "Credit Transaction",
        date: date,
      });
    }

    if (debit >= 0) {
      newBalance -= debit;
      employe.financeData.push({
        date: date || new Date(),
        particular: particular || "Debit Transaction",
        balance: newBalance,
        debit: debit,
        credit: 0,
      });
    }
    await employe.save();
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const creditSalaryForSingleEmploye = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Employ Id Not Found");
    const employe = await EmployeModel.findById(id);
    if (!employe) throw new Error("Employe Not Found");

    let newBalance =
      employe.financeData.length > 0
        ? employe.financeData[employe.financeData.length - 1].balance
        : 0;

    newBalance += employe.salary;
    employe.financeData.push({
      credit: employe.salary,
      debit:  employe.financeData[employe.financeData.length - 1].balance < 0 ? employe.salary - newBalance : 0 ,
      balance: newBalance,
      particular: "Salary Credit Transaction",
      date: Date.now(),
    });

    await employe.save();
    return res
      .status(200)
      .json({ success: true, message: "Successfully Updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateEmploye = async (req, res, next) => {
  try {
    const {
      id,
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
      pastEmploye,
    } = req.body;
    if (!id) throw new Error("Employ Id Not Found");
    let updateQuery = {};
    if (name) {
      updateQuery.name = name;
    };
    if (father_Name) {
      updateQuery.father_Name = father_Name;
    };
    if (CNIC) {
      updateQuery.CNIC = CNIC;
    };
    if (phone_number) {
      updateQuery.phone_number = phone_number;
    };
    if (address) {
      updateQuery.address = address;
    };
    if (father_phone_number) {
      updateQuery.father_phone_number = father_phone_number;
    };
    if (last_work_place) {
      updateQuery.last_work_place = last_work_place;
    };
    if (designation) {
      updateQuery.designation = designation;
    };
    if (salary) {
      updateQuery.salary = salary;
    };
    if (joininig_date) {
      updateQuery.joininig_date = joininig_date;
    };
    if (pastEmploye !== undefined) {
      updateQuery.pastEmploye = pastEmploye;
    };
    const updatedEmployee = await EmployeModel.findByIdAndUpdate(id,updateQuery);
    if (!updatedEmployee) throw new Error("Employee not found");
    res.status(200).json({success:true , message: "Employe Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEmployeDataById = async (req,res,next) => {
  console.log("endpointhit");
  try {
    const {id} = req.body;
    console.log(id);
    if(!id) throw new Error("Employe Not Found");
    const employe = await EmployeModel.findById(id);
    if(!employe) throw new Error("Employe Not Found");
    setMongoose();
    return res.status(200).json(employe);
  } catch (error) {
    return res.status(500).json({error:error.message})
  }
};

export const getAllActiveEmploye = async (req,res,next) => {
   try {
    const page = parseInt(req.query.page) || 1;
    const limit = 1;
    let search = req.query.search || "";

    let query = {
      name: { $regex: search, $options: "i" },
      pastEmploye:false
    };

    const employData = await EmployeModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EmployeModel.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      totalEmploys:total,
      employData
    };
    setMongoose();
   return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({error:error.message})
  }
};

export const getAllPastEmploye = async (req,res,next) => {
  try {
   const page = parseInt(req.query.page) || 1;
   const limit =1;
   let search = req.query.search || "";

   let query = {
     name: { $regex: search, $options: "i" },
     pastEmploye:true
   };

   const employData = await EmployeModel.find(query)
     .skip((page - 1) * limit)
     .limit(limit)
     .sort({ createdAt: -1 });

   const total = await EmployeModel.countDocuments(query);

   const response = {
     totalPages: Math.ceil(total / limit),
     page,
     totalEmploys:total,
     employData
   };
   setMongoose();
  return res.status(200).json(response);
 } catch (error) {
   return res.status(500).json({error:error.message})
 }
};



