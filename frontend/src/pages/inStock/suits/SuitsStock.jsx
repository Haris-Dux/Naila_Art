import { useState, useEffect, useMemo } from 'react';
import { AddSuit, GetAllCategoriesForSuits, GetAllSuit } from '../../../features/InStockSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

const SuitsStock = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [SuitId, setSuitId] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState();
    const [userSelectedCategory, setuserSelectedCategory] = useState("");

    const [search, setSearch] = useState();
    const page = parseInt(searchParams.get("page") || "1", 10);

    const { Suit, GetSuitloading, SuitLoading } = useSelector((state) => state.InStock);
    const { SuitCategories } = useSelector((state) => state.InStock);


    // State variables to hold form data
    const [formData, setFormData] = useState({
        category: "",
        color: "",
        quantity: "",
        cost_price: "",
        sale_price: "",
        d_no: ""
    });

    useEffect(() => {
        dispatch(GetAllSuit({ category: userSelectedCategory, search, page }));
        dispatch(GetAllCategoriesForSuits());
    }, [page, dispatch]);

    // Function to handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(AddSuit(formData)).then((res) => {
            if (res.payload.message === "Successfully Added") {
                dispatch(GetAllSuit({ category: userSelectedCategory, search, page }));
                dispatch(GetAllCategoriesForSuits());
                setFormData({
                    category: "",
                    color: "",
                    quantity: "",
                    cost_price: "",
                    sale_price: "",
                    d_no: ""
                });
            }
            closeModal();
        }).catch((error) => {
            console.error("Error adding suit:", error);
        });
    };

    const openModal = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const openHistoryModal = (id) => {
        setHistoryModalOpen(true);
        setSuitId(id);
        document.body.style.overflow = 'hidden';
    };

    const closeHistoryModal = () => {
        setHistoryModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const renderPaginationLinks = () => {
        const totalPages = Suit?.totalPages;
        const paginationLinks = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLinks.push(
                <li key={i} onClick={ToDown}>
                    <Link
                        to={`/dashboard/suits?page=${i}`}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
                            }`}
                        onClick={() => dispatch(GetAllSuit({ page: i }))}
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
        const value = e.target.value;
        setSearch(value);

        const payload = {
            category: userSelectedCategory,
            page: 1,
            search: value || undefined,
        };

        dispatch(GetAllSuit(payload));
    };

    const handleCategoryClick = (category) => {
        console.log('category', category);
        const selectedCategory = category === "all" ? "" : category;
        setuserSelectedCategory(selectedCategory);

        // check
        if (category === "all") {
            dispatch(GetAllSuit({ search, page: 1 }))
        }
        else if (search) {
            dispatch(GetAllSuit({ category, search, page: 1 }))
        }
        else {
            dispatch(GetAllSuit({ category, page: 1 }))
        }
    }

    const filteredSuitData = useMemo(() => Suit?.data?.filter(data => data.id === SuitId), [Suit, SuitId]);


    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Suits</h1>

                    {/* <!-- search bar --> */}
                    <div className="search_bar mr-2 flex justify-center items-center gap-x-3">
                        <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
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
                                placeholder="Search by Design No"
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <p className='w-full bg-gray-300 h-px mt-5'></p>

                {/* -------------- TABS -------------- */}
                <div className="tabs my-5">
                    <div className="tabs_button flex justify-start items-center flex-wrap gap-4">
                        <Link
                            to={`/dashboard/suits?page=${1}`}
                            className={`border border-gray-500 px-5 py-2 text-sm rounded-md ${userSelectedCategory === ""
                                ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                                : ""
                                }`}
                            onClick={() => handleCategoryClick("all")}
                        >
                            All
                        </Link>
                        {SuitCategories?.map(category => (
                            <Link
                                key={category}
                                className={`border border-gray-500 dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 text-sm rounded-md ${userSelectedCategory === category ? 'bg-[#252525] text-white dark:bg-white dark:text-black' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                                to={`/dashboard/suits?page=${1}`}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* -------------- TABLE -------------- */}
                {GetSuitloading ? (
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
                                        D # No
                                    </th>
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
                                        Quantity
                                    </th>
                                    <th
                                        className="px-6 py-3"
                                        scope="col"
                                    >
                                        Cost Prices
                                    </th>
                                    <th
                                        className="px-6 py-3"
                                        scope="col"
                                    >
                                        Sales Prices
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
                                {Suit && Suit?.data?.length > 0 ? (
                                    Suit?.data?.map((data, index) => (
                                        <tr key={index} className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                            <th className="px-6 py-4 font-medium"
                                                scope="row"
                                            >
                                                {data.d_no}
                                            </th>
                                            <td className="px-6 py-4">
                                                {data.category}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.color}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.quantity}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.cost_price}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.sale_price}
                                            </td>
                                            <td className="pl-10 py-4">
                                                <span onClick={() => openHistoryModal(data?.id)}>
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
                    </div >
                )}
            </section>

            {/* -------- PAGINATION -------- */}
            <section className="flex justify-center">
                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                        <li>
                            {Suit?.page > 1 ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/suits?page=${page - 1}`}
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
                            {Suit?.totalPages !== page ? (
                                <Link
                                    onClick={ToDown}
                                    to={`/dashboard/suits?page=${page + 1}`}
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

            {/* ---------- ADD SUIT MODALS ------------ */}
            {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-2xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add New Suit
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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
                                    <div>
                                        <input
                                            name="category"
                                            type="text"
                                            placeholder="Enter Category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="color"
                                            type="text"
                                            placeholder="Enter Color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="quantity"
                                            type="text"
                                            placeholder="Enter Quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="cost_price"
                                            type="text"
                                            placeholder="Enter Cost Price"
                                            value={formData.cost_price}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="sale_price"
                                            type="text"
                                            placeholder="Enter Sale Price"
                                            value={formData.sale_price}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="d_no"
                                            type="text"
                                            placeholder="Enter Design Number"
                                            value={formData.d_no}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center pt-2">
                                    {SuitLoading ? (
                                        <button disabled="" type="button" class="text-white border-gray-600 bg-gray-600  focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700  inline-flex items-center">
                                            <svg aria-hidden="true" role="status" class="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                            </svg>
                                            Loading...
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
                                        >
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {/* ---------- HISTORY MODALS ------------ */}
            {historyModalOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-4xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Suit History
                            </h3>
                            <button
                                onClick={closeHistoryModal}
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
                                            Date
                                        </th>
                                        <th
                                            className="px-6 py-3"
                                            scope="col"
                                        >
                                            Cost Price
                                        </th>
                                        <th
                                            className="px-6 py-3"
                                            scope="col"
                                        >
                                            Sale Price
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
                                    {filteredSuitData && filteredSuitData.length > 0 ? (
                                        filteredSuitData?.map((item, index) => (
                                            item?.all_records?.map((data, subIndex) => (
                                                <tr key={`${index}-${subIndex}`} className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                                    <td className="px-6 py-4" scope="row">
                                                        {new Date(data?.date).toLocaleDateString()}
                                                    </td>
                                                    <th className="px-6 py-4 font-medium" >
                                                        {data?.cost_price}
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {data?.sale_price}
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
    );
}

export default SuitsStock;
