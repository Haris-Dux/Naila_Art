import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  DeleteExpenseAsync,
  GetAllBranches,
  GetAllExpense,
} from "../../../features/InStockSlice";
import { IoAdd } from "react-icons/io5";
import ExpenseModal from "../../bills/Modals/ExpenseModal";
import { MdOutlineDelete } from "react-icons/md";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";

const Expense = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState();
  const { PaymentData } = useSelector((state) => state.PaymentMethods);
  const { user } = useSelector((state) => state.auth);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const { Branches, loading, deleteLodaing } = useSelector(
    (state) => state.InStock
  );
  const { ExpenseLoading, Expense } = useSelector((state) => state.InStock);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [expenseModal, setexpenseModal] = useState(false);
  const [confirmationModal, setconfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  const handleTabClick = () => {
    setexpenseModal(!expenseModal);
  };

  useEffect(() => {
    const id = user?.user?.id;
    if (user?.user?.role === "superadmin") {
      dispatch(GetAllBranches({ id }));
    } else {
      setSelectedBranchId(user?.user?.branchId);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user?.user?.role === "superadmin" && Branches.length > 0) {
      setSelectedBranchId(Branches[0]?.id);
    }
  }, [Branches, user]);

  useEffect(() => {
    if (selectedBranchId) {
      const payload = {
        page,
        branchId: selectedBranchId,
      };
      dispatch(GetAllExpense(payload));
    }
  }, [dispatch, selectedBranchId, page]);

  const renderPaginationLinks = () => {
    const totalPages = Expense?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/expense?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
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

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value === "") {
      dispatch(GetAllExpense({ branchId: selectedBranchId, page }));
    } else {
      dispatch(
        GetAllExpense({ branchId: selectedBranchId, search: value, page: 1 })
      );
    }
  };

  const handleBranchClick = (branchId) => {
    const selectedBranch = branchId;

    setSelectedBranchId(selectedBranch);

    // check
    if (branchId !== "") {
      dispatch(GetAllExpense({ branchId, search, page: 1 }));
    } else if (search) {
      console.log("case 2");
      dispatch(GetAllExpense({ branchId, search, page: 1 }));
    }
  };

  const closeConfirmationModal = () => {
    setconfirmationModal(false);
    setConfirmationAction(null);
  };

  const handleDeleteExpense = (id) => {
    setconfirmationModal(true);
    const confirmDeletion = () => {
      dispatch(DeleteExpenseAsync({ id })).then((res) => {
        if (res.payload.success) {
          dispatch(GetAllExpense({ branchId: selectedBranchId, page }));
          closeConfirmationModal();
        }
      });
    };
    setConfirmationAction(() => confirmDeletion);
  };

  const getPaymentMethodName = (value) => {
    const name = PaymentData.find((item) => item.value === value)?.label;
    return name;
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Expense
          </h1>

          {/* <!-- search bar --> */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTabClick}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoAdd size={22} className="text-white" />
            </button>

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
                  placeholder="Search by name"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABS -------------- */}

        {loading ? (
          <div className="pt-16 flex justify-center mt-12 items-center">
            <div
              className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
              role="status"
              aria-label="ExpenseLoading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="tabs flex justify-between items-center my-5">
              <div className="tabs_button">
                {/* CHECK ONLY SUPERADMIN CAN SEE ALL */}
                {user?.user?.role === "superadmin" ? (
                  <>
                    {Branches?.map((branch) => (
                      <Link
                        to={`/dashboard/expense?page=${1}`}
                        key={branch?.id}
                        className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                          selectedBranchId === branch?.id
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
                        className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md cursor-default ${
                          user?.user?.branchId === branch?.id
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
            {ExpenseLoading ? (
              <div className="pt-16 flex justify-center mt-12 items-center">
                <div
                  className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                  role="status"
                  aria-label="ExpenseLoading"
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
                        Serial No
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Payment Method
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Name
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Reason
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Amount
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Date
                      </th>
                      <th className="px-6 py-3" scope="col">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Expense?.data?.length > 0 ? (
                      Expense?.data?.map((expense, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <th className="px-6 py-4 font-medium">
                            {expense?.serial_no}
                          </th>
                          <td className="px-6 py-4">
                            {getPaymentMethodName(expense?.payment_Method)}
                          </td>
                          <td className="px-6 py-4">{expense?.name}</td>
                          <td className="px-2 py-4 text-xs max-w-48">
                            {expense?.reason}
                          </td>
                          <td className="px-6 py-4">{expense?.rate}</td>
                          <td className="px-6 py-4">{expense?.Date}</td>
                          <td className="px-6 py-4">
                            <MdOutlineDelete
                              onClick={() => handleDeleteExpense(expense?.id)}
                              size={20}
                              className="cursor-pointer text-red-500"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-xl text-start"
                        >
                          No Data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      {/* -------- PAGINATION -------- */}
      {Expense?.totalPages !== 0 && (
        <section className="flex justify-center">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
              <li>
                {Expense?.page > 1 ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/expense?page=${page - 1}`}
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
                {Expense?.totalPages !== Expense?.page ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/expense?page=${page + 1}`}
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
      )}

      {expenseModal && (
        <ExpenseModal
          isOpen={expenseModal}
          closeModal={() => setexpenseModal(false)}
        />
      )}
      {/* CONFIRMATION MODAL */}
      {confirmationModal && (
        <ConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={confirmationAction}
          message={"Are You Sure Want To Delete This Expense."}
          title={"Delete Expense"}
          updateStitchingLoading={deleteLodaing}
        />
      )}
    </>
  );
};

export default Expense;
