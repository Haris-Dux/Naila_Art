import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBaseAsync } from '../../../features/PurchaseBillsSlice';
import { GetAllBase } from '../../../features/InStockSlice';

const BaseModals = ({ isOpen, closeModal }) => {
    const dispatch = useDispatch();

    // State variables to hold form data
    const [formData, setFormData] = useState({
        colors: "",
        quantity: "",
        r_Date: "",
        category: "",
    });

    // Function to handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createBaseAsync(formData)).then((res) => {
            if (res.payload.message === "Successfully Added") {
                dispatch(GetAllBase());
                setFormData({
                    colors: "",
                    quantity: "",
                    r_Date: "",
                    category: "",
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
                        <div className="p-4 md:p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">

                                    {/* COLORS */}
                                    <div>
                                        <input
                                            name="colors"
                                            type="text"
                                            placeholder="Colors"
                                            value={formData.colors}
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

                                    {/* DATE */}
                                    <div>
                                        <input
                                            name="r_Date"
                                            type="date"
                                            placeholder="Date"
                                            value={formData.r_Date}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        type="submit"
                                        className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                                    >
                                        Submit
                                    </button>
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
