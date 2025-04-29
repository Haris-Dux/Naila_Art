import mongoose from "mongoose";
import { EmployeModel } from "../models/EmployModel.js";
import { setMongoose } from "../utils/Mongoose.js";
import moment from "moment-timezone";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { virtualAccountsService } from "../services/VirtualAccountsService.js";
import { cashBookService } from "../services/CashbookService.js";

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
      //CREDIT LOGIC
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
          const data = {
            session,
            payment_Method,
            amount: credit,
            transactionType: "Deposit",
            date: today,
            note: `Credit Transaction for ${employe.name}`,
          };
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
         //PUSH DATA FOR CASH BOOK
         const dataForCashBook = {
          pastTransaction: false,
          branchId,
          amount: credit,
          tranSactionType: "Deposit",
          transactionFrom: "Employe",
          partyName: employe.name,
          payment_Method,
          session,
        };
        await cashBookService.createCashBookEntry(dataForCashBook);
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
          const data = {
            session,
            payment_Method,
            amount: debit,
            transactionType: "WithDraw",
            date: today,
            note: `Debit Transaction for ${employe.name}`,
          };
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
         //PUSH DATA FOR CASH BOOK
         const dataForCashBook = {
          pastTransaction: false,
          branchId,
          amount: debit,
          tranSactionType: "WithDraw",
          transactionFrom: "Employe",
          partyName: employe.name,
          payment_Method,
          session,
        };
        await cashBookService.createCashBookEntry(dataForCashBook);
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
      const { id, salary, payment_Method, over_time, branchId, leaves, month } =
        req.body;
      if (!id || !salary || !payment_Method || !branchId || !month)
        throw new Error("Missing Fields");
      if (month < 1 || month > 12) {
        throw new Error("Invalid month");
      }
      const employe = await EmployeModel.findById(id).session(session);
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
      if (!employe) throw new Error("Employe Not Found");

      //VERIFY IF SALARY IS CREDITED FOR CURRENT MOTN OR NOT
      const isSalaryPaid = employe.salaryStatus[Number(month)];
      if (isSalaryPaid) {
        throw new Error("Salary Already Paid For This Month");
      } else {
        employe.salaryStatus[month] = true;
      }

      employe.financeData.push({
        credit: 0,
        debit: salary,
        balance: 0,
        particular: `Salary Credit/${payment_Method}/Overtime:${over_time}/Leaves:${leaves}/Month:${month}`,
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
        const data = {
          session,
          payment_Method,
          amount: salary,
          transactionType: "WithDraw",
          date: today,
          note: `Salary credit for ${employe.name}`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);

        //PUSH DATA FOR CASH BOOK
        const dataForCashBook = {
          pastTransaction: false,
          branchId,
          amount: salary,
          tranSactionType: "WithDraw",
          transactionFrom: "Employe",
          partyName: employe.name,
          payment_Method,
          session,
        };
        await cashBookService.createCashBookEntry(dataForCashBook);
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
    const limit = 30;
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
    const limit = 30;
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
    const { over_time, employeeId, note } = req.body;
    if (!over_time || !employeeId) throw new Error("Missing Data Error");
    const employeData = await EmployeModel.findById(employeeId);
    const currentMonth = moment.tz("Asia/Karachi").month() + 1;
    const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");

    employeData.overtime_Data[currentMonth] += over_time;

    //ADD OVERTIME HISTORY
    const O_H_D = {
      date: today,
      time: over_time,
      note: note,
    };
    employeData.over_time_history.push(O_H_D);
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
      const { id, transactionId, amount, payment_Method, branchId } = req.body;
      if (!id || !transactionId || !amount || !branchId || !payment_Method)
        throw new Error("Missing Fields");
      const employe = await EmployeModel.findById(id).session(session);
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");
      if (!employe) throw new Error("Employe Not Found");

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
        const data = {
          session,
          payment_Method,
          amount,
          transactionType: "Deposit",
          date: today,
          note: `Salary Reversed for ${employe.name}`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);

        //PUSH DATA FOR CASH BOOK
        const dataForCashBook = {
          pastTransaction: false,
          branchId,
          amount,
          tranSactionType: "Deposit",
          transactionFrom: "Employe",
          partyName: employe.name,
          payment_Method,
          session,
        };
        await cashBookService.createCashBookEntry(dataForCashBook);
      }

      //MARKING TRANSACTION AS DELETED
      const transaction = employe.financeData.find(
        (item) => item._id.toString() === transactionId
      );
      if (!transaction || !transaction.salaryTransaction) {
        throw new Error("Can Not Delete Transaction");
      }
      const month = transaction.particular.match(/Month:(\d+)/);
      if (month) {
        employe.salaryStatus[Number(month[1])] = false;
      } else {
        throw new Error("Something Went Wrong");
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
