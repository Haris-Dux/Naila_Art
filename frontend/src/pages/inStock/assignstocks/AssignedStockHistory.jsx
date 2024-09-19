import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  AllBranchStockHistoryAsync,
  GetAllBranches,
} from "../../../features/InStockSlice";

const AssignedStockHistory = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [search, setSearch] = useState();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { Suit, StockHistoryLoading, StockHistory, Branches } = useSelector(
    (state) => state.InStock
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.user?.id) {
      dispatch(GetAllBranches({ id: user?.user?.id })).then((response) => {
        if (response?.payload?.length > 0) {
          const initialBranchId = response.payload[0]?.id;
          setSelectedBranch(initialBranchId);
        }
      });
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (Branches.length > 0 && selectedBranch) {
      dispatch(
        AllBranchStockHistoryAsync({ id: selectedBranch, search, page })
      );
    }
  }, [page, dispatch, Branches, selectedBranch]);

  const renderPaginationLinks = () => {
    const totalPages = StockHistory?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/AssignedStockHistory?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => dispatch(AllBranchStockHistoryAsync({ page: i }))}
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const ToDown = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const payload = {
      id: selectedBranch,
      page: 1,
      search: value ,
    };

    dispatch(AllBranchStockHistoryAsync(payload));
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);

    // check
    if (branch) {
      dispatch(AllBranchStockHistoryAsync({ id: branch, search, page: 1 }));
    } else if (search) {
      dispatch(AllBranchStockHistoryAsync({ id: branch, search, page: 1 }));
    } else {
      dispatch(AllBranchStockHistoryAsync({ id: branch, page: 1 }));
    }
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow-400 ";
      case "Received":
        return "green-500";
      case "Returned":
        return "red-500 ";
      default:
        return "gray-400";
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Branch Stock History
          </h1>

          {/* <!-- search bar --> */}
          <div className="search_bar mr-2 flex justify-center items-center gap-x-3">
            <div className="relative mt-4 md:mt-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-5 h-5 text-gray-800 dark:text-gray-200"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>

              <input
                type="text"
                className="md:w-64 lg:w-72 py-2 pl-10 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
                placeholder="Search by Design No"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        <p className="w-full bg-gray-300 h-px mt-5"></p>
        {/* -------------- TABS -------------- */}
        {StockHistoryLoading ? (
          <div className="pt-16 flex justify-center mt-12 items-center">
            <div
              className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="tabs my-5">
              <div className="tabs_button flex justify-start items-center flex-wrap gap-4">
                {Branches?.map((branch) => (
                  <Link
                    key={branch.id}
                    className={`border border-gray-500 dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 text-sm rounded-md ${
                      selectedBranch === branch.id
                        ? "bg-[#252525] text-white dark:bg-white dark:text-black"
                        : ""
                    }`}
                    onClick={() => handleBranchClick(branch.id)}
                    to={`/dashboard/AssignedStockHistory?page=${1}`}
                  >
                    {branch.branchName}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative overflow-x-auto mt-5 ">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      D # No
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Category
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Colors
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Quantity
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Cost Price
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Sales Price
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {StockHistory && StockHistory?.data?.length > 0 ? (
                    StockHistory?.data?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <th className="px-6 py-4  font-medium" scope="row">
                          {data.d_no}
                        </th>
                        <td className="px-6 py-4">{data.category}</td>
                        <td className="px-6 py-4">{data.color}</td>
                        <td className="px-6 py-4">{data.quantity}</td>
                        <td className="px-6 py-4">{data.cost_price}</td>
                        <td className="px-6 py-4">{data.sale_price}</td>
                        <td className="px-6 py-4">{data.date}</td>
                        <td
                          className={`px-6 py-4 text-${setStatusColor(
                            data.stock_status
                          )}`}
                        >
                          {data.stock_status}
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
            </div>
          </>
        )}
        
      </section>

      {/* -------- PAGINATION -------- */}
      <section className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {StockHistory?.page > 1 ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/AssignedStockHistory?page=${page - 1}`}
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
              {StockHistory?.totalPages !== page ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/AssignedStockHistory?page=${page + 1}`}
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
    </>
  );
};

export default AssignedStockHistory;
