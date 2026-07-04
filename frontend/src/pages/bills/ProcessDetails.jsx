import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  applyClaimAccountAsync,
  deletePicturesBillOrderAsync,
  deleteProcessBillAndOrderAsync,
  GetPicturesBillByIdAsync,
  GetProcessBillByIdAsync,
  temporaryAccountUpdateAsync,
} from "../../features/ProcessBillSlice";
import { FaEye } from "react-icons/fa";
import {
  MdOutlineDelete,
} from "react-icons/md";
import DeleteModal from "../../Component/Modal/DeleteModal";

import PicturesOrder from "./Modals/PicturesOrder";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import Icon from "../../Component/Common/Icons";
import AccountFilters, {
  emptyAccountFilters,
  FilteredAccountTotals,
} from "../../Component/AccountFilters/Accountfilters";

const hasDateFilters = (filters) => Boolean(filters.dateFrom || filters.dateTo);

const getDateOnlyTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getDateRange = ({ dateFrom, dateTo }) => {
  const from = getDateOnlyTime(dateFrom);
  const to = getDateOnlyTime(dateTo);

  if (from && to) {
    return {
      from: Math.min(from, to),
      to: Math.max(from, to),
    };
  }

  if (from || to) {
    const date = from || to;
    return { from: date, to: date };
  }

  return null;
};

const filterTransactionsByDate = (transactions = [], filters) => {
  const range = getDateRange(filters);
  if (!range) return transactions;

  return transactions.filter((transaction) => {
    const transactionDate = getDateOnlyTime(transaction.date);
    return (
      transactionDate !== null &&
      transactionDate >= range.from &&
      transactionDate <= range.to
    );
  });
};

const calculateTransactionTotals = (transactions = []) =>
  transactions.reduce(
    (totals, transaction) => ({
      debit: totals.debit + Number(transaction.debit || 0),
      credit: totals.credit + Number(transaction.credit || 0),
    }),
    { debit: 0, credit: 0 },
  );

