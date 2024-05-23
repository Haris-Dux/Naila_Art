import React, { useState } from 'react'
// import data from './SuitsStockData';
import { IoAdd } from "react-icons/io5";

const Embroidery = () => {
    const [isOpen, setIsOpen] = useState(false);


    const [formData, setFormData] = useState({
        partyName: "ABC Party",
        serial_No: "12345",
        date: "2023-05-01",
        per_suit: 10,
        project_status: "Pending",
        design_no: "D001",
        shirt: {
          category: "Cotton",
          color: "Blue",
          quantity_in_no: 5,
          quantity_in_m: 10,
          received: 5
        },
        duppata: {
          category: "Silk",
          color: "Red",
          quantity_in_no: 3,
          quantity_in_m: 6,
          received: 3
        },
        trouser: {
          category: "Linen",
          color: "Black",
          quantity_in_no: 4,
          quantity_in_m: 8,
          received: 4
        },
        received_suit: 15,
        T_Quantity_In_m: 50,
        T_Quantity: 100,
        Front_Stitch: {
          value: 5,
          head: 2
        },
        Bazo_Stitch: {
          value: 4,
          head: 2
        },
        Gala_Stitch: {
          value: 3,
          head: 1
        },
        Back_Stitch: {
          value: 6,
          head: 3
        },
        Pallu_Stitch: {
          value: 5,
          head: 2
        },
        Trouser_Stitch: {
          value: 4,
          head: 2
        },
        D_Patch_Stitch: {
          value: 2,
          head: 1
        },
        F_Patch_Stitch: {
          value: 1,
          head: 1
        },
        tissue: {
          category: "Paper",
          color: "White",
          QuantityInM: 20
        }
      });
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

    const data = [
        {
            design_no: '1',
            partyName: 'Hello Co.',
            quantity: '1322',
            date: '2/2/2',
            quantity: '11',
            status: 'Pending',
            cost_pirce: '200',
            sale_pirce: '2200',
        },
        {
            design_no: '2',
            partyName: 'Hello Co.',
            quantity: '323',
            date: '2/2/2',
            quantity: '11',
            status: 'Pending',
            cost_pirce: '200',
            sale_pirce: '2200',
        },
        {
            design_no: '3',
            partyName: 'Hello Co.',
            quantity: '23231',
            date: '2/2/2',
            quantity: '11',
            status: 'Pending',
            cost_pirce: '200',
            sale_pirce: '2200',
        },
        {
            design_no: '4',
            partyName: 'Hello Co.',
            quantity: '3531',
            date: '2/2/2',
            quantity: '11',
            status: 'Pending',
            cost_pirce: '200',
            sale_pirce: '2200',
        },

    ]

    const openModal = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };


    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Embroidery</h1>

                    {/* <!-- ADD BUTTON & SEARCH BAR --> */}
                    <div className="flex items-center gap-2 mr-2">
                        <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
                            <IoAdd size={22} className='text-white' />
                        </button>

                        <div className="search_bar relative mt-4 md:mt-0">
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
                                placeholder="Search by Party Name"
                            // value={searchText}
                            // onChange={handleSearch}
                            />
                        </div>
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
                                    S # No
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Party Name
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Design No
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Date
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Quantity
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Status
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((data, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        scope="row"
                                    >
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        {data.partyName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.design_no}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.sale_pirce}
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

export default Embroidery


