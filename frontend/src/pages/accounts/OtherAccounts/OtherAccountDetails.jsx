import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { PiHandDeposit, PiHandWithdraw } from "react-icons/pi";
import { MdOutlineDelete } from "react-icons/md";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import {
  creditDebitOtherAccountAsync,
  delteOtherAccountTransactionAsync,
  getOtherAccountDataByIdAsync,
} from "../../../features/OtherAccountsSlice";

const OtherAccountsDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { OtherAccount, loading } = useSelector((state) => state.OtherAccounts);
  const { Branches } = useSelector((state) => state.InStock);
  const { PaymentData } = useSelector((state) => state.PaymentMethods);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [afterConfirmation, setAfterConfirmation] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    particular: "",
    amount: "",
    type: "credit",
    payment_Method: "",
    branchId: "",
    reason: "",
  });

  useEffect(() => {
    dispatch(getOtherAccountDataByIdAsync({ id }));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      accountId: id,
      date: formData.date,
      reason: formData.reason,
      payment_Method: formData.payment_Method,
      branchId: formData.branchId,
      amount: formData.amount,
      transactionType: formData.type,
    };

    dispatch(creditDebitOtherAccountAsync(data)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        dispatch(getOtherAccountDataByIdAsync({ id }));
        setFormData({
          reason: "",
          amount: "",
          type: "credit",
          payment_Method: "",
          branchId: "",
          date: "",
        });
      }
    });
  };

  const openModal = (type) => {
    setFormData((prevData) => ({ ...prevData, type }));
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData("");
    document.body.style.overflow = "auto";
  };

  const handleDeleteTransaction = (data) => {
    setIsConfirmationOpen(true);
    const deleteTransaction = () => {
      const reqData = {
        id:data
      };
      dispatch(delteOtherAccountTransactionAsync(reqData)).then((res) => {
        if (res.payload.success === true) {
          dispatch(getOtherAccountDataByIdAsync({ id }));
          closeConfirmationModal();
        }
      });
    };
    setAfterConfirmation(() => deleteTransaction);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    setAfterConfirmation(null);
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="px-2 py-2 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-3 text-gray-900 dark:text-gray-100">
          <div className="box">
            <h3 className="pb-1 font-medium">Name</h3>
            <h3>{OtherAccount?.accountDetails?.name}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Phone Number</h3>
            <h3>{OtherAccount?.accountDetails?.phone}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">City</h3>
            <h3 className="">{OtherAccount?.accountDetails?.city}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Balance</h3>
            <h3>{OtherAccount?.accountDetails?.total_balance}</h3>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        <div className="tabs flex justify-start items-center gap-3 my-5">
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={() => openModal("debit")}
          >
            <div className="flex items-center gap-2">
              {" "}
              <PiHandDeposit />
              Debit
            </div>
          </button>
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={() => openModal("credit")}
          >
            <div className="flex items-center gap-2">
              <PiHandWithdraw />
              Credit
            </div>
          </button>
        </div>

        {loading.getById ? (
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
          <div className="relative overflow-x-auto mt-5">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Payment Method
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
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  ></th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {OtherAccount?.transactions?.length > 0 ? (
                  OtherAccount?.transactions
                    ?.slice()
                    .reverse()
                    .map((data, index) => (
                      <tr
                        key={index}
                        className={`${
                          data.reversed
                            ? "bg-red-500 text-white"
                            : "bg-white text-black"
                        } border-b text-md font-semibold dark:border-gray-700`}
                      >
                        <th className="px-6 py-4 font-medium " scope="row">
                          <p>{data.date}</p>
                        </th>
                        <td className="px-6 py-4 font-medium">{data.reason}</td>
                        <td className="px-6 py-4 font-medium">
                          {data.payment_Method}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.credit === 0 ? "-" : data.credit}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.debit === 0 ? "-" : data.debit}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.balance === 0 ? "-" : data.balance}
                        </td>

                        <td className=" px-6 py-4">
                          <MdOutlineDelete
                            onClick={() => handleDeleteTransaction(data.id)}
                            size={20}
                            className="cursor-pointer  text-red-500"
                          />
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

        {/* CREDIT DEBIT MODAL */}
        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-96 max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formData.type === "credit" ? "Credit" : "Debit"}
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

              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Reason"
                      name="reason"
                      id="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Amount"
                      name="amount"
                      id="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <select
                    id="payment-method"
                    name="payment_Method"
                    className="bg-gray-50 border w-full text-gray-900 text-sm rounded-md focus:ring-0 border-gray-300 focus:border-gray-300 block  p-2.5 dark:bg-gray-600 dark:border-red-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.payment_Method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                  <select
                    id="branches"
                    name="branchId"
                    className="bg-gray-50 border border-gray-300 w-full text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.branchId || ""}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Branch
                    </option>
                    {Branches?.map((branch) => (
                      <option key={branch?.id} value={branch?.id}>
                        {branch?.branchName}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-center pt-2">
                    <button
                      disabled={loading.creditDebit}
                      type="submit"
                      className={`inline-block rounded ${
                        loading.creditDebit && "cursor-not-allowed"
                      } border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500`}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* REVERSE SALARY CONFIRMATION */}
        {isConfirmationOpen && (
          <ConfirmationModal
            onClose={closeConfirmationModal}
            onConfirm={afterConfirmation}
            message={"Are You Sure Want to delete this transaction ?"}
            title={"Delete Transaction"}
            updateStitchingLoading={loading.delete}
          />
        )}
      </section>
    </>
  );
};

export default OtherAccountsDetails;
