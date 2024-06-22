import { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";


const CashInOut = () => {

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-4 lg:gap-6">
                    <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                        <div className="stat_data pl-4">
                            <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                                Today Cash In
                            </h3>
                            <div className="mt-3 flex justify-start items-center gap-3">
                                <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                                    232,789
                                </span>
                                <span className="text-gray-900 bg-gray-200 text-sm px-3 py-1 w-16 rounded-md">
                                    +1.5k
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                        <div className="stat_data pl-4">
                            <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                                Today Cash Out
                            </h3>
                            <div className="mt-3 flex justify-start items-center gap-3">
                                <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                                    232,789
                                </span>
                                <span className="text-gray-900 bg-gray-200 text-sm px-3 py-1 w-16 rounded-md">
                                    +1.5k
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                        <div className="stat_data pl-4">
                            <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                                Today Cash In Hand
                            </h3>
                            <div className="mt-3 flex justify-start items-center gap-3">
                                <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                                    232,789
                                </span>
                                <span className="text-gray-900 bg-gray-200 text-sm px-3 py-1 w-16 rounded-md">
                                    +1.5k
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* -------------- HEADER -------------- */}
                <div className="mt-4 header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Cash In/Out</h1>
                </div>

                <p className='w-full bg-gray-300 h-px mt-5'></p>


                <div className="data mt-8">
                    <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* PARTY NAME */}
                        <div>
                            <input
                                name="cash"
                                type="text"
                                placeholder="Cash"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required
                            />
                        </div>

                        {/* SELECT PARTY NAME */}
                        <div>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option selected>
                                    Select Party Name
                                </option>
                                <option value="US">
                                    M Amir
                                </option>
                                <option value="CA">
                                    Umer javaid
                                </option>
                            </select>
                        </div>

                        {/* SELECTED PAYMENT METHOD */}
                        <div>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option selected>
                                    Select Payment Method
                                </option>
                                <option value="Cash">
                                    Cash
                                </option>
                                <option value="Cash">
                                    Bank
                                </option>
                            </select>
                        </div>

                        {/* PARTY NAME */}
                        <div>
                            <input
                                type="date"
                                placeholder="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required
                            />
                        </div>

                        <div className='cashIn'>
                            <button className='w-full rounded-md bg-[#04D000] text-white py-3'>
                                Cash In
                            </button>
                        </div>
                        <div className='cashOut'>
                            <button className='w-full rounded-md bg-[#E82B2B] text-white py-3'>
                                Cash Out
                            </button>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

export default CashInOut;
