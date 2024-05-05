import React, { useState } from 'react'

const Lace = () => {
    const [isOpen, setIsOpen] = useState(false);

    const data = [
        {
            bill_no: '1',
            name: 'Lace',
            category: 'Karachi Border',
            totalQuantity: '500',
            date: '10-12-2021',
            recently: '150',
        },
        {
            bill_no: '2',
            name: 'Lace',
            category: 'Karachi Border',
            totalQuantity: '500',
            date: '10-12-2021',
            recently: '150',
        },
        {
            bill_no: '3',
            name: 'Lace',
            category: 'Karachi Border',
            totalQuantity: '500',
            date: '10-12-2021',
            recently: '150',
        },
        {
            bill_no: '4',
            name: 'Lace',
            category: 'Karachi Border',
            totalQuantity: '500',
            date: '10-12-2021',
            recently: '150',
        },
    ]



    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Lace</h1>

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


                {/* -------------- TABLE -------------- */}
                <div className="relative overflow-x-auto mt-5 ">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Bill No
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
                                    Cetegory
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Total Quantity
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    R. Date
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Recently
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) => (
                                <tr key={index} className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        scope="row"
                                    >
                                        {data.bill_no}
                                    </th>
                                    <td className="px-6 py-4">
                                        {data.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.totalQuantity} m
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.recently} m
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
                                Add New Base
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
                            <form action="#" className="space-y-4">
                                <div>
                                    <input
                                        name="category"
                                        type="text"
                                        placeholder="Enter Category"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="color"
                                        type="text"
                                        placeholder="Enter Color"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block mb-2 text-sm font-normal text-gray-900 dark:text-white"
                                        htmlFor="color"
                                    >
                                        Start Date
                                    </label>
                                    <input
                                        id="color"
                                        name="color"
                                        type="date"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="quantity"
                                        type="text"
                                        placeholder="Enter Quantity"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>

                                <div className="flex justify-center pt-2">
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
    )
}

export default Lace

