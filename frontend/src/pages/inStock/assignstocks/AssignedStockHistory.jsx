import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  AllBranchStockHistoryAsync
} from "../../../features/InStockSlice";

const AssignedStockHistory = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { StockHistoryLoading, StockHistory, Branches } = useSelector(
    (state) => state.InStock
  );

  useEffect(() => {
        const initialBranchId = Branches[0]?.id;
        setSelectedBranch(initialBranchId);
        dispatch(
        AllBranchStockHistoryAsync({ branchId: initialBranchId, page })
      );
  }, [Branches]);

  useEffect(() => {
    if (Branches.length > 0 && selectedBranch) {
      dispatch(
        AllBranchStockHistoryAsync({ branchId: selectedBranch, page })
      );
    }
  }, [page,dispatch, Branches]);

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

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
      dispatch(AllBranchStockHistoryAsync({ branchId: branch, page: 1 }));
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow-400 ";
      case "Approved":
        return "green-500";
      case "Rejected":
        return "red-500 ";
      default:
        return "gray-400";
    }
  };

  const getALLBundlesQuantity = (data) => {
    const rawData = data?.bundles || []
    const allBundlesQuantitySum = rawData?.reduce((acc,record) => {
      let totalSum = 0
      const flatData = record.flat();
      flatData.forEach((item) => {
        totalSum += item.quantity
      })
      acc.allBundlesQuantitySum += totalSum;
    return acc;

    },{   
      allBundlesQuantitySum:0
    });
    return allBundlesQuantitySum
  };


  const getSingleBundlesQuantity = (data) => {
    const singleBundleQuantitySum = data?.reduce((acc,record) => {
      let totalSum = 0
        totalSum += record.quantity
      acc.singleBundleQuantitySum += totalSum;
    return acc;

    },{   
      singleBundleQuantitySum:0
    });
    return singleBundleQuantitySum
  };


  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Branch Stock History
          </h1>
        </div>
        <p className="w-full bg-gray-300 h-px mt-5"></p>
        {/* -------------- TABS -------------- */}

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
                  </tr>
                </thead>
                <tbody>
                  {StockHistory?.data?.length > 0 ? (
                    StockHistory.data.map((dataGroup, i) => (
                      <React.Fragment key={`group-${i}`}>
                        <tr className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold">
                          <td colSpan={8} className="px-6 py-4">
                             Total Quantity: {getALLBundlesQuantity(dataGroup)?.allBundlesQuantitySum}  | Issue Date: {dataGroup.issueDate} | Updated Date:{" "}
                            {dataGroup.updatedOn} | Status:{" "}
                            <span
                              className={`text-${setStatusColor(
                                dataGroup.bundleStatus
                              )}`}
                            >
                              {dataGroup.bundleStatus}
                            </span>{" "}
                            {`| Note: ${dataGroup.note}`}
                          </td>
                        </tr>

                        {dataGroup.bundles?.map((bundleArray, bundleIndex) => (
                          <React.Fragment key={`bundle-${i}-${bundleIndex}`}>
                            {/* Bundle Index Row */}
                            <tr className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white font-semibold">
                              <td colSpan={8} className="px-6 py-3">
                                Bundle {bundleIndex + 1} | Quantity : ({getSingleBundlesQuantity(bundleArray)?.singleBundleQuantitySum})
                              </td>
                            </tr>

                            {bundleArray.map((item, itemIndex) => (
                              <tr
                                key={`item-${i}-${bundleIndex}-${itemIndex}`}
                                className="bg-white border-b text-md font-medium dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                              >
                                <th
                                  className="px-6 py-4 font-medium"
                                  scope="row"
                                >
                                  {item.d_no}
                                </th>
                                <td className="px-6 py-4">{item.category}</td>
                                <td className="px-6 py-4">{item.color}</td>
                                <td className="px-6 py-4">{item?.quantity}</td>
                                <td className="px-6 py-4">{item.cost_price}</td>
                                <td className="px-6 py-4">{item.sale_price}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr className="w-full flex justify-center items-center">
                      <td className="text-xl mt-3">No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
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
