import mongoose from "mongoose";
import CustomError from "../config/errors/CustomError.js";
import { verifyrequiredparams } from "../middleware/Common.js";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { BranchModel } from "../models/Branch.Model.js";
import { OtherSaleBillModel } from "../models/OtherSaleModel.js";
import { setMongoose } from "../utils/Mongoose.js";
import { virtualAccountsService } from "../services/VirtualAccountsService.js";
import { cashBookService } from "../services/CashbookService.js";
import moment from "moment-timezone";

export const generateOtherSaleBill = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        name,
        amount,
        city,
        cargo,
        phone,
        date,
        bill_by,
        payment_Method,
        quantity,
        note,
      } = req.body;

      await verifyrequiredparams(req.body, [
        "name",
        "amount",
        "city",
        "cargo",
        "phone",
        "date",
        "bill_by",
        "payment_Method",
        "quantity",
        "note",
      ]);

      //GET HEAD OFFICE BRANCH
      const headOffice = await BranchModel.findOne({
        branchName: "Head Office",
      }).session(session);
      if (!headOffice)
        throw new CustomError("Cannot find head office data", 404);

      const futureDate = moment.tz(date, "Asia/Karachi").startOf("day");
      const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      const now = moment.tz("Asia/Karachi").startOf("day");
      const isFutureDate = futureDate.isAfter(now);
      const isPastDate = futureDate.isBefore(now);
      if (isFutureDate) {
        throw new Error("Date cannot be in the future");
      }

      //UPDATE DAILY SALE
      if (isPastDate) {
        const targetDate = moment.tz(date, "Asia/Karachi").startOf("day");
        const dateList = [];

        const current = moment(targetDate);
        while (current.isSameOrBefore(today)) {
          dateList.push(current.format("YYYY-MM-DD"));
          current.add(1, "day");
        }

        const dailySales = await DailySaleModel.find({
          branchId:headOffice._id,
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
              ...(isOriginalDate && {
                "saleData.totalSale": amount,
                [`saleData.${payment_Method}`]: amount,
              }),
              ...(payment_Method === "cashSale" && {
                "saleData.totalCash": amount,
              }),
            },
          };

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
          branchId: headOffice._id,
          date: today,
        }).session(session);
        if (!dailySaleForToday) {
          throw new Error("Daily sale record not found for This Date");
        }

        let updatedSaleData = {
          ...dailySaleForToday.saleData,
          [payment_Method]: (dailySaleForToday.saleData[payment_Method] +=
            amount),
          totalSale: (dailySaleForToday.saleData.totalSale += amount),
        };
        if (payment_Method === "cashSale") {
          updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
            amount;
        }

        dailySaleForToday.saleData = updatedSaleData;
        await dailySaleForToday.save({ session });
      }

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount,
          transactionType: "Deposit",
          date,
          note: `Other Sale Bill Generated For : ${name}`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      }

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: isPastDate,
        branchId: headOffice._id,
        amount,
        tranSactionType: "Deposit",
        transactionFrom: "Other Sale",
        partyName: name,
        payment_Method,
        ...(isPastDate && { pastDate: date }),
        session,
      };
      await cashBookService.createCashBookEntry(dataForCashBook);

      //GET LAST SERIAL NUMBER
      const lastOtherSale = await OtherSaleBillModel.find({})
        .sort({ createdAt: -1 })
        .select("serialNumber")
        .session(session);

      //GENERATE SALE
      await OtherSaleBillModel.create(
        [
          {
            name,
            amount,
            serialNumber: lastOtherSale[0]?.serialNumber + 1 || 1,
            city,
            cargo,
            phone,
            date,
            bill_by,
            payment_Method,
            quantity,
            note,
          },
        ],
        { session }
      );
      return res.status(201).json({
        success: true,
        message: "Other Sale Bill Created Successfully",
      });
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const getAllOtherSaleBills = async (req, res, next) => {
  try {
    const name = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    let query = {};
    if (name) {
      query = { name: { $regex: name, $options: "i" } };
    }
    const totalDocuments = await OtherSaleBillModel.countDocuments(query);
    const data = await OtherSaleBillModel.find(query)
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
    next(error);
  }
};
