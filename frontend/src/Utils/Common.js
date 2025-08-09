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
