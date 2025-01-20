import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBranches } from "../../features/InStockSlice";
import { useSearchParams, Link } from "react-router-dom";
import { getReturnBillNoRecordAsync } from "../../features/BuyerSlice";

const W_R_R_Bills = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { user } = useSelector((state) => state.auth);
  const { loading: branchesLoading, Branches } = useSelector(
    (state) => state.InStock
  );
  const { getReturnBillLoading, returnBillsNoRecord } = useSelector(
    (state) => state.Buyer
  );
  const [selectedBranchId, setSelectedBranchId] = useState();

  useEffect(() => {
    if (user?.user?.id) {
      dispatch(GetAllBranches({ id: user?.user?.id }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (Branches?.length > 0) {
      const payload = {
        id: selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id,
        page,
      };
      dispatch(getReturnBillNoRecordAsync(payload));

      setSelectedBranchId(
        selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id
      );
    }
  }, [user, dispatch, Branches, page]);

  const renderPaginationLinks = () => {
    const totalPages = returnBillsNoRecord?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/return-Bills-No-Record?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() =>
              dispatch(
                getReturnBillNoRecordAsync({
                  id: selectedBranchId,
                  page: i,
                })
              )
            }
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

  const handleBranchClick = (branchId) => {
    const selectedBranch = branchId === "All" ? "" : branchId;
    setSelectedBranchId(selectedBranch);
    setSearch("");

    const payload = {
      id: branchId,
      page: 1,
    };
    dispatch(getReturnBillNoRecordAsync(payload));
  };

  const searchTimerRef = useRef();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const payload = {
      id: selectedBranchId,
      search: value.length > 0 ? value : undefined,
    };
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      dispatch(getReturnBillNoRecordAsync(payload));
    }, 1000);
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* UPPER TABS */}
        <div className="mb-3 upper_tabs flex justify-start items-center">
          <div className="tabs_button">
            {/* CHECK ONLY SUPERADMIN CAN SEE ALL */}
            {user?.user?.role === "superadmin" ? (
              <>
                {Branches?.map((branch) => (
                  <Link
                    to={`/dashboard/return-Bills-No-Record?page=${1}`}
                    key={branch?.id}
                    className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                      selectedBranchId === branch?.id
                        ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                        : "dark:text-white"
                    }`}
                    onClick={() => handleBranchClick(branch?.id)}
                  >
                    {branch?.branchName}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {/* THIS SHOWS TO ADMIN & USER */}
                {Branches?.map((branch) => (
                  <button
                    className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md cursor-default ${
                      user?.user?.branchId === branch?.id
                        ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                        : ""
                    }`}
                  >
                    {branch?.branchName}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Buyer Return Bills (No Record)
          </h1>

          {/* <!-- search bar --> */}
          <div className="search_bar flex items-center gap-3 mr-2">
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
                placeholder="Search by name"
                value={search}
                onChange={(e) => handleSearch(e)}
              />
            </div>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABLE -------------- */}

        {getReturnBillLoading || branchesLoading ? (
          <div className="min-h-[90vh] flex justify-center items-center">
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
            <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-2 text-base py-2" scope="col">
                    Sr.
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Party Name
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Amount
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Phone
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Quantity
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Category
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Color
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {returnBillsNoRecord &&
                returnBillsNoRecord?.data?.length > 0 ? (
                  returnBillsNoRecord?.data?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-2 py-2">{index + 1}</td>
                      <td className="px-2 py-2">{data.name}</td>
                      <td className="px-2 py-2">{data.cash} Rs</td>
                      <td className="px-2 py-2">{data.phone}</td>
                      <td className="px-2 py-2">{data.quantity}</td>
                      <td className="px-2 py-2">{data.category}</td>
                      <td className="px-2 py-2">{data.color}</td>
                      <td className="px-2 py-2 max-w-[200px]">{data.note}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="w-full flex justify-center items-center">
                    <td className="text-sm mt-3">No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* -------- PAGINATION -------- */}
      {returnBillsNoRecord?.totalPages &&
      returnBillsNoRecord?.totalPages !== 1 ? (
        <section className="flex justify-center">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
              <li>
                {returnBillsNoRecord?.page > 1 ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/return-Bills-No-Record?page=${page - 1}`}
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
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 dark:bg-gray-700 dark:text-gray-400 rounded-s-lg cursor-not-allowed"
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
                {returnBillsNoRecord?.totalPages !== page ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/return-Bills-No-Record?page=${page + 1}`}
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
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-700 dark:text-gray-400 rounded-e-lg cursor-not-allowed"
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
    </>
  );
};

export default W_R_R_Bills;
