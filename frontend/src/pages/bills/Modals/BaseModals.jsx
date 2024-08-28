import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddOldSellerDetailsFromAsync, AddSellerDetailsFromAsync, getAllPurchasingHistoryAsync } from '../../../features/SellerSlice';
import { useSearchParams } from 'react-router-dom';
import moment from "moment-timezone";

const BaseModals = ({ isOpen, closeModal, sellerDetails }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

    const [discountState, setDiscountState] = useState(false);

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
        subtotal: "",
        discountType: "number",
        discount: "",
        total: "",
        seller_stock_category: "Base",
    });

    useEffect(() => {
        if (sellerDetails) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: sellerDetails.name || "",
                phone: sellerDetails.phone || "",
            }));
        }
    }, [sellerDetails]);

    const handleDiscountTypeChange = (e) => {
        const discountType = e.target.value;
        setFormData((prevState) => {
            const discountValue = discountType === "percentage"
                ? (prevState.subtotal * prevState.discount) / 100
                : prevState.discount;

            return {
                ...prevState,
                discountType,
                total: Number(prevState.subtotal) - Number(discountValue),
            };
        });
    };


    // Function to handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === "discount" || name === "subtotal" || name === "discountType") {
            const discountValue = newFormData.discountType === "percentage"
                ? (newFormData.subtotal * newFormData.discount) / 100
                : newFormData.discount;

            newFormData.total = Number(newFormData.subtotal) - Number(discountValue);
        }

        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { discount, discountType, subtotal, ...filteredFormData } = formData;

        const modifiedFormData = {
            ...filteredFormData,
            total: Number(filteredFormData.total),
            rate: Number(filteredFormData.rate),
            quantity: Number(filteredFormData.quantity),
            bill_no: Number(filteredFormData.bill_no),
        };

        if (sellerDetails && sellerDetails?.id) {
            modifiedFormData.sellerId = sellerDetails?.id;
        }

        console.log('modifiedFormData', modifiedFormData);

        if (sellerDetails) {
            dispatch(AddOldSellerDetailsFromAsync(modifiedFormData)).then((res) => {
                if (res.payload.success === true) {
                    dispatch(getAllPurchasingHistoryAsync({ category: 'Base', page }));
                    resetFormData();
                    closeModal();
                    setDiscountState(false);
                }
            });
        } else {
            dispatch(AddSellerDetailsFromAsync(modifiedFormData)).then((res) => {
                if (res.payload.success === true) {
                    dispatch(getAllPurchasingHistoryAsync({ category: 'Base', page }));
                    resetFormData();
                    closeModal();
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
            subtotal: "",
            discountType: "number",
            discount: "",
            total: "",
            seller_stock_category: "Base",
        });
    };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setDiscountState(isChecked);

        setFormData((prevState) => {
            let updatedTotal = prevState.subtotal;

            if (isChecked) {
                const discount = Number(prevState.discount) || 0;

                if (prevState.discountType === "percentage") {
                    updatedTotal = updatedTotal - (updatedTotal * discount) / 100;
                } else {
                    updatedTotal = updatedTotal - discount;
                }
            } else {
                updatedTotal = prevState.subtotal;
            }

            return {
                ...prevState,
                discount: isChecked ? prevState.discount : "",
                discountType: isChecked ? prevState.discountType : "number",
                total: updatedTotal,
            };
        });
    };


    return (
        <>
            {isOpen && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Base
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
                        <div className="p-4 md:p-3">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-3">

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
                                    <div className='col-span-2'>
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


                                    {/* QUANTITY */}
                                    <div>
                                        <input
                                            name="quantity"
                                            type="number"
                                            placeholder="Quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* SUB TOTAL */}
                                    <div>
                                        <input
                                            name="subtotal"
                                            type="number"
                                            placeholder="Sub Total"
                                            value={formData.subtotal}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* TOTAL */}
                                    <div>
                                        <input
                                            name="total"
                                            type="number"
                                            placeholder="Total"
                                            value={formData.total}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            readOnly
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

                                    {/* PHONE NUMBER */}
                                    <div className=''>
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

                                    {/* CHECKBOX */}
                                    <div className='col-span-2'>
                                        <div className="flex items-center pl-1">
                                            <input
                                                id="default-checkbox"
                                                type="checkbox"
                                                checked={discountState}
                                                onChange={handleCheckboxChange}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-transparent"
                                            />
                                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 cursor-pointer dark:text-gray-300">
                                                Discount
                                            </label>
                                        </div>
                                    </div>


                                    {discountState && (
                                        <>
                                            {/* DISCOUNT TYPE */}
                                            <div className="flex items-center pl-1">
                                                <div className="flex items-center me-4">
                                                    <input
                                                        id="inline-radio"
                                                        type="radio"
                                                        value="number"
                                                        name="discountType"
                                                        checked={formData.discountType === "number"}
                                                        onChange={handleDiscountTypeChange}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="inline-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Number</label>
                                                </div>
                                                <div className="flex items-center me-4">
                                                    <input
                                                        id="inline-2-radio"
                                                        type="radio"
                                                        value="percentage"
                                                        name="discountType"
                                                        checked={formData.discountType === "percentage"}
                                                        onChange={handleDiscountTypeChange}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Percentage</label>
                                                </div>
                                            </div>

                                            {/* DISCOUNT */}
                                            <div>
                                                <input
                                                    name="discount"
                                                    type="number"
                                                    placeholder="Discount"
                                                    value={formData.discount}
                                                    onChange={handleChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-center mt-6">
                                    {addSellerLoading ? (
                                        <button disabled="" type="button" class="text-white border-gray-600 bg-gray-600 focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-3 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700  inline-flex items-center">
                                            <svg aria-hidden="true" role="status" class="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                            </svg>
                                            Loading...
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="inline-block rounded border border-gray-600 bg-gray-600 px-12 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-0 active:text-indgrayigo-500"
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

export default BaseModals;
