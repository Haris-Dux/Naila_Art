import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BranchCashOutAsync, getDailySaleByIdAsync } from "../../features/DailySaleSlice";
import { PiHandDeposit } from "react-icons/pi";
import { PaymentData } from "../../Utils/AccountsData";

const DailySaleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [cashOutModal, setCashOutModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { loading, DailySaleById, cashOutLoading } = useSelector(
    (state) => state.DailySale
  );

  const [formData, setFormData] = useState({
    amount: "",
    payment_Method: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getDailySaleByIdAsync({ id }));
    }
  }, [dispatch, id]);

  const openModal = () => {
    setCashOutModal(true);
    setFormData({
        amount: DailySaleById?.saleData?.totalCash,
        payment_Method: "",
      });
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setCashOutModal(false);
    setFormData({
      amount: DailySaleById?.saleData?.totalCash,
      payment_Method: "",
    });
    document.body.style.overflow = "auto";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      amount: formData.amount,
      payment_Method: formData.payment_Method,
      branchId: user?.user?.branchId,
    };

    dispatch(BranchCashOutAsync(data)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        dispatch(getDailySaleByIdAsync({ id }));
        setFormData({
          amount: DailySaleById?.saleData?.totalCash,
          payment_Method: "",
        });
      }
    });
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
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
          <div className="content">
            {/* HEADER */}
            <div className="header pt-3 pb-4 w-full border-b">
              <h2 className="text-3xl font-medium text-center">Daily Sale</h2>
            </div>

            {/* ALL ENTRIES */}
            <div className="data px-6 pt-12 w-full">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-12">
                {/* -------- LEFT -------- */}
                <div className="left w-full">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Total Sale:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.totalSale}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Cash in Meezan Bank:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.cashInMeezanBank}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Cash in EasyPaisa:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.cashInEasyPaisa}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Today Buyer Credit:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.todayBuyerCredit}
                    />
                  </div>
                </div>

                {/* -------- RIGHT -------- */}
                <div className="right w-full">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Cash in Jazz Cash:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.cashInJazzCash}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Today Expense:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.totalExpense}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Today buyer debit:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.todayBuyerDebit}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN DATA */}
            <div className="data px-6 pt-12 w-full">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-12">
                {/* -------- LEFT -------- */}
                <div className="left w-full">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Cash Sale:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.cashSale}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Total Profit:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.totalProfit}
                    />
                  </div>
                </div>

                {/* -------- RIGHT -------- */}
                <div className="right w-full">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="title w-full text-md font-medium">
                      Total Cash:
                    </div>
                    <input
                      className="border border-gray-200 text-sm rounded-md"
                      type="number"
                      value={DailySaleById?.saleData?.totalCash}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {user?.user?.role === "user" && (
        <button
          className="px-4 py-2.5 ml-6 mt-3 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
          onClick={openModal}
        >
          <div className="flex items-center gap-2">
            <PiHandDeposit />
            Cash Out
          </div>
        </button>
      )}
      {cashOutModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-96 max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Branch Cash Out Details
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
                    type="number"
                    placeholder="Amount"
                    name="amount"
                    id="amount"
                    onChange={handleChange}
                    required
                    value={
                      formData.amount
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                    disabled={cashOutLoading}
                    type="submit"
                    className={`inline-block rounded ${
                      cashOutLoading && "cursor-not-allowed"
                    } border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailySaleDetail;
