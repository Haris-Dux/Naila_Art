import { useEffect, useState } from 'react'
import { Link, useSearchParams } from "react-router-dom";
import { GetAllaccessories } from '../../../features/InStockSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import UsedAccessoriesModal from './UsedAccessoriesModal';


const Accessories = () => {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [accessoriesModal, setAccessoriesModal] = useState();
    const [selectedUsedAccessories, setSelectedUsedAccessories] = useState();

    const [selectedTab, setSelectedTab] = useState("all_Records");
    const [accessoriesId, setAccessoriesId] = useState();
    const [search, setSearch] = useState();
    const { loading, accessories } = useSelector((state) => state.InStock);

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        dispatch(GetAllaccessories({ search, page }))
    }, [search, page, dispatch]);


    const openModal = (id) => {
        setIsOpen(true);
        setAccessoriesId(id);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const openAccessoriesModal = (id) => {
        setAccessoriesModal(true);
        setSelectedUsedAccessories(id);
        document.body.style.overflow = 'hidden';
    };

    const closeAccessoriesModal = () => {
        setAccessoriesModal(false);
        document.body.style.overflow = 'auto';
    };

    const filteredData = accessories?.data?.filter((data) => data.id === accessoriesId);

    const renderPaginationLinks = () => {
        const totalPages = accessories?.totalPages;
        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push(
                <li key={i} onClick={ToDown}>
                    <Link
                        to={`/dashboard/accessories?page=${i}`}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
                            }`}
                        onClick={() => dispatch(GetAllaccessories({ page: i }))}
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

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }


    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };


    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Accessories</h1>

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
                                placeholder="Search by Name"
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
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
                                    <th
                                        className="px-6 py-4 text-md"
                                        scope="col"
                                    >
                                        History / Update
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {accessories && accessories?.data?.length > 0 ? (
                                    accessories?.data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
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
                                            <td className="pl-10 py-4 flex items-center gap-8">
                                                <FaEye onClick={() => openModal(data?.id)} size={20} className='cursor-pointer' />
                                                <MdEdit onClick={() => openAccessoriesModal(data?.id)} size={20} className='cursor-pointer' />
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
                            {accessories?.page > 1 ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/accessories?page=${page - 1}`}
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
                            {accessories?.totalPages !== page ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/accessories?page=${page + 1}`}
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

            {accessoriesModal && <UsedAccessoriesModal isOpen={openAccessoriesModal} closeModal={closeAccessoriesModal} selectedUsedAccessories={selectedUsedAccessories} />}

            {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-3xl max-h-[80vh] scrollable-content bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Accessories History
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

                        <div className="tabs flex justify-between items-center my-4">
                            <div className="tabs_button">
                                <button
                                    className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${selectedTab === "all_Records"
                                        ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                                        : ""}`}
                                    onClick={() => handleTabClick("all_Records")}
                                >
                                    Stock In
                                </button>
                                <button
                                    className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${selectedTab === "accessoriesUsed_Records"
                                        ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                                        : ""}`}
                                    onClick={() => handleTabClick("accessoriesUsed_Records")}
                                >
                                    Stock Used
                                </button>
                            </div>
                        </div>

                        {/* ------------- BODY ------------- */}
                        <div className="pb-7 pt-0 px-2">
                            {selectedTab === "all_Records" && (
                                <>
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
                                                    Date
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
                                                    Quantity
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData && filteredData.length > 0 ? (
                                                filteredData?.map((item, index) => (
                                                    item?.all_Records?.slice().reverse().map((data, subIndex) => (
                                                        <tr key={`${index}-${subIndex}`} className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                                            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row">
                                                                {data.serial_No}
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                {new Date(data?.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {data.name}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {data.quantity} 
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
                                </>
                            )}

                            {selectedTab === "accessoriesUsed_Records" && (
                                <>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                                            <tr>
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
                                                    Name
                                                </th>
                                                <th
                                                    className="px-6 py-3"
                                                    scope="col"
                                                >
                                                    Note
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
                                            {filteredData && filteredData.length > 0 ? (
                                                filteredData?.map((item, index) => (
                                                    item?.accessoriesUsed_Records?.map((data, subIndex) => (
                                                        <tr key={`${index}-${subIndex}`} className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                                            <td className="px-6 py-4">
                                                                {new Date(data?.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {data?.name}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {data?.note}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {data?.quantityRemoved}
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
                                </>
                            )}
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default Accessories;
