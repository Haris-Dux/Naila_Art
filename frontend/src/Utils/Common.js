import moment from "moment-timezone";

export const buildQueryParams = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export const getTodayDate = () => {
  return moment().tz("Asia/Karachi").format("YYYY-MM-DD");
};

export const setAccountStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-[#2ECC40]";
      case "Unpaid":
        return "text-red-700";
      case "Advance Paid":
        return "text-blue-700";
      default:
        return "text-black";
    }
};
