import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowUp, FaEye } from "react-icons/fa";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { useParams } from "react-router-dom";
import {
  addCheckAsync,
  deleteCheckAsync,
  getAllChecksForPartyAsync,
  markAsPaidCheckAsync,
  updateBuyerCheckWithNewAsync,
} from "../../features/BuyerSlice";
import { IoAdd } from "react-icons/io5";
import moment from "moment-timezone";
import { PaymentData } from "../../Utils/AccountsData";
import ConfirmationModal from "../../Component/Modal/ConfirmationModal";

const BuyersChecks = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [markAsPaidModal, setMarkAsPaidModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [category, setCategory] = useState("");
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const { checkLoading, BuyersChecks, getBuyersChecksLoading } = useSelector(
    (state) => state.Buyer
  );

  const [checkDetails, setCheckDetails] = useState({
    checkNumber: "",
    date: "",
    note: "",
    checkAmount: "",
    buyerId: id,
    checkId: "",
    id: "",
    payment_Method: "",
  });

  const handleCheckDetailsChange = (e) => {
    const { name, value } = e.target;
    setCheckDetails((prev) => ({
      ...prev,
      [name]: name === "checkAmount" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getAllChecksForPartyAsync({ buyerId: id }));
    }
  }, [dispatch, id]);

  const openModal = (data) => {
    setIsOpen(true);
    setCategory(data.category);
    document.body.style.overflow = "hidden";
    setCheckDetails((prev) => ({
      ...prev,
      checkId: data.id,
      date: today,
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setMarkAsPaidModal(false);
    document.body.style.overflow = "auto";
    setCheckDetails({
      checkNumber: "",
      note: "",
      checkAmount: "",
      checkId: "",
      payment_Method: "",
      buyerId: id,
    });
  };

  const handleAddCheck = (e) => {
    e.preventDefault();
    if (category === "UpdateCheck") {
      console.log("case 1");
      const updatedData = {
        ...checkDetails,
        id: BuyersChecks.id,
      };
      dispatch(updateBuyerCheckWithNewAsync(updatedData)).then((res) => {
        if (res.payload.success) {
          closeModal();
          dispatch(getAllChecksForPartyAsync({ buyerId: id }));
        }
      });
    } else {
      console.log("case 2");
      dispatch(addCheckAsync(checkDetails)).then((res) => {
        if (res.payload.success) {
          closeModal();
          dispatch(getAllChecksForPartyAsync({ buyerId: id }));
        }
      });
    }
  };

  const openPaidModal = (id) => {
    setMarkAsPaidModal(true);
    document.body.style.overflow = "hidden";
    setCheckDetails((prev) => ({
      ...prev,
      checkId: id,
      id: BuyersChecks.id,
      date: today,
    }));
  };

  const handleMarkAsPaid = (e) => {
    e.preventDefault();

    const data = {
      id: checkDetails.id,
      payment_Method: checkDetails.payment_Method,
      checkId: checkDetails.checkId,
      date: checkDetails.date,
    };
    dispatch(markAsPaidCheckAsync(data)).then((res) => {
      if (res.payload.success) {
        closeModal();
        dispatch(getAllChecksForPartyAsync({ buyerId: id }));
      }
    });
  };

  const handleDeleteCheck = (e) => {
    e.preventDefault();
    const data = {
      id: checkDetails.id,
      checkId: checkDetails.checkId,
    };
    dispatch(deleteCheckAsync(data)).then((res) => {
      if (res.payload.success) {
        closeConfirmationModal();
        dispatch(getAllChecksForPartyAsync({ buyerId: id }));
      }
    });
  };

  const openConfirmationModal = (id) => {
    document.body.style.overflow = "hidden";
    setCheckDetails((prev) => ({
      ...prev,
      checkId:id,
      id: BuyersChecks.id,
    }));
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    document.body.style.overflow = "auto";
    setConfirmationModal(false);
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Buyer Checks
          </h1>
          <div className="search_bar flex items-center gap-3 mr-2">
            <button
              onClick={openModal}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoAdd size={22} className="text-white" />
            </button>
          </div>
        </div>
        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABLE -------------- */}
        {getBuyersChecksLoading ? (
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
          <div className="relative overflow-x-auto mt-3 ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3 " scope="col">
                    Date
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Check Number
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Check Amount
                  </th>
                  <th className="px-6 py-3 text-center" scope="col">
                    Note
                  </th>
                  <th className="px-6 py-3 text-center" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {BuyersChecks && BuyersChecks?.checkDetails?.length > 0 ? (
                  BuyersChecks?.checkDetails
                    ?.slice()
                    .reverse()
                    .map((data, index, arr) => (
                      <React.Fragment>
                        <tr
                          key={index}
                          className={`${
                            data.paid ? "bg-green-500 text-white" : "bg-white"
                          } border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                        >
                          <th
                            className="px-6 py-4 font-medium text-sm"
                            scope="row"
                          >
                            {data?.newCheck && (
                              <span className="bg-red-500 mr-2 rounded-md text-white p-1">
                                New
                              </span>
                            )}
                            {data?.date}
                          </th>
                          <td className="px-6 py-4">{data?.checkNumber}</td>
                          <td className="px-6 py-4">{data?.checkAmount}</td>

                          <td className="px-6 py-4">{data?.note}</td>
                          <td className="pl-10 py-4 flex items-center gap-2">
                            {!data.updated ? (
                              data.paid ? (
                                <div className="text-center w-full">
                                  <span className=" text-white font-semibold">
                                    Check Cashed
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      openModal({
                                        id: data?.id,
                                        category: "UpdateCheck",
                                      })
                                    }
                                    className="cursor-pointer bg-blue-700 p-2 text-white rounded-md"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => openPaidModal(data?.id)}
                                    className="cursor-pointer bg-green-500 p-2 text-white rounded-md"
                                  >
                                    Mark paid
                                  </button>
                                  <button
                                    onClick={() =>
                                      openConfirmationModal(data?.id)
                                    }
                                    className="cursor-pointer text-red-500"
                                  >
                                    <MdOutlineDelete size={24} />
                                  </button>
                                </>
                              )
                            ) : (
                              <div className="text-center  w-full text-blue-700">
                                Updated
                              </div>
                            )}
                          </td>
                        </tr>
                        {index < arr.length - 1 && !data?.newCheck && (
                          <tr>
                            <td colSpan="5" className="text-center">
                              <div className="flex justify-center">
                                <FaArrowUp className="text-gray-500 mt-2" />
                              </div>
                            </td>
                          </tr>
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
      </section>
      {/* ADD CHECK MODAL */}
      {isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-lg max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              {/* ------------- HEADER ------------- */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Check Details
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
              <form onSubmit={handleAddCheck} className="p-4 md:p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
                  {/* DATE */}
                  <div>
                    <input
                      name="date"
                      type="text"
                      placeholder="Date"
                      value={checkDetails.date}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      readOnly
                    />
                  </div>

                  {/* CHECK AMOUNT */}
                  <div>
                    <input
                      name="checkAmount"
                      type="number"
                      placeholder="Check Amount"
                      onChange={handleCheckDetailsChange}
                      value={checkDetails.checkAmount}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* CHECK NUMBER */}
                <div>
                  <input
                    name="checkNumber"
                    type="text"
                    placeholder="Check Number"
                    onChange={handleCheckDetailsChange}
                    value={checkDetails.checkNumber}
                    className="bg-gray-50 mt-4 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                {/* NOTE */}
                <div>
                  <input
                    name="note"
                    type="text"
                    placeholder="Enter Note"
                    onChange={handleCheckDetailsChange}
                    value={checkDetails.note}
                    className="bg-gray-50 border mt-4 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    disabled={checkLoading}
                    type="submit"
                    className={`px-4 py-2.5 text-sm ${
                      checkLoading && "cursor-not-allowed bg-[#373636]"
                    } rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {/* MARK AS PAID MODAL */}
      {markAsPaidModal && (
        <>
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-sm max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              {/* ------------- HEADER ------------- */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Payment Method
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
              <form onSubmit={handleMarkAsPaid} className="p-4 md:p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-x-4">
                  {/* DATE */}
                  <div>
                    <input
                      name="date"
                      type="text"
                      placeholder="Date"
                      value={checkDetails.date}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      readOnly
                    />
                  </div>
                  {/* PAYMENT METHOD */}
                  <select
                    id="payment-method"
                    name="payment_Method"
                    className="bg-gray-50 border w-full border-red-500 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-red-500 block  p-2.5 dark:bg-gray-600 dark:border-red-500 dark:placeholder-gray-400 dark:text-white"
                    value={checkDetails?.payment_Method}
                    onChange={(e) =>
                      setCheckDetails({
                        ...checkDetails,
                        payment_Method: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Payment Method
                    </option>
                    {PaymentData?.map((item) => (
                      <option value={item.value} key={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-center mt-2">
                    <button
                      disabled={checkLoading}
                      type="submit"
                      className={`px-4 py-2.5 text-sm ${
                        checkLoading && "cursor-not-allowed bg-[#373636]"
                      } rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800`}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {/* CONFIRMATION MODAL */}
      {confirmationModal && (
        <ConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={handleDeleteCheck}
          message={"Are You Sure Want To Delete This Check"}
          title={"Delete Cheek"}
          updateStitchingLoading={checkLoading}
        />
      )}
    </>
  );
};

export default BuyersChecks;
