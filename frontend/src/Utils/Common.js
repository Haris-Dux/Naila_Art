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

export const accountStatusOptions = [
  { value: "", label: "All" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
  { value: "Advance Paid", label: "Advance Paid" },
];

export const buyerStatusOptions = [
  ...accountStatusOptions.slice(0, 3),
  { value: "Partially Paid", label: "Partially Paid" },
  accountStatusOptions[3],
];

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
