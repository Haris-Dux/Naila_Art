import React, { useState,useEffect } from 'react'
import { IoAdd } from "react-icons/io5";
import {  GetAllExpense } from '../../../features/InStockSlice';
import { useDispatch, useSelector } from 'react-redux';
const Expense = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messageId, setMessageId] = useState();
    const dispatch = useDispatch()
    const { loading,Expense } = useSelector((state) => state.InStock);



    useEffect(() => {
        dispatch(GetAllExpense())
         }, [])


console.log('data',Expense)

    const openModal = (msgId) => {
        setMessageId(msgId);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const data = [
        {
            serial_no: 'X0001',
            name: 'Umer',
            reason: 'This is the first express ',
            rate: '200',
            date: '22-12-24',
        },
        {
            serial_no: 'X0002',
            name: 'Umer',
            reason: 'This is the second express ',
            rate: '200',
            date: '22-12-24',
        },
        {
            serial_no: 'X0003',
            name: 'Umer',
            reason: 'This is the third express ',
            rate: '200',
            date: '22-12-24',
        },
        {
            serial_no: 'X0004',
            name: 'Umer',
            reason: 'This is the forth express ',
            rate: '200',
            date: '22-12-24',
        },
    ]

    const filteredMsgData = data.find((data) => data?.serial_no === messageId);

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Expense</h1>

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
                                placeholder="Search by Design Number"
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
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>All</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Head Office</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Shop 1</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Shop 2</button>
                        <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Other</button>
                    </div>
                </div>


                {/* -------------- TABLE -------------- */}
                <div className="relative overflow-x-auto mt-5 ">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Serial No
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Name
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Reason
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Rate
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        scope="row"
                                    >
                                        {data?.serial_no}
                                    </th>
                                    <td className="px-6 py-4">
                                        {data?.name}
                                    </td>
                                    <td onClick={() => openModal(data.serial_no)} className="px-6 py-4 cursor-pointer">
                                        {data?.reason}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data?.rate}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data?.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section >


            {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Expense Details
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
                            <p>{filteredMsgData?.reason}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Expense
