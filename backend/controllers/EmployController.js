import mongoose from "mongoose";
import { EmployeModel } from "../models/EmployModel.js";
import { PaymentData } from "../utils/Common.js";
import { setMongoose } from "../utils/Mongoose.js";
import moment from "moment-timezone";
import { DailySaleModel } from "../models/DailySaleModel.js";
import {
  VA_HistoryModal,
  VirtalAccountModal,
} from "../models/DashboardData/VirtalAccountsModal.js";

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
    return res
      .status(200)
      .json({ success: true, message: "Employe Added Sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const creditDebitBalance = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, date, particular, branchId, payment_Method } = req.body;
      if (!id || !date || !particular)
        throw new Error("Missing Requires Fields");

      const credit = parseInt(req.body.credit, 10);
      const debit = parseInt(req.body.debit, 10);
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
      const employe = await EmployeModel.findById(id).session(session);
      if (!employe) throw new Error("Employe Not Found");
      const lastNonSalaryTransaction = employe.financeData
        .slice()
        .reverse()
        .find((transaction) => !transaction.salaryTransaction);

      let newBalance = lastNonSalaryTransaction
        ? lastNonSalaryTransaction.balance
        : 0;

      if (credit >= 0) {
        newBalance += credit;
        employe.financeData.push({
          credit: credit,
          debit: 0,
          balance: newBalance,
          particular: particular,
          date: date,
        });
        //DEDUCTION FROM DAILY SALE
        const dailySaleForToday = await DailySaleModel.findOne({
          branchId,
          date: today,
        }).session(session);
        if (!dailySaleForToday) {
          throw new Error("Daily sale record not found for This Date");
        }
        if (payment_Method === "cashSale") {
          dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash +=
            credit;
        }
        await dailySaleForToday.save({ session });

        //UPDATING VIRTUAL ACCOUNTS
        if (payment_Method !== "cashSale") {
          let virtualAccounts = await VirtalAccountModal.find({}).session(
            session
          );
          let updatedAccount = {
            ...virtualAccounts,
            [payment_Method]: (virtualAccounts[0][payment_Method] += credit),
          };
          const new_balance = updatedAccount[0][payment_Method];
          const historyData = {
            date: today,
            transactionType: "Deposit",
            payment_Method,
            new_balance,
            amount: credit,
            note: `Credit Transaction for ${employe.name}`,
          };
          virtualAccounts = updatedAccount;
          await virtualAccounts[0].save({ session });
          await VA_HistoryModal.create([historyData], { session });
        }
      }

      //DEBIT LOGIC
      if (debit >= 0) {
        newBalance -= debit;
        //HISTORY DATA
        employe.financeData.push({
          date: date,
          particular: particular,
          balance: newBalance,
          debit: debit,
          credit: 0,
        });

        //DEDUCTION FROM DAILY SALE
        const dailySaleForToday = await DailySaleModel.findOne({
          branchId,
          date: today,
        }).session(session);
        if (!dailySaleForToday) {
          throw new Error("Daily sale record not found for This Date");
        }
        if (payment_Method === "cashSale") {
          dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash -=
            debit;
        }
        if (dailySaleForToday.totalCash < 0) {
          throw new Error("Not Enough Total Cash");
        }
        await dailySaleForToday.save({ session });

        //UPDATING VIRTUAL ACCOUNTS
        if (payment_Method !== "cashSale") {
          let virtualAccounts = await VirtalAccountModal.find({}).session(
            session
          );
          let updatedAccount = {
            ...virtualAccounts,
            [payment_Method]: (virtualAccounts[0][payment_Method] -= debit),
          };
          const new_balance = updatedAccount[0][payment_Method];
          const historyData = {
            date: today,
            transactionType: "WithDraw",
            payment_Method,
            new_balance,
            amount: debit,
            note: `Debit Transaction for ${employe.name}`,
          };
          if (new_balance < 0)
            throw new Error("Not Enough Cash In Payment Method");
          virtualAccounts = updatedAccount;

          await virtualAccounts[0].save({ session });
          await VA_HistoryModal.create([historyData], { session });
        }
      }
      await employe.save({ session });
      return res
        .status(200)
        .json({ success: true, message: "Updated Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const creditSalaryForSingleEmploye = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, salary, payment_Method, over_time, branchId, leaves } =
        req.body;
      if (!id || !salary || !payment_Method || !branchId)
        throw new Error("Missing Fields");
      const employe = await EmployeModel.findById(id).session(session);
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
      if (!employe) throw new Error("Employe Not Found");

      const paymentMethodName = PaymentData.find(
        (method) => method.value === payment_Method
      )?.label;

      employe.financeData.push({
        credit: 0,
        debit: salary,
        balance: 0,
        particular: `Salary Credit/${paymentMethodName}/Overtime:${over_time}/Leaves:${leaves} `,
        date: today,
        over_time,
        leaves,
        payment_Method,
        branchId,
        salaryTransaction: true,
      });

      employe.overtime_Data.hours = 0;
      await employe.save({ session });

      //DEDUCT FROM PAYMENT METHID
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: today,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }
      if (payment_Method === "cashSale") {
        dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash -=
          salary;
      }
      if (dailySaleForToday.totalCash < 0) {
        throw new Error("Not Enough Total Cash");
      }

      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({}).session(
          session
        );
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] -= salary),
        };
        const new_balance = updatedAccount[0][payment_Method];
        const historyData = {
          date: today,
          transactionType: "WithDraw",
          payment_Method,
          new_balance,
          amount: salary,
          note: `Salary credit for ${employe.name}`,
        };
        if (new_balance < 0)
          throw new Error("Not Enough Cash In Payment Method");
        virtualAccounts = updatedAccount;

        await virtualAccounts[0].save({ session });
        await VA_HistoryModal.create([historyData], { session });
      }

      return res.status(200).json({ success: true, message: "Success" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
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
    }
    if (father_Name) {
      updateQuery.father_Name = father_Name;
    }
    if (CNIC) {
      updateQuery.CNIC = CNIC;
    }
    if (phone_number) {
      updateQuery.phone_number = phone_number;
    }
    if (address) {
      updateQuery.address = address;
    }
    if (father_phone_number) {
      updateQuery.father_phone_number = father_phone_number;
    }
    if (last_work_place) {
      updateQuery.last_work_place = last_work_place;
    }
    if (designation) {
      updateQuery.designation = designation;
    }
    if (salary) {
      updateQuery.salary = salary;
    }
    if (joininig_date) {
      updateQuery.joininig_date = joininig_date;
    }
    if (pastEmploye !== undefined) {
      updateQuery.pastEmploye = pastEmploye;
    }
    const updatedEmployee = await EmployeModel.findByIdAndUpdate(
      id,
      updateQuery
    );
    if (!updatedEmployee) throw new Error("Employee not found");
    return res
      .status(200)
      .json({ success: true, message: "Employe Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEmployeDataById = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) throw new Error("Employe Not Found");
    const employe = await EmployeModel.findById(id);
    if (!employe) throw new Error("Employe Not Found");
    setMongoose();
    return res.status(200).json(employe);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllActiveEmploye = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = req.query.search || "";

    let query = {
      name: { $regex: search, $options: "i" },
      pastEmploye: false,
    };

    const employData = await EmployeModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EmployeModel.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      totalEmploys: total,
      employData,
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllPastEmploye = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    let search = req.query.search || "";

    let query = {
      name: { $regex: search, $options: "i" },
      pastEmploye: true,
    };

    const employData = await EmployeModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EmployeModel.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      totalEmploys: total,
      employData,
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addLeave = async (req, res) => {
  try {
    const { employeeId, date } = req.body;
    if (!employeeId || !date)
      throw new Error("Employee ID and Date are required");
    // Check if leave already exists for the date
    const employeData = await EmployeModel.findById(employeeId);
    const existingLeave = employeData.leaves.some((leave) => leave === date);
    if (existingLeave) {
      employeData.leaves = employeData.leaves.filter((leave) => leave !== date);
    } else {
      employeData.leaves.push(date);
    }
    await employeData.save();

    return res
      .status(201)
      .json({ success: true, message: "Leave Update Successfull" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateOvertime = async (req, res, next) => {
  try {
    const { over_time, employeeId } = req.body;
    if (!over_time || !employeeId) throw new Error("Missing Data Error");
    const employeData = await EmployeModel.findById(employeeId);
    const currentMonth = moment.tz("Asia/Karachi").format("YYYY-MM");
    employeData.overtime_Data.hours += over_time;
    employeData.overtime_Data.month = currentMonth;
    await employeData.save();
    return res.status(200).json({ success: true, message: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const reverseSalary = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, transactionId, amount, payment_Method, over_time, branchId } =
        req.body;
      if (!id || !transactionId || !amount || !branchId || !payment_Method)
        throw new Error("Missing Fields");
      const employe = await EmployeModel.findById(id).session(session);
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
      if (!employe) throw new Error("Employe Not Found");

      employe.overtime_Data.hours += over_time;

      //ADD IN PAYMENT METHID
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: today,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      }
      if (payment_Method === "cashSale") {
        dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash +=
          amount;
      }

      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({}).session(
          session
        );
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] += amount),
        };
        const new_balance = updatedAccount[0][payment_Method];
        const historyData = {
          date: today,
          transactionType: "Deposit",
          payment_Method,
          new_balance,
          amount,
          note: `Salary Reversed for ${employe.name}`,
        };

        virtualAccounts = updatedAccount;

        await virtualAccounts[0].save({ session });
        await VA_HistoryModal.create([historyData], { session });
      }

      //MARKING TRANSACTION AS DELETED
      const transaction = employe.financeData.find(
        (item) => item._id.toString() === transactionId
      );
      if (!transaction || !transaction.salaryTransaction) {
        throw new Error("Can Not Delete Transaction");
      }
      transaction.reversed = true;
      await employe.save({ session });

      return res.status(200).json({ success: true, message: "Success" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
