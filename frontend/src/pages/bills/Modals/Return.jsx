import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { CreateReturnforBranch } from "../../../features/ReturnSlice";
import moment from "moment-timezone";

const Return = ({ Buyerdata, closeModal, selected }) => {
  const [updatedSuitsData, setUpdatedSuitsData] = useState([]);
  const [T_Return_Amount, setT_Return_Amount] = useState(0);
  const [Amount_From_Balance, setAmount_From_Balance] = useState(0);
  const buyerBalance = Buyerdata?.virtual_account?.total_balance;
  const [Amount_Payable, setAmount_From_TotalCash] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [methodValue, setMethodValue] = useState("default-account");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.Buyer);
  const { user } = useSelector((state) => state.auth);
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const { Returnloading } = useSelector((state) => state.Return);
  const [selectedDate, setSelectedDate] = useState(today);

  // Initialize suits data when Buyerdata is available
  useEffect(() => {
    if (selected?.profitDataForHistory) {
      const initializedSuitsData = selected.profitDataForHistory.map(
        (data) => ({
          ...data,
          quantity_to_send: "",
          price: "",
        })
      );
      setUpdatedSuitsData(initializedSuitsData);
    }
  }, [Buyerdata]);

  const validateValue = (value) => {
    return value === undefined || value === null || isNaN(value) || value === ""
      ? 0
      : parseFloat(value);
  };

  // Calculate Total Return Amount whenever updatedSuitsData changes
  useEffect(() => {
    const totalReturnAmount = updatedSuitsData.reduce((total, data) => {
      const price =
        validateValue(data.price) * validateValue(data.quantity_to_send);

      return total + price;
    }, 0);
    setT_Return_Amount(totalReturnAmount);

    //CALCULATING OTHER PRICES
    const AFB = buyerBalance - totalReturnAmount;
    if (totalReturnAmount > 0 && AFB >= 0) {
      setAmount_From_Balance(validateValue(totalReturnAmount));
      setAmount_From_TotalCash(0);
    } else if (totalReturnAmount > 0 && AFB < 0 && buyerBalance >= 0) {
      const AFTC = validateValue(buyerBalance - totalReturnAmount);
      setAmount_From_TotalCash(Math.abs(AFTC));
      setAmount_From_Balance(validateValue(totalReturnAmount - Math.abs(AFTC)));
    } else if (totalReturnAmount > 0 && buyerBalance <= 0) {
      setAmount_From_TotalCash(totalReturnAmount);
      setAmount_From_Balance(0);
    }
  }, [updatedSuitsData]);

  const handleQuantityChange = (index, value) => {
    const newSuitsData = [...updatedSuitsData];
    const MaxQuantity = selected.profitDataForHistory[index].quantity;
    let validateValue = value > MaxQuantity ? MaxQuantity : value;
    newSuitsData[index] = {
      ...newSuitsData[index],
      quantity_to_send: validateValue,
    };
    setUpdatedSuitsData(newSuitsData);
  };

  const handlePriceChange = (index, value) => {
    let newSuitsData = [...updatedSuitsData];
    newSuitsData[index] = { ...newSuitsData[index], price: value };
    setUpdatedSuitsData(newSuitsData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      branchId: Buyerdata?.branchId,
      buyerId: Buyerdata?.id,
      bill_Id: selected?.id,
      partyName: Buyerdata?.name,
      serialNumber: Buyerdata?.serialNumber,
      phone: Buyerdata?.phone,
      date: methodValue === "cash" ? selectedDate : today,
      bill_Date: selected?.date,
      T_Return_Amount,
      Amount_From_Balance,
      Amount_Payable,
      method: methodValue,
      suits_data: updatedSuitsData.map((data) => ({
        id: data.suitId,
        quantity: parseInt(data.quantity_to_send),
        profit: data.profit,
        d_no: data.d_no,
        color: data.color,
        category: data.category,
        price: parseFloat(data.price),
      })),
    };

    dispatch(CreateReturnforBranch(formData)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        closeConfirmationModal();
      }
    });
  };

  const handleRemoveRow = (suitIndex) => {
    setUpdatedSuitsData((prevState) => {
      const newSuitData = prevState.filter((_, index) => index !== suitIndex);
      return newSuitData;
    });
  };

  const openConfirmationModal = () => {
    setConfirmationModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
      >
        <div className="relative scrollable-content py-4 px-3 w-full max-w-6xl h-[80vh] bg-white rounded-md shadow dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Return Form :
            </h3>
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

          {loading ? (
            <div className="py-4 flex justify-center mt-12 items-center">
              <div
                className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading.....</span>
              </div>
            </div>
          ) : (
            <form>
              <div className="px-2 py-2 mb-3 grid grid-cols-1 gap-4 border-2 rounded-lg lg:grid-cols-6 lg:gap-4 text-gray-900 dark:text-gray-100  dark:border-gray-600">
                <div className="box text-center">
                  <div className="pb-1 font-normal " scope="col">
                    <span className="text-red-500 ">S.N</span>-
                    <span className="text-green-600">A.S.N</span>
                  </div>
                  <span className="text-red-500">
                    {" "}
                    {Buyerdata?.serialNumber}
                  </span>
                  -<span className="text-green-600">{Buyerdata?.autoSN}</span>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal">Phone Number</h3>
                  <h3>{Buyerdata?.phone}</h3>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal">Name</h3>
                  <h3>{Buyerdata?.name}</h3>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal text-red-500">Total Debit</h3>
                  <h3 className="font-normal text-red-500">
                    {Buyerdata?.virtual_account?.total_debit}
                  </h3>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal">Total Credit</h3>
                  <h3>{Buyerdata?.virtual_account?.total_credit}</h3>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal">Total Balance</h3>
                  <h3>{Buyerdata?.virtual_account?.total_balance}</h3>
                </div>
              </div>

              {/* Return Amounts */}
              <div className=" px-8 py-2 flex justify-around items-center border-2 rounded-lg text-gray-900 dark:text-gray-100  dark:border-gray-600">
                <div className="box text-center">
                  <h3 className="pb-1 font-normal">Total Return Amount</h3>
                  <h3>{T_Return_Amount}</h3>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal">Amount From Balance</h3>
                  <h3>{Amount_From_Balance}</h3>
                </div>
                <div className="box text-center">
                  <h3 className="pb-1 font-normal ">Amount Payable</h3>
                  <h3>{Amount_Payable}</h3>
                </div>
              </div>

              {/* Suits Data Input Table */}
              <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        Category
                      </th>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        <span className="text-green-500">Quantity</span>/
                        <span className="text-red-500">Returnable</span>
                      </th>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        Color
                      </th>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        {" "}
                        Sale Price
                      </th>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        Enter R.Q
                      </th>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        Enter R.Price
                      </th>
                      <th className="px-6 py-4 text-center text-md font-medium">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedSuitsData &&
                      updatedSuitsData?.map((data, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b text-md font-normal dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <td className="px-6 text-center py-4">
                            {data?.category}
                          </td>
                          <td className="px-6 text-center py-4">
                            <span className="text-green-500">
                              {data?.quantity}
                            </span>
                            /
                            <span className="text-red-500">
                              {data?.quantity_for_return}
                            </span>
                          </td>
                          <td className="px-6 text-center py-4">
                            {data?.color}
                          </td>
                          <td className="px-6 text-center py-4">
                            {data?.suitSalePrice}
                          </td>
                          <td className="px-6 text-center py-4">
                            <input
                              type="number"
                              inputMode="numeric"
                              placeholder="0"
                              required
                              value={updatedSuitsData[index].quantity_to_send}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              className="border border-gray-300 rounded-md px-2 py-1 w-20 text-gray-600"
                            />
                          </td>
                          <td className="px-6 text-center py-4">
                            <input
                              type="number"
                              inputMode="numeric"
                              placeholder="0"
                              required
                              value={updatedSuitsData[index].price}
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                              className="border border-gray-300 rounded-md px-2 py-1 w-20 text-gray-600"
                            />
                          </td>
                          <td className="px-6 flex justify-center py-4">
                            <RxCross2
                              onClick={() => handleRemoveRow(index)}
                              className="text-red-500 cursor-pointer"
                              size={28}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="button"
                  onClick={openConfirmationModal}
                  className="inline-block rounded border border-gray-600 bg-gray-900 px-10 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring active:text-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* RETURN CONFIRMATION MODAL */}
      {confirmationModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg bg-white rounded-md shadow dark:bg-gray-700">
            <div className="flex items-center justify-center p-4 border-b dark:border-gray-600"></div>
            <div className="p-2">
              <p className="text-gray-700 text-center dark:text-gray-300">
                {methodValue === "default-account" && Amount_Payable <= 0
                  ? "Are you want to deduct this amount from buyers account ?"
                  : "Select a method for the payable amount"}
              </p>
            </div>

            {Amount_Payable > 0 ? (
              <div className="flex items-center justify-center my-2 gap-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="account"
                    name="paymentMethod"
                    value={methodValue}
                    onChange={() => setMethodValue("account")}
                    className="form-radio h-4 w-4 cursor-pointer text-gray-600"
                  />
                  <label
                    htmlFor="account"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Account
                  </label>
                </div>
                <div className="flex items-center ml-4">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value={methodValue}
                    onChange={() => setMethodValue("cash")}
                    className="form-radio cursor-pointer h-4 w-4 text-gray-600"
                  />
                  <label
                    htmlFor="cash"
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    Cash
                  </label>
                </div>

                {methodValue === "cash" &&
                  user?.user?.role === "superadmin" && (
                    <input
                      name="Date"
                      type="Date"
                      placeholder="Date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  )}
              </div>
            ) : null}

            <div className="flex justify-center p-2">
              <button
                onClick={closeConfirmationModal}
                className="px-4 py-2 text-sm rounded bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white mr-2"
              >
                Cancel
              </button>
              {Returnloading ? (
                <button
                  disabled
                  className="px-4 py-2.5 cursor-not-allowed text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                >
                  Confirm
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Return;
