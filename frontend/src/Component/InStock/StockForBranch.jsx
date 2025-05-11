import React, { useState, useEffect } from "react";
import "./Stock.css";
import {
  GetAllStockForBranch,
  approveOrRejectStock,
  getPendingStockForBranchAsync,
} from "../../features/InStockSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
const StockForBranch = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [userSelectedCategory, setuserSelectedCategory] = useState("");
  const [confirmationModal, setconfirmationModal] = useState(false);
  const [rejectModal, setrejectModal] = useState(false);
  const [record, setRecord] = useState(false);
  const [search, setSearch] = useState();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const {
    suitStocks,
    GetSuitloading,
    SuitLoading,
    stockLoading,
    pendingStock,
  } = useSelector((state) => state.InStock);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      GetAllStockForBranch({
        category: userSelectedCategory,
        search,
        page,
      })
    );
    dispatch(getPendingStockForBranchAsync());
  }, [page, dispatch]);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const openConfirmationModal = (record) => {
    setconfirmationModal(true);
    setRecord(record);
    document.body.style.overflow = "hidden";
  };

  const closeConfirmationModal = () => {
    setconfirmationModal(false);
    document.body.style.overflow = "auto";
  };

  const openRejectModal = (record) => {
    setrejectModal(true);
    setRecord(record);
    document.body.style.overflow = "hidden";
  };

  const closeRejectModal = () => {
    setrejectModal(false);
    document.body.style.overflow = "auto";
  };

  const renderPaginationLinks = () => {
    const totalPages = suitStocks?.totalPages;
    const paginationLinks = [];
    const visiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (startPage > 1) {
      paginationLinks.push(
        <li key="start-ellipsis" className="text-black my-auto">
          .....
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/suits?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
          >
            {i}
          </Link>
        </li>
      );
    }

    if (endPage < totalPages) {
      paginationLinks.push(
        <li key="end-ellipsis" className="text-black my-auto">
          .....
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
      category: userSelectedCategory,
      page: 1,
      search: value || undefined,
      id: user?.user?.branchId,
    };

    dispatch(GetAllStockForBranch(payload));
  };

  const handleCategoryClick = (category) => {
    const selectedCategory = category === "all" ? "" : category;
    setuserSelectedCategory(selectedCategory);

    // check
    if (category === "all") {
      dispatch(GetAllStockForBranch({ search, page: 1 }));
    } else if (search) {
      dispatch(
        GetAllStockForBranch({
          category,
          search,
          page: 1,
        })
      );
    } else {
      dispatch(GetAllStockForBranch({ category, page: 1 }));
    }
  };

  const handleAccept = () => {
    const stockId = record;
    const payload = {
      stockId,
      status: "Approved",
    };

    dispatch(approveOrRejectStock(payload))
      .then((res) => {
        if (res.payload.success === true) {
          closeModal();
          closeConfirmationModal();
    dispatch(getPendingStockForBranchAsync());

          dispatch(
            GetAllStockForBranch({
              category: userSelectedCategory,
              search,
              page,
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error processing stock:", error);
      });
  };

  const handleReject = () => {
    const stockId = record;
    const payload = {
      stockId,
      status: "Rejected",
    };

    dispatch(approveOrRejectStock(payload))
      .then((res) => {
        if (res.payload.success === true) {
          closeModal();
          closeRejectModal();
    dispatch(getPendingStockForBranchAsync());

          dispatch(
            GetAllStockForBranch({
              category: userSelectedCategory,
              search,
              page,
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error processing stock:", error);
      });
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow-400 ";
      case "Approved":
        return "green-500";
      case "Returned":
        return "red-500 ";
      default:
        return "gray-400";
    }
  };

  let notificationCount = pendingStock?.length;

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Suits
          </h1>

          {/* <!-- search bar --> */}
          <div className="search_bar mr-2 flex justify-center items-center gap-x-5">
            <div className="relative inline-block">
              <button
                onClick={openModal}
                className="relative rounded-sm border border-gray-700 bg-gray-600 p-1.5 text-white hover:bg-gray-700 hover:text-gray-100 focus:ring-0"
              >
                New Stock
                {notificationCount > 0 && (
                  <span className="absolute top-[-9px] inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-500 border-2 border-white rounded-full animate-blink">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

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
        <div className="tabs my-5">
          <div className="tabs_button flex justify-start items-center flex-wrap gap-4">
            <Link
              to={`/dashboard/suits?page=${1}`}
              className={`border border-gray-500 px-5 py-2 text-sm rounded-md ${
                userSelectedCategory === ""
                  ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                  : ""
              }`}
              onClick={() => handleCategoryClick("all")}
            >
              All
            </Link>
            {suitStocks?.categoryNames?.map((category) => (
              <Link
                key={category}
                className={`border border-gray-500 dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 text-sm rounded-md ${
                  userSelectedCategory === category
                    ? "bg-[#252525] text-white dark:bg-white dark:text-black"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category)}
                to={`/dashboard/suits?page=${1}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* -------------- TABLE -------------- */}
        {GetSuitloading ? (
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
                  <th className="px-6 text-center py-3" scope="col">
                    D # No
                  </th>
                  <th className="px-6 text-center py-3" scope="col">
                    Category
                  </th>
                  <th className="px-6 text-center py-3" scope="col">
                    Colors
                  </th>
                  <th className="px-6 text-center py-3" scope="col">
                    Total Quantity
                  </th>
                  <th className="px-6 text-center py-3" scope="col">
                    Sold Quantity
                  </th>
                  <th className="px-6 text-center py-3" scope="col">
                    Cost Prices
                  </th>
                  <th className="px-6 text-center py-3" scope="col">
                    Sales Prices
                  </th>
                  <th className="px-6 py-4 text-center text-md" scope="col">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {suitStocks && suitStocks?.data?.length > 0 ? (
                  suitStocks?.data?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <th
                        className="px-6 text-center py-4 font-medium"
                        scope="row"
                      >
                        {data.d_no}
                      </th>
                      <td className="px-6 text-center py-4">{data.category}</td>
                      <td className="px-6 text-center py-4">{data.color}</td>
                      <td className="px-6 text-center py-4">
                        {data.total_quantity}
                      </td>
                      <td className="px-6 text-center py-4">
                        {data.sold_quantity}
                      </td>

                      <td className="px-6 text-center py-4">
                        {data.cost_price}
                      </td>
                      <td className="px-6 text-center py-4">
                        {data.sale_price}
                      </td>
                      <td className="px-6 text-center py-4">
                        {data.lastUpdated}
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
        )}
      </section>
      {/* -------- PAGINATION -------- */}
      {suitStocks?.totalPages && suitStocks?.totalPages !== 1 ? (
        <section className="flex justify-center">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
              <li>
                {suitStocks?.page > 1 ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/suits?page=${page - 1}`}
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
                {suitStocks?.totalPages !== page ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/suits?page=${page + 1}`}
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
      ) : null}
      {/* ---------- PENDING STOCK MODALS ------------ */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative scrollable-content py-4 px-3 w-full max-w-6xl h-[80vh] bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pending Stock
              </h3>
              <button
                onClick={closeModal}
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
            {SuitLoading ? (
              <div className="pt-4 flex justify-center mt-12 items-center">
                <div
                  className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="p-2 md:p-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-6 text-center py-3">Category</th>
                      <th className="px-6 text-center py-3">Color</th>
                      <th className="px-6 text-center py-3">Quantity</th>
                      <th className="px-6 text-center py-3">Cost Price</th>
                      <th className="px-6 text-center py-3">Sale Price</th>
                      <th className="px-6 text-center py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingStock?.length > 0 ? (
                      pendingStock.map((dataGroup, i) => (
                        <React.Fragment key={`group-${i}`}>
                          <tr className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold">
                            <td colSpan={8} className="px-6 py-4">
                              Issue Date: {dataGroup.issueDate} | Status:{" "}
                              <span
                                className={`text-${setStatusColor(
                                  dataGroup.bundleStatus
                                )}`}
                              >
                                {dataGroup.bundleStatus}
                              </span>{" "}
                              {`| Note: ${dataGroup.note}`}
                              <span className="mx-10">
                                   <button
                                        onClick={() =>
                                          openConfirmationModal(dataGroup.id)
                                        }
                                        className="text-green-500 hover:bg-green-100 rounded-lg p-2"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => openRejectModal(dataGroup.id)}
                                        className="text-red-500 hover:bg-red-100 rounded-lg p-2 ml-2"
                                      >
                                        Reject
                                      </button>
                              </span>
                            
                            </td>
                          
                          </tr>

                          {dataGroup.bundles?.map(
                            (bundleArray, bundleIndex) => (
                              <React.Fragment
                                key={`bundle-${i}-${bundleIndex}`}
                              >
                                {/* Bundle Index Row */}
                                <tr className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white font-semibold">
                                  <td colSpan={8} className="px-6 py-3">
                                    Bundle {bundleIndex + 1}
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
                                    <td className="px-6 py-4">
                                      {item.category}
                                    </td>
                                    <td className="px-6 py-4">{item.color}</td>
                                    <td className="px-6 py-4">
                                      {item.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                      {item.cost_price}
                                    </td>
                                    <td className="px-6 py-4">
                                      {item.sale_price}
                                    </td>
                                    
                                  </tr>
                                ))}
                              </React.Fragment>
                            )
                          )}
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
          </div>
        </div>
      )}
      ;{/* ----------  APPROVE MODAL ------------ */}
      {confirmationModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg bg-white rounded-md shadow dark:bg-gray-700">
            <div className="flex items-center justify-center p-4 border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-green-600 dark:text-white">
                ACCEPT STOCK
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-center dark:text-gray-300">
                Are you sure you want to proceed with this? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-center p-2">
              {stockLoading ? (
                <button
                  disabled
                  className="px-4 py-2.5 cursor-not-allowed text-sm rounded bg-green-300 dark:bg-gray-200 text-white dark:text-gray-800"
                >
                  Approve
                </button>
              ) : (
                <button
                  onClick={handleAccept}
                  className="px-4 py-2.5 text-sm rounded bg-green-600 dark:bg-gray-200 text-white dark:text-gray-800"
                >
                  Approve
                </button>
              )}
            </div>

            <div className="button_box absolute top-6 right-6">
              <button
                onClick={closeConfirmationModal}
                className="text-red-500 hover:bg-gray-200 hover:text-red-500 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
      {/* ----------  REJECT MODAL ------------ */}
      {rejectModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg bg-white rounded-md shadow dark:bg-gray-700">
            <div className="flex items-center justify-center p-4 border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-red-500 dark:text-white">
                REJECT STOCK
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-center dark:text-gray-300">
                Are you sure you want to proceed with this? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-center p-2">
              {stockLoading ? (
                <button
                  disabled
                  className="px-4 py-2.5 cursor-not-allowed text-sm rounded bg-red-300 dark:bg-gray-200 text-white dark:text-gray-800"
                >
                  Reject
                </button>
              ) : (
                <button
                  onClick={handleReject}
                  className="px-4 py-2.5 text-sm rounded bg-red-500 dark:bg-gray-200 text-white dark:text-gray-800"
                >
                  Reject
                </button>
              )}
            </div>

            <div className="button_box absolute top-6 right-6">
              <button
                onClick={closeRejectModal}
                className="text-red-500 hover:bg-gray-200 hover:text-red-500 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
    </>
  );
};

export default StockForBranch;
