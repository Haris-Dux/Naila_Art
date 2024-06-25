import { useSelector } from 'react-redux';

const data = [
    {
        id: 1,
        date: "02-02-2024",
        particular: "Bill No # 508",
        credit: 0,
        debit: 10000,
        balance: 10000
    },
    {
        id: 2,
        date: "02-02-2024",
        particular: "Cash in Meezan Bank",
        credit: 2000,
        debit: 0,
        balance: 8000
    },
]

const EmployeeDetails = () => {
    const { loading } = useSelector((state) => state.InStock);

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* BUYER DETAILS */}
                <div className="px-2 py-2 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-3 text-gray-900 dark:text-gray-100">
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Employee Name</h3>
                        <h3>M Amir</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Phone Number</h3>
                        <h3>0332 4700802</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>CNIC</h3>
                        <h3>35202-6206522-9</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Address</h3>
                        <h3 className=''>531 G Block Karim Block Lahore</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Last Work Place</h3>
                        <h3>Brandth Road</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Designation</h3>
                        <h3>Sales Man</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Father CNIC</h3>
                        <h3>35202-6206522-9</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Joining Date</h3>
                        <h3>02-02-2024</h3>
                    </div>
                </div>

                <p className='w-full bg-gray-300 h-px mt-5'></p>

                {/* -------------- TABLE -------------- */}
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto mt-5 ">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th
                                        className="px-6 py-4 text-md font-medium"
                                        scope="col"
                                    >
                                        Date
                                    </th>
                                    <th
                                        className="px-6 py-4 text-md font-medium"
                                        scope="col"
                                    >
                                        Particular
                                    </th>
                                    <th
                                        className="px-6 py-4 text-md font-medium"
                                        scope="col"
                                    >
                                        Credit
                                    </th>
                                    <th
                                        className="px-6 py-4 text-md font-medium"
                                        scope="col"
                                    >
                                        Debit
                                    </th>
                                    <th
                                        className="px-6 py-4 text-md font-medium"
                                        scope="col"
                                    >
                                        Balance
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                scope="row"
                                            >
                                                <p>{data.date}</p>
                                            </th>
                                            <td className="px-6 py-4 font-medium">
                                                {data.particular}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {data.credit === 0 ? "-" : data.credit}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {data.debit === 0 ? "-" : data.debit}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {data.balance === 0 ? "-" : data.balance}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="w-full flex justify-center items-center">
                                        <td className='text-xl mt-3'>No Data Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div >
                )}
            </section >
        </>
    );
}

export default EmployeeDetails;
