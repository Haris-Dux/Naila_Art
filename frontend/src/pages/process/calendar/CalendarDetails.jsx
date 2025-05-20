import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  generateCalenderBillAsync,
  generateCalenderGatePssPdfAsync,
  GetSingleCalender,
  UpdateCalenderAsync,
} from "../../../features/CalenderSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  createCutting,
  getCuttingDataBypartyNameAsync,
} from "../../../features/CuttingSlice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import ReactSearchBox from "react-search-box";
import moment from "moment-timezone";

const CalendarDetails = () => {
  const { id } = useParams();
  const {
    loading,
    SingleCalender,
    generateCAlenderBillLoading,
    CalenderpdfLoading,
  } = useSelector((state) => state.Calender);
  const { loading: IsLoading, previousDataByPartyName } = useSelector(
    (state) => state.Cutting
  );
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] =
    useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  const [isGenerateGatePassOpen, setisGenerateGatePassOpen] = useState(false);
  const [partyValue, setPartyValue] = useState("newParty");
  const [accountData, setAccountData] = useState(null);
  const [processBillModal, setProcessBillModal] = useState(false);

  const [CuttingData, setCuttingData] = useState({
    serial_No: "",
    partyName: "",
    design_no: "",
    date: "",
    T_Quantity: "",
    rate: "",
    embroidery_Id: "",
  });

  const handleInputChangeCutting = (e) => {
    const { name, value } = e.target;
    setCuttingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [CalenderData, setCalenderData] = useState({
    id: id,
    r_quantity: "",
  });

  const [billData, setBilldata] = useState({
    Manual_No: "",
    additionalExpenditure: "",
  });


  const [convertedQuantity, setConvertedQuantity] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const { embroidery_Id, design_no, serial_No, from } = location.state || {};

  useEffect(() => {
    if (id === "null") {
      openModal();
    }
  }, [id]);

  useEffect(() => {
    if (id !== "null") {
      const data = {
        id: id,
      };
      dispatch(GetSingleCalender(data));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setCuttingData({
      serial_No: SingleCalender?.serial_No || serial_No || "",
      design_no: SingleCalender?.design_no || design_no || "",
      T_Quantity: "",
      partytype: partyValue,
      date: today,
      partyName: "",
      embroidery_Id: SingleCalender?.embroidery_Id || embroidery_Id || "",
    });
  }, [SingleCalender, partyValue, id]);

  useEffect(() => {
    setCalenderData({
      id: id,
      r_quantity: SingleCalender?.r_quantity || "",
    });
    setConvertedQuantity(SingleCalender?.r_quantity);
    setConvertedAmount(SingleCalender?.r_quantity * SingleCalender?.rate);
  }, [SingleCalender]);

  const handleInputChangeCalender = (e) => {
    const { name, value } = e.target;
    setCalenderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitCutting = (e) => {
    e.preventDefault();

    dispatch(createCutting(CuttingData)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        navigate("/dashboard/cutting");
      }
    });
  };

  const handleCompleteCalender = (e) => {
    e.preventDefault();
    const data = {
      id: id,
    };
    dispatch(UpdateCalenderAsync({ project_status: "Completed", id: id }))
      .then(() => {
        dispatch(GetSingleCalender(data));
        closeCompletedModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateCalender = (e) => {
    e.preventDefault();

    const data = {
      id: id,
    };

    dispatch(UpdateCalenderAsync(CalenderData))
      .then(() => {
        dispatch(GetSingleCalender(data));
        closeUpdateRecievedModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (id === "null") {
      navigate(from);
    }
    setIsOpen(false);
    setPartyValue("newParty");
    document.body.style.overflow = "auto";
  };

  const handleOpenGatePassModal = () => {
    setisGenerateGatePassOpen(true);
  };

  const closeGatepassModal = () => {
    setisGenerateGatePassOpen(false);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="pt-16 flex justify-center mt-12 items-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  const handleCompletedClick = () => {
    setIsCompletedConfirmOpen(true);
  };

  const closeCompletedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleUpdateReceivedClick = () => {
    setIsUpdateReceivedConfirmOpen(true);
  };

  const closeUpdateRecievedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleGenerateGatePassPDf = () => {
    dispatch(generateCalenderGatePssPdfAsync(SingleCalender));
    closeGatepassModal();
  };

  const generateBill = (e) => {
    e.preventDefault();
    const formData = {
      ...SingleCalender,
      ...billData,
      r_quantity: convertedQuantity,
      process_Category: "Calender",
      Calender_id: SingleCalender.id,
    };
    dispatch(generateCalenderBillAsync(formData)).then((res) => {
      if (res.payload.success) {
        closeBillModal();
        const data = {
          id: id,
        };
        dispatch(GetSingleCalender(data));
      }
    });
  };

  const openGenerateBillForm = () => {
    setBilldata((prev) => ({
      ...prev,
      Manual_No: SingleCalender?.Manual_No                                                                                        
    }))
    setProcessBillModal(true);
  };

  const closeBillModal = () => {
    setProcessBillModal(false);
    setConvertedQuantity(SingleCalender?.r_quantity);
    setConvertedAmount(SingleCalender?.r_quantity * SingleCalender?.rate);
    setBilldata({
      Manual_No: "",
      additionalExpenditure: "",
    });
  };

  const handleBillDataChange = (e) => {
    const { name, value } = e.target;
    setBilldata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUnitChange = (e) => {
    const unit = e.target.value;
    let convertedQuantity = "";
    let convertedAmount = "";
    if (unit === "y") {
      convertedQuantity = SingleCalender?.r_quantity * 1.09361;
      convertedAmount = Math.round(convertedQuantity * SingleCalender?.rate);
    } else if (unit === "m") {
      convertedQuantity = SingleCalender.r_quantity;
      convertedAmount = convertedQuantity * SingleCalender?.rate;
    }
    setConvertedQuantity(convertedQuantity);
    setConvertedAmount(convertedAmount);
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return <span className="text-[#FFC107]">{status}</span>;
      case "Completed":
        return <span className="text-[#2ECC40]">{status}</span>;
      default:
        return "";
    }
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

  const handleSelectedRecord = (value) => {
    const Data = previousDataByPartyName?.accountData.find(
      (item) => item.partyName === value
    );
    setCuttingData((prev) => ({
      ...prev,
      partyName: value,
    }));
    if (Data?.partyName === value) {
      setAccountData(Data?.virtual_account);
    } else {
      setAccountData(false);
    }
  };

  const togleNameField = (e) => {
    const value = e.target.value;
    setPartyValue(value);
    setCuttingData((prev) => ({
      ...prev,
      partyName: "",
    }));
    setAccountData(null);
  };

  const handleSearchOldData = (value) => {
    dispatch(getCuttingDataBypartyNameAsync({ partyName: value }));
  };

  const searchResults = previousDataByPartyName?.cuttingData?.map((item) => {
    return {
      key: item.partyName,
      value: item.partyName,
    };
  });

  const handleSkipStep = (e) => {
    const value = e.target.value;
    switch (true) {
      case value === "Stones":
        navigate("/dashboard/cutting-details/null", {
          state: {
            embroidery_Id: SingleCalender.embroidery_Id,
            design_no: SingleCalender.design_no,
            serial_No: SingleCalender.serial_No,
            from: location.pathname,
          },
        });
        break;
        case value === "Stitching":
          navigate("/dashboard/stones-details/null", {
            state: {
              embroidery_Id: SingleCalender.embroidery_Id,
              design_no: SingleCalender.design_no,
              serial_No: SingleCalender.serial_No,
              from: location.pathname,
            },
          });
          break;
      default:
        break;
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Calendar
          </h1>
        </div>

        {/* -------------- DETAILS SECTION -------------- */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
            {/* FIRST ROW */}
            <div className="box">
              <span className="font-medium">Party Name:</span>
              <span> {SingleCalender?.partyName}</span>
            </div>
            <div className="box">
              <span className="font-medium">Manual No:</span>
              <span> {SingleCalender?.Manual_No ?? '--'}</span>
            </div>
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span> {SingleCalender?.design_no}</span>
            </div>

            <div className="box">
              <span className="font-medium">Rate:</span>
              <span> {SingleCalender?.rate}</span>
            </div>
            <div className="box">
              <span className="font-medium">Project Status:</span>
              <span className="">
                {" "}
                {setStatusColor(SingleCalender?.project_status)}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Date:</span>
              <span>{new Date(SingleCalender?.date).toLocaleDateString()}</span>
            </div>
            <div className="box">
              <span className="font-medium">Quantity:</span>
              <span> {SingleCalender?.T_Quantity} m </span>
            </div>
            <div className="box">
              <span className="font-medium">R. Quantity:</span>
              <span>
                {" "}
                {SingleCalender?.r_quantity}{" "}
                {SingleCalender?.r_quantity !== "" ? "m" : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* ENTER RECEIVED QUANTITY */}
        <div className="my-10 px-3 text-gray-800  dark:text-gray-200">
          <label htmlFor="received_quantity" className="font-semibold">
            Enter Received Quantity
          </label>
          <div className="flex gap-3">
            <input
              id="r_quantity"
              name="r_quantity"
              type="text"
              placeholder="Quantity"
              className="bg-gray-50 mt-2 border max-w-40 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
              value={CalenderData.r_quantity}
              onChange={handleInputChangeCalender}
              disabled={SingleCalender?.project_status === "Completed"}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          {SingleCalender?.project_status !== "Completed" && (
            <button
              className="px-2 py-2.5 text-sm rounded bg-blue-800 text-white border-none"
              onClick={handleUpdateReceivedClick}
            >
              Update Recived
            </button>
          )}
        </div>
        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-6 flex justify-center items-center gap-x-5">
          {SingleCalender?.project_status !== "Completed" &&
            SingleCalender?.updated && (
              <button
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                onClick={handleCompletedClick}
              >
                Completed
              </button>
            )}
          {SingleCalender?.project_status === "Completed" &&
            !SingleCalender?.bill_generated && (
              <button
                onClick={openGenerateBillForm}
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              >
                Generate Bill
              </button>
            )}
          {CalenderpdfLoading ? (
            <button
              disabled
              className="px-4 py-2.5 text-sm rounded bg-gray-400 cursor-progress dark:bg-gray-200 text-white dark:text-gray-800"
            >
              Generate Gate Pass
            </button>
          ) : (
            <button
              onClick={handleOpenGatePassModal}
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            >
              Generate Gate Pass
            </button>
          )}
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={openModal}
          >
            Next Step
          </button>
          <select
            onChange={handleSkipStep}
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
          >
            <option value="" disabled selected hidden>
              Skip To
            </option>
            <option value="Stones">Stones</option>
            <option value="Stitching">Stitching</option>
          </select>
        </div>

        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-4xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cutting Details
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
              {/* ACCOUNT DATA */}
              {partyValue === "oldParty" && accountData === false ? (
                <div className=" px-8 py-2 mb-5 flex justify-around items-center border-2 border-red-600 rounded-lg text-green-500 dark:text-green-500  dark:border-red-600">
                  <p>Calender Data Found But No Bill Generated Yet</p>
                </div>
              ) : (
                <>
                  {partyValue === "oldParty" && accountData !== null && (
                    <div className=" px-8 py-2 flex justify-around items-center border-2 rounded-lg text-gray-900 dark:text-gray-100  dark:border-gray-600">
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal">Total Debit</h3>
                        <h3>{accountData?.total_debit || 0}</h3>
                      </div>
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal">Total Credit</h3>
                        <h3>{accountData?.total_credit || 0}</h3>
                      </div>
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal ">Total Balance</h3>
                        <h3>{accountData?.total_balance || 0}</h3>
                      </div>
                      <div className="box text-center">
                        <h3 className="pb-1 font-normal ">Status</h3>
                        <h3>
                          {setAccountStatusColor(accountData?.status) ||
                            "No Status"}
                        </h3>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmitCutting}>
                  <div className="mb-8 grid items-star grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* RADIO BUTTONS */}
                    <div className="grid grid-cols-2 items-center justify-center gap-1">
                      <label className="col-span-1 ">
                        <input
                          type="radio"
                          name="partyType"
                          value="oldParty"
                          className="bg-gray-50 cursor-pointer border mr-2 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          onChange={togleNameField}
                          required
                        />
                        Old Party
                      </label>
                      <label className="col-span-1 ">
                        <input
                          type="radio"
                          name="partyType"
                          value="newParty"
                          className="bg-gray-50 cursor-pointer border mr-2 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          onChange={togleNameField}
                          required
                          defaultChecked
                        />
                        New Party
                      </label>
                    </div>

                    <div>
                      {partyValue === "newParty" ? (
                        <input
                          name="partyName"
                          type="text"
                          placeholder="Party Name"
                          className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                          value={CuttingData.partyName}
                          onChange={handleInputChangeCutting}
                        />
                      ) : (
                        <div className="custom-search-box relative">
                          <ReactSearchBox
                            key={searchResults?.key}
                            onSelect={(value) =>
                              handleSelectedRecord(value?.item?.key)
                            }
                            placeholder={
                              CuttingData.partyName === ""
                                ? "Search"
                                : CuttingData.partyName
                            }
                            data={searchResults}
                            onChange={(value) => handleSearchOldData(value)}
                            inputBorderColor="#D1D5DB"
                            inputBackgroundColor="#F9FAFB"
                          />
                          <style jsx>
                            {`
                              .react-search-box-dropdown {
                                position: absolute;
                                z-index: 50;
                                top: 100%;
                                left: 0;
                                width: 100%;
                              }
                            `}
                          </style>
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        name="design_no"
                        type="text"
                        placeholder="Design No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.design_no}
                        onChange={handleInputChangeCutting}
                        required
                        readOnly
                      />
                    </div>
                  </div>
                  <div className=" grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                    <div>
                      <input
                        name="date"
                        type="text"
                        placeholder="Date"
                        className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.date}
                        required
                        readOnly
                      />
                    </div>

                    <div>
                      <input
                        name="T_Quantity"
                        type="text"
                        placeholder="Quantity"
                        className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.T_Quantity}
                        onChange={handleInputChangeCutting}
                        required
                      />
                    </div>

                    <div>
                      <input
                        name="rate"
                        type="number"
                        placeholder="rate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.rate}
                        step="0.01"
                        onChange={handleInputChangeCutting}
                        required
                      />
                    </div>

                    <div>
                      <input
                        name="serial_No"
                        type="text"
                        placeholder="serial No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.serial_No}
                        onChange={handleInputChangeCutting}
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    {IsLoading ? (
                      <button
                        disabled
                        type="submit"
                        className="inline-block cursor-not-allowed rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
                      >
                        Submiting...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
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

        {isUpdateReceivedConfirmOpen && (
          <ConfirmationModal
            title="Confirm Update"
            message="Are you sure you want to update the received items?"
            onConfirm={handleUpdateCalender}
            onClose={closeUpdateRecievedModal}
          />
        )}

        {isCompletedConfirmOpen && (
          <ConfirmationModal
            title="Confirm Complete"
            message="Are you sure you want to Complete ?"
            onConfirm={handleCompleteCalender}
            onClose={closeCompletedModal}
          />
        )}

        {isGenerateGatePassOpen && (
          <ConfirmationModal
            title="Confirmation"
            message="Are you sure you want to generate gatepass?"
            onConfirm={handleGenerateGatePassPDf}
            onClose={closeGatepassModal}
          />
        )}
        {/* PROCESS BILL MODAL */}
        {processBillModal && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-lg max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              {/* ------------- HEADER ------------- */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Additionl Process Bill Details
                </h3>
                <button
                  onClick={closeBillModal}
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
                <form onSubmit={generateBill}>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
                    {/* Manual_No */}
                    <div>
                      <input
                        name="Manual_No"
                        type="text"
                        placeholder="Manual No"
                        value={billData.Manual_No}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        readOnly
                      />
                    </div>

                    {/* Additional Expenditure */}
                    <input
                      name="additionalExpenditure"
                      type="number"
                      placeholder="A.E"
                      value={billData.additionalExpenditure}
                      onChange={handleBillDataChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    <div className=" items-center grid grid-cols-4 gap-1 justify-center">
                      <input
                        name="processBillAmount"
                        type="text"
                        value={convertedQuantity}
                        className="bg-gray-50 col-span-2 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        readOnly
                      />

                      <select
                        type="text"
                        className="bg-gray-50 col-span-2 border  border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        onChange={handleUnitChange}
                      >
                        <option selected value={"m"}>
                          m
                        </option>
                        <option value={"y"}>y</option>
                      </select>
                    </div>
                    <div className=" items-center grid grid-cols-4 gap-1 justify-center">
                      <h3 className="col-span-2">Bill Amount :</h3>
                      <input
                        name="processBillAmount"
                        type="text"
                        value={convertedAmount}
                        className="bg-gray-50 border col-span-2 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    {generateCAlenderBillLoading ? (
                      <button
                        disabled
                        type="button"
                        class="text-white cursor-not-allowed border-gray-600 bg-gray-600  focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700  inline-flex items-center"
                      >
                        <svg
                          aria-hidden="true"
                          role="status"
                          class="inline mr-3 w-4 h-4 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        Loading...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-0 active:text-indgrayigo-500"
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
      </section>
    </>
  );
};

export default CalendarDetails;
