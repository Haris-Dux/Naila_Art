import { useParams } from "react-router-dom";
import { useState } from "react";

const StonesDetails = () => {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const data = [
        {
            id: 2,
            partyName: 'Lahore Party',
            design_no: '293',
            date: '21/03/23',
            quantity: '1322',
            status: 'Pending',
        },
        {
            id: 3,
            partyName: 'Fsd Party',
            design_no: '293',
            date: '21/03/23',
            quantity: '1322',
            status: 'Complete',
        },
    ]



    

    const selectedDetails = data?.find((data) => data?.id == id);
    console.log('selectedDetails', selectedDetails);

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Stones Details</h1>
                </div>

                {/* -------------- DETAILS SECTION -------------- */}
                <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
                        {/* FIRST ROW */}
                        <div className="box">
                            <span className="font-medium">Party Name:</span>
                            <span> M Umer</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Serial No:</span>
                            <span> A 0001</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Design No:</span>
                            <span> 794</span>
                        </div>

                        <div className="box">
                            <span className="font-medium">Per Suit:</span>
                            <span> 130</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Project Status:</span>
                            <span className="text-green-600 dark:text-green-300"> Complete</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Design No:</span>
                            <span> 706</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">T Quantity:</span>
                            <span> 12 Suits</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Front:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Back:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Bazu:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Dupatta:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Gala:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Front Patch:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Trouser:</span>
                            <span> 12</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">R Quantity:</span>
                            <span> ---</span>
                        </div>
                    </div>
                </div>

                {/* RECEIVED SUITS COLORS */}
                <div className="my-10 px-3 text-gray-800 dark:text-gray-200">
                    <h2 className="text-lg font-semibold">Received Suits Colors</h2>

                    <div className="flex justify-between items-start flex-wrap gap-x-20">
                        {/* DETAILS */}
                        <div className="details">
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">R Front</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">R Back</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">R Bazu</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">R Dupatta</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">R Gala</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">R Front Patch</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-6">
                                <span className="w-32 font-semibold">Trouser</span>
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm" />
                            </div>
                        </div>

                        {/* RECENT DETAILS */}
                        <div className="recent_details">
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                            <div className="line my-3 flex justify-between items-center gap-x-4">
                                <span className="w-28 font-semibold">Recent Date</span>
                                <input type="date" className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* -------------- BUTTONS BAR -------------- */}
                <div className="mt-10 flex justify-center items-center gap-x-5">
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Completed</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Bill</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Gate Pass</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Next Step</button>
                </div>
            </section >


            {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-5xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Stitching Details
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
                            <form className="space-y-4">

                                {/* INPUT FIELDS DETAILS */}
                                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                                    {/* SERIAL NO */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Serial No"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* DESIGN NO */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Design No"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* QUANTITY */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Quantity"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* DATE */}
                                    <div>
                                        <input
                                            type="date"
                                            placeholder="Date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* PARTY NAME */}
                                    <div>
                                        <input
                                            name="category"
                                            type="text"
                                            placeholder="Party Name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>


                                    {/* ENTER RATE */}
                                    <div>
                                        <input
                                            name="color"
                                            type="text"
                                            placeholder="Enter Rate"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* LACE QUANTITY */}
                                    <div>
                                        <input
                                            name="color"
                                            type="text"
                                            placeholder="Lace Quantity"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* LACE CATEGORY */}
                                    <div>
                                        <input
                                            name="color"
                                            type="text"
                                            placeholder="Lace Category"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>


                                <div className="box">
                                    <div className="header flex justify-between items-center">
                                        <h3>Enter Suit Colors And Quantity:</h3>
                                        <p><FiPlus size={24} className='text-gray-700 cursor-pointer' /></p>
                                    </div>

                                    <div className="my-5 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                                        {/* SELECT CATEGORY */}
                                        <div>
                                            <select
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            >
                                                <option selected>
                                                    Select Category
                                                </option>
                                                <option value="US">
                                                    United States
                                                </option>
                                                <option value="CA">
                                                    Canada
                                                </option>
                                            </select>
                                        </div>

                                        {/* SELECTED COLORS */}
                                        <div>
                                            <select
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            >
                                                <option selected>
                                                    Select Colors
                                                </option>
                                                <option value="US">
                                                    United States
                                                </option>
                                            </select>
                                        </div>

                                        {/* ENTER QUANITY */}
                                        <div className='col-span-2'>
                                            <input
                                                type="text"
                                                placeholder="Enter Quantity In No"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <button
                                        type="submit"
                                        className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default StonesDetails;
