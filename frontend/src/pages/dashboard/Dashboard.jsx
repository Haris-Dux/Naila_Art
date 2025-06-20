import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutUserAsync } from "../../features/authSlice";
import { RiNotification2Line } from "react-icons/ri";
import { showNotificationsForChecksAsync } from "../../features/BuyerSlice";
import moment from "moment-timezone";
import { generateOtherSaleAsync } from "../../features/OtherSale";
import { FaBookOpen } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  // STATES
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkNotifications, setChecksNotifications] = useState(false);
  const { PaymentData } = useSelector((state) => state.PaymentMethods);
  const [isInStockDropdownOpen, setIsInStockDropdownOpen] = useState(false);
  const [isBillsDropdownOpen, setIsBillsDropdownOpen] = useState(false);
  const [isProcessDropdownOpen, setIsProcessDropdownOpen] = useState(false);
  const [isAccountsDropdownOpen, setIsAccountsDropdownOpen] = useState(false);
  const [othersaleModal, setOtherSaleModal] = useState(false);

  const [formData, setFormData] = useState({
    cash: "",
    amount: "",
    city: "",
    cargo: "",
    name: "",
    phone: "",
    category: "",
    color: "",
    quantity: "",
    branchId: "",
    payment_Method: "",
    date: today,
    note: "",
    bill_by: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const { user, logoutLoading } = useSelector((state) => state.auth);
  const { generateOtherSaleLoading } = useSelector((state) => state.OtherBills);
  const { CheckNotifications } = useSelector((state) => state.Buyer);

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
    if (user && user?.user?.role !== "user") {
      dispatch(showNotificationsForChecksAsync());
    }
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [dispatch, user]);

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

  const handleLogout = () => {
    dispatch(logoutUserAsync()).then((res) => {
      if (res.payload.success) {
        navigate("/");
      }
    });
  };

  const handleMoveTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const viewChecksData = () => {
    document.body.style.overflow = "hidden";
    setChecksNotifications(true);
    if (user && user?.user?.role !== "user") {
      dispatch(showNotificationsForChecksAsync());
    }
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setChecksNotifications(false);
    setOtherSaleModal(false);
    setFormData({
      cash: "",
      amount: "",
      city: "",
      cargo: "",
      name: "",
      phone: "",
      category: "",
      color: "",
      quantity: "",
      branchId: "",
      payment_Method: "",
      date: today,
      note: "",
      bill_by: "",
    });
  };

  const openOtherSaleModal = () => {
    setOtherSaleModal(true);
    document.body.style.overflow = "hidden";
  };

  const notificationValue = CheckNotifications?.data?.length || 0;

  const handleGenerateOtherSale = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      phone: formData.phone,
      amount: Number(formData.amount),
      city: formData.city,
      cargo: formData.cargo,
      date: formData.date,
      bill_by: formData.bill_by,
      payment_Method: formData.payment_Method,
      quantity: formData.quantity,
      note: formData.note,
    };
    dispatch(generateOtherSaleAsync(payload)).then((res) => {
      if (res.payload.success) {
        closeModal();
      }
    });
  };

  const enviroment = import.meta.env.VITE_APP_ENV;

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

              <Link
                to="/dashboard"
                className="hidden sm:flex items-center justify-between mr-4"
              >
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  NAILA ARTS{" "}
                  {enviroment === "dev" ? (
                    <span>( DEV ENVIROMENT )</span>
                  ) : null}
                </span>
              </Link>
            </div>

            {/* ---------------- NAVBAR - RIGHT ---------------- */}
            <div className="flex items-center gap-2 lg:order-2">
              <Link
                to="/dashboard/cash-book"
                className=" flex items-center gap-2 rounded border border-gray-800 bg-white px-4 py-2.5 mx-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-600 focus:outline-none active:text-gray-500"
              >
                Cash Book
                <FaBookOpen size={24} />
              </Link>

              <Link
                to="/dashboard/generate-bill"
                className="inline-block rounded border border-gray-800 bg-white px-4 py-2.5 mx-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-600 focus:outline-none active:text-gray-500"
              >
                Generate Buyer Bill
              </Link>
              {user && user?.user?.role === "superadmin" && (
                <button
                  onClick={openOtherSaleModal}
                  className="inline-block rounded border border-gray-800 bg-white px-4 py-2.5 mx-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-600 focus:outline-none active:text-gray-500"
                >
                  Generate Other Sale
                </button>
              )}
              {user && user?.user?.role !== "user" && (
                <button className="relative mr-2">
                  <RiNotification2Line
                    onClick={viewChecksData}
                    size={32}
                    className="text-2xl text-gray-700 hover:text-gray-900 cursor-pointer"
                  />
                  <div className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white text-xs font-medium shadow-md border-2 border-white">
                    {notificationValue}
                  </div>
                </button>
              )}

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
                  className={`${
                    isMenuOpen ? "" : "hidden"
                  } absolute right-0 z-10 mt-5 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  tabIndex="-1"
                  ref={menuRef}
                >
                  <div className="py-1" role="none">
                    <>
                      {logoutLoading ? (
                        <button
                          disabled
                          className="text-red-400 cursor-not-allowed block w-full px-4 py-2 text-left hover:bg-gray-200"
                          id="menu-item-3"
                          role="menuitem"
                          tabIndex="-1"
                          type="submit"
                        >
                          <span className="flex text-md font-normal gap-2">
                            <IoLogOutOutline size={20} /> Signing out
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={handleLogout}
                          className="text-red-700 block w-full px-4 py-2 text-left hover:bg-gray-200"
                          id="menu-item-3"
                          role="menuitem"
                          tabIndex="-1"
                          type="submit"
                        >
                          <span className="flex text-md font-normal gap-2">
                            <IoLogOutOutline size={20} /> Sign out
                          </span>
                        </button>
                      )}
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* ---------------- SIDEBAR ---------------- */}
        <aside
          aria-label="Sidenav"
          className={`fixed top-0 left-0 z-40 w-56 xl:w-64 h-screen pt-14 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        >
          <div className="scrollable-content py-5 h-full bg-[#FAFAFA] dark:bg-gray-800">
            <ul className="pt-2">
              {/* DASHBOARD */}
              <li>
                <Link
                  to="/dashboard"
                  onClick={handleMoveTop}
                  className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                    location.pathname === "/dashboard"
                      ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                      : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                  } group`}
                >
                  {/* <FaStore size={22} className="text-gray-500 dark:text-gray-400" /> */}
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>

              {/* INSTOCK DROPDOWN */}
              <li className="relative">
                <button
                  className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium group ${
                    location.pathname.includes("suits") ||
                    location.pathname.includes("base") ||
                    location.pathname.includes("lace") ||
                    location.pathname.includes("bag") ||
                    location.pathname.includes("accessories")
                      ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                      : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={toggleInStockDropdown}
                >
                  <span className="ml-3">In Stock</span>
                  <svg
                    className={`ml-auto w-4 h-4 transform ${
                      isInStockDropdownOpen ? "rotate-180" : ""
                    } transition-transform`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isInStockDropdownOpen && (
                  <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <li>
                      <Link
                        to="/dashboard/suits"
                        onClick={handleMoveTop}
                        className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                          location.pathname === "/dashboard/suits"
                            ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                            : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                        } group`}
                      >
                        Suits
                      </Link>
                    </li>

                    {user?.user?.role !== "user" ? (
                      <>
                        <li>
                          <Link
                            to="/dashboard/base"
                            onClick={handleMoveTop}
                            className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                              location.pathname === "/dashboard/base"
                                ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                                : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                            } group`}
                          >
                            Base
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/dashboard/lace"
                            onClick={handleMoveTop}
                            className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                              location.pathname === "/dashboard/lace"
                                ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                                : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                            } group`}
                          >
                            Lace
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/dashboard/bag"
                            onClick={handleMoveTop}
                            className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                              location.pathname === "/dashboard/bag"
                                ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                                : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                            } group`}
                          >
                            Bag
                          </Link>
                        </li>
                      </>
                    ) : null}

                    <li>
                      <Link
                        to="/dashboard/accessories"
                        onClick={handleMoveTop}
                        className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                          location.pathname === "/dashboard/accessories"
                            ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                            : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                        } group`}
                      >
                        Accessories
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* PROCESS DROPDOWN */}
              {user?.user?.role !== "user" ? (
                <li className="relative">
                  <button
                    className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium ${
                      location.pathname.includes("embroidery") ||
                      location.pathname.includes("calendar") ||
                      location.pathname.includes("cutting") ||
                      location.pathname.includes("stitching") ||
                      location.pathname.includes("stones")
                        ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                        : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                    } group`}
                    onClick={toggleProcessDropdown}
                  >
                    <span className="ml-3">Process</span>
                    <svg
                      className={`ml-auto w-4 h-4 transform ${
                        isProcessDropdownOpen ? "rotate-180" : ""
                      } transition-transform`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isProcessDropdownOpen && (
                    <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <li>
                        <Link
                          to="/dashboard/embroidery"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/embroidery" ||
                            location.pathname.includes("embroidery-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Embroidery
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/calendar"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/calendar" ||
                            location.pathname.includes("calendar-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Calendar
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/cutting"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/cutting" ||
                            location.pathname.includes("cutting-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Cutting
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/stones"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/stones" ||
                            location.pathname.includes("stones-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Stones
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/stitching"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/stitching" ||
                            location.pathname.includes("stitching-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Stitching
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ) : null}

              {/* ACCOUNTS DROPDOWN */}
              <li className="relative">
                <button
                  className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium group
                                        ${
                                          location.pathname.includes(
                                            "buyers"
                                          ) ||
                                          location.pathname.includes(
                                            "sellers"
                                          ) ||
                                          location.pathname.includes("employee")
                                            ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                                            : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                                        }`}
                  onClick={toggleAccountsDropdown}
                >
                  <span className="ml-3">Accounts</span>
                  <svg
                    className={`ml-auto w-4 h-4 transform ${
                      isAccountsDropdownOpen ? "rotate-180" : ""
                    } transition-transform`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isAccountsDropdownOpen && (
                  <ul className="absolute left-0 z-10 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <li>
                      <Link
                        to="/dashboard/buyers"
                        onClick={handleMoveTop}
                        className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                          location.pathname === "/dashboard/buyers" ||
                          location.pathname.includes("buyers-details") ||
                          location.pathname.includes("generate-bill")
                            ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                            : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                        } group`}
                      >
                        Buyers
                      </Link>
                    </li>
                    {user?.user?.role !== "user" ? (
                      <li>
                        <Link
                          to="/dashboard/sellers"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/sellers" ||
                            location.pathname.includes("sellers-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Sellers
                        </Link>
                      </li>
                    ) : null}
                    {user?.user?.role === "superadmin" && (
                      <li>
                        <Link
                          to="/dashboard/employee"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/employee" ||
                            location.pathname.includes("employee-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Employee
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>

              {/* BILLS DROPDOWN */}
              <li className="relative">
                <button
                  className={`h-14 pl-4 w-full border-t flex items-center p-2 text-base font-medium group
                                         ${
                                           location.pathname.includes(
                                             "naila-arts-buyer"
                                           ) ||
                                           location.pathname.includes(
                                             "processbills"
                                           ) ||
                                           location.pathname.includes(
                                             "purchasebills"
                                           )
                                             ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                                             : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                                         }
                                         `}
                  onClick={toggleBillsDropdown}
                >
                  <span className="ml-3">Bills</span>
                  <svg
                    className={`ml-auto w-4 h-4 transform ${
                      isBillsDropdownOpen ? "rotate-180" : ""
                    } transition-transform`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isBillsDropdownOpen && (
                  <ul className="absolute left-0 z-0 mt-2 w-full border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <li>
                      <Link
                        to="/dashboard/naila-arts-buyer"
                        onClick={handleMoveTop}
                        className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                          location.pathname === "/dashboard/naila-arts-buyer"
                            ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                            : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                        } group`}
                      >
                        Buyer Bills
                      </Link>
                    </li>
                    {user?.user?.role !== "user" ? (
                      <li>
                        <Link
                          to="/dashboard/processbills"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/processbills" ||
                            location.pathname.includes("process-details")
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Process Bills
                        </Link>
                      </li>
                    ) : null}
                    {user?.user?.role !== "user" ? (
                      <li>
                        <Link
                          to="/dashboard/purchasebills"
                          onClick={handleMoveTop}
                          className={`h-14 pl-12 border-t flex items-center p-2 text-base cursor-pointer font-medium ${
                            location.pathname === "/dashboard/purchasebills"
                              ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                              : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                          } group`}
                        >
                          Purchase Bills
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                )}
              </li>

              {/* Expense  */}
              <li>
                <Link
                  to="/dashboard/expense"
                  onClick={handleMoveTop}
                  className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                    location.pathname.includes(
                      "/dashboard/expense" || "/dashboard/expense-stats"
                    )
                      ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                      : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                  } group`}
                >
                  <span className="ml-3">Expense</span>
                </Link>
              </li>

              {/* B PAir */}
              {user?.user?.role !== "user" ? (
                <li>
                  <Link
                    to="/dashboard/bpair"
                    onClick={handleMoveTop}
                    className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                      location.pathname === "/dashboard/bpair"
                        ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                        : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                    } group`}
                  >
                    <span className="ml-3">B Pair</span>
                  </Link>
                </li>
              ) : null}

              {/* CASH IN/OUT */}
              <li>
                <Link
                  to="/dashboard/cash"
                  onClick={handleMoveTop}
                  className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                    location.pathname === "/dashboard/cash"
                      ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                      : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                  } group`}
                >
                  {/* <FaStore size={22} className="text-gray-500 dark:text-gray-400" /> */}
                  <span className="ml-3">Cash</span>
                </Link>
              </li>

              {/* DAILY SALE */}
              <li>
                <Link
                  to="/dashboard/dailySale"
                  onClick={handleMoveTop}
                  className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                    location.pathname === "/dashboard/dailySale" ||
                    location.pathname.includes("dailySale-details")
                      ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                      : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                  } group`}
                >
                  <span className="ml-3">DailySale</span>
                </Link>
              </li>

              {/* SHOP FOR SUPERADMIN */}
              {user?.user?.role === "superadmin" ? (
                <>
                  <li>
                    <Link
                      to="/dashboard/Shop"
                      onClick={handleMoveTop}
                      className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                        location.pathname === "/dashboard/Shop"
                          ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                          : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                      } group`}
                    >
                      <span className="ml-3">Shop</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/paymentMethods"
                      onClick={handleMoveTop}
                      className={`h-14 pl-4 border-t flex items-center p-2 text-base font-medium ${
                        location.pathname === "/dashboard/paymentMethods"
                          ? "bg-[#434343] text-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400"
                          : "bg-[#FAFAFA] dark:bg-gray-800 text-gray-900 dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100"
                      } group`}
                    >
                      <span className="ml-3">Payment Methods</span>
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </aside>
        {/* ---------------- DASHBOARD ---------------- */}
        <main className="ml-0 md:ml-56 lg:ml-56 xl:ml-64 h-auto pt-16 pb-10 bg-white dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* CHECKS MODAL */}
      {checkNotifications && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-6xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <input
                type="text"
                placeholder="Search by Name"
                className="w-1/4 px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                onChange={(e) => setSearchQuery(e.target.value)}
              />

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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Name
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Phone
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Due Date
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Note
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      C.Number
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      C.Amount
                    </th>
                  </tr>
                </thead>
              </table>

              <div className="scrollable-content h-[50vh] overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                  <tbody>
                    {CheckNotifications &&
                    CheckNotifications?.data?.length > 0 ? (
                      CheckNotifications?.data
                        .filter((data) =>
                          data?.buyerName
                            ?.toLowerCase()
                            .includes(searchQuery?.toLowerCase())
                        )
                        .slice()
                        .reverse()
                        .map((data, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          >
                            <td className=" px-6 py-3 text-center">
                              {data?.buyerName}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {data?.buyerPhone}
                            </td>
                            <td className=" px-6 py-3 text-center" scope="row">
                              {data?.date}
                            </td>
                            <td className=" px-6 py-3 text-center" scope="row">
                              {data?.note}
                            </td>
                            <td className=" px-6 py-3 text-center" scope="row">
                              {data?.checkNumber}
                            </td>
                            <td className=" px-6 py-3 text-center">
                              {data?.checkAmount}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr className="w-full flex justify-center items-center">
                        <td className="text-xl mt-3">No Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTHER SALE MODAL */}
      {othersaleModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generate Other Sale
              </h3>
              <div className="flex items-center space-x-4">
                {/* View All Button */}

                <Link
                  className="px-4 py-1.5 ml-1 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                  to={"/dashboard/other-sale"}
                  onClick={closeModal}
                >
                  View All Bills
                </Link>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            </div>

            {/* Body */}
            <div className="p-4 md:p-5">
              <form onSubmit={handleGenerateOtherSale}>
                <div className="grid grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Party Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <input
                      name="amount"
                      type="number"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <input
                      name="city"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <input
                      name="cargo"
                      type="text"
                      placeholder="Cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      name="phone"
                      type="text"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Bill By */}
                  <div>
                    <input
                      name="bill_by"
                      type="text"
                      placeholder="Bill By"
                      value={formData.bill_by}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <input
                      name="quantity"
                      type="number"
                      placeholder="Quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <select
                      id="payment-method"
                      name="payment_Method"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.payment_Method}
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_Method: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Payment Method
                      </option>
                      {PaymentData?.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note */}
                  <div className="col-span-3">
                    <input
                      name="note"
                      type="text"
                      placeholder="Enter Note"
                      value={formData.note}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                  {generateOtherSaleLoading ? (
                    <button
                      disabled
                      type="submit"
                      className="inline-block cursor-not-allowed rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
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
    </>
  );
};

export default Dashboard;
