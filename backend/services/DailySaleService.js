import moment from "moment-timezone";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { verifyrequiredparams } from "../middleware/Common.js";

export const updateTotalCashForDateRange = async (data) => {
  try {
    const { date, branchId, amount, session } = data;
    await verifyrequiredparams(data,['date', 'branchId', 'amount', 'session'])
    const targetDate = moment.tz(date, "Asia/Karachi").startOf("day");
    const today = moment.tz("Asia/Karachi").startOf("day");

    const dateList = [];
    const current = moment(targetDate);
    while (current.isSameOrBefore(today)) {
      dateList.push(current.format("YYYY-MM-DD"));
      current.add(1, "day");
    };
    
    const dailySales = await DailySaleModel.find({
      branchId,
      date: { $in: dateList },
    }).session(session);

    if (dailySales.length !== dateList.length) {
      const foundDates = dailySales.map((d) => d.date);
      const missing = dateList.filter((d) => !foundDates.includes(d));
      throw new Error(`Missing Daily Sale records for: ${missing.join(", ")}`);
    }

    // Prepare bulk operations
    const bulkOps = dailySales.map((saleDoc) => {
      const isOriginalDate = saleDoc.date === targetDate.format("YYYY-MM-DD");
      const update = {
        $inc: {
          "saleData.totalCash": amount,
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
  } catch (error) {
    throw error;
  }
};
