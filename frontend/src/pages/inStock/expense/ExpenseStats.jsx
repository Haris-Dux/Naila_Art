import React, { useEffect, useState } from "react";
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

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const monthlyBarChartData = {
    labels: ExpenseStats?.monthly_expense?.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Expense",
        data: ExpenseStats?.monthly_expense?.map((item) => item.total_expense),
        backgroundColor: "#CCCCCC",
        borderColor: "#434343",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const expenseBarChartData = {
    labels: ExpenseStats?.category_expense?.map((item) => item.categoryName),
    datasets: [
      {
        label: "Category Expense",
        data: ExpenseStats?.category_expense?.map((item) => item.total_expense),
        backgroundColor: "#CCCCCC",
        borderColor: "#434343",
        borderWidth: 2,
        borderRadius: 5,
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

  console.log("years", years);
  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Expense Statistics
          </h1>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        <>
          <div className="tabs flex justify-between items-center my-5">
            <div className="tabs_button">
              {user?.user?.role === "superadmin" ? (
                <>
                  {Branches?.map((branch) => (
                    <button
                      key={branch?.id}
                      className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                        selectedBranchId === branch?.id
                          ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                          : ""
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
                      className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md cursor-default ${"dark:bg-white bg-gray-700 dark:text-black text-gray-100"}`}
                    >
                      {branch?.branchName}
                    </button>
                  ))}
                </>
              )}
            </div>
            {/* YEAR FILTER */}
            <div className="col-span-2">
              <select
                name="year"
                type="text"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              >
                {years?.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
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
            <div>
              <div className="my-5 text-2xl font-bold text-center text-gray-800 dark:text-gray-100 bg-gray-100 py-3 rounded-md shadow">
                Yearly Expense ({selectedYear}):{" "}
                <span className="text-gray-800">
                  Rs. {ExpenseStats?.yearly_expense}
                </span>
              </div>
              {/* MONTHLY EXPENSE BAR CHARTS */}
              <div className="h-[22rem] rounded-lg text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700 w-full p-4">
                <Bar
                  data={monthlyBarChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>

              {/* CATEGORY EXPENSE BAR CHARTS */}
              <div className="h-[22rem] mt-5 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700 w-full p-4">
                <Bar
                  data={expenseBarChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          )}
        </>
      </section>
    </>
  );
};

export default ExpenseStats;
