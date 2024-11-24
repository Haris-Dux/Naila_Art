import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddOldSellerDetailsFromAsync,
  AddSellerDetailsFromAsync,
  getAllPurchasingHistoryAsync,
} from "../../../features/SellerSlice";
import { useSearchParams } from "react-router-dom";
import moment from "moment-timezone";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const LaceModal = ({ isOpen, closeModal, sellerDetails }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const initialRow = { roleQuantity: "", measurement: "" };
  const [measurementData, setMeasurementData] = useState({
    rowData: [initialRow],
  });
  const { addSellerLoading } = useSelector((state) => state.Seller);

  // State variables to hold form data
  const [formData, setFormData] = useState({
    bill_no: "",
    date: today,
    name: "",
    phone: "",
    category: "",
    quantity: "",
    rate: "",
    total: "",
    subTotal: "",
    discountType: "RS",
    discount: "",
    seller_stock_category: "Lace",
  });

  useEffect(() => {
    if (!isOpen) {
      resetFormData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (sellerDetails) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: sellerDetails.name || "",
        phone: sellerDetails.phone || "",
      }));
    }
  }, [sellerDetails]);

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const modifiedFormData = {
      ...formData,
      total: Number(formData.total),
      rate: Number(formData.rate),
      quantity: Number(formData.quantity),
      bill_no: Number(formData.bill_no),
      seller_stock_category: "Lace",
    };

    if (sellerDetails && sellerDetails?.id) {
      modifiedFormData.sellerId = sellerDetails?.id;
    }

    if (
      modifiedFormData.quantity === 0 ||
      modifiedFormData.subTotal === 0 ||
      modifiedFormData.total === 0
    ) {
      return toast.error("Please Fill all required fields");
    }

    if (sellerDetails) {
      dispatch(AddOldSellerDetailsFromAsync(modifiedFormData)).then((res) => {
        if (res.payload.success === true) {
          dispatch(getAllPurchasingHistoryAsync({ category: "Lace", page }));
          resetFormData();
          closeModal();
          setMeasurementData({ rowData: [initialRow]})
        }
      });
    } else {
      dispatch(AddSellerDetailsFromAsync(modifiedFormData)).then((res) => {
        if (res.payload.success === true) {
          dispatch(getAllPurchasingHistoryAsync({ category: "Lace", page }));
          resetFormData();
          closeModal();
          setMeasurementData({ rowData: [initialRow]})
        }
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      bill_no: "",
      date: today,
      name: "",
      phone: "",
      category: "",
      quantity: "",
      rate: "",
      total: "",
      subTotal: "",
      discountType: "RS",
      discount: "",
      seller_stock_category: "",
    });
  };

  const validateValue = (value) => {
    return value === undefined || value === null || isNaN(value) || value === ""
      ? 0
      : parseInt(value);
  };

  useEffect(() => {
    const updatedsubtotal =
      validateValue(formData.quantity) * validateValue(formData.rate);
    const discount =
      formData.discountType === "%"
        ? (updatedsubtotal * validateValue(formData.discount)) / 100 || 0
        : validateValue(formData.discount) || 0;
    const total = updatedsubtotal - discount;
    setFormData((prevState) => ({
      ...prevState,
      subTotal: updatedsubtotal,
      total: total,
    }));
  }, [
    formData.quantity,
    formData.rate,
    formData.discount,
    formData.discountType,
  ]);


  const handleMeasurementChange = (e, index) => {
    const { name, value } = e.target;
    setMeasurementData((prev) => {
      const updatedRows = [...prev.rowData];
      updatedRows[index] = { ...updatedRows[index], [name]: parseInt(value) };
      calulateTotalQuantity(updatedRows);
      return { ...prev, rowData: updatedRows };
    });
  };

  const addRow = () => {
    setMeasurementData((prev) => ({
      ...prev,
      rowData: [...prev.rowData, initialRow],
    }));
  };

  const deleteRow = (index) => {
    setMeasurementData((prev) => {
      let updatedRows = [...prev.rowData];
      updatedRows = updatedRows.filter((_, i) => i !== index);
      calulateTotalQuantity(updatedRows);
      return { ...prev, rowData: updatedRows };
    });
  };

  const calulateTotalQuantity = (updatedRows) => {
    const totalQuantity = updatedRows.reduce((total, row) => {
      return (
        total + validateValue(row.roleQuantity) * validateValue(row.measurement)
      );
    }, 0);
    console.log("totalQuantity", totalQuantity);
    setFormData((prev) => ({
      ...prev,
      quantity: totalQuantity,
    }));
  };

  const setAccountStatusColor = (status) => {
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
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative  scrollable-content max-h-[80vh]  py-4 px-3 w-full max-w-5xl bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Lace
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

            {/* ACCOUNT DATA */}
            <>
              {sellerDetails && sellerDetails?.virtual_account && (
                <div className=" px-8 py-2 flex justify-around items-center border-2 rounded-lg text-gray-900 dark:text-gray-100  dark:border-gray-600">
                  <div className="box text-center">
                    <h3 className="pb-1 font-normal">Total Debit</h3>
                    <h3>{sellerDetails?.virtual_account?.total_debit || 0}</h3>
                  </div>
                  <div className="box text-center">
                    <h3 className="pb-1 font-normal">Total Credit</h3>
                    <h3>{sellerDetails?.virtual_account?.total_credit || 0}</h3>
                  </div>
                  <div className="box text-center">
                    <h3 className="pb-1 font-normal ">Total Balance</h3>
                    <h3>
                      {sellerDetails?.virtual_account?.total_balance || 0}
                    </h3>
                  </div>
                  <div className="box text-center">
                    <h3 className="pb-1 font-normal ">Status</h3>
                    <h3>
                      {setAccountStatusColor(
                        sellerDetails?.virtual_account?.status
                      ) || "No Status"}
                    </h3>
                  </div>
                </div>
              )}
            </>

            {/* ------------- BODY ------------- */}
            <div className="p-4 md:p-5">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-x-4">
                  {/* BILL */}
                  <div>
                    <input
                      name="bill_no"
                      type="text"
                      placeholder="Bill No"
                      value={formData.bill_no}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* DATE */}
                  <div>
                    <input
                      name="date"
                      type="date"
                      placeholder="Date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      readOnly
                    />
                  </div>

                  {/* PARTY NAME */}
                  <div className="">
                    <input
                      name="name"
                      type="text"
                      placeholder="Party Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      readOnly={!!sellerDetails}
                    />
                  </div>

                  {/* PHONE NUMBER */}
                  <div className="">
                    <input
                      name="phone"
                      type="number"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      readOnly={!!sellerDetails}
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <input
                      name="category"
                      type="text"
                      placeholder="Category"
                      value={formData.category}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>
                {/* ROLE_QUANTITY AND MEASUREMENT */}
                <div className="mt-12 mb-4  relative py-4  gap-4 border-t border-b">
                  {/* Plus Sign */}
                  <button
                    type="button"
                    className="absolute -top-7 right-2 text-black"
                    onClick={addRow} // Optional: Add a function for the button
                  >
                    <FaPlus size={18} />
                  </button>

                  {measurementData.rowData.map((data, index) => (
                    <div key={index} className="grid  py-2 grid-cols-2 gap-4">
                      <input
                        name="roleQuantity"
                        type="number"
                        placeholder="Quantity"
                        value={data.roleQuantity}
                        onChange={(e) => handleMeasurementChange(e, index)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                      />
                      <div className="flex items-center justify-center gap-4">
                        <input
                          name="measurement"
                          type="number"
                          placeholder="Measurement"
                          value={data.measurement}
                          onChange={(e) => handleMeasurementChange(e, index)}
                          className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <button type="button" onClick={() => deleteRow(index)}>
                          <RxCross2
                            size={24}
                            className="text-red-500 flex-shrink-0"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-x-4">
                  {/* QUANTITY */}
                  <div>
                    <input
                      name="quantity"
                      type="number"
                      placeholder="Quantity"
                      value={formData.quantity}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      readOnly
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

                  {/* SUB-TOTAL */}
                  <div>
                    <input
                      name="subTotal"
                      type="number"
                      placeholder="SubTotal"
                      value={formData.subTotal}
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="flex">
                        <input
                          name="discount"
                          type="number"
                          placeholder="Discount"
                          value={formData.discount}
                          onChange={handleChange}
                          className="bg-gray-50 border rounded-tl-md rounded-bl-md border-gray-300 text-gray-900 text-sm  focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                        <select
                          name="discountType"
                          className="bg-gray-50 border rounded-tr-md rounded-br-md border-gray-300 text-gray-900 text-sm focus:ring-0 focus:border-gray-300 block  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          value={formData.discountType}
                          onChange={handleChange}
                        >
                          <option value="RS">RS</option>
                          <option value="%">%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div>
                    <input
                      name="total"
                      type="number"
                      placeholder={`Total`}
                      value={formData.total}
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  {addSellerLoading ? (
                    <button
                      disabled
                      type="button"
                      class="text-white cursor-not-allowed border-gray-600 bg-gray-300 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-3 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700  inline-flex items-center"
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
                      Submit
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
      )}
    </>
  );
};

export default LaceModal;
