import moment from "moment-timezone";
import { BranchModel } from "../../models/Branch.Model.js";
import mongoose, { Types } from "mongoose";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import {
  ExpenseCategoriesModel,
  ExpenseModel,
} from "../../models/Stock/ExpenseModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import { virtualAccountsService } from "../../services/VirtualAccountsService.js";
import { cashBookService } from "../../services/CashbookService.js";
import CustomError from "../../config/errors/CustomError.js";
import { verifyrequiredparams } from "../../middleware/Common.js";
import { getTodayDate, verifyPastDate } from "../../utils/Common.js";
import { updateTotalCashForDateRange } from "../../services/DailySaleService.js";

export const addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { categoryId, reason, Date, rate, branchId, payment_Method } =
        req.body;
      if (!categoryId || !reason || !Date || !rate || !branchId)
        throw new Error("Missing Fields");
      const branch = await BranchModel.findOne({ _id: branchId }).session(
        session
      );
      if (!branch) throw new Error("Branch Not Found");
      const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");

      const futureDate = moment.tz(Date, "Asia/Karachi").startOf("day");
      const now = moment.tz("Asia/Karachi").startOf("day");
      const isFutureDate = futureDate.isAfter(now);
      const isPastDate = futureDate.isBefore(now);
      if (isFutureDate) {
        throw new Error("Date cannot be in the future");
      }

      if (payment_Method) {
        //SUPERADMIN CASE
        if (payment_Method === "cashSale") {
          if (!isPastDate) {
            let dailySalebyDate = await DailySaleModel.findOne({
              branchId,
              date: { $eq: Date },
            });
            if (!dailySalebyDate) throw new Error("Daily Sale Not Found Error");
            dailySalebyDate.saleData.totalExpense += rate;
            dailySalebyDate.saleData.totalCash -= rate;
            if (dailySalebyDate.saleData.totalCash < 0)
              throw new Error("Not enogh cash for expense");
            await dailySalebyDate.save({ session });
          } else if (isPastDate) {
            const targetDate = moment.tz(Date, "Asia/Karachi").startOf("day");
            const today = moment.tz("Asia/Karachi").startOf("day");

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
              const isOriginalDate =
                saleDoc.date === targetDate.format("YYYY-MM-DD");

              const update = {
                $inc: {
                  "saleData.totalCash": -rate,
                  ...(isOriginalDate && { "saleData.totalExpense": rate }),
                },
              };

              const futureCash = saleDoc.saleData.totalCash - rate;
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
          }
        } else {
          let dailySalebyDate = await DailySaleModel.findOne({
            branchId,
            date: { $eq: Date },
          });
          if (!dailySalebyDate) throw new Error("Daily Sale Not Found Error");
          dailySalebyDate.saleData.totalExpense += rate;
          const data = {
            session,
            payment_Method,
            amount: rate,
            transactionType: "WithDraw",
            date: Date,
            note: `Expense Entry/${reason}`,
          };
          await dailySalebyDate.save({ session });
          await virtualAccountsService.makeTransactionInVirtualAccounts(data);
        }
      } else {
        //ADMIN AND USER CASE
        let existingDailySaleData = await DailySaleModel.findOne({
          branchId,
          date: { $eq: today },
        });
        if (!existingDailySaleData)
          throw new Error("Daily Sale Not Found Error");
        existingDailySaleData.saleData.totalExpense += rate;
        existingDailySaleData.saleData.totalCash -= rate;
        if (existingDailySaleData.saleData.totalCash < 0) {
          throw new Error("Not Enough Cash");
        }
        await existingDailySaleData.save({ session });
      }

      const categoryName = await ExpenseCategoriesModel.findById(
        categoryId
      ).select("name");

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: isPastDate,
        branchId,
        amount: rate,
        tranSactionType: "WithDraw",
        transactionFrom: "Expense",
        partyName: categoryName.name,
        payment_Method: payment_Method ? payment_Method : "cashSale",
        session,
        ...(isPastDate && { pastDate: Date }),
      };
      await cashBookService.createCashBookEntry(dataForCashBook);

      //GET LAST SERIAL NUMBER
      const lastExpenseS_N = await ExpenseModel.find({
        branchId,
      })
        .sort({ createdAt: -1 })
        .select("serial_no")
        .session(session);
      await ExpenseModel.create(
        [
          {
            branchId,
            categoryId,
            reason,
            Date,
            rate,
            serial_no: lastExpenseS_N[0]?.serial_no + 1 || 1,
            ...(payment_Method && { payment_Method }),
          },
        ],
        { session }
      );

      return res.status(200).json({ success: true, message: "Expense Added" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllExpenses = async (req, res, next) => {
  try {
    const id = req.query.branchId;
    if (!id) throw new Error("Missing Branch Id");
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const categoryId = req.query.category || "";

    let query = {
      branchId: id,
      categoryId: categoryId,
    };

    const totalDocuments = await ExpenseModel.countDocuments(query);
    const data = await ExpenseModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const response = {
      data,
      page,
      total_Expense: totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id } = req.body;
      if (!id) throw new Error("Missing Expense Id");
      const ExpenseData = await ExpenseModel.findById(id).session(session);
      if (!ExpenseData) throw new Error("Expense Data Not Found");
      const today = getTodayDate();

      let dailySaleForToday = await DailySaleModel.findOne({
        branchId: ExpenseData.branchId,
        date: { $eq: today },
      }).session(session);
      if (!dailySaleForToday) throw new Error("Daily Sale Not Found Error");

      //UPDATING DAILY SALE AND VIRTUAL ACCOUNTS
      const payment_Method = ExpenseData.payment_Method;
      const rate = ExpenseData.rate;
  
      const isPastDate = verifyPastDate(ExpenseData.Date);
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount: rate,
          transactionType: "Deposit",
          date: today,
          note: `Expense Entry Deleted/${ExpenseData.name}/${ExpenseData.reason}`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      } else {
        if (!isPastDate) {
          dailySaleForToday.saleData.totalCash += rate;
          await dailySaleForToday.save({ session });
        } else if (isPastDate) {
          const data = {
            date: ExpenseData.Date,
            branchId: ExpenseData.branchId,
            amount: rate,
            session,
          };
          await updateTotalCashForDateRange(data);
        }
      }

      //DEDUCTING EXPENSE FROM THE ACTUAL EXPENSE DATE
      const actualDailySale = await DailySaleModel.findOne({
        branchId: ExpenseData.branchId,
        date: ExpenseData.Date,
      }).session(session);
      if (!actualDailySale) throw new Error("Daily Sale Not Found Error");
      actualDailySale.saleData.totalExpense -= rate;
      await actualDailySale.save({ session });

      //DELETE EXPENSE
      await ExpenseModel.findByIdAndDelete(id).session(session);

      const categoryName = await ExpenseCategoriesModel.findById(
        ExpenseData.categoryId
      ).select("name");

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: isPastDate,
        branchId: ExpenseData.branchId,
        amount: rate,
        tranSactionType: "Deposit",
        transactionFrom: "Expense",
        partyName: categoryName.name,
        payment_Method,
        ...(isPastDate && { pastDate: ExpenseData.Date }),
        session,
      };

      await cashBookService.createCashBookEntry(dataForCashBook);

      return res
        .status(200)
        .json({ success: true, message: "Expense Deleted Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const createExpenseCategory = async (req, res, next) => {
  try {
    const { name, branches } = req.body;
    if (!name) throw new CustomError("Category name required", 404);
    if (!branches || !branches.length)
      throw new CustomError("Please select at least 1 branch", 404);
    const checkExistingCategory = await ExpenseCategoriesModel.findOne({
      name,
    });
    if (checkExistingCategory)
      throw new CustomError("Category already exists", 404);
    await ExpenseCategoriesModel.create({ name, branches });
    return res
      .status(200)
      .json({ success: true, message: "Category created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateExpenseCategory = async (req, res, next) => {
  try {
    const { id, name, branches } = req.body;
    await verifyrequiredparams(req.body, ["id", "name"]);
    const checkExistingCategory = await ExpenseCategoriesModel.findOne({
      name,
      branches: branches,
    });
    if (checkExistingCategory)
      throw new CustomError("Category already exists", 404);
    await ExpenseCategoriesModel.findByIdAndUpdate(id, {
      name: name,
      branches: branches,
    });
    return res
      .status(200)
      .json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllExpenseCategories = async (req, res, next) => {
  try {
    const data = await ExpenseCategoriesModel.find().sort({
      createdAt: -1,
    });
    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getExpenseStats = async (req, res, next) => {
  try {
    let branchId = req.query.branchId;
    const currentYear = req.query.year;
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const data = await ExpenseModel.aggregate([
      {
        $match: {
          branchId: branchId,
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $facet: {
          total_year_expense: [
            {
              $group: {
                _id: null,
                total_expense: { $sum: "$rate" },
              },
            },
          ],
          total_monthly_expense: [
            {
              $group: {
                _id: { $month: "$createdAt" },
                total_expense: { $sum: "$rate" },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ],
          category_expense: [
            {
              $group: {
                _id: "$categoryId",

                total_expense: { $sum: "$rate" },
              },
            },
            {
              $lookup: {
                from: "expense categories",
                localField: "_id",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unwind: "$category",
            },
            {
              $match: {
                "category.branches":
                  Types.ObjectId.createFromHexString(branchId),
              },
            },
            {
              $project: {
                _id: 0,
                categoryId: "$_id",
                categoryName: "$category.name",
                total_expense: 1,
              },
            },
          ],
        },
      },
    ]);

    const { total_year_expense, total_monthly_expense, category_expense } =
      data[0];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const yearly_expense = total_year_expense[0]?.total_expense || 0;

    const monthly_expense = total_monthly_expense.map((item) => ({
      month: months[item._id - 1],
      total_expense: item.total_expense,
    }));
    const response = {
      yearly_expense,
      monthly_expense,
      category_expense,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
