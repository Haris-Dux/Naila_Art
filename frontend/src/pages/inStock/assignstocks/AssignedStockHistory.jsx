import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  AllBranchStockHistoryAsync
} from "../../../features/InStockSlice";
import Pagination from "../../../Component/Common/Pagination";
import { buildPaginationQuery, getPageLimit } from "../../../Utils/Common";

const AssignedStockHistory = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);

  const { StockHistoryLoading, StockHistory, Branches } = useSelector(
    (state) => state.InStock
  );

  useEffect(() => {
    if (Branches.length > 0 && !selectedBranch) {
      setSelectedBranch(Branches[0]?.id);
    }
  }, [Branches, selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      dispatch(
        AllBranchStockHistoryAsync({ branchId: selectedBranch, page, limit })
      );
    }
  }, [dispatch, selectedBranch, page, limit]);



  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
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
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl lg:text-3xl font-medium">
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
                  to={`/dashboard/AssignedStockHistory${buildPaginationQuery(searchParams, { page: 1, limit })}`}
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
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      D # No
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Category
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Colors
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Quantity
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Cost Price
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Sales Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {StockHistory?.data?.length > 0 ? (
                    StockHistory.data.map((dataGroup, i) => (
                      <React.Fragment key={`group-${i}`}>
                        <tr className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold">
                          <td colSpan={8} className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">
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
                              <td colSpan={8} className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm">
                                Bundle {bundleIndex + 1} | Quantity : ({getSingleBundlesQuantity(bundleArray)?.singleBundleQuantitySum})
                              </td>
                            </tr>

                            {bundleArray.map((item, itemIndex) => (
                              <tr
                                key={`item-${i}-${bundleIndex}-${itemIndex}`}
                                className="bg-white border-b text-md font-medium dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                              >
                                <th
                                  className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm"
                                  scope="row"
                                >
                                  {item.d_no}
                                </th>
                                <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{item.category}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{item.color}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{item?.quantity}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{item.cost_price}</td>
                                <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{item.sale_price}</td>
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

      <Pagination
        currentPage={page}
        totalPages={StockHistory?.totalPages}
        totalRecords={StockHistory?.totalRecords}
        pageSize={limit}
      />
    </>
  );
};

export default AssignedStockHistory;
