import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetAllBase } from '../../../features/InStockSlice';
import { Link, useSearchParams } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { getAllPurchasingHistoryAsync } from '../../../features/SellerSlice';

const BaseTable = () => {
    const dispatch = useDispatch();

    const { loading, Base } = useSelector((state) => state.InStock);

    const { PurchasingHistory } = useSelector((state) => state.Seller);
    console.log('PurchasingHistory', PurchasingHistory);


    const [baseId, setBaseId] = useState();
    const [userSelectedCategory, setuserSelectedCategory] = useState("");
    const [search, setSearch] = useState();

    const [isOpen, setIsOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        dispatch(getAllPurchasingHistoryAsync({ category: 'Base', search, page }))

    }, [page, dispatch]);

    const renderPaginationLinks = () => {
        const totalPages = Base?.totalPages;
        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push(
                <li key={i} onClick={ToDown}>
                    <Link
                        to={`/dashboard/purchasebills?page=${i}`}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
                            }`}
                        onClick={() => dispatch(GetAllBase({ category: userSelectedCategory, page: i }))}
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

    const openModal = (id) => {
        setIsOpen(true);
        setBaseId(id);
        // document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        // document.body.style.overflow = 'auto';
    };

    const handleCategoryClick = (category) => {
        const selectedCategory = category === "all" ? "" : category;
        setuserSelectedCategory(selectedCategory);

        // check
        if (category === "all") {
            dispatch(GetAllBase({ search, page: 1 }))
        }
        else if (search) {
            dispatch(GetAllBase({ category, search, page: 1 }))
        }
        else {
            dispatch(GetAllBase({ category, page: 1 }))
        }
    }

    const filteredBaseData = useMemo(() => Base?.data?.filter(data => data.id === baseId), [Base, baseId]);

    return (
        <>
            {/* <p className='w-full bg-gray-300 h-px mt-5'></p> */}

            {/* -------------- TABS -------------- */}
            {/* <div className="tabs flex justify-between items-center my-5">
                <div className="tabs_button">
                    <Link
                        to={`/dashboard/purchasebills?page=${1}`}
                        className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${userSelectedCategory === ""
                            ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                            : ""
                            }`}
                        onClick={() => handleCategoryClick("all")}
                    >
                        All
                    </Link>
                    {BaseCategories?.map(category => (
                        <Link
                            key={category}
                            className={`border border-gray-500 dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md ${userSelectedCategory === category ? 'bg-[#252525] text-white dark:bg-white dark:text-black' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                            to={`/dashboard/purchasebills?page=${1}`}
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div> */}


            <section>
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
                                    <th
                                        className="px-6 py-4 text-md"
                                        scope="col"
                                    >
                                        History
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
                                                {data.colors}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.TYm} m
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(data.r_Date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.recently} m
                                            </td>
                                            <td className="pl-10 py-4">
                                                <span onClick={() => openModal(data?.id)}>
                                                    <FaEye size={20} className='cursor-pointer' />
                                                </span>
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
            </section>


            {/* -------- PAGINATION -------- */}
            <section className="flex justify-center">
                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                        <li>
                            {Base?.page > 1 ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/purchasebills?page=${page - 1}`}
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
                                    to={`/dashboard/purchasebills?page=${page + 1}`}
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


            {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-4xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Base History
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
                                            Color
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBaseData && filteredBaseData.length > 0 ? (
                                        filteredBaseData?.map((item, index) => (
                                            item?.all_Records?.map((data, subIndex) => (
                                                <tr key={`${index}-${subIndex}`} className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                                    <th className="px-6 py-4 font-medium" scope="row">
                                                        {data?.category}
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {data?.colors}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(data?.Date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {data?.quantity} m
                                                    </td>
                                                </tr>
                                            ))
                                        ))
                                    ) : (
                                        <tr className="w-full flex justify-center items-center">
                                            <td className='text-xl mt-3'>No Data Available</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default BaseTable;