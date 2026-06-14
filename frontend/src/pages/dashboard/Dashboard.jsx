import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IoBagHandleOutline,
  IoBookOutline,
  IoBriefcaseOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoChevronDown,
  IoColorPaletteOutline,
  IoCubeOutline,
  IoGridOutline,
  IoLayersOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoRestaurantOutline,
  IoCutOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoStorefrontOutline,
  IoWalletOutline,
  IoPeople,
} from "react-icons/io5";
import { logoutUserAsync } from "../../features/authSlice";
import { RiNotification2Line } from "react-icons/ri";
import { showNotificationsForChecksAsync } from "../../features/BuyerSlice";
import moment from "moment-timezone";
import { generateOtherSaleAsync } from "../../features/OtherSale";
import { FaBookOpen } from "react-icons/fa";
import { Roles } from "../../constants/Roles";

const baseNavItemClass =
  "flex w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors";
const parentNavItemClass = `${baseNavItemClass} h-10`;
const childNavItemClass = `${baseNavItemClass} h-9 pl-8`;
const activeNavItemClass = "bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900";
const inactiveNavItemClass =
  "text-gray-700 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-200 dark:hover:bg-gray-700";
const roleGroups = {
  all: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.BRANCH_USER],
  adminAndSuperAdmin: [Roles.SUPER_ADMIN, Roles.ADMIN],
  superAdminOnly: [Roles.SUPER_ADMIN],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  // STATES
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkNotifications, setChecksNotifications] = useState(false);
  const { PaymentData } = useSelector((state) => state.PaymentMethods);
  const [openSection, setOpenSection] = useState("");
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

  const { user, logoutLoading } = useSelector((state) => state.auth);
  const { generateOtherSaleLoading } = useSelector((state) => state.OtherBills);
  const { CheckNotifications } = useSelector((state) => state.Buyer);

  useEffect(() => {
    if (user && user?.user?.role !== Roles.BRANCH_USER) {
      dispatch(showNotificationsForChecksAsync());
    }
  }, [dispatch, user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    if (user && user?.user?.role !== Roles.BRANCH_USER) {
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
  const userRole = user?.user?.role;
  const canAccess = (allowedRoles = roleGroups.all) =>
    allowedRoles.includes(userRole);

  const isRouteActive = (matches = []) =>
    matches.some((match) =>
      match.exact
        ? location.pathname === match.path
        : location.pathname.includes(match.path)
    );

  const closeSidebarOnMobile = () => {
    setIsSidebarOpen(false);
    handleMoveTop();
  };

  const sidebarSections = [
    {
      type: "link",
      label: "Dashboard",
      to: "/dashboard",
      icon: IoGridOutline,
      allowedRoles: roleGroups.all,
      matches: [{ path: "/dashboard", exact: true }],
    },
    {
      key: "stock",
      label: "In Stock",
      icon: IoCubeOutline,
      allowedRoles: roleGroups.all,
      matches: [
        { path: "suits" },
        { path: "base" },
        { path: "lace" },
        { path: "bag" },
        { path: "accessories" },
      ],
      items: [
        {
          label: "Suits",
          to: "/dashboard/suits",
          icon: IoStorefrontOutline,
          allowedRoles: roleGroups.all,
          matches: [{ path: "/dashboard/suits", exact: true }],
        },
        {
          label: "Base",
          to: "/dashboard/base",
          icon: IoLayersOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "/dashboard/base", exact: true }],
        },
        {
          label: "Lace",
          to: "/dashboard/lace",
          icon: IoColorPaletteOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "/dashboard/lace", exact: true }],
        },
        {
          label: "Bag",
          to: "/dashboard/bag",
          icon: IoBagHandleOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "/dashboard/bag", exact: true }],
        },
        {
          label: "Accessories",
          to: "/dashboard/accessories",
          icon: IoSettingsOutline,
          allowedRoles: roleGroups.all,
          matches: [{ path: "/dashboard/accessories", exact: true }],
        },
      ].filter((item) => canAccess(item.allowedRoles)),
    },
    {
      key: "process",
      label: "Process",
      icon: IoBriefcaseOutline,
      allowedRoles: roleGroups.adminAndSuperAdmin,
      matches: [
        { path: "process-analytics" },
        { path: "embroidery" },
        { path: "calendar" },
        { path: "cutting" },
        { path: "stitching" },
        { path: "stones" },
      ],
      items: [
        {
          label: "Analytics",
          to: "/dashboard/process-analytics",
          icon: IoStatsChartOutline,
          allowedRoles: roleGroups.superAdminOnly,
          matches: [{ path: "process-analytics" }],
        },
        {
          label: "Embroidery",
          to: "/dashboard/embroidery",
          icon: IoColorPaletteOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "embroidery" }],
        },
        {
          label: "Calendar",
          to: "/dashboard/calendar",
          icon: IoCalendarOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "calendar" }],
        },
        {
          label: "Cutting",
          to: "/dashboard/cutting",
          icon: IoCutOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "cutting" }],
        },
        {
          label: "Stones",
          to: "/dashboard/stones",
          icon: IoRestaurantOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "stones" }],
        },
        {
          label: "Stitching",
          to: "/dashboard/stitching",
          icon: IoLayersOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "stitching" }],
        },
      ].filter((item) => canAccess(item.allowedRoles)),
    },
    {
      key: "accounts",
      label: "Accounts",
      icon: IoPeopleOutline,
      allowedRoles: roleGroups.all,
      matches: [
        { path: "accounts-dashboard" },
        { path: "buyers" },
        { path: "sellers" },
        { path: "generate-bill" },
        { path: "other-accounts" },
        { path: "processbills" },
        { path: "process-details" },
      ],
      items: [
        {
          label: "Analytics",
          to: "/dashboard/accounts-dashboard",
          icon: IoStatsChartOutline,
          allowedRoles: roleGroups.superAdminOnly,
          matches: [{ path: "accounts-dashboard" }],
        },
        {
          label: "Buyers",
          to: "/dashboard/buyers",
          icon: IoPeopleOutline,
          allowedRoles: roleGroups.all,
          matches: [
            { path: "/dashboard/buyers", exact: true },
            { path: "buyers-details" },
            { path: "generate-bill" },
          ],
        },
        {
          label: "Sellers",
          to: "/dashboard/sellers",
          icon: IoPeopleOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "sellers" }],
        },
        {
          label: "Process",
          to: "/dashboard/processbills",
          icon: IoBookOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "processbills" }, { path: "process-details" }],
        },
        {
          label: "Other Accounts",
          to: "/dashboard/other-accounts",
          icon: IoWalletOutline,
          allowedRoles: roleGroups.superAdminOnly,
          matches: [{ path: "other-accounts" }],
        },
      ].filter((item) => canAccess(item.allowedRoles)),
    },
    {
      type: "link",
      label: "Employee",
      to: "/dashboard/employee",
      icon: IoPeopleOutline,
      allowedRoles: roleGroups.superAdminOnly,
      matches: [{ path: "/dashboard/employee", exact: true}]
    },
    {
      key: "bills",
      label: "Bills",
      icon: IoReceiptOutline,
      allowedRoles: roleGroups.all,
      matches: [
        { path: "naila-arts-buyer" },
        { path: "purchasebills" },
      ],
      items: [
        {
          label: "Buyer Bills",
          to: "/dashboard/naila-arts-buyer",
          icon: IoReceiptOutline,
          allowedRoles: roleGroups.all,
          matches: [{ path: "naila-arts-buyer" }],
        },
        {
          label: "Purchase Bills",
          to: "/dashboard/purchasebills",
          icon: IoReceiptOutline,
          allowedRoles: roleGroups.adminAndSuperAdmin,
          matches: [{ path: "purchasebills" }],
        },
      ].filter((item) => canAccess(item.allowedRoles)),
    },
    {
      type: "link",
      label: "Expense",
      to: "/dashboard/expense",
      icon: IoCashOutline,
      allowedRoles: roleGroups.all,
      matches: [{ path: "expense" }],
    },
    {
      type: "link",
      label: "B Pair",
      to: "/dashboard/bpair",
      icon: IoLayersOutline,
      allowedRoles: roleGroups.adminAndSuperAdmin,
      matches: [{ path: "/dashboard/bpair", exact: true }],
    },
    {
      type: "link",
      label: "Cash",
      to: "/dashboard/cash",
      icon: IoCashOutline,
      allowedRoles: roleGroups.all,
      matches: [{ path: "/dashboard/cash", exact: true }],
    },
    {
      type: "link",
      label: "Daily Sale",
      to: "/dashboard/dailySale",
      icon: IoWalletOutline,
      allowedRoles: roleGroups.all,
      matches: [{ path: "dailySale" }],
    },
    {
      type: "link",
      label: "Shop",
      to: "/dashboard/Shop",
      icon: IoStorefrontOutline,
      allowedRoles: roleGroups.superAdminOnly,
      matches: [{ path: "/dashboard/Shop", exact: true }],
    },
    {
      type: "link",
      label: "Payment Methods",
      to: "/dashboard/paymentMethods",
      icon: IoWalletOutline,
      allowedRoles: roleGroups.superAdminOnly,
      matches: [{ path: "/dashboard/paymentMethods", exact: true }],
    },
  ].filter((section) => canAccess(section.allowedRoles));

  useEffect(() => {
    const activeSection = sidebarSections.find(
      (section) => section.items && isRouteActive(section.matches)
    );

    if (activeSection) {
      setOpenSection(activeSection.key);
    }
  }, [location.pathname]);

  const renderSidebarLink = (item, isChild = false) => {
    const Icon = item.icon;
    const isActive = isRouteActive(item.matches);

    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={closeSidebarOnMobile}
        className={`${isChild ? childNavItemClass : parentNavItemClass} ${
          isActive ? activeNavItemClass : inactiveNavItemClass
        }`}
      >
        <Icon size={isChild ? 16 : 18} className="shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

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
                className="p-2 mr-2 text-gray-600                           {section.items.map((item) =>
rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
              {user && user?.user?.role === Roles.SUPER_ADMIN && (
                <>
                <button
                  onClick={openOtherSaleModal}
                  className="inline-block rounded border border-gray-800 bg-white px-4 py-2.5 mx-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-600 focus:outline-none active:text-gray-500"
                >
                  Generate Other Sale
                </button>

                <Link
                to="/dashboard/employee-attendance"
                className=" flex items-center gap-2 rounded border border-gray-800 bg-white px-4 py-2.5 mx-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-600 focus:outline-none active:text-gray-500"
              >
                Attendance
                <IoPeople size={24} />
              </Link>

              </>
              )}
              {user && user?.user?.role !== Roles.BRANCH_USER && (
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
            </div>
          </div>
        </nav>

        {/* ---------------- SIDEBAR ---------------- */}
        <aside
          aria-label="Sidenav"
          className={`fixed top-0 left-0 z-40 h-screen w-60 pt-14 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } border-r border-gray-200 bg-white md:translate-x-0 dark:border-gray-700 dark:bg-gray-800`}
        >
          <div className="flex h-full flex-col bg-white dark:bg-gray-800">
            <nav className="scrollable-content flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {sidebarSections.map((section) => {
                if (section.type === "link") {
                  return renderSidebarLink(section);
                }

                const Icon = section.icon;
                const isOpen = openSection === section.key;
                const isActive = isRouteActive(section.matches);

                return (
                  <div key={section.key}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSection((prev) =>
                          prev === section.key ? "" : section.key
                        )
                      }
                      className={`${parentNavItemClass} ${
                        isActive ? activeNavItemClass : inactiveNavItemClass
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="flex-1 truncate text-left">
                        {section.label}
                      </span>
                      <IoChevronDown
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        <div className="mt-1 space-y-1 border-l border-gray-200 pl-2 dark:border-gray-700">
                          {section.items.map((item) =>
                            renderSidebarLink(item, true)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold uppercase text-white dark:bg-gray-100 dark:text-gray-900">
                  {user?.user?.name?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.user?.name}
                  </p>
                  <p className="truncate text-xs capitalize text-gray-500 dark:text-gray-300">
                    {userRole}
                  </p>
                </div>
              </div>

              <button
                disabled={logoutLoading}
                onClick={handleLogout}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200"
              >
                <IoLogOutOutline size={18} />
                {logoutLoading ? "Signing out" : "Sign out"}
              </button>
            </div>
          </div>
        </aside>
        {/* ---------------- DASHBOARD ---------------- */}
        <main className="ml-0 h-auto bg-white pt-16 pb-10 md:ml-60 dark:bg-gray-900">
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
