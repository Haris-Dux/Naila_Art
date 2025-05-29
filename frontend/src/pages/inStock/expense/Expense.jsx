import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  createExpenseCategoryAsync,
  DeleteExpenseAsync,
  GetAllExpense,
  getExpenseCategoriesAsync,
  updateExpenseCategoryAsync,
} from "../../../features/InStockSlice";
import { IoAdd } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";
import ExpenseModal from "../../bills/Modals/ExpenseModal";
import { MdOutlineDelete } from "react-icons/md";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import Select from "react-select";

const Expense = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { Branches, deleteLodaing } = useSelector((state) => state.InStock);
  const {
    ExpenseLoading,
    Expense,
    ExpenseCategories,
    ExpenseUpdateLoading,
    ExpenseCategoryLoading,
  } = useSelector((state) => state.InStock);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [expenseModal, setexpenseModal] = useState(false);
  const [categoriesModal, setCategoriesModal] = useState("");
  const [confirmationModal, setconfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [expenseCategoryData, setExpenseCategoryData] = useState({
    name: "",
    id: "",
    branches: [],
  });

  const handleTabClick = () => {
    setexpenseModal(!expenseModal);
  };

  useEffect(() => {
    if (user?.user?.role === "superadmin" && Branches.length > 0) {
      setSelectedBranchId(Branches[0]?.id);
    } else {
      setSelectedBranchId(user?.user?.branchId);
    }
    dispatch(getExpenseCategoriesAsync()).then((res) => {
      setSelectedCategory(res?.payload[0]?.id);
    });
  }, [Branches, user]);

  useEffect(() => {
    if (selectedBranchId && selectedCategory) {
      const payload = {
        page,
        branchId: selectedBranchId,
        categoryId: selectedCategory,
      };
      dispatch(GetAllExpense(payload));
    }
  }, [dispatch, selectedBranchId, page, selectedCategory]);

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

  const filterdCategories = ExpenseCategories.filter((item) =>
    item?.branches?.includes(selectedBranchId)
  );

  const handleBranchClick = (branchId) => {
    setSelectedBranchId(branchId);
    const id = ExpenseCategories.filter((item) =>
      item?.branches?.includes(branchId)
    )[0]?.id;
    setSelectedCategory(id);
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

  const openCategoryModal = (data) => {
    setCategoriesModal(data.type);
    if (data.type === "EditExpense") {
      setExpenseCategoryData((prev) => ({
        ...prev,
        name: data.category.name,
        id: data.category.id,
        branches: data.category.branches,
      }));
    }
  };

  const closeCategoryModal = () => {
    setCategoriesModal("");
    setExpenseCategoryData({
      name: "",
      id: "",
    });
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (categoriesModal === "AddExpenseCategory") {
      const payload = {
        name: expenseCategoryData.name,
        branches: expenseCategoryData.branches,
      };
      dispatch(createExpenseCategoryAsync(payload)).then((res) => {
        if (res.payload.success) {
          closeCategoryModal();
        }
      });
    } else {
      const payload = {
        name: expenseCategoryData.name,
        id: expenseCategoryData.id,
        branches: expenseCategoryData.branches,
      };
      dispatch(updateExpenseCategoryAsync(payload)).then((res) => {
        if (res.payload.success) {
          closeCategoryModal();
          setExpenseCategoryData({
            name: "",
            id: "",
            branches: [],
          });
        }
      });
    }
  };

  const branchOptions = Branches.map((branch) => ({
    label: branch.branchName,
    value: branch.id,
  }));

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        <div className="tabs flex justify-between items-center ">
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
                    disabled
                    className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md cursor-default ${"dark:bg-white bg-gray-700 dark:text-black text-gray-100"}`}
                  >
                    {branch?.branchName}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Expense
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to={"/dashboard/expense-stats"}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoStatsChart size={22} className="text-white" />
            </Link>
            {user?.user?.role === "superadmin" && (
              <button
                type="button"
                onClick={() => openCategoryModal({ type: "ViewCategories" })}
                className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
              >
                <TbCategory size={22} className="text-white" />
              </button>
            )}

            <button
              type="button"
              onClick={handleTabClick}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoAdd size={22} className="text-white" />
            </button>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        <>
          <div className="tabs flex justify-between items-center my-5">
            <div className="tabs_button">
              {filterdCategories?.map((category) => (
                <Link
                  to={`/dashboard/expense?page=${1}`}
                  key={category?.id}
                  className={`border border-gray-500 px-5 py-2 mx-2 text-sm rounded-md ${
                    selectedCategory === category?.id
                      ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category?.id)}
                >
                  {category?.name}
                </Link>
              ))}
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
                        <td className="px-6 py-4">{expense?.payment_Method}</td>
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
                      <td colSpan="5" className="px-6 py-4 text-xl text-start">
                        No Data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
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

      {/* ADD EXPENSE */}
      {expenseModal && (
        <ExpenseModal
          isOpen={expenseModal}
          closeModal={() => setexpenseModal(false)}
          ExpenseCategories={filterdCategories}
          selectedCategory={selectedCategory}
          branchId={selectedBranchId}
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

      {/* CATEGORIES MODAL */}
      {categoriesModal === "ViewCategories" && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex gap-3 items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Expense Categories
              </h3>
              {user?.user?.role === "superadmin" && (
                <button
                  type="button"
                  onClick={() =>
                    openCategoryModal({ type: "AddExpenseCategory" })
                  }
                  className="flex items-center text-sm justify-center gap-1 text-white rounded border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
                >
                  <IoAdd size={18} className="text-white" />
                  New Category
                </button>
              )}
              <button
                onClick={closeCategoryModal}
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
                    <th className=" px-2 py-3 text-center" scope="col">
                      #
                    </th>
                    <th className=" px-2 py-3 text-center" scope="col">
                      Name
                    </th>
                    <th className=" px-2 py-3 text-center" scope="col">
                      Branches
                    </th>

                    <th className=" px-2 py-3 text-center" scope="col">
                      Update
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="scrollable-content h-[50vh] overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
                  {ExpenseCategoryLoading ? (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="min-h-[50vh] flex justify-center items-center">
                            <div
                              className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                              role="status"
                              aria-label="loading"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {ExpenseCategories?.map((data, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <td className=" px-6 py-3 text-center">
                            {index + 1}
                          </td>
                          <td className=" px-6 py-3 text-center">
                            {data?.name}
                          </td>

                          <td className=" px-6 py-3 text-center">
                            <select
                              defaultValue=""
                              className="bg-gray-50 border border-gray-300 w-40 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            >
                              <option value="" disabled>
                                View Branches
                              </option>
                              {data?.branches?.map((branchId, i) => (
                                <option disabled key={i}>
                                  {
                                    Branches?.find(
                                      (option) => option.id === branchId
                                    ).branchName
                                  }
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-6 py-3 text-center">
                            {" "}
                            <button
                              onClick={() =>
                                openCategoryModal({
                                  type: "EditExpense",
                                  category: data,
                                })
                              }
                              className="px-4 py-2.5 text-sm rounded"
                            >
                              <MdOutlineModeEdit
                                className="cursor-pointer"
                                size={20}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD OR UPDATE CATEGORIES */}
      {(categoriesModal === "AddExpenseCategory" ||
        categoriesModal === "EditExpense") && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {categoriesModal === "AddExpenseCategory"
                ? "Add Expense Category"
                : "Edit Category"}
            </h2>
            <input
              type="text"
              value={expenseCategoryData.name}
              onChange={(e) =>
                setExpenseCategoryData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter category name"
            />
            <div className="mt-2 custom-reactSelect">
              <Select
                isMulti
                options={branchOptions}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: 4,
                    borderColor: "#D1D5DB",
                    boxShadow: state.isFocused ? "none" : "none",
                    "&:hover": {
                      borderColor: "#D1D5DB",
                    },
                    padding: "2px",
                  }),
                }}
                placeholder="Select branch for category"
                className="bg-gray-50   text-gray-900 rounded-md"
                onChange={(selectedOptions) => {
                  setExpenseCategoryData((prev) => ({
                    ...prev,
                    branches: selectedOptions.map((option) => option.value),
                  }));
                }}
                value={branchOptions.filter((option) =>
                  expenseCategoryData?.branches?.includes(option.value)
                )}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={closeCategoryModal}
                className="px-4 py-2 text-sm rounded bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white mr-2"
              >
                Cancel
              </button>
              <button
                disabled={ExpenseUpdateLoading}
                onClick={handleCreateCategory}
                className={`px-4 py-2.5 text-sm rounded text-white dark:text-gray-800 transition 
    ${
      ExpenseUpdateLoading
        ? "bg-gray-400 dark:bg-gray-300 cursor-not-allowed"
        : "bg-gray-900 dark:bg-gray-200 cursor-pointer hover:bg-[#3a3a3a]"
    }`}
              >
                {categoriesModal === "AddExpenseCategory" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Expense;
