import React, { useState, useEffect, useRef } from "react";
import { CeateExpenseAsync } from "../../../features/PurchaseBillsSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetAllExpense } from "../../../features/InStockSlice";
import moment from "moment-timezone";


const ExpenseModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { Branches } = useSelector((state) => state.InStock);
  const { expenseLoading } = useSelector((state) => state.PurchaseBills);
  const today = moment.tz("Asia/karachi").format("YYYY-MM-DD");


  // State variables to hold form data
  const [formData, setFormData] = useState({
    branchId: user?.user?.branchId || "",
    name: "",
    rate: "",
    Date: today,
    reason: "",
    serial_no: "",
    payment_Method: "",
  });

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle branch selection
  const handleBranchChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      branchId: e.target.value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const modifiedFormData = {
      ...formData,
      rate: Number(formData.rate),
      serial_no: Number(formData.serial_no),
    }

    dispatch(CeateExpenseAsync(modifiedFormData)).then((res) => {
      if (res.payload.success === true) {
        dispatch(GetAllExpense({ page: 1 }));
        setFormData({
          branchId: "",
          name: "",
          rate: "",
          Date: today,
          reason: "",
          serial_no: "",
          payment_Method: "",
        });
        closeModal();
      }
    });
  };

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Expense
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
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
                  {/* NAME */}
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* RATE */}
                  <div>
                    <input
                      name="rate"
                      type="number"
                      placeholder="Rate"
                      value={formData.rate}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* DATE */}
                  <div>
                    <input
                      name="Date"
                      type="text"
                      placeholder="Date"
                      value={today}
                      // onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* SERIAL NO */}
                  <div>
                    <input
                      name="serial_no"
                      type="text"
                      placeholder="Serial No"
                      value={formData.serial_no}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* REASON */}
                  <div className="col-span-2">
                    <input
                      name="reason"
                      type="text"
                      placeholder="Reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {user?.user?.role === "superadmin" ? (
                    <div className="col-span-2">
                      <select
                        id="payment-method"
                        name="payment_Method"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={formData.payment_Method}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            payment_Method: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Payment Method
                        </option>
                        <option value="cashInMeezanBank">Meezan Bank</option>
                        <option value="cashInJazzCash">Jazz Cash</option>
                        <option value="cashInEasyPaisa">EasyPaisa</option>
                        <option value="cashSale">Cash Sale</option>
                      </select>
                    </div>
                  ) : null}

                  {user?.user?.role === "superadmin" 
                     ? (
                    <div className="col-span-2">
                      <select
                        id="branches"
                        value={formData.branchId}
                        onChange={handleBranchChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      >
                        <option value="">Choose Branch</option>
                        {Branches?.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.branchName}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-center mt-6">
                  {expenseLoading ? (
                     <button
                     disabled
                     className="inline-block rounded border border-gray-600 bg-gray-400 cursor-not-allowed px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                   >
                     Submit
                   </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseModal;
