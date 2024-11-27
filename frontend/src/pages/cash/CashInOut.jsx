import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllBranches } from "../../features/InStockSlice";
import {
  cashInAsync,
  cashOutAsync,
  getTodayCashInOutAsync,
  validatePartyNameForAdminAsync,
  validatePartyNameForMainBranchAsync,
  validatePartyNameForOtherBranchAsync,
} from "../../features/CashInOutSlice";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import { accountTypeData, PaymentData } from "../../Utils/AccountsData";

const CashInOut = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [validatePartyName, setvalidatePartyName] = useState();
  const [selectedParty, setSelectedParty] = useState("");
  const [transactionType, setTransactionType] = useState("CashIn");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

  const { user } = useSelector((state) => state.auth);
  const { loading: branchesLoading, Branches } = useSelector(
    (state) => state.InStock
  );

  const {
    loading,
    valiDateLoading,
    cashInLoading,
    cashOutLoading,
    mainBranchResponse,
    otherBranchResponse,
    TodayCashInOutData,
  } = useSelector((state) => state.CashInOut);


  const [formData, setFormData] = useState({
    partyId: "",
    branchId: user?.user?.role === "superadmin" ? "" : user?.user?.branchId,
    cash: "",
    date: today,
    payment_Method: "",
    accountCategory:""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBranchChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      branchId: value,
    }));
  };

  const timerRef = useRef(null);

  const handleValidateParty = useCallback(
    (e) => {
      const value = e.target.value;
      setvalidatePartyName(value);

      if (value.length > 0) {
        const validateParty =
          user?.user?.role === "superadmin"
            ? validatePartyNameForMainBranchAsync
            : user?.user?.role === "admin"
            ? validatePartyNameForAdminAsync
            : validatePartyNameForOtherBranchAsync;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          dispatch(validateParty({ name: value, accountCategory: formData?.accountCategory }));
        }, 1000);

        return () => clearTimeout(timer);
      }
    },
    [dispatch, user?.user?.role,formData?.accountCategory]
  );

  useEffect(() => {
    return () => {
      clearTimeout(handleValidateParty);
    };
  }, [handleValidateParty]);

  const handleSelectParty = (party) => {
    setSelectedParty(party);
    setFormData((prevData) => ({
      ...prevData,
      partyId: party?.id,
    }));
    closeModal();
  };

  const openModal = () => {
    if(!formData.accountCategory && user?.user?.role !== "user"){
      return toast.error("Please Select Account Category")
    }
    setIsOpen(true);
    setSelectedParty("");
    dispatch(resetValidatedResponse());
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setvalidatePartyName("");
    document.body.style.overflow = "auto";
  };

  const handleCashIn = () => {
    const isFormValid = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );

    if (!isFormValid) {
      toast.error("All fields must be filled");
      return;
    }

    let modifiedFormData = {};

    if (user && user?.user?.role === "admin") {
      modifiedFormData = {
        ...formData,
        branchId: user?.user?.branchId,
        cash: Number(formData.cash),
      };
    } else {
      modifiedFormData = {
        ...formData,
        cash: Number(formData.cash),
      };
    }

    dispatch(cashInAsync(modifiedFormData)).then((res) => {
      if (res.payload.sucess === true) {
        dispatch(getTodayCashInOutAsync({ branchId: selectedBranchId }));
        resetForm();
        setSelectedParty("");
      }
    });
  };

  const handleCashOut = () => {
    const isFormValid = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );

    if (!isFormValid) {
      toast.error("All fields must be filled");
      return;
    }

    let modifiedFormData = {};

    if (user && user?.user?.role === "admin") {
      modifiedFormData = {
        ...formData,
        branchId: user?.user?.branchId,
        cash: Number(formData.cash),
      };
    } else {
      modifiedFormData = {
        ...formData,
        cash: Number(formData.cash),
      };
    }

    dispatch(cashOutAsync(modifiedFormData)).then((res) => {
      if (res.payload.sucess === true) {
        dispatch(getTodayCashInOutAsync({ branchId: selectedBranchId }));
        resetForm();
        setSelectedParty("");
      }
    });
  };

  const resetForm = () => {
    setFormData({
      partyId: "",
      cash: "",
      date: today,
      payment_Method: "",
      accountCategory:""
    });
  };

  const handleBranchClick = (branchId) => {
    const selectedBranch = branchId === "All" ? "" : branchId;
    setSelectedBranchId(selectedBranch);
    dispatch(getTodayCashInOutAsync({ branchId }));
  };

  useEffect(() => {
    if (user?.user?.id) {
      dispatch(GetAllBranches({ id: user?.user?.id }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (Branches?.length > 0) {
      const payload = {
        branchId: user?.user?.branchId || Branches[0]?.id,
      };

      dispatch(getTodayCashInOutAsync(payload));
      setSelectedBranchId(user?.user?.branchId || Branches[0]?.id);
    }
  }, [dispatch, Branches]);

  const handleChangeTransaction = (value) => {
    setTransactionType(value);
  };

  const setAccountStatusColor = (status) => {
    switch (status) {
      case "Partially Paid":
        return <span className="text-[#FFC107]">{status}</span>;
      case "Paid":
        return <span className="text-[#2ECC40]">{status}</span>;
      case "Unpaid":
        return <span className="text-red-700">{status}</span>;
      case "Advance Paid":
        return <span className="text-blue-700">{status}</span>;
      default:
        return "";
    }
  };


  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {loading || branchesLoading ? (
          <div className="min-h-screen flex justify-center items-center">
            <div
              className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleChangeTransaction("CashIn")}
                className="rounded-md bg-[#04D000] text-white p-3"
              >
                Cash In
              </button>
              <button
                onClick={() => handleChangeTransaction("CashOut")}
                className="rounded-md bg-[#E82B2B] text-white p-3"
              >
                Cash Out
              </button>
            </div>
            <div className="my-5 upper_tabs flex justify-start items-center">
              <div className="tabs_button">
                {/* CHECK ONLY SUPERADMIN CAN SEE ALL */}
                {user?.user?.role === "superadmin" ? (
                  <>
                    {Branches?.map((branch) => (
                      <button
                        key={branch?.id}
                        className={`border border-gray-500 px-5 py-2 mr-4 text-sm rounded-md ${
                          selectedBranchId === branch?.id
                            ? "dark:bg-white bg-gray-700 dark:text-black text-gray-100"
                            : ""
                        }`}
                        onClick={() => handleBranchClick(branch?.id)}
                      >
                        {branch?.branchName}
                      </button>
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

            <div className="grid grid-cols- gap-4 lg:grid-cols-4  lg:gap-6">
              {transactionType === "CashIn" && (
                <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                  <div className="stat_data pl-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                      Today Cash In
                    </h3>
                    <div className="mt-3 flex justify-start items-center gap-3">
                      <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                        {TodayCashInOutData?.data?.todayCashIn}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {transactionType === "CashOut" && (
                <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                  <div className="stat_data pl-4">
                    <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                      Today Cash Out
                    </h3>
                    <div className="mt-3 flex justify-start items-center gap-3">
                      <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                        {TodayCashInOutData?.data?.todayCashOut}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                <div className="stat_data pl-4">
                  <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                    Total Cash In Hand
                  </h3>
                  <div className="mt-3 flex justify-start items-center gap-3">
                    <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                      {TodayCashInOutData?.data?.saleData?.totalCash}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 my-auto">
                  {selectedParty &&  (
                    <div className="px-8 py-2  flex justify-around items-center border border-gray-400 rounded-lg text-gray-900 dark:text-gray-100  dark:border-gray-600">
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal">Total Debit</h3>
                        <h3>{selectedParty?.virtual_account?.total_debit || 0}</h3>
                      </div>
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal">Total Credit</h3>
                        <h3>{selectedParty?.virtual_account?.total_credit || 0}</h3>
                      </div>
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal ">Total Balance</h3>
                        <h3>{selectedParty?.virtual_account?.total_balance || 0}</h3>
                      </div>
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal ">Status</h3>
                        <h3>
                          {setAccountStatusColor(selectedParty?.virtual_account?.status) ||
                            "No Status"}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
            </div>

            <div className="mt-4 header flex justify-between items-center  mx-2">
              <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
                Cash {`${transactionType === "CashIn" ? "In" : "Out"}`}
              </h1>
            </div>


            <p className="w-full bg-gray-300 h-px mt-5"></p>

            <div className="data mt-8">
              <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CASH */}
                <div>
                  <input
                    name="cash"
                    type="number"
                    placeholder="Cash"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.cash}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* CHOOSE BRANCH NAME */}
                {user?.user?.role === "superadmin" ? (
                  <div>
                    <select
                      id="branches"
                      name="branchId"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData?.branchId || ""}
                      onChange={handleBranchChange}
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
                ) : null}

                {/* ACCOUNT TYPE  */}

                { user?.user?.role !== "user" && <div>
                  <select
                    id="accountCategory"
                    name="accountCategory"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.accountCategory}
                    onChange={ (e) =>
                      setFormData({
                        ...formData,
                        accountCategory: e.target.value,
                        
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Account Type
                    </option>
                    {accountTypeData?.map((item) => (
                      <option value={item.value} key={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>}

                {/* SELECT PARTY NAME */}
                <div>
                  <input
                    name="partyId"
                    type="text"
                    placeholder="Select Party"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onClick={openModal}
                    value={
                      selectedParty?.name
                        ? selectedParty?.name || ""
                        : selectedParty?.partyName || ""
                    }
                    required
                    readOnly
                  />
                </div>

                {/* SELECTED PAYMENT METHOD */}
                <div>
                  <select
                    id="payment-method"
                    name="payment_Method"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.payment_Method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_Method: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    {PaymentData?.map((item) => (
                      <option value={item.value} key={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                {/* DATE */}
                <div>
                  <input
                    type="date"
                    placeholder="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formData?.date}
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                {transactionType === "CashIn" && (
                  <div className="cashIn">
                    {cashInLoading ? (
                      <button
                        disabled
                        type="submit"
                        className="w-full cursor-not-allowed rounded-md bg-green-300 border border-[#04D000] py-3 text-sm text-white focus:outline-none"
                      >
                        Cash In
                      </button>
                    ) : (
                      <button
                        onClick={handleCashIn}
                        className="w-full rounded-md bg-[#04D000] text-white py-3"
                      >
                        Cash In
                      </button>
                    )}
                  </div>
                )}

                {transactionType === "CashOut" && (
                  <div className="cashOut">
                    {cashOutLoading ? (
                      <button
                        disabled
                        type="submit"
                        className="w-full cursor-not-allowed rounded-md bg-red-400 border border-[#E82B2B] py-3 text-sm text-white focus:outline-none"
                      >
                        Cash Out
                      </button>
                    ) : (
                      <button
                        onClick={handleCashOut}
                        className="w-full rounded-md bg-[#E82B2B] text-white py-3"
                      >
                        Cash Out
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-8 px-3 w-full max-w-2xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between flex-col p-3 rounded-t dark:border-gray-600">
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                Search Party Name
              </h3>
            </div>

            {/* ------------- BODY ------------- */}
            <div className="px-3">
              <div className="search_user flex justify-center flex-col pt-6 mt-0">
                <input
                  type="text"
                  className="w-full py-2 pl-6 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
                  placeholder="Search by name"
                  value={validatePartyName}
                  onChange={handleValidateParty}
                />

                {user?.user?.role === "user" ? (
                  <>
                    {valiDateLoading ? (
                      <>
                        <div className="py-6 flex justify-center items-center">
                          <div
                            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {validatePartyName?.length > 0 &&
                        otherBranchResponse &&
                        otherBranchResponse?.Data &&
                        otherBranchResponse?.Data.length > 0 ? (
                          <ul className="mt-4 max-h-60 overflow-y-auto rounded-lg">
                            {otherBranchResponse?.Data.map((data) => (
                              <li key={data?.id}>
                                <button
                                  onClick={() => handleSelectParty(data)}
                                  className="py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between"
                                >
                                  <span>{data?.name}</span>
                                  <span>{data?.phone}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-4 text-gray-600 pl-4">
                            No matching Data found.
                          </p>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {valiDateLoading ? (
                      <>
                        <div className="py-6 flex justify-center items-center">
                          <div
                            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {validatePartyName?.length > 0 &&
                        mainBranchResponse &&
                        mainBranchResponse?.Data &&
                        mainBranchResponse?.Data.length > 0 ? (
                          <ul className="mt-4 max-h-60 overflow-y-auto rounded-lg">
                            {mainBranchResponse?.Data?.map((data) => (
                              <li key={data?.id}>
                                <button
                                  onClick={() => handleSelectParty(data)}
                                  className="py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between"
                                >
                                  <span>{data?.name || data?.partyName}</span>
                                  <span> {data?.phone
                                      ? data.phone
                                      : "Sr # " + data?.serial_No}</span>
                                </button>
                              </li>
                            ))}
                            {/* {mainBranchResponse?.Data[1].map((data) => (
                              <li key={data?.id}>
                                <button
                                  onClick={() => handleSelectParty(data)}
                                  className="py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between"
                                >
                                  <span>{data?.name}</span>
                                  <span>{data?.phone}</span>
                                </button>
                              </li>
                            ))} */}
                            {/* {mainBranchResponse?.Data?.map((data) => (
                              <li key={data?.id}>
                                <button
                                  onClick={() => handleSelectParty(data)}
                                  className="py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between"
                                >
                                  <span>{data?.partyName}</span>
                                  <span>
                                    {data?.phone
                                      ? data.phone
                                      : "Sr # " + data?.serial_No}
                                  </span>
                                </button>
                              </li>
                            ))} */}
                          </ul>
                        ) : (
                          <p className="mt-4 text-gray-600 pl-4">
                            No matching Data found.
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="button absolute top-3 right-3">
              <button
                onClick={closeModal}
                className="end-2.5 bg-gray-100 text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        </div>
      )}
    </>
  );
};

export default CashInOut;
