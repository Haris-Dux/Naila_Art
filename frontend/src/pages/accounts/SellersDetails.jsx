import { useDispatch, useSelector } from 'react-redux';
import { GetSellerByIdAsync } from '../../features/SellerSlice';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';


const SellersDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { loading, SellerById } = useSelector((state) => state.Seller);

    useEffect(() => {
        if (id) {
            dispatch(GetSellerByIdAsync({ id }));
        }
    }, [dispatch, id]);


    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* BUYER DETAILS */}
                <div className="px-2 py-2 mb-3 grid grid-cols-1 items-center text-center gap-4 lg:grid-cols-6 lg:gap-4 text-gray-900 dark:text-gray-100">
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Title</h3>
                        <h3>{SellerById?.name}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Phone Number</h3>
                        <h3>{SellerById?.phone}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium text-red-500'>Total Debit</h3>
                        <h3 className='font-medium text-red-500'>{SellerById?.virtual_account?.total_debit === null ? "0" : SellerById?.virtual_account?.total_debit}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Total Credit</h3>
                        <h3>{SellerById?.virtual_account?.total_credit === null ? "0" : SellerById?.virtual_account?.total_credit}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Total Balance</h3>
                        <h3>{SellerById?.virtual_account?.total_balance === null ? "0" : SellerById?.virtual_account?.total_balance}</h3>
                    </div>
                </div>


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
                                {SellerById && SellerById?.credit_debit_history?.length > 0 ? (
                                    SellerById?.credit_debit_history?.slice().reverse().map((data, index) => (
                                        <tr key={index} className={` border-b text-md font-semibold ${
                                            data.particular.startsWith("Bill Deleted") ? "bg-red-500 text-white" : "bg-white text-black"
                                          }`}>
                                            <th className="px-6 py-4 font-medium"
                                                scope="row"
                                            >
                                                <p>{data.date}</p>
                                            </th>
                                            <td className="px-6 py-4 font-medium">
                                                {data.particular}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {data.credit === 0 || data.credit === null ? "-" : data.credit}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {data.debit === 0 || data.debit === null ? "-" : data.debit}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {data.balance === 0 || data.balance === null ? "-" : data.balance}
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

export default SellersDetails;