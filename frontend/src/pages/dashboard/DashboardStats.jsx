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
  createTransactionAsync,
  getDataForOtherBranchAsync,
  getDataForSuperAdminAsync,
  getTransactionHIstoryAsync,
} from "../../features/DashboardSlice";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import SendOTP from "./SendOTP";
import { CiSearch } from "react-icons/ci";
import moment from "moment-timezone";
import { showNotificationsForChecksAsync } from "../../features/BuyerSlice";
import { GrPowerReset } from "react-icons/gr";

const DashboardStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { PaymentData } = useSelector((state) => state.PaymentMethods);
  const { user } = useSelector((state) => state.auth);
  const { loading, DashboardData, transactionLoading, TransactionsHistory } =
    useSelector((state) => state.dashboard);
  const [hasError, setHasError] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

  const [transactionType, setTransactionType] = useState("");
  const [transactionModal, setTransactionModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  useEffect(() => {
    if (user && user?.user?.role !== "user") {
      dispatch(showNotificationsForChecksAsync());
    }
  }, [user, dispatch]);

  const [formData, setFormData] = useState({
    date: today,
    transactionType: "",
    payment_Method: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    if (user?.user?.role === "superadmin") {
      dispatch(getDataForSuperAdminAsync()).then((res) => {
        if (res?.error) {
          setHasError(true);
          localStorage.removeItem("dashboardAccessTime");
        }
        setDataLoading(false);
      });
    } else {
      dispatch(getDataForOtherBranchAsync()).then((res) => {
        if (res?.error) {
          setHasError(true);
          localStorage.removeItem("dashboardAccessTime");
        }
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

  const validateValue = (value) => {
    return value === undefined || value === null || isNaN(value) || value === ""
      ? ""
      : parseInt(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? validateValue(value) : value,
      transactionType: transactionType,
    }));
  };

  const opemTransactionMOdal = (transactionValue) => {
    setTransactionType(transactionValue);
    setTransactionModal(true);
  };

  const closeTransactionMOdal = () => {
    setTransactionType("");
    setTransactionModal(false);
  };

  const openConfirmationModal = () => {
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
  };

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    transactionType: "",
    account: "",
  });

  const openHistoryModal = () => {
    setHistoryModal(true);
    document.body.style.overflow = "hidden";
    const data = {
      page: 1,
      filters,
    };
    dispatch(getTransactionHIstoryAsync(data));
  };

  const closeHistoryModal = () => {
    setHistoryModal(false);
    setDate("");
    document.body.style.overflow = "auto";
  };

  const handleTransaction = (e) => {
    e.preventDefault();
    setConfirmationModal(false);
    dispatch(createTransactionAsync(formData)).then((res) => {
      if (res.payload.success === true) {
        dispatch(getDataForSuperAdminAsync()).then((res) => {
          if (res?.error) {
            setHasError(true);
            localStorage.removeItem("dashboardAccessTime");
          }
          setDataLoading(false);
        });
        closeTransactionMOdal();
        setTransactionType("");
        resetFormData();
      }
    });
  };

  const resetFormData = () => {
    setFormData({
      date: today,
      transactionType: "",
      payment_method: "",
      amount: "",
      note: "",
    });
  };

  const page = TransactionsHistory?.page;

  const handleChangeFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFiltersSearch = () => {
    dispatch(getTransactionHIstoryAsync({ page: 1, filters }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      transactionType: "",
      payment_Method: "",
      account: "",
    });
    dispatch(getTransactionHIstoryAsync({ page: 1, filters }));
  };

  const renderPaginationLinks = () => {
    const totalPages = TransactionsHistory?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i}>
          <Link
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => ToDown(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const ToDown = (pageValue) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    dispatch(getTransactionHIstoryAsync({ page: pageValue, filters }));
  };

  if (hasError) {
    return <SendOTP />;
  }

  const getPaymentMethodName = (method) => {
    const name = PaymentData.find((item) => item.value === method).label;
    return name;
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
              <div className=" px-4 pt-2 lg:col-span-4 xl:col-span-1 pb-2 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-400 dark:border-gray-700">
                <div className="flex flex-col justify-between h-full">
                  <div className="scrollable-content max-h-[17rem] pr-2">
                    <div className="flex justify-between items-center">
                      <h2 className="mb-1 font-medium text-lg">
                        Bank Accounts
                      </h2>
                      {user?.user?.role === "superadmin" && (
                        <FaHistory
                          className="cursor-pointer"
                          onClick={openHistoryModal}
                          size={18}
                        />
                      )}
                    </div>
                    {DashboardData?.bankAccountsData &&
                      DashboardData?.bankAccountsData.map((account, index) => (
                        <div
                          key={index}
                          className="my-3 flex justify-between items-center border-b"
                        >
                          <span className="text-sm">{account.name}</span>
                          <span className="text-sm font-semibold">
                            {account.value}
                          </span>
                        </div>
                      ))}
                  </div>

                  {user?.user?.role === "superadmin" && (
                    <div className="flex justify-evenly items-center mt-2">
                      <button onClick={(e) => opemTransactionMOdal("Deposit")}>
                        <PiHandDeposit size={32} className="text-green-500 " />
                      </button>
                      <button onClick={() => opemTransactionMOdal("WithDraw")}>
                        <PiHandWithdraw size={32} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* TRANSACTION MODAL */}
      {transactionModal && !confirmationModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transaction Details
              </h3>
              <button
                onClick={closeTransactionMOdal}
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* ------------- BODY ------------- */}
            <div className="p-4 md:p-5">
              <form onSubmit={openConfirmationModal}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
                  {/* AMOUNT */}
                  <div>
                    <input
                      name="amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* DATE */}
                  <div>
                    <input
                      name="date"
                      type="date"
                      placeholder="Date"
                      value={today}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      readOnly
                    />
                  </div>

                  {/* payment_Method */}
                  <div className="col-span-2">
                    <select
                      name="payment_Method"
                      type="text"
                      value={formData.payment_Method}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    >
                      <option value="" disabled>
                        Payment Method
                      </option>
                      {PaymentData?.slice(0, -1)?.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* NOtE */}
                  <div className="col-span-2">
                    <input
                      name="note"
                      type="text"
                      inputMode="text"
                      placeholder="Write Note"
                      value={formData.note}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  {transactionLoading ? (
                    <button
                      disabled
                      type="button"
                      class="text-white cursor-not-allowed border-gray-600 bg-gray-300 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-3 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700  inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        class="inline mr-3 w-4 h-4 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        ></path>
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Submit
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-0 active:text-indgrayigo-500"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* CONFIRMATION MODAL */}
      {confirmationModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg bg-white rounded-md shadow dark:bg-gray-700">
            <div className="flex items-center justify-center p-4 border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {transactionType === "Deposit" ? (
                  <span className="text-green-500 flex items-center justify-center gap-4">
                    Deposit <PiHandDeposit size={32} />
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center justify-center gap-4">
                    Withdraw <PiHandWithdraw size={32} />
                  </span>
                )}
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-center dark:text-gray-300">
                Are You Sure Want To Make a Transaction of{" "}
                <span className="font-semibold">{formData.amount}</span> ?
              </p>
            </div>
            <div className="flex justify-center p-2">
              <button
                onClick={closeConfirmationModal}
                className="px-4 py-2 text-sm rounded bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white mr-2"
              >
                Cancel
              </button>

              <button
                onClick={handleTransaction}
                className="px-4 py-2.5 text-sm rounded bg-green-500 dark:bg-gray-200 text-white dark:text-gray-800"
              >
                Confirm
              </button>
            </div>

            <div className="button_box absolute top-6 right-6">
              <button
                onClick={closeConfirmationModal}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* HISTORY MODALS */}
      {historyModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-6xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Accounts Statement
              </h3>
              {/*   CLOSE BUTTON */}
              <button
                onClick={closeHistoryModal}
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* ------------- BODY ------------- */}
            <div className="p-4 md:p-5">
              {/* SEARCH FILTERS */}
              <div className="flex items-center gap-3 justify-center mb-4">
                {/* DATES*/}

                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    From
                  </span>
                  <input
                    type="date"
                    name="dateFrom"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block pl-14 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={filters.dateFrom}
                    onChange={handleChangeFilters}
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    To
                  </span>
                  <input
                    type="date"
                    name="dateTo"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block pl-14 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={filters.dateTo}
                    onChange={handleChangeFilters}
                  />
                </div>

                {/* ACCOUNT */}
                <select
                  id="account"
                  name="account"
                  className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  value={filters.account}
                  onChange={handleChangeFilters}
                >
                  <option value="" disabled>
                    Select Account
                  </option>
                  {PaymentData?.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {/* TRANSACTION TYPE */}
                <select
                  id="transactionType"
                  name="transactionType"
                  className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  value={filters.transactionType}
                  onChange={handleChangeFilters}
                >
                  <option value="" disabled>
                    Transaction Type
                  </option>
                  <option value="Deposit">Deposit</option>
                  <option value="WithDraw">WithDraw</option>
                </select>
                {/* SEARCH BUTTON */}
                <button
                  onClick={handleFiltersSearch}
                  type="button"
                  className="flex items-center gap-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <CiSearch size={20} className="cursor-pointer" />
                  Search
                </button>
                {/* RESET BUTTON */}
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <GrPowerReset size={20} className="cursor-pointer" />
                  Reset
                </button>
              </div>
              {/* TABLE */}
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Date
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Transaction Type
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Amount
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Payment Method
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      New Balance
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Note
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="h-[60vh] scrollable-content overflow-y-auto">
                {transactionLoading ? (
                  <div className="min-h-screen flex justify-center items-center">
                    <div
                      className="animate-spin inline-block w-9 h-9 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                    <tbody>
                      {TransactionsHistory &&
                      TransactionsHistory?.data?.length > 0 ? (
                        TransactionsHistory?.data?.map((data, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b text-sm font-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          >
                            <td className=" px-6 py-3 text-center" scope="row">
                              {data?.date}
                            </td>
                            <td
                              className={`px-6 py-3 text-center ${
                                data?.transactionType === "Deposit"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {data?.transactionType}
                            </td>
                            <td className=" px-6 py-3 text-center">
                              {data?.amount}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {getPaymentMethodName(data?.payment_Method)}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {data?.new_balance}
                            </td>
                            <td className="px-6 py-3 text-xs text-center">
                              {data?.note}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="w-full flex justify-center items-center">
                          <td className="text-xl mt-3">No Data Available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {/* -------- PAGINATION -------- */}
            <section className="flex justify-center">
              <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-8 py-2 text-sm">
                  <li>
                    {TransactionsHistory?.page > 1 ? (
                      <Link
                        onClick={() => ToDown(page - 1)}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="w-2.5 h-2.5 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 1 1 5l4 4"
                          />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                        disabled
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="w-2.5 h-2.5 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 1 1 5l4 4"
                          />
                        </svg>
                      </button>
                    )}
                  </li>
                  {renderPaginationLinks()}
                  <li>
                    {TransactionsHistory?.totalPages !== page ? (
                      <Link
                        onClick={() => ToDown(page + 1)}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="w-2.5 h-2.5 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-not-allowed"
                        disabled
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="w-2.5 h-2.5 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                      </button>
                    )}
                  </li>
                </ul>
              </nav>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardStats;
