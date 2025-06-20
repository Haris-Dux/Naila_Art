import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { getBuyerForBranchAsync } from "../../features/BuyerSlice";

const PhoneComponent = ({ phone }) => {
  const maskPhoneNumber = (phone) => {
    if (phone.length > 3) {
      return phone.slice(0, 3) + "*******".slice(0, phone.length - 3);
    } else {
      return phone;
    }
  };

  return <p>{maskPhoneNumber(phone)}</p>;
};

const Buyers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState();
  const [validateOldBuyer, setValidateOldBuyer] = useState("");
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { user } = useSelector((state) => state.auth);
  const { Branches } = useSelector((state) => state.InStock);
  const { loading, Buyers } = useSelector((state) => state.Buyer);
  const [selectedBranchId, setSelectedBranchId] = useState();

  useEffect(() => {
    if (Branches?.length > 0) {
      const payload = {
        id: user?.user?.id,
        branchId: selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id,
        status: paymentStatus !== "All" ? paymentStatus : undefined,
        page,
      };
      dispatch(getBuyerForBranchAsync(payload));

      setSelectedBranchId(
        selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id
      );
    }
  }, [user, dispatch, Branches, page]);

  const filteredData = Buyers?.buyers;

  const renderPaginationLinks = () => {
    const totalPages = Buyers?.totalPages;
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
            to={`/dashboard/buyers?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() =>
              dispatch(
                getBuyerForBranchAsync({
                  id: user?.user?.id,
                  page: i,
                  branchId: selectedBranchId,
                })
              )
            }
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

  const searchTimerRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setValidateOldBuyer(value);

    const payload = {
      id: user?.user?.id,
      page: 1,
      search: value.length > 0 ? value : undefined,
      status: paymentStatus !== "All" ? paymentStatus : undefined,
      branchId: selectedBranchId,
    };

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (value.length > 0) {
      searchTimerRef.current = setTimeout(() => {
        dispatch(getBuyerForBranchAsync(payload));
      }, 1000);
    }
  };

  const handleStatusClick = (status) => {
    setPaymentStatus(status);

    const payload = {
      id: user?.user?.id,
      page: 1,
      status: status !== "All" ? status : null,
      branchId: selectedBranchId,
      search: validateOldBuyer.length > 0 ? validateOldBuyer : null,
    };

    dispatch(getBuyerForBranchAsync(payload));
    navigate(`/dashboard/buyers?page=${1}`);
  };

  const handleBranchClick = (branchId) => {
    const selectedBranch = branchId === "All" ? "" : branchId;
    setSelectedBranchId(selectedBranch);
    setPaymentStatus();
    setValidateOldBuyer("");

    const payload = {
      id: user?.user?.id,
      branchId: branchId,
      page: 1,
    };
    dispatch(getBuyerForBranchAsync(payload));
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "Partially Paid":
        return <span className="text-[#FFC107]">{status}</span>;
      case "Paid":
        return <span className="text-[#2ECC40]">{status}</span>;
      case "Unpaid":
        return <span className="text-red-700">{status}</span>;
      case "Advance Paid":
        return <span className="text-blue-700">{status}</span>;
      default:
        return "";
    }
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
                    to={`/dashboard/buyers?page=${1}`}
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
            Buyers
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
                value={validateOldBuyer}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABS -------------- */}
        <div className="tabs flex justify-between items-center my-5">
          <div className="tabs_button">
            <button
              onClick={() => handleStatusClick("All")}
              className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                paymentStatus === undefined || paymentStatus === "All"
                  ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                  : "dark:text-white"
              }`}
            >
              All
            </button>

            <button
              onClick={() => handleStatusClick("Paid")}
              className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                paymentStatus === "Paid"
                  ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                  : "dark:text-white"
              }`}
            >
              Paid
            </button>

            <button
              onClick={() => handleStatusClick("Unpaid")}
              className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                paymentStatus === "Unpaid"
                  ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                  : "dark:text-white"
              }`}
            >
              Unpaid
            </button>

            <button
              onClick={() => handleStatusClick("Partially Paid")}
              className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                paymentStatus === "Partially Paid"
                  ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                  : "dark:text-white"
              }`}
            >
              Partially Paid
            </button>

            <button
              onClick={() => handleStatusClick("Advance Paid")}
              className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                paymentStatus === "Advance Paid"
                  ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                  : "dark:text-white"
              }`}
            >
              Advance Paid
            </button>
          </div>
        </div>

        {/* -------------- TABLE -------------- */}

        <div className="relative overflow-x-auto mt-5 ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  <span className="text-red-500">S.N</span>-
                  <span className="text-green-600">A.S.N</span>
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Party Name
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  City
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Credit
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Debit
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Balance
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Status
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Details
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  New Bill
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={8}>
                    <div className="min-h-[50vh] flex justify-center items-center">
                      <div
                        className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                        role="status"
                        aria-label="loading"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-6 py-4  font-medium">
                        <span className="text-red-500">
                          {" "}
                          {data.serialNumber}
                        </span>
                        -<span className="text-green-600">{data.autoSN}</span>
                      </td>
                      <th
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        <p>{data.name}</p>
                        <PhoneComponent phone={data.phone} />
                      </th>
                      <td className="px-6 py-4 font-medium">{data.city}</td>
                      <td className="px-6 py-4 font-medium">
                        {data.virtual_account.total_credit} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.virtual_account.total_debit} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.virtual_account.total_balance} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {setStatusColor(data.virtual_account.status)}
                      </td>
                      <td className="pl-10 py-4">
                        <Link
                          onClick={() => window.scrollTo(0, 0)}
                          to={`/dashboard/buyers-details/${data.id}`}
                        >
                          <FaEye size={20} className="cursor-pointer" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <Link
                          to={`/dashboard/old-buyer-generate-bill/${data.id}`}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          <TfiWrite className="cursor-pointer" size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="w-full flex justify-center items-center">
                    <td className="text-xl mt-3">No Data Available</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </section>

      {/* -------- PAGINATION -------- */}
      {Buyers?.totalPages && Buyers?.totalPages !== 1 ? (
        <section className="flex justify-center">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
              <li>
                {Buyers?.page > 1 ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/buyers?page=${page - 1}`}
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
                {Buyers?.totalPages !== page ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/buyers?page=${page + 1}`}
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

export default Buyers;
