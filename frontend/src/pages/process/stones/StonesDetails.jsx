import { useParams } from "react-router-dom";


const StonesDetails = () => {
    const { id } = useParams();

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
        </>
    )
}

export default StonesDetails;
