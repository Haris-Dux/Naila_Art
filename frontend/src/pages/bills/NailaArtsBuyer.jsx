import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";
import {
  deleteBuyerBillAsync,
  getBuyerBillsHistoryForBranchAsync,
  getBuyerByIdAsync,
} from "../../features/BuyerSlice";
import Return from "./Modals/Return";
import { IoDocumentTextOutline } from "react-icons/io5";
import Icon from "../../Component/Common/Icons";
import DeleteModal from "../../Component/Modal/DeleteModal";

const NailaArtsBuyer = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [otherBillModal, setOthebillNodal] = useState(false);
  const [returnModal, setreturnModal] = useState(false);
  const [selected, setselected] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [search, setSearch] = useState();
  const [suitSaleData, setSuitSaleData] = useState("");
  const [otherBillData, setOtherBillData] = useState("");

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { user } = useSelector((state) => state.auth);
  const { loading: branchesLoading, Branches } = useSelector(
    (state) => state.InStock
  );
  const { BuyerBillHistory, billHistoryLoading, BuyerById, deleteBillLoading } = useSelector(
    (state) => state.Buyer
  );
  const [selectedBranchId, setSelectedBranchId] = useState();


  useEffect(() => {
    if (selected) {
      dispatch(getBuyerByIdAsync({ id: selected?.buyerId }));
    }
  }, [selected]);

  useEffect(() => {
    if (Branches?.length > 0) {
      const payload = {
        id: selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id,
        page,
      };
      dispatch(getBuyerBillsHistoryForBranchAsync(payload));

      setSelectedBranchId(
        selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id
      );
    }
  }, [user, dispatch, Branches, page]);

  const renderPaginationLinks = () => {
    const totalPages = BuyerBillHistory?.totalPages;
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
               to={`/dashboard/naila-arts-buyer?page=${i}`}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
                i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
              }`}
              onClick={() =>
                dispatch(
                  getBuyerBillsHistoryForBranchAsync({
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

  const handleBranchClick = (branchId) => {
    const selectedBranch = branchId === "All" ? "" : branchId;
    setSelectedBranchId(selectedBranch);
    setSearch("");

    const payload = {
      id: branchId,
      page: 1,
    };
    dispatch(getBuyerBillsHistoryForBranchAsync(payload));
  };

  const openModal = (data) => {
    setSuitSaleData(data);
    setIsOpen(true);
  };

  const openOtheBillMOdal = (data) => {
    setOtherBillData(data);
    setOthebillNodal(true);
  };

  const closeModal = () => {
    setSuitSaleData("");
    setOtherBillData("");
    setIsOpen(false);
    setOthebillNodal(false);
  };

  const openReturnModal = (data) => {
    setselected(data);
    setreturnModal(true);
    document.body.style.overflow = "hidden";
  };
  const closeReturnModal = () => {
    setselected("");
    setreturnModal(false);
    document.body.style.overflow = "auto";
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
    if (value.length > 0) {
      searchTimerRef.current = setTimeout(() => {
        dispatch(getBuyerBillsHistoryForBranchAsync(payload));
      }, 1000);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setToDelete(id);
    document.body.style.overflow = "hidden";
  };
  
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setToDelete(null);
    document.body.style.overflow = "auto";
  };

  const handleDeleteBill = () => {
    dispatch(deleteBuyerBillAsync(toDelete)).then((res) => {
      if(res.payload.success){
        const payload = {
        id: selectedBranchId
          ? selectedBranchId
          : user?.user?.branchId || Branches[0].id,
        page,
      };
      closeDeleteModal();
      dispatch(getBuyerBillsHistoryForBranchAsync(payload));
      }
    })
  }

  return (
    <>
      {billHistoryLoading || branchesLoading ? (
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
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
            {/* UPPER TABS */}
            <div className="mb-3 upper_tabs flex justify-start items-center">
              <div className="tabs_button">
                {/* CHECK ONLY SUPERADMIN CAN SEE ALL */}
                {user?.user?.role === "superadmin" ? (
                  <>
                    {Branches?.map((branch) => (
                      <Link
                        to={`/dashboard/naila-arts-buyer?page=${1}`}
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
                Buyers Bills
              </h1>

              {/* <!-- search bar --> */}
              <div className="search_bar flex items-center gap-3 mr-2">
                <Link
                  className=" bg-[#374151] hover:bg-gray-500 text-white px-3 py-2 rounded-md"
                  to={"/dashboard/naila-arts-return-bills"}
                >
                  Return Bills
                </Link>
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
                     Method
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Total
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Paid
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Remaining
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Profit
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Details
                    </th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BuyerBillHistory && BuyerBillHistory?.data?.length > 0 ? (
                    BuyerBillHistory?.data?.map((data, index) => (
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
                          className="px-6 py-4 font-medium text-gray-900"
                         
                        >
                          <p>{data.name}</p>
                          {data.phone} 
                        </th>
                          <td className="px-6 py-4 font-medium">
                          {data.city ?? "--"} 
                        </td>
                          <td className="px-6 py-4 font-medium">
                          {data.payment_Method ?? "--"} 
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.total} Rs
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.paid} Rs
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.remaining} Rs
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.TotalProfit} Rs
                        </td>
                        <td className="px-6 py-4 font-medium">{data.date}</td>
                        <td className="pl-10 py-4 flex gap-2">
                          <button
                            onClick={() =>
                              openModal(data?.profitDataForHistory)
                            }
                          >
                            <FaEye size={20} className="cursor-pointer mt-2" />
                          </button>
                          {data?.other_Bill_Data && (
                            <button
                              onClick={() =>
                                openOtheBillMOdal(data?.other_Bill_Data)
                              }
                            >
                              <IoDocumentTextOutline
                                size={20}
                                className="cursor-pointer"
                              />
                            </button>
                          )}
                        </td>
                        <td className="pl-10 py-4">
                          <button onClick={() => openReturnModal(data)}>
                            <FaEdit size={20} className="cursor-pointer" />
                          </button>
                         {data?.canDelete && <button onClick={() => openDeleteModal(data.id)}>
                           <Icon name="delete" size={20}/>
                          </button>}
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

          {/* -------- PAGINATION -------- */}
          <section className="flex justify-center">
            <nav aria-label="Page navigation example">
              <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                <li>
                  {BuyerBillHistory?.page > 1 ? (
                    <Link
                      onClick={ToDown}
                      to={`/dashboard/naila-arts-buyer?page=${page - 1}`}
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
                  {BuyerBillHistory?.totalPages !== page ? (
                    <Link
                      onClick={ToDown}
                      to={`/dashboard/naila-arts-buyer?page=${page + 1}`}
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
        </>
      )}
      {/* Suit Histoty Modal */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-4xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
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
                    <th className=" px-6 py-3 text-center" scope="col">
                      Sale Price
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="scrollable-content h-[50vh] overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
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
                        <td className="px-6 py-3 text-center">{data?.color}</td>
                        <td className=" px-6 py-3 text-center">
                          {data?.quantity}
                        </td>
                        <td className=" px-6 py-3 text-center">
                          {data?.suitSalePrice}
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

      {/* OTHE BILL DETAILS MODAL */}
      {otherBillModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-xl  bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Other Bill Details
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Quantity
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Amount
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Note
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="scrollable-content  overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                  <tbody>
                    <tr className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <td className=" px-6 py-3 text-center">
                        {otherBillData?.o_b_quantity}
                      </td>
                      <td className=" px-6 py-3 text-center">
                        {otherBillData?.o_b_amount}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {otherBillData?.o_b_note}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Return Bill Modal  */}
      {returnModal && (
        <Return
          closeModal={closeReturnModal}
          Buyerdata={BuyerById}
          selected={selected}
        />
      )}

      {/* Delete Confiramtion Modal */}
      {deleteModal && <DeleteModal
      onClose={closeDeleteModal}
      onConfirm={handleDeleteBill}
      message={"Are you sure want to delete this bill ?"}
      title={"Delete Bill"}
      Loading={deleteBillLoading}
      />}
    </>
  );
};

export default NailaArtsBuyer;
