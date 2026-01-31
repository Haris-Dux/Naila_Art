import mongoose from "mongoose";
import { EmployeModel } from "../models/EmployModel.js";
import { setMongoose } from "../utils/Mongoose.js";
import moment from "moment-timezone";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { virtualAccountsService } from "../services/VirtualAccountsService.js";
import { cashBookService } from "../services/CashbookService.js";
import { CashbookTransactionAccounts, CashbookTransactionSource, TransactionType } from "../enums/cashbookk.enum.js";
import { getTodayDate } from "../utils/Common.js";

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
      const today = getTodayDate();
      const employe = await EmployeModel.findById(id).session(session);
      if (!employe) throw new Error("Employe data not found");
      const lastNonSalaryTransaction = employe.financeData
        .slice()
        .reverse()
        .find((transaction) => !transaction.salaryTransaction);

      let newBalance = lastNonSalaryTransaction
        ? lastNonSalaryTransaction.balance
        : 0;

      const futureDate = moment.tz(date, "Asia/Karachi").startOf('day');
      const now = moment.tz("Asia/Karachi").startOf('day');
      const isFutureDate = futureDate.isAfter(now);
      const isPastDate = futureDate.isBefore(now);
      if (isFutureDate) {
        throw new Error("Date cannot be in the future");
      }

      //CREDIT LOGIC
      if (credit >= 0) {
        newBalance += credit;
        employe.financeData.push({
          credit: credit,
          debit: 0,
          balance: newBalance,
          particular: particular,
          date: date,
          payment_Method,
          branchId
        });
        const financeRecordId = employe.financeData[employe.financeData.length -1]._id

        //UPDATING VIRTUAL ACCOUNTS
        if (payment_Method !== "cashSale") {
          const data = {
            session,
            payment_Method,
            amount: credit,
            transactionType: TransactionType.DEPOSIT,
            date,
            note: `Credit Transaction for ${employe.name}`,
            sourceId:financeRecordId,
          };
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
        //PUSH DATA FOR CASH BOOK
        const dataForCashBook = {
          pastTransaction: isPastDate,
          branchId,
          amount: credit,
          tranSactionType: TransactionType.DEPOSIT,
          transactionFrom: CashbookTransactionSource.EMPLOYE,
          category: CashbookTransactionAccounts.EMPLOYE,
          sourceId:financeRecordId,
          partyName: employe.name,
          payment_Method,
          ...(isPastDate && { pastDate: date }),
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
          payment_Method,
          branchId
        });
        const financeRecordId = employe.financeData[employe.financeData.length -1]._id

        //UPDATING VIRTUAL ACCOUNTS
        if (payment_Method !== "cashSale") {
          const data = {
            session,
            payment_Method,
            amount: debit,
            transactionType: TransactionType.WITHDRAW,
            date,
            note: `Debit Transaction for ${employe.name}`,
            sourceId:financeRecordId,
          };
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
        //PUSH DATA FOR CASH BOOK
        const dataForCashBook = {
          pastTransaction: isPastDate,
          branchId,
          amount: debit,
          tranSactionType: TransactionType.WITHDRAW,
          transactionFrom: CashbookTransactionSource.EMPLOYE,
          category: CashbookTransactionAccounts.EMPLOYE,
          sourceId:financeRecordId,
          partyName: employe.name,
          payment_Method,
          ...(isPastDate && { pastDate: date }),
          session,
        };
        await cashBookService.createCashBookEntry(dataForCashBook);
      }

      //UPDATE DAILY SALE
      if (payment_Method === "cashSale") {
        const amountForDailySale =
          credit >= 0 ? credit : debit >= 0 ? -debit : 0;
        if (isPastDate) {
          const targetDate = moment.tz(date, "Asia/Karachi").startOf("day");
          const dateList = [];

          const current = moment(targetDate);
          while (current.isSameOrBefore(today)) {
            dateList.push(current.format("YYYY-MM-DD"));
            current.add(1, "day");
          }

          const dailySales = await DailySaleModel.find({
            branchId,
            date: { $in: dateList },
          }).session(session);

          if (dailySales.length !== dateList.length) {
            const foundDates = dailySales.map((d) => d.date);
            const missing = dateList.filter((d) => !foundDates.includes(d));
            throw new Error(
              `Missing Daily Sale records for: ${missing.join(", ")}`
            );
          }

          // Prepare bulk operations
          const bulkOps = dailySales.map((saleDoc) => {
            const update = {
              $inc: {
                "saleData.totalCash": amountForDailySale,
              },
            };

            if (debit >= 0) {
              const futureCash = saleDoc.saleData.totalCash - debit;
              if (futureCash < 0) {
                throw new Error(`Not enough cash on ${saleDoc.date}`);
              }
            }

            return {
              updateOne: {
                filter: { _id: saleDoc._id },
                update,
              },
            };
          });

          await DailySaleModel.bulkWrite(bulkOps, { session });
        } else {
          const dailySaleForToday = await DailySaleModel.findOne({
            branchId,
            date: today,
          }).session(session);
          if (!dailySaleForToday) {
            throw new Error("Daily sale record not found for This Date");
          }
          if (payment_Method === "cashSale") {
            dailySaleForToday.totalCash =
              dailySaleForToday.saleData.totalCash += amountForDailySale;
          }
          await dailySaleForToday.save({ session });
        }
      }

      await employe.save({ session });
      return res
        .status(200)
        .json({ success: true, message: "Transaction successfull" });
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
      const {
        id,
        salary,
        payment_Method,
        over_time,
        branchId,
        leaves,
        month,
        date,
      } = req.body;
      if (!id || !salary || !payment_Method || !branchId || !month || !date)
        throw new Error("Please fill all fields");
      if (month < 1 || month > 12) {
        throw new Error("Invalid month");
      }
      const employe = await EmployeModel.findById(id).session(session);
      const today = getTodayDate();
      if (!employe) throw new Error("Employe data not found");

      //VERIFY IF SALARY IS CREDITED FOR CURRENT MOTN OR NOT
      const isSalaryPaid = employe.salaryStatus[Number(month)];
      if (isSalaryPaid) {
        throw new Error("Salary already paid for this month");
      } else {
        employe.salaryStatus[month] = true;
      }

      employe.financeData.push({
        credit: 0,
        debit: salary,
        balance: 0,
        particular: `Salary Credit/${payment_Method}/Overtime:${over_time}/Leaves:${leaves}/Month:${month}`,
        date,
        over_time,
        leaves,
        payment_Method,
        branchId,
        salaryTransaction: true,
      });
      const financeRecordId = employe.financeData[employe.financeData.length - 1]._id;
      employe.overtime_Data.hours = 0;
      await employe.save({ session });

      const futureDate = moment.tz(date, "Asia/Karachi").startOf("day");
      const now = moment.tz("Asia/Karachi").startOf("day");
      const isFutureDate = futureDate.isAfter(now);
      const isPastDate = futureDate.isBefore(now);
      if (isFutureDate) {
        throw new Error("Date cannot be in the future");
      }

      //UPDATE DAILY SALE
      if (payment_Method === "cashSale") {
        if (isPastDate) {
          const targetDate = moment.tz(date, "Asia/Karachi").startOf("day");
          const dateList = [];

          const current = moment(targetDate);
          while (current.isSameOrBefore(today)) {
            dateList.push(current.format("YYYY-MM-DD"));
            current.add(1, "day");
          }

          const dailySales = await DailySaleModel.find({
            branchId,
            date: { $in: dateList },
          }).session(session);

          if (dailySales.length !== dateList.length) {
            const foundDates = dailySales.map((d) => d.date);
            const missing = dateList.filter((d) => !foundDates.includes(d));
            throw new Error(
              `Missing Daily Sale records for: ${missing.join(", ")}`
            );
          }

          // Prepare bulk operations
          const bulkOps = dailySales.map((saleDoc) => {
            const update = {
              $inc: {
                "saleData.totalCash": -salary,
              },
            };

            const futureCash = saleDoc.saleData.totalCash - salary;
            if (futureCash < 0) {
              throw new Error(`Not enough cash on ${saleDoc.date}`);
            }

            return {
              updateOne: {
                filter: { _id: saleDoc._id },
                update,
              },
            };
          });

          await DailySaleModel.bulkWrite(bulkOps, { session });
        } else {
          const dailySaleForToday = await DailySaleModel.findOne({
            branchId,
            date: today,
          }).session(session);
          if (!dailySaleForToday) {
            throw new Error("Daily sale record not found for this date");
          }

          dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash -=
            salary;

          if (dailySaleForToday.totalCash < 0) {
            throw new Error("Not Enough Total Cash");
          }

          await dailySaleForToday.save({ session });
        }
      }

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount: salary,
          transactionType: TransactionType.WITHDRAW,
          date,
          note: `Salary credit for ${employe.name}`,
          sourceId:financeRecordId,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      }

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: isPastDate,
        branchId,
        amount: salary,
        tranSactionType: TransactionType.WITHDRAW,
        transactionFrom: CashbookTransactionSource.EMPLOYE,
        category: CashbookTransactionAccounts.EMPLOYE,
        sourceId: financeRecordId,
        partyName: employe.name,
        payment_Method,
        ...(isPastDate && { pastDate: date }),
        session,
      };
      await cashBookService.createCashBookEntry(dataForCashBook);

      return res.status(200).json({ success: true, message: "Salary Transaction Successfull" });
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
        throw new Error("Missing fields");
      const employe = await EmployeModel.findById(id).session(session);
      const transaction = employe.financeData.find(
        (item) => item._id.toString() === transactionId
      );
      if (!transaction || !transaction.salaryTransaction) {
        throw new Error("Can Not Delete Transaction");
      } 
      const today = getTodayDate();
      if (!employe) throw new Error("Employe Not Found");

      //ADD IN PAYMENT METHID
      if(payment_Method === "cashSale") {
        await DailySaleModel.updateMany(
          {
          branchId,
          date:{
            $gte: transaction.date,
            $lte:today
          }
        },
        {
          $inc:{
           "saleData.totalCash": amount,
          }
        }
      );
      }

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount,
          transactionType: TransactionType.DEPOSIT,
          date: today,
          note: `Salary Reversed for ${employe.name}`,
          sourceId:transactionId,
          isDelete:true
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      }

      //DELETE CASH BOOK ENTRY
      const dataForCashBook = {
        id: transactionId,
        session,
      };
      await cashBookService.deleteEntry(dataForCashBook);

      //MARKING TRANSACTION AS DELETED
      const month = transaction.particular.match(/Month:(\d+)/);
      if (month) {
        employe.salaryStatus[Number(month[1])] = false;
      } else {
        throw new Error("Something Went Wrong");
      }
      employe.financeData = employe.financeData.filter(
        (item) => item?._id?.toString() !== transactionId
      );
      employe.salaryStatus[transaction.m]
      await employe.save({ session });

      return res.status(200).json({ success: true, message: "Salary reverse successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const deleteCreditDebitEntry = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { employeId, recordId } = req.params;
      if (!employeId || !recordId) throw new Error("Record id is required");

      const today = getTodayDate();
      const employe = await EmployeModel.findById(employeId).session(session);
      if (!employe) throw new Error("Employe data not found");
      const recordData = employe.financeData.find(
        (record) => record._id?.toString() === recordId
      );
      const payment_Method = recordData.payment_Method;
      let credit = null;
      let debit = null;

      if (recordData.credit > 0) {
        credit = parseInt(recordData.credit, 10);
      } else if (recordData.debit > 0) {
        debit = parseInt(recordData.debit, 10);
      }

      const lastNonSalaryTransaction = employe.financeData
        .slice()
        .reverse()
        .find((transaction) => !transaction.salaryTransaction);

      let newBalance = lastNonSalaryTransaction
        ? lastNonSalaryTransaction.balance
        : 0;

      //CREDIT LOGIC
      if (credit > 0) {
        newBalance -= credit;

        //UPDATING VIRTUAL ACCOUNTS
        if (payment_Method !== "cashSale") {
          const data = {
            session,
            payment_Method,
            amount: credit,
            transactionType: TransactionType.WITHDRAW,
            date:today,
            note: `Credit transaction deleted for ${employe.name}`,
            isDelete:true,
            sourceId:recordId
          };
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
      }

      //DEBIT LOGIC
      if (debit > 0) {
        newBalance += debit;
        //UPDATING VIRTUAL ACCOUNTS
        if (payment_Method !== "cashSale") {
          const data = {
            session,
            payment_Method,
            amount: debit,
            transactionType: TransactionType.DEPOSIT,
            date:today,
            note: `Debit transaction deleted for ${employe.name}`,
            sourceId:recordId,
            isDelete:true
          };
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
      }

      //DELETE CASH BOOK ENTRY
      const dataForCashBook = {
        id: recordId,
        session,
      };
      console.log('dataForCashBook', dataForCashBook)
      await cashBookService.deleteEntry(dataForCashBook);

      //UPDATE DAILY SALE
      if (payment_Method === "cashSale") {

        const amountForDailySale =
          credit > 0 ? -credit : debit > 0 ? debit : 0;

          const targetDate = moment.tz(recordData.date, "Asia/Karachi").startOf("day");
          const dateList = [];

          const current = moment(targetDate);
          while (current.isSameOrBefore(today)) {
            dateList.push(current.format("YYYY-MM-DD"));
            current.add(1, "day");
          }

          const dailySales = await DailySaleModel.find({
            branchId:recordData.branchId,
            date: { $in: dateList },
          }).session(session);

          if (dailySales.length !== dateList.length) {
            const foundDates = dailySales.map((d) => d.date);
            const missing = dateList.filter((d) => !foundDates.includes(d));
            throw new Error(
              `Missing Daily Sale records for: ${missing.join(", ")}`
            );
          }

          // Prepare bulk operations
          const bulkOps = dailySales.map((saleDoc) => {
            const update = {
              $inc: {
                "saleData.totalCash": amountForDailySale,
              },
            };
            if (credit >= 0) {
              const futureCash = saleDoc.saleData.totalCash - credit;
              if (futureCash < 0) {
                throw new Error(`Not enough cash on ${saleDoc.date}`);
              }
            }

            return {
              updateOne: {
                filter: { _id: saleDoc._id },
                update,
              },
            };
          });

          await DailySaleModel.bulkWrite(bulkOps, { session });
      };
       employe.financeData = employe.financeData.filter(
        (record) => record._id?.toString() !== recordId
      );
      await employe.save({ session });
      return res
        .status(200)
        .json({ success: true, message: "Transaction deleted successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
