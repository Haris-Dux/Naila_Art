import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { getAllReturnsForBranch } from "../../features/ReturnSlice";
import Pagination from "../../Component/Common/Pagination";
import { buildPaginationQuery, getPageLimit } from "../../Utils/Common";

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

const ReturnBills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState();
  const [suitSaleData, setSuitSaleData] = useState("");
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);

  const { user } = useSelector((state) => state.auth);
  const { loading: branchesLoading, Branches } = useSelector(
    (state) => state.InStock
  );
  const { Returnloading, ReturnsBillHistory } = useSelector(
    (state) => state.Return
  );

  const [selectedBranchId, setSelectedBranchId] = useState();


  useEffect(() => {
    if (Branches?.length > 0) {
      const payload = {
        id: selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id,
        page,
        limit,
      };
      dispatch(getAllReturnsForBranch(payload));

      setSelectedBranchId(
        selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id
      );
    }
  }, [user, dispatch, Branches, page, limit]);

 

  const handleBranchClick = (branchId) => {
    const selectedBranch = branchId === "All" ? "" : branchId;
    setSelectedBranchId(selectedBranch);
    setSearch("");

    const payload = {
      id: branchId,
      page: 1,
      limit,
    };
    dispatch(getAllReturnsForBranch(payload));
  };

  const openModal = (data) => {
    setSuitSaleData(data);
    setIsOpen(true);
  };
  const closeModal = () => {
    setSuitSaleData("");
    setIsOpen(false);
  };

  const searchTimerRef = useRef();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const payload = {
      id: selectedBranchId,
      page: 1,
      limit,
      search: value.length > 0 ? value : undefined,
    };
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    if (value.length > 0) {
      searchTimerRef.current = setTimeout(() => {
        dispatch(getAllReturnsForBranch(payload));
      }, 1000);
    } else {
      dispatch(getAllReturnsForBranch(payload));
    }
    navigate(`/dashboard/naila-arts-return-bills${buildPaginationQuery(searchParams, { page: 1, limit })}`);
  };

  return (
    <>
      {Returnloading || branchesLoading ? (
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
        <>
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
            {/* UPPER TABS */}
            <div className="mb-3 upper_tabs flex justify-start items-center">
              <div className="tabs_button flex flex-wrap gap-1">
                {/* CHECK ONLY SUPERADMIN CAN SEE ALL */}
                {user?.user?.role === "superadmin" ? (
                  <>
                    {Branches?.map((branch) => (
                      <Link
                        to={`/dashboard/naila-arts-return-bills${buildPaginationQuery(searchParams, { page: 1, limit })}`}
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
            <div className="header flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-6 mx-2">
              <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl lg:text-3xl font-medium">
               Return Bills
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

            <div className="relative overflow-x-auto mt-5 ">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                      <span className="text-red-500">S.N</span>                    
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                      Party Name
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                    T Return Amount
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                    Amount From Balance
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                    Amount From TotalCash
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                      Date
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-xs md:text-sm font-medium" scope="col">
                      Suit Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ReturnsBillHistory &&
                  ReturnsBillHistory?.data?.length > 0 ? (
                    ReturnsBillHistory?.data?.slice()?.reverse()?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center font-medium text-xs md:text-sm">
                          <span className="text-red-500">
                            {data.serialNumber}
                          </span>
                        </td>
                        <th
                          className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white text-xs md:text-sm"
                          scope="row"
                        >
                          <p>{data.partyName}</p>
                          <PhoneComponent phone={data.phone} />
                        </th>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center font-medium text-xs md:text-sm">
                          {data.T_Return_Amount} Rs
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center font-medium text-xs md:text-sm">
                          {data.Amount_From_Balance} Rs
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center font-medium text-xs md:text-sm">
                          {data.Amount_From_TotalCash ?? "0"} Rs
                        </td>
                       
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center font-medium text-xs md:text-sm">{data.date}</td>
                        <td className="pl-4 md:pl-6 lg:pl-10 py-2 md:py-3 lg:py-4 text-center">
                          <button onClick={() => openModal(data.suits_data)}>
                            <FaEye size={20} className="cursor-pointer" />
                          </button>
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
          </section>

          <Pagination
            currentPage={page}
            totalPages={ReturnsBillHistory?.totalPages}
            totalRecords={ReturnsBillHistory?.totalRecords}
            pageSize={limit}
          />
        </>
      )}
      ;
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Suit History
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
            <div className="p-4 md:p-5">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className=" px-6 py-3 text-center" scope="col">
                      D # No
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Category
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Color
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Quantity
                    </th>
                  
                  </tr>
                </thead>
              </table>
              <div className="scrollable-content h-[50vh] overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    {suitSaleData?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <td className=" px-6 py-3 text-center">{data?.d_no}</td>
                        <td className=" px-6 py-3 text-center">
                          {data?.category}
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-center text-xs md:text-sm">{data?.color}</td>
                        <td className=" px-6 py-3 text-center">
                          {data?.quantity}
                        </td>
                      
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
     
    </>
  );
};

export default ReturnBills;