const ProcessDetails = () => {
  const dispatch = useDispatch();
  const { id, category } = useParams();
  const [deleteModal, setDeleteModal] = useState(false);
  const [processClaimModal, setprocessClaimModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [picturesOrderModal, setpicturesOrderModal] = useState(false);
  const { loading, ProcessBillsDetails, deleteLoadings, discountLoading, accountUpdateLoading } =
    useSelector((state) => state.ProcessBill);

    //TEMPORAY
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({
      accountId: "",
      totalDebit: "",
      totalCredit: "",
      totalBalance: "",
      category: "process",
    });
    const [filters, setFilters] = useState(emptyAccountFilters);
    const [appliedFilters, setAppliedFilters] = useState(emptyAccountFilters);

    useEffect(() => {
  if (accountUpdateLoading) {
    document.body.style.cursor = "wait";
  } else {
    document.body.style.cursor = "default";
  }

  return () => {
    document.body.style.cursor = "default";
  };
}, [accountUpdateLoading]);

//

  useEffect(() => {
    if (id && category === "Pictures") {
      dispatch(GetPicturesBillByIdAsync({ id }));
    } else if (id) {
      dispatch(GetProcessBillByIdAsync({ id }));
    }
  }, [dispatch, id]);

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSelectedId(id);
  };

  const closedeleteModal = () => {
    setDeleteModal(false);
  };

  const handleDelete = () => {
    if (category === "Pictures") {
      dispatch(deletePicturesBillOrderAsync({ id: selectedId })).then((res) => {
        if (res.payload.success === true) {
          dispatch(GetPicturesBillByIdAsync({ id }));
          closedeleteModal();
        }
      });
    } else {
      dispatch(
        deleteProcessBillAndOrderAsync({
          id: selectedId,
          process_Category: category,
        })
      ).then((res) => {
        if (res.payload.success === true) {
          dispatch(GetProcessBillByIdAsync({ id }));
          closedeleteModal();
        }
      });
    }
  };


  const viewPicturesOrderData = (value) => {
    setpicturesOrderModal(true);
    setSelectedId(value);
  };

  const hidePicturesOrderData = () => {
    setpicturesOrderModal(false);
  };

  let category_path = "";
  switch (true) {
    case category === "Embroidery":
      category_path = "embroidery-details";
      break;
    case category === "Calender":
      category_path = "calendar-details";
      break;
    case category === "Cutting":
      category_path = "cutting-details";
      break;
    case category === "Stone":
      category_path = "stones-details";
      break;
    case category === "Stitching":
      category_path = "stitching-details";
      break;
  }


  const closeDiscountModal = () => {
    setprocessClaimModal(false);
    setClaimData({
      claimAmount: "",
      claimReason: "",
    });
  };

  const [claimData, setClaimData] = useState({
    claimAmount: "",
    claimReason: "",
    claimCategory: "",
  });

  const openClaimProcessModal = (category) => {
    setprocessClaimModal(true);
    setClaimData((prev) => ({
      ...prev,
      claimCategory: category,
    }));
  };

  const handleClaimDataChange = (e) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({
      ...prev,
      [name]: name === "claimAmount" ? parseInt(value) : value,
    }));
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    const modelCategory = category === "Pictures" ? "Pictures" : "Process";
    const data = {
      id: id,
      amount: claimData.claimAmount,
      category: modelCategory,
      note: claimData.claimReason,
      claimCategory: claimData.claimCategory,
    };
    dispatch(applyClaimAccountAsync(data)).then((res) => {
      if (res.payload.success === true) {
        if (category === "Pictures") {
          dispatch(GetPicturesBillByIdAsync({ id }));
        } else {
          dispatch(GetProcessBillByIdAsync({ id }));
        }
      }
      closeDiscountModal();
    });
  };

  const handleAccountUpdate = () => {
    const updatedData = {
      ...editFormData,
      accountId:ProcessBillsDetails.id
    };
    dispatch(temporaryAccountUpdateAsync(updatedData)).then((res) => {
     if(res.payload.success) {
         if (id && category === "Pictures") {
      dispatch(GetPicturesBillByIdAsync({ id }));
    } else if (id) {
      dispatch(GetProcessBillByIdAsync({ id }));
    }
    setIsEditMode(false);
    setEditFormData({
      accountId: "",
      totalDebit: "",
      totalCredit: "",
      totalBalance: "",
      category: "process",
    })
     }
    })
  }

  const transactions = ProcessBillsDetails?.credit_debit_history || [];
  const filteredTransactions = filterTransactionsByDate(
    transactions,
    appliedFilters,
  );
  const filteredTotals = calculateTransactionTotals(filteredTransactions);
  const isFilterApplied = hasDateFilters(appliedFilters);

  const handleFiltersSearch = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters(emptyAccountFilters);
    setAppliedFilters(emptyAccountFilters);
  };

  return (
    <>
      
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-5 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
        {/* PROCESS DETAILS */}
        <div className="px-2 py-2 mb-3 grid border-2 mx-auto max-w-3xl text-center rounded-lg grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-4 text-gray-900 dark:text-gray-100">
          <div className="box">
            <h3 className="pb-1 font-medium">Party Name</h3>
            <h3>{ProcessBillsDetails?.partyName}</h3>
                <div className="flex items-center justify-center gap-4">
                                 {!isEditMode && <Icon name="edit" className="cursor-pointer" size={20} onClick={() => setIsEditMode(true)}/>}

               {isEditMode && <Icon name="cross" className="cursor-pointer" size={20} onClick={() => setIsEditMode(false)}/>}
               {isEditMode && <Icon name="tick" className="cursor-pointer" size={20} onClick={handleAccountUpdate}/>}
               </div>
          </div>
         {isEditMode ? 
         
     <>
      <div className="box relative">
        <h3 className="pb-1 font-medium flex items-center justify-center gap-2">
          Total Debit
        </h3>
        <input
          type="number"
          placeholder="Enter debit"
          className="w-full px-2 py-1 border rounded"
          onChange={(e) =>
    setEditFormData((prev) => ({
      ...prev,
      totalDebit: e.target.value,
    }))
  }
        />
      </div>

      <div className="box relative">
        <h3 className="pb-1 font-medium flex items-center justify-center gap-2">
          Total Credit
        </h3>
        <input
          type="number"
          placeholder="Enter credit"
          className="w-full px-2 py-1 border rounded"
          onChange={(e) =>
    setEditFormData((prev) => ({
      ...prev,
      totalCredit: e.target.value,
    }))
  }
        />
      </div>

      <div className="box relative">
        <h3 className="pb-1 font-medium flex items-center justify-center gap-2">
          Total Balance
        </h3>
        <input
          type="number"
          placeholder="Enter balance"
          className="w-full px-2 py-1 border rounded"
         onChange={(e) =>
    setEditFormData((prev) => ({
      ...prev,
      totalBalance: e.target.value,
    }))
  }
        />
      </div>
    </>
         
         
         : <> <div className="box">
            <h3 className="pb-1 font-medium text-red-500">Total Debit</h3>
            <h3 className="font-medium text-red-500">
              {ProcessBillsDetails?.virtual_account?.total_debit === null || ProcessBillsDetails?.virtual_account?.total_debit === undefined
                ? "0"
                : ProcessBillsDetails?.virtual_account?.total_debit}
            </h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Total Credit</h3>
            <h3>
              {ProcessBillsDetails?.virtual_account?.total_credit === null || ProcessBillsDetails?.virtual_account?.total_credit === undefined
                ? "0"
                : ProcessBillsDetails?.virtual_account?.total_credit}
            </h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Total Balance</h3>
            <h3>
              {ProcessBillsDetails?.virtual_account?.total_balance === null
                ? "0"
                : ProcessBillsDetails?.virtual_account?.total_balance}
            </h3>
          </div> </>}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-center">
          <div className="flex flex-wrap items-center gap-3">
 
            <button
              onClick={() => openClaimProcessModal("Calim In")}
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            >
              <div className="flex items-center justify-center gap-2">
                <CiLogout />
                Claim Out
              </div>
            </button>
            <button
              onClick={() => openClaimProcessModal("Claim Out")}
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            >
              <div className="flex items-center justify-center gap-2">
                <CiLogin />
                Claim In
              </div>
            </button>
          </div>

          <div className="ml-auto flex flex-wrap justify-end gap-3">
          <FilteredAccountTotals
            show={isFilterApplied}
            debit={filteredTotals.debit}
            credit={filteredTotals.credit}
            count={filteredTransactions.length}
          />
          <AccountFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleFiltersSearch}
            onReset={handleResetFilters}
          />
        </div>
      </div>

        {/* -------------- TABLE -------------- */}
        {loading ? (
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
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                    Date
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                    Particular
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                    Credit
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                    Debit
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                    Balance
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions?.length > 0 ? (
                  filteredTransactions
                    ?.slice()
                    .reverse()
                    .map((data, index) => (
                      <tr
                        key={index}
                        className={`border-b ${data.orderId === "claim_entry" ? "bg-red-500 text-white": "bg-white text-black"} text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      >
                        <th
                          className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium whitespace-nowrap dark:text-white text-xs md:text-sm"
                          scope="row"
                        >
                          <p>{data.date}</p>
                        </th>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.particular}
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.credit === 0 || data.credit === null
                            ? "-"
                            : data.credit}
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.debit === 0 || data.debit === null
                            ? "-"
                            : data.debit}
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.balance === 0 || data.balance === null
                            ? "-"
                            : data.balance}
                        </td>
                        {data.orderId && data.orderId !== "" ? (
                          <td className="pl-4 md:pl-6 lg:pl-10 py-2 md:py-3 lg:py-4 flex items-center  gap-3">
                            {category === "Pictures" ? (
                              <button
                                onClick={() =>
                                  viewPicturesOrderData(data?.orderId)
                                }
                              >
                                <FaEye size={20} className="cursor-pointer" />
                              </button>
                            ) : (
                              <Link
                                to={`/dashboard/${category_path}/${data.orderId}`}
                              >
                                <FaEye size={20} className="cursor-pointer" />
                              </Link>
                            )}

                            <button
                              onClick={() => openDeleteModal(data.orderId)}
                            >
                              <MdOutlineDelete
                                size={20}
                                className="cursor-pointer text-red-500"
                              />
                            </button>
                          </td>
                        ) : (
                          <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">--</td>
                        )}
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

      {deleteModal && (
        <DeleteModal
          title={"Delete Bill And Order"}
          message={"Are you sure want to delete this Bill and Order ?"}
          onClose={closedeleteModal}
          Loading={deleteLoadings}
          onConfirm={handleDelete}
        />
      )}

      {picturesOrderModal && (
        <PicturesOrder id={selectedId} closeModal={hidePicturesOrderData} />
      )}


      {processClaimModal && (
        <>
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-[95%] max-w-sm max-h-[90vh] overflow-y-auto bg-white rounded-md shadow dark:bg-gray-700">
              {/* ------------- HEADER ------------- */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Claim Entry details
                </h3>
                <button
                  onClick={closeDiscountModal}
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
                <form onSubmit={handleClaimSubmit}>
                  <div className="grid grid-cols-1 lg:gap-4">
                    {/* Claim AMount */}
                    <input
                      name="claimAmount"
                      type="number"
                      placeholder="Claim Amount"
                      value={claimData.claimAmount}
                      onChange={handleClaimDataChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />

                    {/* Claim Reason */}
                    <input
                      name="claimReason"
                      type="text"
                      placeholder="Claim Reason"
                      value={claimData.claimReason}
                      onChange={handleClaimDataChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex justify-center mt-6">
                    {discountLoading ? (
                      <button
                        disabled
                        type="button"
                        class="text-white cursor-not-allowed border-gray-600 bg-gray-600  focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700  inline-flex items-center"
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
                        Loading...
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
        </>
      )}
    </>
  );
};

export default ProcessDetails;
