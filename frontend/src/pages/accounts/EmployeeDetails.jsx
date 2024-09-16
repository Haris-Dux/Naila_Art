import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AddCreditDebit,
  CreditSalary,
  GetEmployeeById,
} from "../../features/AccountSlice";

const EmployeeDetails = () => {
  const { id } = useParams();
  const { loading, Employee } = useSelector((state) => state.Account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    particular: "",
    amount: 0,
    type: "credit",
  });

  useEffect(() => {
    dispatch(GetEmployeeById({ id }));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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
          date: "",
          particular: "",
          amount: 0,
          type: "credit",
        });
      }
    });
  };

  const handleCreditSalary = () => {
    dispatch(CreditSalary({ id })).then((res) => {
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
    document.body.style.overflow = "hidden";
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    document.body.style.overflow = "auto";
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
                  Employee?.financeData?.map((data, index) => (
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
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
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

        {isConfirmationOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
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

              <div className="p-4 md:p-5">
                <p className="text-center text-gray-700 dark:text-gray-300">
                  Are you sure you want to credit the salary?
                </p>
                <div className="flex justify-center pt-5 gap-3">
                  <button
                    onClick={handleCreditSalary}
                    className="inline-block rounded  bg-green-500 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-green-400 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
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
