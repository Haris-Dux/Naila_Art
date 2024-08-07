import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoAdd } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { GetAllStitching } from '../../../features/stitching';


const Stitching = () => {
    const dispatch = useDispatch();
    const { Stitching, loading } = useSelector((state) => state.stitching);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');

    const [search, setSearch] = useState('');

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        dispatch(GetAllStitching({ search, page }));
    }, [page, dispatch]);




    const totalPages = Stitching?.totalPages || 1;


    // const handleSearch = (e) => {
    //     setSearchText(e.target.value);
    // };

    const filteredData = Stitching?.data?.filter((data) =>
        data.partyName.toLowerCase().includes(searchText.toLowerCase())
    );
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value === "") {
            dispatch(GetAllStitching({ page }));
        } else {
            dispatch(GetAllStitching({ search: value, page: 1 }));
        }
    };

    const renderPaginationLinks = () => {
        const totalPages = Stitching?.totalPages;
        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push(
                <li key={i} onClick={ToDown}>
                    <Link
                        to={`/dashboard/stitching?page=${i}`}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
                            }`}
                        onClick={() => dispatch(GetAllStitching({ page: i }))}
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


    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Stitching</h1>

                    {/* <!-- search bar --> */}
                    <div className="flex items-center gap-2 mr-2">
                        <button className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
                            <IoAdd size={22} className='text-white' />
                        </button>

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
                                placeholder="Search by party name"
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
                    <>
                        <div className="relative overflow-x-auto mt-5 ">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            Sr #
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            Party Name
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            Design No
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            Date
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            T Quantity
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            R Quantity
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            Status
                                        </th>
                                        <th
                                            className="px-6 py-3 font-medium"
                                            scope="col"
                                        >
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData && filteredData?.length > 0 ? (
                                        filteredData?.map((data, index) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    scope="row"
                                                >
                                                    {data?.serial_No}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {data.partyName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {data.design_no}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(data.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {data.Quantity} y
                                                </td>
                                                <td className="px-6 py-4">
                                                    {data.r_quantity} y
                                                </td>
                                                <td className="px-6 py-4">
                                                    {data.project_status}
                                                </td>
                                                <td className="pl-10 py-4">
                                                    <Link to={`/dashboard/stitching-details/${data.id}`}>
                                                        <FaEye size={20} className='cursor-pointer' />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))) : (
                                        <tr className="w-full flex justify-center items-center">
                                            <td className='text-xl mt-3'>No Data Available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section >

            {/* -------- PAGINATION -------- */}
            <section className="flex justify-center">
                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                        <li>
                            {Stitching?.page > 1 ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/stitching?page=${page - 1}`}
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
                            {Stitching?.totalPages !== page ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/stitching?page=${page + 1}`}
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
    )
}

export default Stitching;