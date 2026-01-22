import moment from "moment-timezone";
import { CashbookTransactionSource } from "../enums/cashbookk.enum.js";
import { Roles } from "../enums/Roles.js";

export const getTodayDate = () => {
  return moment().tz("Asia/Karachi").format("YYYY-MM-DD");
};

export const verifyPastDate = (date) => {
  const futureDate = moment.tz(date, "Asia/Karachi").startOf("day");
  const now = moment.tz("Asia/Karachi").startOf("day");
  const isFutureDate = futureDate.isAfter(now);
  if (isFutureDate) {
    throw new Error("Date cannot be in the future");
  }
  const pastDate = futureDate.isBefore(now);
  return pastDate;
};

export const canDeleteRecord = (data) => {
  const { role, date, transactionFrom, cashBookCase = true } = data;
  if (!role || !date || !transactionFrom) throw new Error("Missing arguments");
  const threshold = new Date("2026-01-23T00:00:00.000Z");
  if (cashBookCase) {
    return (
      role === Roles.SUPER_ADMIN &&
      new Date(date) >= threshold &&
      [
        CashbookTransactionSource.CASH_IN,
        CashbookTransactionSource.CASH_OUT,
      ].includes(transactionFrom)
    );
  } else if (!cashBookCase) {
    if(transactionFrom === CashbookTransactionSource.BUYERS){
      return role === Roles.SUPER_ADMIN && new Date(date) >= threshold;
    }
  }
};
