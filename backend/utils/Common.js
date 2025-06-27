import moment from "moment-timezone";

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
