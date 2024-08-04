import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { GetAllExpense } from "../../features/InStockSlice";
import { useEffect } from "react";

const CategoryTable = ({ category }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);


    // ALL USE SELECTORRS
    const { loading } = useSelector((state) => state.InStock);
    const { Base } = useSelector((state) => state.InStock);
    console.log('Base', Base);
    const { Lace } = useSelector((state) => state.InStock);
    console.log('Lace', Lace);
    const { Bags } = useSelector((state) => state.InStock);
    console.log('Bags', Bags);
    const { accessories } = useSelector((state) => state.InStock);
    console.log('accessories', accessories);
    const { Expense } = useSelector((state) => state.InStock);
    console.log('Expense', Expense);

    const allExpenses = Expense?.data?.reduce((acc, branch) => {
        return acc.concat(branch.brannchExpenses);
    }, []);

    const renderPaginationLinks = () => {
        const totalPages = Expense?.totalPages;
        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push(
                <li key={i} onClick={ToDown}>
                    <Link
                        to={`/dashboard/purchasebills?page=${i}`}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
                            }`}
                        onClick={() => dispatch(GetAllExpense({ page: i }))}
                    >
                        {i}
                    </Link>
                </li>
            );
        }
        return paginationLinks;
    };

    const ToDown = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };



    if (category === 'Base') {
        return (
            <>
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
                                        className="px-6 py-3"
                                        scope="col"
                                    >
                                        Category
                                    </th>
                                    <th
                                        className="px-6 py-3"
                                        scope="col"
                                    >
                                        Colors
                                    </th>
                                    <th
                                        className="px-6 py-3"
                                        scope="col"
                                    >
                                        T. m
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
                                {Base && Base?.data?.length > 0 ? (
                                    Base?.data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                            <th className="px-6 py-4 font-medium" scope="row">
                                                {data?.category}
                                            </th>
                                            <td className="px-6 py-4">
                                                {data?.colors}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data?.TYm} m
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(data?.r_Date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data?.recently} m
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
                    </div>
                )}
            </>
        );
    } else if (category === 'Lace') {
        return (
            <>
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto mt-7">
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
                                {Lace && Lace?.data?.length > 0 ? (
                                    Lace?.data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
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
                                                {new Date(data?.r_Date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.recently} m
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
                    </div>
                )}
            </>
        );
    } else if (category === 'Bag & Box') {
        return (
            <>
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto mt-7">
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
                                {Bags && Bags?.data?.length > 0 ? (
                                    Bags?.data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                            <td className="px-6 py-4"
                                                scope="row"
                                            >
                                                {data.bill_no}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.totalQuantity} m
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(data?.r_Date).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4">
                                                {data.recently} m
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
                    </div>
                )}
            </>
        );
    } else if (category === 'Accessories') {
        return (
            <>
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto mt-7 ">
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
                                {accessories && accessories?.data?.length > 0 ? (
                                    accessories?.data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                            <th className="px-6 py-4 font-medium"
                                                scope="row"
                                            >
                                                {data.serial_No}
                                            </th>
                                            <td className="px-6 py-4">
                                                {data.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.totalQuantity}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(data.r_Date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.recently}
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
                    </div>
                )}
            </>
        );
    } else if (category === 'Expense') {
        return (
            <>
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
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
                                    {allExpenses?.length > 0 ? (
                                        allExpenses?.data?.map((expense, index) => (
                                            <tr key={index} className="bg-white border-b font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                                <th className="px-6 py-4 font-medium"
                                                    scope="row"
                                                >
                                                    {expense.serial_no}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {expense.name}
                                                </td>
                                                <td onClick={() => openModal(expense.id)} className="px-6 py-4 cursor-pointer">
                                                    {expense.reason}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {expense.rate}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(expense.Date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center">
                                                No Data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div >


                        {/* -------- PAGINATION -------- */}
                        <section className="flex justify-center">
                            <nav aria-label="Page navigation example">
                                <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                                    <li>
                                        {Base?.page > 1 ? (
                                            <Link
                                                onClick={ToDown}
                                                to={`/dashboard/base?page=${page - 1}`}
                                                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg
                                                    className="w-2.5 h-2.5 rtl:rotate-180"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 6 10"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 1 1 5l4 4"
                                                    />
                                                </svg>
                                            </Link>
                                        ) : (
                                            <button
                                                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                                                disabled
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg
                                                    className="w-2.5 h-2.5 rtl:rotate-180"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 6 10"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 1 1 5l4 4"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </li>
                                    {renderPaginationLinks()}
                                    <li>
                                        {Base?.totalPages !== page ? (
                                            <Link
                                                onClick={ToDown}
                                                to={`/dashboard/base?page=${page + 1}`}
                                                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg
                                                    className="w-2.5 h-2.5 rtl:rotate-180"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 6 10"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="m1 9 4-4-4-4"
                                                    />
                                                </svg>
                                            </Link>
                                        ) : (
                                            <button
                                                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-not-allowed"
                                                disabled
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg
                                                    className="w-2.5 h-2.5 rtl:rotate-180"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 6 10"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="m1 9 4-4-4-4"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </li>
                                </ul>
                            </nav>
                        </section>
                    </>
                )}
            </>
        );
    } else {
        return null;
    }
};

export default CategoryTable;
