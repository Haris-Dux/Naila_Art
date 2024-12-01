import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AddCreditDebit,
  addLeaveAsync,
  CreditSalary,
  GetEmployeeById,
  updateOvertimeHoursAsync,
} from "../../features/AccountSlice";
import { PaymentData } from "../../Utils/AccountsData";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment-timezone";
import { GetAllBranches } from "../../features/InStockSlice";

const EmployeeDetails = () => {
  const { id } = useParams();
  const { loading, Employee, employeEditLoading } = useSelector(
    (state) => state.Account
  );
  const { Branches } = useSelector((state) => state.InStock);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [leavesModal, setLeavesModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [overTimeModal, setOverTimeModal] = useState(false);
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const [formData, setFormData] = useState({
    date: today,
    particular: "",
    amount: "",
    type: "credit",
    payment_Method: "",
    over_time: "",
    salary: "",
    branchId: "",
  });

  const currentMonth = moment.tz("Asia/Karachi").format("YYYY-MM");
  const currentMonthLeaves = Employee?.leaves?.filter((item) =>
    item.startsWith(currentMonth)
  );

  useEffect(() => {
    dispatch(GetEmployeeById({ id }));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "over_time" || name === "amount" || name === "salary"
          ? parseInt(value)
          : value,
    }));
  };

  useEffect(() => {
    if (user?.user?.id) {
      dispatch(GetAllBranches({ id: user?.user?.id }));
    }
  }, [dispatch, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id,
      date: formData.date,
      particular: formData.particular,
      [formData.type]: formData.amount,
    };

    dispatch(AddCreditDebit(data)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        dispatch(GetEmployeeById({ id }));
        setFormData({
          particular: "",
          amount: "",
          type: "credit",
        });
      }
    });
  };

  const handleCreditSalary = (e) => {
    e.preventDefault();
    if (!formData.payment_Method) {
      return toast.error("Please Select Payment Method");
    }
    const data = {
      id: id,
      salary: formData.salary,
      payment_Method: formData.payment_Method,
      over_time: Employee?.overtime_Data?.hours,
      leaves: currentMonthLeaves?.length,
      branchId: formData.branchId,
    };
    dispatch(CreditSalary(data)).then((res) => {
      if (res.payload.success === true) {
        closeConfirmationModal();
        dispatch(GetEmployeeById({ id }));
      }
    });
  };

  const openModal = (type) => {
    setFormData((prevData) => ({ ...prevData, type }));
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const openConfirmationModal = () => {
    setIsConfirmationOpen(true);
    calculatePayableSlary();
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    setOverTimeModal(false);
    setFormData((prev) => ({
      ...prev,
      payment_Method: "",
      date: "",
      over_time: "",
    }));
  };

  const closeAddLeaveModal = () => {
    setLeavesModal(false);
    setShowCalendar(false);
    setFormData((prev) => ({
      ...prev,
      date: "",
    }));
  };

  const isLeaveDate = (date) => {
    return Employee?.leaves?.includes(date);
  };

  const handleUpdateLeave = (e) => {
    e.preventDefault();
    const data = {
      date: formData?.date,
      employeeId: id,
    };
    dispatch(addLeaveAsync(data)).then((res) => {
      if (res.payload.success === true) {
        closeAddLeaveModal();
        dispatch(GetEmployeeById({ id }));
      }
    });
  };

  const viewOrEditLeaves = () => {
    setShowCalendar(true);
  };

  const handleDateClick = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setFormData((prev) => ({
      ...prev,
      date: formattedDate,
    }));
    setShowCalendar(false);
    setLeavesModal(true);
  };

  const openOverTimeModal = () => {
    setOverTimeModal(true);
  };

  const handleUpdateOvertimeHours = (e) => {
    e.preventDefault();
    const data = {
      over_time: formData.over_time,
      employeeId: id,
    };
    dispatch(updateOvertimeHoursAsync(data)).then((res) => {
      if (res.payload.success === true) {
        dispatch(GetEmployeeById({ id }));
        closeConfirmationModal();
      }
    });
  };

  const calculatePayableSlary = () => {
    const salary = Employee?.salary;
    const leaves = currentMonthLeaves?.length;
    const totalDays = moment().daysInMonth();
    const paidDays = totalDays - leaves;
    const salaryForOneDay = salary / totalDays;
    const overtimeHours = Employee?.overtime_Data?.hours || 0;
    const overtimeDays = overtimeHours / 12;
    const payableSalary = Math.round(
      (paidDays + overtimeDays) * salaryForOneDay
    );
    setFormData((prev) => ({
      ...prev,
      salary: payableSalary,
    }));
    return payableSalary;
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="px-2 py-2 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-3 text-gray-900 dark:text-gray-100">
          <div className="box">
            <h3 className="pb-1 font-medium">Employee Name</h3>
            <h3>{Employee?.name}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Phone Number</h3>
            <h3>{Employee?.phone_number}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">CNIC</h3>
            <h3>{Employee?.CNIC}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Address</h3>
            <h3 className="">{Employee?.address}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Last Work Place</h3>
            <h3>{Employee?.last_work_place}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Designation</h3>
            <h3>{Employee?.designation}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Joining Date</h3>
            <h3>
              {Employee?.joininig_date
                ? new Date(Employee.joininig_date).toLocaleDateString()
                : "No joining date available"}
            </h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Father's Phone Number</h3>
            <h3>{Employee?.father_phone_number}</h3>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {!Employee?.pastEmploye && (
          <div className="tabs flex justify-start items-center gap-3 my-5">
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={() => openModal("debit")}
            >
              Debit
            </button>
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={() => openModal("credit")}
            >
              Credit
            </button>
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={openConfirmationModal}
            >
              Credit Salary
            </button>
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={openOverTimeModal}
            >
              Add Overtime
            </button>
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={viewOrEditLeaves}
            >
              Update Leaves
            </button>
          </div>
        )}

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
          <div className="relative overflow-x-auto mt-5">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Particular
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Credit
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Debit
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {Employee && Employee?.financeData?.length > 0 ? (
                  Employee?.financeData
                    ?.slice()
                    .reverse()
                    .map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <th
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          scope="row"
                        >
                          <p>{new Date(data.date).toLocaleDateString()}</p>
                        </th>
                        <td className="px-6 py-4 font-medium">
                          {data.particular}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.credit === 0 ? "-" : data.credit}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.debit === 0 ? "-" : data.debit}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.balance === 0 ? "-" : data.balance}
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
        )}

        {/* SALARY CONFIRM MODAL */}
        {overTimeModal && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Update Overtime Hours
                </h3>
                <button
                  onClick={closeConfirmationModal}
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

              <div className="p-4 md:p-5">
                {/* ENTER HOURS*/}
                <div>
                  <input
                    type="number"
                    placeholder="Enter Hours"
                    name="over_time"
                    id="over_time"
                    value={formData.over_time}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div className="flex justify-center pt-5 gap-3">
                  <button
                    disabled={employeEditLoading}
                    onClick={handleUpdateOvertimeHours}
                    className={`inline-block rounded ${
                      employeEditLoading && "cursor-not-allowed"
                    } border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeConfirmationModal}
                    className="inline-block rounded border border-gray-300 bg-gray-300 dark:bg-gray-400 px-10 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-400 focus:outline-none focus:ring"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*  VIEW PAST LEAVES */}
        {showCalendar && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-2 px-3 w-96 max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add Or Delete Leave
                </h3>
                <button
                  onClick={closeAddLeaveModal}
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

              <div className="p-2 md:p-5">
                <div className="space-y-2">
                  <Calendar
                    onClickDay={handleDateClick}
                    tileClassName={({ date }) => {
                      const correctFormat = moment(date).format("YYYY-MM-DD");
                      if (isLeaveDate(correctFormat)) {
                        return "mark-red";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEAVES MODAL */}
        {leavesModal && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3  max-w-xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {!isLeaveDate(formData?.date) ? (
                    <span className="text-green-500">Mark Leave</span>
                  ) : (
                    <span className="text-red-500">Delete Leave</span>
                  )}
                </h3>
                <button
                  onClick={closeAddLeaveModal}
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
              <div className="p-4">
                <p className="text-center text-gray-700 dark:text-gray-300">
                  {`Are you sure you want to ${
                    !isLeaveDate(formData?.date) ? "Mark Leave" : "Delete Leave"
                  } for `}
                  <span className="font-bold">{formData?.date}</span>
                  {` ?`}
                </p>
              </div>

              <div className="p-4">
                <div className="flex justify-center">
                  <button
                    onClick={handleUpdateLeave}
                    disabled={employeEditLoading}
                    type="submit"
                    className={`inline-block rounded ${
                      employeEditLoading && "cursor-not-allowed"
                    } border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREDIT DEBIT MODAL */}
        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-96 max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formData.type === "credit" ? "Add Credit" : "Add Debit"}
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

              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      name="date"
                      id="date"
                      value={today}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Particular"
                      name="particular"
                      id="particular"
                      value={formData.particular}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Amount"
                      name="amount"
                      id="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <select
                    id="payment-method"
                    name="payment_Method"
                    className="bg-gray-50 border w-full border-red-500 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-red-500 block  p-2.5 dark:bg-gray-600 dark:border-red-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.payment_Method}
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
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SALARY CONFIRM MODAL */}
        {isConfirmationOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 max-w-2xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Confirm Credit Salary
                </h3>
                <button
                  onClick={closeConfirmationModal}
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

              <div className="p-4">
                <div className="w-full border-2 rounded-md">
                  <div className="p-3 grid grid-cols-3 gap-2 gap-x-6 mx-auto">
                    <div className="w-full text-center">
                      {" "}
                      <span className="text-sm font-bold">
                        Overtime Hours :
                      </span>{" "}
                      {Employee?.overtime_Data?.hours}
                    </div>
                    <div className="w-full text-center">
                      {" "}
                      <span className="text-sm font-bold">
                        Actual Salary :
                      </span>{" "}
                      {Employee?.salary}
                    </div>
                    <div className="w-full text-center">
                      {" "}
                      <span className="text-sm font-bold ">Leaves :</span>{" "}
                      {currentMonthLeaves?.length}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 p-3 gap-2 gap-x-4">
                    <div className="col-span-1 items-center grid grid-cols-2">
                      <h3 className="text-sm font-bold col-span-1">
                        T.Salary :
                      </h3>
                      <input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary || calculatePayableSlary()}
                        onChange={handleChange}
                        className="bg-gray-50 border col-span-1 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                    </div>
                    <div className="col-span-1">
                      <select
                        id="branches"
                        name="branchId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={formData?.branchId || ""}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Branch
                        </option>
                        {Branches?.map((branch) => (
                          <option key={branch?.id} value={branch?.id}>
                            {branch?.branchName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <select
                        id="payment-method"
                        name="payment_Method"
                        className="bg-gray-50 border border-red-500 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-red-500 block  p-2.5 dark:bg-gray-600 dark:border-red-500 dark:placeholder-gray-400 dark:text-white"
                        value={formData?.payment_Method}
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
                  </div>
                </div>
                <div className="flex justify-center pt-4 gap-3">
                  <button
                    disabled={employeEditLoading}
                    type="submit"
                    onClick={handleCreditSalary}
                    className={`inline-block rounded ${
                      employeEditLoading && "cursor-not-allowed"
                    }  bg-green-500 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-green-400 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeConfirmationModal}
                    className="inline-block rounded border border-gray-300 bg-gray-300 dark:bg-gray-400 px-10 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-400 focus:outline-none focus:ring"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default EmployeeDetails;
