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

export const DEFAULT_PAGE_LIMIT = 30;

export const PAGE_LIMIT_OPTIONS = [30, 50, 100];

export const getPageLimit = (searchParams) => {
  const limit = parseInt(searchParams.get("limit") || DEFAULT_PAGE_LIMIT, 10);
  return PAGE_LIMIT_OPTIONS.includes(limit) ? limit : DEFAULT_PAGE_LIMIT;
};

export const buildPaginationQuery = (searchParams, updates = {}) => {
  const params = new URLSearchParams(searchParams);
  const page = updates.page ?? params.get("page") ?? 1;
  const limit = updates.limit ?? params.get("limit") ?? DEFAULT_PAGE_LIMIT;

  params.set("page", page);
  params.set(
    "limit",
    PAGE_LIMIT_OPTIONS.includes(Number(limit)) ? Number(limit) : DEFAULT_PAGE_LIMIT,
  );

  return `?${params.toString()}`;
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
