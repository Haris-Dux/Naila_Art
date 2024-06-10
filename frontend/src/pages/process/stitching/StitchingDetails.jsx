import { useParams } from "react-router-dom";


const StitchingDetails = () => {
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
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Stitching Details</h1>
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
                            <span className="font-medium">Rate:</span>
                            <span> 130</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Project Status:</span>
                            <span className="text-green-600 dark:text-green-300"> Complete</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Date:</span>
                            <span> 02-12-24</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Lace Quantity:</span>
                            <span> 78 suits</span>
                        </div>
                        <div className="box col-span-2">
                            <span className="font-medium">Lace Category:</span>
                            <span> karachi Border</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">R. Quantity:</span>
                            <span> ---</span>
                        </div>
                    </div>
                </div>

                {/* -------------- RECEIVED STOCK SECTION -------------- */}
                <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
                        <div className="box_1">
                            <h3 className="mb-4 font-semibold text-lg">Received Suits Colors</h3>

                            <div className="details space-y-2">
                                <div className="details_box flex items-center gap-x-3">
                                    <p className="w-44">Brown color (24)</p>
                                    <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                </div>
                                <div className="details_box flex items-center gap-x-3">
                                    <p className="w-44">Brown color (24)</p>
                                    <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                </div>
                                <div className="details_box flex items-center gap-x-3">
                                    <p className="w-44">Brown color (24)</p>
                                    <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                </div>
                                <div className="details_box flex items-center gap-x-3">
                                    <p className="w-44">Brown color (24)</p>
                                    <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                </div>
                                <div className="details_box flex items-center gap-x-3">
                                    <p className="w-44">Brown color (24)</p>
                                    <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                </div>
                                <div className="details_box flex items-center gap-x-3">
                                    <p className="w-44">Brown color (24)</p>
                                    <input type="text" className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm" />
                                </div>
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

export default StitchingDetails;