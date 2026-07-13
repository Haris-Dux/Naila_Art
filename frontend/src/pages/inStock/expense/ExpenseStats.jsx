import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseStatsAsync } from "../../../features/InStockSlice";
import { Bar } from "react-chartjs-2";
import {
  IoBarChartOutline,
  IoCalendarOutline,
  IoCashOutline,
} from "react-icons/io5";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const numberFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => `Rs. ${numberFormatter.format(Number(value) || 0)}`;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#4B5563", font: { family: "Poppins" } },
    },
    y: {
      grid: { color: "#E5E7EB" },
      ticks: { color: "#6B7280", font: { family: "Poppins" } },
    },
  },
};

const MetricCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
          {label}
        </p>
        <p className="mt-2 truncate text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tone}`}
      >
        <Icon size={20} />
      </span>
    </div>
  </div>
);

const EmptyChart = ({ message }) => (
  <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 text-center text-sm font-medium text-gray-400 dark:border-gray-700 dark:text-gray-500">
    {message}
  </div>
);

const ExpenseStats = () => {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const { user } = useSelector((state) => state.auth);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { Branches, ExpenseStatsLoading, ExpenseStats } = useSelector(
    (state) => state.InStock
  );

  useEffect(() => {
    if (user?.user?.role === "superadmin" && Branches.length > 0) {
      setSelectedBranchId(Branches[0]?.id);
    } else {
      setSelectedBranchId(user?.user?.branchId);
    }
  }, [Branches, user]);

  useEffect(() => {
    if (selectedBranchId) {
      const payload = {
        branchId: selectedBranchId,
        year: selectedYear,
      };
      dispatch(getExpenseStatsAsync(payload));
    }
  }, [dispatch, selectedBranchId, selectedYear]);

  const handleBranchClick = (branchId) => {
    setSelectedBranchId(branchId);
  };

  const monthlyExpense = ExpenseStats?.monthly_expense || [];
  const categoryExpense = ExpenseStats?.category_expense || [];
  const yearlyExpense = Number(ExpenseStats?.yearly_expense) || 0;
  const activeMonths = monthlyExpense.filter(
    (item) => Number(item?.total_expense) > 0
  ).length;
  const averageMonthlyExpense =
    activeMonths > 0 ? yearlyExpense / activeMonths : 0;

  const monthlyBarChartData = {
    labels: monthlyExpense.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Expense",
        data: monthlyExpense.map((item) => item.total_expense),
        backgroundColor: "#111827",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 46,
      },
    ],
  };

  const expenseBarChartData = {
    labels: categoryExpense.map((item) => item.categoryName),
    datasets: [
      {
        label: "Category Expense",
        data: categoryExpense.map((item) => item.total_expense),
        backgroundColor: "#009970",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 46,
      },
    ],
  };

  const getYears = () => {
    let years = [];
    let startyear = 2024;
    for (let i = startyear; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  };

  const years = getYears();

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
        <div className="header flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-6 mx-2">
          <div>
            <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl lg:text-3xl font-medium">
              Expense Statistics
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Track branch expense trends and category spend
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
            <IoCalendarOutline className="text-gray-500 dark:text-gray-300" />
            <select
              name="year"
              type="text"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-900 focus:border-0 focus:outline-none focus:ring-0 dark:text-white"
            >
              {years?.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        <>
          <div className="my-5 flex flex-wrap items-center justify-between gap-3">
            <div className="tabs_button flex flex-wrap gap-2">
              {user?.user?.role === "superadmin" ? (
                <>
                  {Branches?.map((branch) => (
                    <button
                      key={branch?.id}
                      className={`border px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedBranchId === branch?.id
                          ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100 border-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleBranchClick(branch?.id)}
                    >
                      {branch?.branchName}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {/* THIS SHOWS TO ADMIN & USER */}
                  {Branches?.map((branch) => (
                    <button
                      disabled
                      key={branch?.id}
                      className="border border-gray-700 px-5 py-2 text-sm font-medium rounded-md cursor-default dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                    >
                      {branch?.branchName}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {ExpenseStatsLoading ? (
            <div className="pt-16 flex justify-center mt-12 items-center">
              <div
                className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                role="status"
                aria-label="ExpenseLoading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label={`${selectedYear} Expense`}
                  value={formatCurrency(yearlyExpense)}
                  icon={IoCashOutline}
                  tone="bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                />            
                <MetricCard
                  label="Monthly Average"
                  value={formatCurrency(averageMonthlyExpense)}
                  icon={IoBarChartOutline}
                  tone="bg-blue-50 text-blue-600 dark:bg-blue-950/30"
                />
              
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-1">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Monthly Expense
                      </h2>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Expense movement across {selectedYear}
                      </p>
                    </div>
                    <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {monthlyExpense.length || 0} months
                    </span>
                  </div>

                  <div className="h-[22rem]">
                    {monthlyExpense.length ? (
                      <Bar data={monthlyBarChartData} options={chartOptions} />
                    ) : (
                      <EmptyChart message="No monthly expense data available" />
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Category Expense
                      </h2>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Spend grouped by expense category
                      </p>
                    </div>
                    <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {categoryExpense.length || 0} categories
                    </span>
                  </div>

                  <div className="h-[22rem]">
                    {categoryExpense.length ? (
                      <Bar data={expenseBarChartData} options={chartOptions} />
                    ) : (
                      <EmptyChart message="No category expense data available" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </section>
    </>
  );
};

export default ExpenseStats;
