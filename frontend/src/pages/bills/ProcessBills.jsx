import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';

const data = [
    {
        serial_no: 455,
        name: 'M Amir',
        design_no: '1322',
        date: '2-2-2024',
        quantity: 98,
        status: 'Paid',
    },
    {
        serial_no: 405,
        name: 'Umer Javaid',
        design_no: '1365',
        date: '2-2-2022',
        quantity: 115,
        status: 'Pending',
    },
    {
        serial_no: 588,
        name: 'M Amir',
        design_no: '1322',
        date: '2-2-2024',
        quantity: 98,
        status: 'Paid',
    },
]

const ProcessBills = () => {
    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Process Bills</h1>

                    {/* <!-- search bar --> */}
                    <div className="search_bar mr-2">
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
                                placeholder="Search by Bill Number"
                            // value={searchText}
                            // onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <p className='w-full bg-gray-300 h-px mt-5'></p>

                {/* -------------- TABS -------------- */}
                <div className="tabs flex justify-between items-center my-5">
                    <div className="tabs_button">
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Embroidery</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Stone</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Cutting</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Stitching</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Pictures</button>
                    </div>
                </div>


                {/* -------------- TABLE -------------- */}
                <div className="relative overflow-x-auto mt-5 ">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    S # No
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Party Name
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Design No
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Date
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Quantity
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Status
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((data, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        scope="row"
                                    >
                                        {data.serial_no}
                                    </th>
                                    <td className="px-6 py-4">
                                        {data.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.design_no}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.quantity} Suits
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.status}
                                    </td>
                                    <td className="pl-10 py-4">
                                        <Link to={`/dashboard/stones-details/${data.id}`}>
                                            <FaEye size={20} className='cursor-pointer' />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section >
        </>
    )
}

export default ProcessBills
