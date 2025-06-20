import moment from "moment-timezone";
import { verifyrequiredparams } from "../middleware/Common.js";
import { cashBookServiceModel } from "../models/CashBookService/CashBookServiceModel.js";
import { getTodayDate } from "../utils/Common.js";
import { setMongoose } from "../utils/Mongoose.js";

class cashBookHistoryService {
   getCurrentTime() {
    return moment.tz("Asia/Karachi").format("HH:mm");
  }

  getTodayDate() {
    return moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  }

  async createCashBookEntry(data) {
    try {
      const {
        pastDate,
        pastTransaction,
        branchId,
        amount,
        tranSactionType,
        transactionFrom,
        partyName,
        payment_Method,
        session,
      } = data;

      await verifyrequiredparams(data, [
        "branchId",
        "amount",
        "tranSactionType",
        "transactionFrom",
        "partyName",
        "payment_Method",
      ]);

      if (pastTransaction && !pastDate) {
        throw new Error("Past date is required for past transaction");
      }

      await cashBookServiceModel.create(
        [
          {
            pastTransaction,
            branchId,
            amount,
            tranSactionType,
            transactionFrom,
            partyName,
            payment_Method,
            transactionTime: this.getCurrentTime(),
            ...(!pastTransaction && {currentDate: this.getTodayDate()}),
            ...(pastTransaction && { pastDate: pastDate }),
          },
        ],
        { session }
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllCashBookEntries(req) {
    try {
      const dateFrom = req.query.dateFrom || "";
      const dateTo = req.query.dateTo || "";
      const account = req.query.account || "";
      const transactionType = req.query.transactionType || "";
      const userRole = req.user_role;
      const branchIdFromQuery = req.query.branchId || "";
      let branchId = req.branch_id;

      let query = {};
      let dateQuery = [];

      if (dateFrom && dateTo) {
        dateQuery.push(
          { currentDate: { $gte: dateFrom, $lte: dateTo } },
          { pastDate: { $gte: dateFrom, $lte: dateTo } }
        );
      } else if (dateFrom) {
        dateQuery.push(
          { currentDate: { $eq: dateFrom } },
          { pastDate: { $eq: dateFrom } }
        );
      }

      if (dateQuery.length) {
        query.$or = dateQuery;
      }
      
      if (account) {
        query.payment_Method = account;
      }
      if (transactionType) {
        query.tranSactionType = transactionType;
      }

      if (userRole !== "superadmin") {
        query.branchId = branchId;
      }

      if(userRole === "superadmin" && branchIdFromQuery){
        query.branchId = branchIdFromQuery
      }

      const data = await cashBookServiceModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate({
          path: "branchId",
          select: "branchName",
        });
      setMongoose();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const cashBookService = new cashBookHistoryService();
