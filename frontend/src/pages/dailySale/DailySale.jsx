import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { GetAllBranches, GetAllExpense } from "../../features/InStockSlice";
import { FaEye } from 'react-icons/fa';
import { getDailySaleAsync } from "../../features/DailySaleSlice";

const DailySale = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [messageId, setMessageId] = useState();
    const [searchText, setSearchText] = useState("");

    const { user } = useSelector((state) => state.auth);
    const { Branches } = useSelector((state) => state.InStock);
    const { loading, DailySaleHistory } = useSelector((state) => state.DailySale);
    // console.log('DailySaleHistory', DailySaleHistory);

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const [selectedBranchId, setSelectedBranchId] = useState();


    const [searchDate, setSearchDate] = useState('');
    console.log('searchDate', searchDate);


    const filteredData = searchText ? DailySaleHistory?.dailySaleHistory?.filter((item) =>
        item.partyName.toLowerCase().includes(searchText.toLowerCase())
    )
        : DailySaleHistory?.dailySaleHistory;


    useEffect(() => {
        if (user?.user?.id) {
            dispatch(GetAllBranches({ id: user?.user?.id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (Branches.length > 0) {
            setSelectedBranchId(user?.user?.branchId || Branches[0].id)
            const branchId = user?.user?.branchId || Branches[0].id;

            if (searchDate) {
                dispatch(getDailySaleAsync({ id: branchId, date: searchDate, page }));
            } else {
                dispatch(getDailySaleAsync({ id: branchId, page }));
            }
        }
    }, [dispatch, searchDate, user, Branches, page]);


    const openModal = (msgId) => {
        setMessageId(msgId);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = "auto";
    };

    const handlePaginationClick = (i) => {
        const branchId = user?.user?.branchId || Branches[0].id;

        if (searchDate) {
            dispatch(getDailySaleAsync({ id: branchId, date: searchDate, page: i }));
        } else {
            dispatch(getDailySaleAsync({ id: branchId, page: i }));
        }
    }

    const renderPaginationLinks = () => {
        const totalPages = DailySaleHistory?.totalPages;
        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push(
                <li key={i} onClick={ToDown}>
                    <Link
                        to={`/dashboard/dailySale?page=${i}`}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
                            }`}
                        // onClick={() => dispatch(getDailySaleAsync({ page: i }))}
                        onClick={() => handlePaginationClick(i)}
                    >
                        {i}
                    </Link>
                </li >
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


    const handleBranchClick = (branchId) => {
        const selectedBranch = branchId === "all" ? "" : branchId;
        setSelectedBranchId(selectedBranch);
        dispatch(getDailySaleAsync({ id: branchId, page }));
    }

    const handleSearch = (e) => {
        setSearchDate(e.target.value);
    };

    const getBranchNameById = (branchId) => {
        const branch = Branches.find(branch => branch.id === branchId);
        return branch ? branch.branchName : 'Unknown Branch';
    };

    const filteredMsgData = DailySaleHistory?.dailySaleHistory?.find((data) => data?.id === messageId);

    return (
        <>
            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
                        Daily Sale
                    </h1>

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
                                type="date"
                                className="md:w-64 lg:w-72 py-2 pl-10 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
                                placeholder="Search by date"
                                value={searchDate}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <p className="w-full bg-gray-300 h-px mt-5"></p>

                {/* -------------- TABS -------------- */}
                <div className="tabs flex justify-between items-center my-5">
                    <div className="tabs_button">
                        {/* CHECK ONLY SUPERADMIN CAN SEE ALL */}
                        {user?.user?.role === "superadmin" ? (
                            <>
                                {Branches?.map((branch) => (
                                    <Link
                                        to={`/dashboard/dailySale?page=${1}`}
                                        key={branch?.id}
                                        className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${selectedBranchId === branch?.id
                                            ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                                            : ""
                                            }`}
                                        onClick={() => handleBranchClick(branch?.id)}
                                    >
                                        {branch?.branchName}
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <>
                                {/* THIS SHOWS TO ADMIN & USER */}
                                {Branches?.map((branch) => (
                                    <button
                                        className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md cursor-default ${user?.user?.branchId === branch?.id
                                            ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                                            : ""
                                            }`}
                                    >
                                        {branch?.branchName}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* -------------- TABLE -------------- */}
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div
                            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                            role="status"
                            aria-label="loading"
                        >
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto mt-5 ">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-6 py-3" scope="col">
                                        Branch Name
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        Total Sale
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        Total Sale
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        Date
                                    </th>
                                    <th className='px-6 py-3 font-medium' scope='col'>
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.length > 0 ? (
                                    filteredData?.map((expense, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        >
                                            <td className="px-6 py-4 font-medium">{getBranchNameById(expense?.branchId)}</td>
                                            <td className="px-6 py-4">{expense?.saleData?.totalSale}</td>
                                            <td className="px-6 py-4">{expense?.saleData?.totalExpense}</td>
                                            <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                                            <td className='pl-10 py-4'>
                                                <Link to={`/dashboard/dailySale-details/${expense?.id}`}>
                                                    <FaEye size={20} className='cursor-pointer' />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-xl text-start">
                                            No Data available
                                        </td>
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
                            {DailySaleHistory?.page > 1 ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/dailySale?page=${page - 1}`}
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
                            {DailySaleHistory?.totalPages !== page ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/dailySale?page=${page + 1}`}
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
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Expense Details
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
                            <p className="text-gray-900 dark:text-white">
                                {filteredMsgData?.reason}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DailySale;
