import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCashBookEntriesAsync } from "../../features/CashBookSlice";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import moment from "moment-timezone";

const CashBook = () => {
  const dispatch = useDispatch();
  const { loading, cashBookData } = useSelector((state) => state.CashBook);
  const { PaymentData } = useSelector((state) => state.PaymentMethods);
   const { user } = useSelector((state) => state.auth);
    const { Branches } = useSelector((state) => state.InStock);

  const today = moment().tz("Asia/Karachi").format("YYYY-MM-DD");

  const [filters, setFilters] = useState({
    dateFrom: today,
    dateTo: "",
    transactionType: "",
    account: "",
    branchId:""
  });

  useEffect(() => {
    dispatch(getAllCashBookEntriesAsync(filters));
  }, [dispatch]);

  const handleChangeFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFiltersSearch = () => {
    dispatch(getAllCashBookEntriesAsync(filters));
  };

  const handleResetFilters = () => {
    const updatedFilters = {
      dateFrom: today,
      dateTo: "",
      transactionType: "",
      payment_Method: "",
      account: "",
      branchId:""
    };
  
    setFilters(updatedFilters);
    dispatch(getAllCashBookEntriesAsync(updatedFilters));
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[80vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Cash Book
          </h1>

          {/* SEARCH FILTERS */}
          <div className="flex items-center gap-3 justify-center mb-2">
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



            {user && user?.user?.role === "superadmin" ? (
                   
                      <select
                        id="branchId"
                        name='branchId'
                        value={filters.branchId}
                        onChange={handleChangeFilters}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      >
                        <option value="">Select Branch</option>
                        {Branches?.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.branchName}
                          </option>
                        ))}
                      </select>

                  ) : null}


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
        </div>

        {/* -------------- TABLE -------------- */}

        <>
          <div className="relative overflow-x-auto mt-5 ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Time
                  </th>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Transaction From
                  </th>
                  <th
                    className="px-6 py-3  font-medium text-center"
                    scope="col"
                  >
                    Transaction Type
                  </th>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-center font-medium" scope="col">
                    Amount
                  </th>
                </tr>
              </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7">
                        <div className="flex justify-center items-center py-10">
                          <div
                            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full"
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : cashBookData && cashBookData?.length > 0 ? (
                    cashBookData?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <td className="px-6 text-center py-4">
                          {data.transactionTime}
                        </td>
                        <td className="px-6 text-center py-4">
                          {data?.currentDate } {data?.pastDate}
                        </td>
                        <td className="px-6 text-center py-4">
                          {data?.branchId?.branchName}
                        </td>
                        <td className="px-6 text-center py-4">
                          {data.partyName}
                        </td>
                        <td className="px-6  text-center py-4">
                          {data?.transactionFrom}
                        </td>
                        <td
                          className={`px-6 text-center py-4 ${
                            data.tranSactionType === "Deposit"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {data.tranSactionType}
                        </td>
                        <td className="px-6 text-center py-4">
                          {data.payment_Method}
                        </td>
                        <td className="px-6 text-center py-4">{data.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="w-full flex justify-center items-center">
                      <td className="text-xl mt-3">
                        No Data Available.
                      </td>
                    </tr>
                  )}
                </tbody>
            
            </table>
          </div>
        </>
      </section>
    </>
  );
};

export default CashBook;
