import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Dropdown } from "flowbite-react";
// import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
// import { FaStore } from "react-icons/fa";
// import { MdAddBusiness } from "react-icons/md";
// import { FaOpencart } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutUserAsync } from "../../features/authSlice";
import toast from "react-hot-toast";


const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    // STATES
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const [isInStockDropdownOpen, setIsInStockDropdownOpen] = useState(false);
    const [isBillsDropdownOpen, setIsBillsDropdownOpen] = useState(false);
    const [isProcessDropdownOpen, setIsProcessDropdownOpen] = useState(false);
    const [isAccountsDropdownOpen, setIsAccountsDropdownOpen] = useState(false);

    const toggleInStockDropdown = () => {
        setIsInStockDropdownOpen((prevState) => !prevState);
        setIsBillsDropdownOpen(false);
        setIsProcessDropdownOpen(false);
        setIsAccountsDropdownOpen(false);
    };

    const toggleBillsDropdown = () => {
        setIsBillsDropdownOpen((prevState) => !prevState);
        setIsInStockDropdownOpen(false);
        setIsProcessDropdownOpen(false);
        setIsAccountsDropdownOpen(false);
    };

    const toggleProcessDropdown = () => {
        setIsProcessDropdownOpen((prevState) => !prevState);
        setIsInStockDropdownOpen(false);
        setIsBillsDropdownOpen(false);
        setIsAccountsDropdownOpen(false);
    };

    const toggleAccountsDropdown = () => {
        setIsAccountsDropdownOpen((prevState) => !prevState);
        setIsProcessDropdownOpen(false);
        setIsInStockDropdownOpen(false);
        setIsBillsDropdownOpen(false);
    };

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/')
        }

    }, [user, dispatch, navigate])

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = (event) => {
        if (
            !menuRef.current.contains(event.target) &&
            event.target !== menuButtonRef.current
        ) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeMenu);

        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    // HANDLE THEME CHANGE
    const handleThemeChange = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        toggleMenu();
    };

    // HANDLE LOGOUT
    const handleLogout = () => {
        dispatch(logoutUserAsync())
    }


    const handleMoveTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                {/* ---------------- NAVBAR ---------------- */}
                <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
                    <div className="flex flex-wrap justify-between items-center mx-5">
                        {/* ---------------- NAVBAR - LEFT ---------------- */}
                        <div className="flex justify-start items-center">
                            <button
                                aria-controls="drawer-navigation"
                                className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                onClick={toggleSidebar}
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        fillRule="evenodd"
                                    />
                                </svg>
                                <svg
                                    aria-hidden="true"
                                    className="hidden w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        fillRule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Toggle sidebar</span>
                            </button>

                            <Link to="/dashboard" className="hidden sm:flex items-center justify-between mr-4">
                                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                    NAILA ARTS
                                </span>
                            </Link>
                        </div>

                        {/* ---------------- NAVBAR - RIGHT ---------------- */}
                        <div className="flex items-center gap-2 lg:order-2">
                            <button className="inline-block rounded border border-gray-800 bg-white px-4 py-2.5 mx-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-600 focus:outline-none active:text-gray-500">
                                Generate Bill
                            </button>

                            <button className="custom-button inline-block rounded border border-gray-600 bg-gray-600 px-4 py-2.5 mx-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none active:text-gray-100">
                                Return
                            </button>
                            {/* <p className="text-xl capitalize mx-5 text-gray-900 dark:text-gray-100">{user?.name}</p> */}

                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        aria-expanded={isMenuOpen}
                                        aria-haspopup="true"
                                        className="inline-flex justify-center items-center gap-x-1.5 rounded-full bg-gray-100 h-9 w-9 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 capitalize"
                                        id="menu-button"
                                        type="button"
                                        onClick={toggleMenu}
                                        ref={menuButtonRef}
                                    >
                                        {user?.user?.name[0]}
                                    </button>
                                </div>
                                <div
                                    aria-labelledby="menu-button"
                                    aria-orientation="vertical"
                                    className={`${isMenuOpen ? "" : "hidden"
                                        } absolute right-0 z-10 mt-5 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                    role="menu"
                                    tabIndex="-1"
                                    ref={menuRef}
                                >
                                    <div className="py-1" role="none">
                                        <button
                                            onClick={handleThemeChange}
                                            className="text-gray-700 block px-4 w-full py-2 hover:bg-gray-200"
                                            id="menu-item-1"
                                            role="menuitem"
                                            tabIndex="-1"
                                        >
                                            {theme === "light" ? (
                                                <span className="flex text-md gap-2"><Moon size={20} />Dark Mode</span>
                                            ) : (
                                                <span className="flex text-md gap-2"><Sun size={20} />Light Mode</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="text-red-700 block w-full px-4 py-2 text-left hover:bg-gray-200"
                                            id="menu-item-3"
                                            role="menuitem"
                                            tabIndex="-1"
                                            type="submit"
                                        >
                                            <span className="flex text-md font-normal gap-2"><IoLogOutOutline size={20} /> Sign out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                {/* ---------------- SIDEBAR ---------------- */}
                <aside aria-label="Sidenav" className={`fixed top-0 left-0 z-40 w-56 xl:w-64 h-screen pt-14 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}>

                    <div className="overflow-y-auto py-5 h-full bg-[#FAFAFA] dark:bg-gray-800">
                        <ul className="pt-10">

                            {/* DASHBOARD */}
                            <li>
                                <Link to="/dashboard" onClick={handleMoveTop} className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${location.pathname === "/dashboard" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>
                                    {/* <FaStore size={22} className="text-gray-500 dark:text-gray-400" /> */}
                                    <span className="ml-3">Dashboard</span>
                                </Link>
                            </li>

                            {/* INSTOCK DROPDOWN */}
                            <li className="relative">
                                <button
                                    className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium group ${location.pathname.includes("suits") || location.pathname.includes("base") || location.pathname.includes("lace") || location.pathname.includes("bag") || location.pathname.includes("accessories") || location.pathname.includes("expense") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"}`}
                                    onClick={toggleInStockDropdown}
                                >
                                    <span className="ml-3">In Stock</span>
                                    <svg
                                        className={`ml-auto w-4 h-4 transform ${isInStockDropdownOpen ? 'rotate-180' : ''} transition-transform`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isInStockDropdownOpen && (
                                    <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">

                                        <li>
                                            <Link to="/dashboard/suits" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/suits" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Suits</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/base" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/base" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Base</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/lace" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/lace" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Lace</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/bag" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/bag" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Bag</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/accessories" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/accessories" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Accessories</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/expense" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/expense" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Expense</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* PROCESS DROPDOWN */}
                            <li className="relative">
                                <button
                                    className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium ${location.pathname.includes("embroidery") || location.pathname.includes("calendar") || location.pathname.includes("cutting") || location.pathname.includes("stitching") || location.pathname.includes("stones") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}
                                    onClick={toggleProcessDropdown}
                                >
                                    <span className="ml-3">Process</span>
                                    <svg
                                        className={`ml-auto w-4 h-4 transform ${isProcessDropdownOpen ? 'rotate-180' : ''} transition-transform`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isProcessDropdownOpen && (
                                    <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">

                                        <li>
                                            <Link to="/dashboard/embroidery" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/embroidery" || location.pathname.includes("embroidery-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Embroidery</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/calendar" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/calendar" || location.pathname.includes("calendar-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Calendar</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/cutting" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/cutting" || location.pathname.includes("cutting-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Cutting</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/stitching" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/stitching" || location.pathname.includes("stitching-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Stitching</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/stones" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/stones" || location.pathname.includes("stones-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Stones</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* ACCOUNTS DROPDOWN */}
                            <li className="relative">
                                <button
                                    className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium group
                                        ${location.pathname.includes("buyers") || location.pathname.includes("sellers") || location.pathname.includes("employee") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"}`}
                                    onClick={toggleAccountsDropdown}
                                >
                                    <span className="ml-3">Accounts</span>
                                    <svg
                                        className={`ml-auto w-4 h-4 transform ${isAccountsDropdownOpen ? 'rotate-180' : ''} transition-transform`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isAccountsDropdownOpen && (
                                    <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                                        <li>
                                            <Link to="/dashboard/buyers" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/buyers" || location.pathname.includes("buyers-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Buyers</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/sellers" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/sellers" || location.pathname.includes("sellers-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Sellers</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/employee" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/employee" || location.pathname.includes("employee-details") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Employee</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* CASH IN/OUT */}
                            <li>
                                <Link to="/dashboard/cash" onClick={handleMoveTop} className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${location.pathname === "/dashboard/cash" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>
                                    {/* <FaStore size={22} className="text-gray-500 dark:text-gray-400" /> */}
                                    <span className="ml-3">Cash</span>
                                </Link>
                            </li>

                            {/* BILLS DROPDOWN */}
                            <li className="relative">
                                <button
                                    className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium group
                                         ${location.pathname.includes("naila-arts-buyer") || location.pathname.includes("processbills") || location.pathname.includes("purchasebills") ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"}
                                         `}
                                    onClick={toggleBillsDropdown}
                                >
                                    <span className="ml-3">Bills</span>
                                    <svg
                                        className={`ml-auto w-4 h-4 transform ${isBillsDropdownOpen ? 'rotate-180' : ''} transition-transform`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isBillsDropdownOpen && (
                                    <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">

                                        <li>
                                            <Link to="/dashboard/naila-arts-buyer" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/naila-arts-buyer" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Naila Arts Buyer</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/processbills" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/processbills" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Process Bills</Link>
                                        </li>
                                        <li>
                                            <Link to="/dashboard/purchasebills" onClick={handleMoveTop} className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${location.pathname === "/dashboard/purchasebills" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>Purchase Bills</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            {/* SHOP FOR SUPERADMIN */}
                            {user?.user?.role === "superadmin" ? (
                                <li>
                                    <Link to="/dashboard/Shop" onClick={handleMoveTop} className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${location.pathname === "/dashboard/Shop" ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400" : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"} group`}>
                                        {/* <FaStore size={22} className="text-gray-500 dark:text-gray-400" /> */}
                                        <span className="ml-3">Shop</span>
                                    </Link>
                                </li>) : null}
                        </ul>
                    </div>
                </aside >
                {/* ---------------- DASHBOARD ---------------- */}
                < main className="ml-0 md:ml-56 lg:ml-56 xl:ml-64 h-auto pt-16 pb-10 bg-white dark:bg-gray-900" >
                    <Outlet />
                </ main>
            </div >
        </>
    );
};

export default Dashboard;
