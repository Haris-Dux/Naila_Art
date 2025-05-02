
import moment from "moment-timezone";

export const getTodayDate = () => {
  return moment().tz('Asia/Karachi').format("YYYY-MM-DD");
};


  

  