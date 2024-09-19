import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataForOtherBranchAsync,
  getDataForSuperAdminAsync,
} from "../../features/DashboardSlice";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SendOTP from "./SendOTP";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { loading, DashboardData } = useSelector((state) => state.dashboard);
  const [hasError, setHasError] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user?.user?.role === "superadmin") {
      dispatch(getDataForSuperAdminAsync()).then((res) => {
        if (res?.error) {
          setHasError(true);
          localStorage.removeItem("dashboardAccessTime");
        };
        setDataLoading(false);
      });
    } else {
      dispatch(getDataForOtherBranchAsync()).then((res) => {
        if (res?.error) {
          setHasError(true);
          localStorage.removeItem("dashboardAccessTime");
        };
        setDataLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    const updateTime = () => {
      const endTime = localStorage.getItem("dashboardAccessTime");
      if (endTime) {
        const now = new Date().getTime();
        const timeLeft = Math.max(endTime - now, 0);
        if (timeLeft === 0) {
          localStorage.removeItem("dashboardAccessTime");
          setHasError(true);
        }
      }
    };
    const interval = setInterval(updateTime, 60000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const getMonthlySalesData = (monthlyGraphData) => {
    const salesData = Array(12).fill(0);
    monthlyGraphData.forEach(({ totalSale, month }) => {
      const monthIndex = parseInt(month, 10) - 1;
      salesData[monthIndex] = totalSale;
    });

    return salesData;
  };

  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sale",
        data: getMonthlySalesData(DashboardData?.monthlyGraphData || []),
        backgroundColor: "#CCCCCC",
        borderColor: "#434343",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const handleShowSuits = () => {
    navigate(`/dashboard/suits`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (hasError) {
    return <SendOTP />;
  };

  return (
    <>
      {dataLoading || loading ? (
        <div className="min-h-[90vh] flex justify-center items-center">
          <div
            className="animate-spin inline-block w-9 h-9 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <section className="bg-white dark:bg-gray-900 mt-7 mb-0 mx-6 px-2 pt-6 pb-16 min-h-screen rounded-lg">
          {/* ------------ FIRST STATS BAR ------------*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-4 lg:gap-3">
            {/* FIRST BOX */}
            <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
              <div className="stat_data">
                <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                  Daily Sale
                </h3>
                <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 mb-2 text-2xl font-semibold">
                  {DashboardData?.dailySale?.today}
                </h2>
                <span
                  className={`text-gray-900 ${
                    DashboardData?.dailySale?.differenceFromYesterday >= 0
                      ? "bg-green-200"
                      : "bg-red-200"
                  } px-3 py-1 rounded-lg`}
                >
                  {DashboardData?.dailySale?.differenceFromYesterday >= 0
                    ? `+${DashboardData?.dailySale?.differenceFromYesterday}`
                    : DashboardData?.dailySale?.differenceFromYesterday}
                </span>
              </div>

              <div className="size-28">
                <CircularProgressbar
                  value={Math.abs(DashboardData?.dailySale?.percentage)}
                  text={`${DashboardData?.dailySale?.percentage}%`}
                  styles={buildStyles({
                    rotation: 1,
                    strokeLinecap: "butt",
                    textSize: "20px",
                    pathTransitionDuration: 0.5,
                    pathColor:
                      DashboardData?.dailySale?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    textColor:
                      DashboardData?.dailySale?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </div>

            {/* SECOND BOX */}
            <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
              <div className="stat_data">
                <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                  Monthly Sale
                </h3>
                <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 mb-2 text-2xl font-semibold">
                  {DashboardData?.monthlysale?.currentMonthSale}
                </h2>
                <span
                  className={`text-gray-900 ${
                    DashboardData?.monthlysale?.differenceFromLastMonth >= 0
                      ? "bg-green-200"
                      : "bg-red-200"
                  } px-3 py-1 rounded-lg`}
                >
                  {DashboardData?.monthlysale?.differenceFromLastMonth > 0
                    ? "+" + DashboardData?.monthlysale?.differenceFromLastMonth
                    : DashboardData?.monthlysale?.differenceFromLastMonth}
                </span>
              </div>

              <div className="size-28">
                <CircularProgressbar
                  value={Math.abs(DashboardData?.monthlysale?.percentage)}
                  text={`${DashboardData?.monthlysale?.percentage}%`}
                  styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 1,
                    strokeLinecap: "butt",
                    textSize: "20px",
                    pathTransitionDuration: 0.5,
                    pathColor:
                      DashboardData?.monthlysale?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    textColor:
                      DashboardData?.monthlysale?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </div>

            {/* THIRD BOX */}
            <div className="h-40 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
              <div className="stat_data">
                <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                  Gross Sale
                </h3>
                <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 mb-2 text-2xl font-semibold">
                  {DashboardData?.grossSale?.currentyearSale}
                </h2>
                <span
                  className={`text-gray-900 ${
                    DashboardData?.grossSale?.differenceFromLastYear >= 0
                      ? "bg-green-200"
                      : "bg-red-200"
                  } px-3 py-1 rounded-lg`}
                >
                  {DashboardData?.grossSale?.differenceFromLastYear > 0
                    ? "+" + DashboardData?.grossSale?.differenceFromLastYear
                    : DashboardData?.grossSale?.differenceFromLastYear}
                </span>
              </div>

              <div className="size-28">
                <CircularProgressbar
                  value={Math.abs(DashboardData?.grossSale?.percentage)}
                  text={`${DashboardData?.grossSale?.percentage}%`}
                  styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 1,
                    strokeLinecap: "butt",
                    textSize: "20px",
                    pathTransitionDuration: 0.5,
                    pathColor:
                      DashboardData?.grossSale?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    textColor:
                      DashboardData?.grossSale?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </div>

            {/* FORTH BOX */}
            <div className="h-40 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-between items-center">
              <div className="stat_data">
                <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                  Gross Profit
                </h3>
                <h2 className="text-gray-900 dark:text-gray-100 mt-1.5 mb-2 text-2xl font-semibold">
                  {DashboardData?.grossProfit?.currentYearGrossProfit}
                </h2>
                <span
                  className={`text-gray-900 ${
                    DashboardData?.grossProfit?.differenceFromLastyear >= 0
                      ? "bg-green-200"
                      : "bg-red-200"
                  } px-3 py-1 rounded-lg`}
                >
                  {DashboardData?.grossProfit?.differenceFromLastyear > 0
                    ? "+" + DashboardData?.grossProfit?.differenceFromLastyear
                    : DashboardData?.grossProfit?.differenceFromLastyear}
                </span>
              </div>

              <div className="size-28">
                <CircularProgressbar
                  value={Math.abs(DashboardData?.grossProfit?.percentage)}
                  text={`${DashboardData?.grossProfit?.percentage}%`}
                  styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    rotation: 1,
                    strokeLinecap: "butt",
                    textSize: "20px",
                    pathTransitionDuration: 0.5,
                    pathColor:
                      DashboardData?.grossProfit?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    textColor:
                      DashboardData?.grossProfit?.percentage >= 0
                        ? "#31C48D"
                        : "#F60002",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                  })}
                />
              </div>
            </div>
          </div>

          {/* ------------ SECOND STATS BAR ------------*/}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
            <div className="rounded-lg md:col-span-1 lg:col-span-4 xl:col-span-3">
              {/* BAR CHARTS */}
              <div className="h-[22rem] rounded-lg text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-700 w-full p-4">
                <Bar
                  data={barChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>

              {/* TOTAL SUITES && ACCOUNTS */}
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 rounded-lg">
                {/* TOTAL SUITE */}
                <div className="rounded-lg lg:col-span-3">
                  <div className="min-h-72 px-3 py-4 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
                    <h2 className="text-lg font-medium mb-3">Total Suits</h2>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                          <th className="px-6 py-3" scope="col">
                            Category
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Colors
                          </th>
                          <th className="px-6 py-3" scope="col">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {DashboardData &&
                        DashboardData?.totalSuits?.length > 0 ? (
                          DashboardData?.totalSuits
                            ?.slice(0, 4)
                            .map((data, index) => (
                              <tr
                                key={index}
                                onClick={handleShowSuits}
                                className="bg-white border-b cursor-pointer text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                              >
                                <td className="px-6 py-3">{data.category}</td>
                                <td className="px-6 py-3">{data.color}</td>
                                <td className="px-6 py-3">{data.quantity}</td>
                              </tr>
                            ))
                        ) : (
                          <tr className="w-full flex justify-center items-center">
                            <td className="text-xl mt-3">No Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {/* BUTTON */}
                    {DashboardData?.totalSuits?.length > 0 ? (
                      <div className="button w-full flex justify-center items-center mt-3">
                        <Link
                          to="/dashboard/suits"
                          onClick={() => window.scrollTo(0, 0)}
                          className="bg-gray-300 px-6 py-1 rounded-md"
                        >
                          View All
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* ACCOUNTS DETAILS */}
                <div className="lg:col-span-1">
                  <div className="mb-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                    <div className="stat_data pl-4">
                      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                        Cash In Hand
                      </h3>
                      <h3 className="mt-1 text-gray-900 dark:text-gray-100">
                        <span className="text-xl font-semibold mr-2">
                          Rs {DashboardData?.cashInHand}
                        </span>
                      </h3>
                    </div>
                  </div>
                  <div className="mb-3 py-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-green-400 dark:border-green-700 flex justify-start items-center">
                    <div className="stat_data pl-4">
                      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                        Receivable
                      </h3>
                      <h3 className="mt-1 text-gray-900 dark:text-gray-100">
                        <span className="text-xl font-semibold mr-2">
                          Rs {DashboardData?.recieveable}
                        </span>
                      </h3>
                    </div>
                  </div>
                  {user?.user?.role === "superadmin" ? (
                    <div className="mb-3 py-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-red-400 dark:border-gray-700 flex justify-start items-center">
                      <div className="stat_data pl-4">
                        <h3 className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                          Payable
                        </h3>
                        <h3 className="mt-1 text-gray-900 dark:text-gray-100">
                          <span className="text-xl font-semibold mr-2">
                            Rs {DashboardData?.payable}
                          </span>
                        </h3>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              {/* SALES BY LOCATION */}
              <div className="h-[22rem] mb-5 px-4 pt-5 lg:col-span-4 xl:col-span-1 pb-5 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
                <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-400 dark:border-gray-700 z-10">
                  <h2 className="font-medium text-lg">Sales By Locations</h2>
                </div>
                <div className="scrollable-content auto h-[calc(22rem-4.4rem)]">
                  {" "}
                  {DashboardData?.salesBylocation?.map((data, index) => (
                    <div
                      key={index}
                      className="my-4 px-3 city flex justify-between items-center border-b"
                    >
                      <span>{data?.city?.name}</span>
                      <span className="font-semibold">{data?.city?.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BANK ACCOUNT */}
              <div className="h-[21rem] px-4 pt-5 lg:col-span-4 xl:col-span-1 pb-5 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
                <h2 className="mb-3 font-medium text-lg">Bank Account</h2>
                {DashboardData?.bankAccountsData &&
                  Object.entries(DashboardData.bankAccountsData).map(
                    ([name, value], index) => (
                      <div
                        key={index}
                        className="my-4 flex justify-between items-center border-b"
                      >
                        <span>{name}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DashboardStats;
