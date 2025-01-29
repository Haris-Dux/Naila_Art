import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  generateCuttingBillAsync,
  generateCuttingGatePssPdfAsync,
  GetSingleCutting,
  Updatecuttingasync,
} from "../../../features/CuttingSlice";
import { FiPlus } from "react-icons/fi";
import {
  createStone,
  getColorsForCurrentEmbroidery,
  getStoneDataBypartyNameAsync,
} from "../../../features/stoneslice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import ProcessBillModal from "../../../Component/Modal/ProcessBillModal";
import moment from "moment-timezone";
import ReactSearchBox from "react-search-box";
import { MdOutlineDelete } from "react-icons/md";

const CuttingDetails = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const {
    loading,
    SingleCutting,
    generateCuttingBillLoading,
    CuttingpdfLoading,
  } = useSelector((state) => state.Cutting);
  const {
    color,
    loading: IsLoading,
    previousDataByPartyName,
  } = useSelector((state) => state.stone);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] =
    useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  const [isGenerateGatePassOpen, setisGenerateGatePassOpen] = useState(false);
  const [processBillModal, setProcessBillModal] = useState(false);
  const [processBillData, setProcessBillData] = useState({});
  const [accountData, setAccountData] = useState(null);
  const [partyValue, setPartyValue] = useState("newParty");
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

  const [cuttingData, setcuttingData] = useState({
    id,
    r_quantity: "",
  });

  const initialRow = { category: "", color: "", quantity: "" };

  const [formData, setFormData] = useState({
    partyName: "",
    serial_No: "",
    design_no: "",
    partyType: partyValue,
    date: "",
    rate: "",
    category_quantity: [initialRow],
  });

  const { embroidery_Id, design_no, serial_No, from } = location.state || {};

  useEffect(() => {
    setFormData({
      serial_No: SingleCutting?.serial_No || serial_No || "",
      design_no: SingleCutting?.design_no || design_no || "",
      date: today,
      partyType: partyValue,
      partyName: "",
      embroidery_Id: SingleCutting?.embroidery_Id || embroidery_Id || "",
      category_quantity: [initialRow],
    });
  }, [SingleCutting, partyValue]);

  useEffect(() => {
    setcuttingData({
      id: id,
      r_quantity: SingleCutting?.r_quantity || "",
    });
  }, [SingleCutting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      category_quantity: [...prevState.category_quantity, initialRow],
    }));
  };

  const deleteRow = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      category_quantity: prevState.category_quantity.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      category_quantity: prevState.category_quantity?.map((row, i) =>
        i === index ? { ...row, category: value } : row
      ),
    }));
  };

  const handleColorChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      category_quantity: prevState.category_quantity?.map((row, i) =>
        i === index ? { ...row, color: value } : row
      ),
    }));
  };

  const handleQuantityChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      category_quantity: prevState.category_quantity?.map((row, i) =>
        i === index ? { ...row, quantity: parseInt(value) } : row
      ),
    }));
  };

  useEffect(() => {
    if (id !== "null") {
      const data = {
        id: id,
      };
      dispatch(GetSingleCutting(data));
    } else {
      openModal();
    }
  }, [id, dispatch]);

  useEffect(() => {
    if ((SingleCutting && SingleCutting?.serial_No) || serial_No) {
      const data = SingleCutting?.serial_No || serial_No;
      dispatch(getColorsForCurrentEmbroidery({ serial_No: data }));
    }
  }, [id, SingleCutting]);

  const handleInputChangeCutting = (e) => {
    const { name, value } = e.target;
    setcuttingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitstome = (e) => {
    e.preventDefault();

    dispatch(createStone(formData)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        navigate("/dashboard/stones");
      }
    });
  };

  const handleUpdateCutting = (e) => {
    e.preventDefault();

    const data = {
      id: id,
    };

    dispatch(Updatecuttingasync(cuttingData)).then((res) => {
      if (res.payload.success) {
        dispatch(GetSingleCutting(data));
        closeUpdateRecievedModal();
      }
    });
  };

  const handleCompleteCutting = (e) => {
    e.preventDefault();

    const data = {
      id: id,
    };

    dispatch(Updatecuttingasync({ project_status: "Completed", id: id }))
      .then(() => {
        dispatch(GetSingleCutting(data));
        closeCompletedModal();
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
    document.body.style.overflow = "auto";
  };

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
    dispatch(generateCuttingGatePssPdfAsync(SingleCutting));
    closeGatepassModal();
  };

  const generateBill = (e) => {
    e.preventDefault();
    const formData = {
      ...SingleCutting,
      process_Category: "Cutting",
      Manual_No: processBillData.Manual_No,
      additionalExpenditure: processBillData.additionalExpenditure,
      Cutting_id: SingleCutting.id,
      Embroidery_id: SingleCutting?.embroidery_Id,
    };
    dispatch(generateCuttingBillAsync(formData)).then((res) => {
      if (res.payload.success) {
        closeBillModal();
        setProcessBillData({});
      }
    });
  };

  const openGenerateBillForm = () => {
    setProcessBillModal(true);
  };

  const closeBillModal = () => {
    setProcessBillModal(false);
  };

  const HandleProcessBillDataChange = (data) => {
    setProcessBillData(data);
  };

  const handleOpenGatePassModal = () => {
    setisGenerateGatePassOpen(true);
  };

  const closeGatepassModal = () => {
    setisGenerateGatePassOpen(false);
    document.body.style.overflow = "auto";
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
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      partyName: "",
    }));
    setAccountData(null);
  };

  const handleSearchOldData = (value) => {
    dispatch(getStoneDataBypartyNameAsync({ partyName: value }));
  };

  const searchResults = previousDataByPartyName?.stoneData?.map((item) => {
    return {
      key: item.partyName,
      value: item.partyName,
    };
  });

  const handleSkipStep = (e) => {
    const value = e.target.value;
    switch (true) {
      case value === "Stitching":
        navigate("/dashboard/stones-details/null", {
          state: {
            embroidery_Id: SingleCutting.embroidery_Id,
            design_no: SingleCutting.design_no,
            serial_No: SingleCutting.serial_No,
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
            Cutting Details
          </h1>
        </div>
        {/* -------------- DETAILS SECTION -------------- */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
            {/* FIRST ROW */}
            <div className="box">
              <span className="font-medium">Party Name:</span>
              <span> {SingleCutting?.partyName}</span>
            </div>
            <div className="box">
              <span className="font-medium">Manual No:</span>
              <span> {SingleCutting?.Manual_No ?? '--'}</span>
            </div>
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span> {SingleCutting?.design_no}</span>
            </div>

            <div className="box">
              <span className="font-medium">Rate:</span>
              <span> {SingleCutting?.rate}</span>
            </div>
            <div className="box">
              <span className="font-medium">Project Status:</span>
              <span className="">
                {" "}
                {setStatusColor(SingleCutting?.project_status)}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Date:</span>
              <span>{new Date(SingleCutting?.date).toLocaleDateString()}</span>
            </div>
            <div className="box">
              <span className="font-medium">Quantity:</span>
              <span> {SingleCutting?.T_Quantity} </span>
            </div>
            <div className="box">
              <span className="font-medium">R. Quantity:</span>
              <span> {SingleCutting?.r_quantity}</span>
            </div>
            <div className="box">
              <span className="font-medium">Available Quantity:</span>
              <span> {SingleCutting?.Available_Quantity}</span>
            </div>
          </div>
        </div>
        {/* RECEIVED SUITS COLORS */}
        <div className="my-10 px-3 text-gray-800 dark:text-gray-200">
          <label htmlFor="received_quantity" className="font-semibold">
            Enter Received Quantity
          </label>
          <input
            id="r_quantity"
            name="r_quantity"
            type="text"
            placeholder="Quantity"
            className="bg-gray-50 mt-2 border max-w-xs border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
            value={cuttingData.r_quantity}
            onChange={handleInputChangeCutting}
            disabled={SingleCutting?.project_status === "Completed"}
          />
        </div>
        <div className="flex justify-center items-center">
          {SingleCutting?.project_status !== "Completed" && (
            <button
              className={`px-3 py-2 text-sm rounded bg-blue-800 text-white border-none`}
              onClick={handleUpdateReceivedClick}
            >
              Update Recived
            </button>
          )}
        </div>
        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-6 flex justify-center items-center gap-x-5">
          {SingleCutting?.project_status !== "Completed" &&
            SingleCutting?.updated && (
              <button
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                onClick={handleCompletedClick}
              >
                Completed
              </button>
            )}

          {SingleCutting?.project_status === "Completed" &&
            !SingleCutting.bill_generated && (
              <button
                onClick={openGenerateBillForm}
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              >
                Generate Bill
              </button>
            )}

          {CuttingpdfLoading ? (
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
            <option value="Stitching">Stitching</option>
          </select>
        </div>
        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative scrollable-content max-h-[90vh] py-4 px-3 w-full max-w-4xl bg-white rounded-md shadow dark:bg-gray-700">
              {/* ------------- HEADER ------------- */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Stone
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

              {/* ------------- BODY ------------- */}
              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmitstome}>
                  {/* INPUT FIELDS DETAILS */}
                  <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
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
                          value={formData.partyName}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="custom-search-box relative">
                          <ReactSearchBox
                            key={searchResults?.key}
                            onSelect={(value) =>
                              handleSelectedRecord(value?.item?.key)
                            }
                            placeholder={
                              formData.partyName === ""
                                ? "Search"
                                : formData.partyName
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
                        name="SerialNo"
                        type="text"
                        placeholder="Serial No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={formData.serial_No}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                    <div>
                      <input
                        name="DesignNo"
                        type="text"
                        placeholder="Design No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={formData.design_no}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                    {/* DATE */}
                    <div>
                      <input
                        name="date"
                        type="date"
                        placeholder="Date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={formData.date}
                        required
                        readOnly
                      />
                    </div>

                    {/* ENTER RATE */}
                    <div>
                      <input
                        name="rate"
                        type="text"
                        placeholder="Enter Rate"
                        step="0.01"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={formData.rate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center ">
                    <h2 className="block mb-0 text-sm font-medium text-gray-900 dark:text-white">
                      Select Quantity
                    </h2>
                    <p onClick={addNewRow}>
                      <FiPlus
                        size={24}
                        className=" cursor-pointer dark:text-white"
                      />
                    </p>
                  </div>

                  {formData.category_quantity &&
                    formData.category_quantity?.map((row, index) => (
                      <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* SELECT CATEGORY */}
                        <div>
                          <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={row.category}
                            onChange={(e) => handleCategoryChange(e, index)}
                          >
                            <option selected>Select Category</option>
                            <option value="Front">Front</option>
                            <option value="Back">Back</option>
                            <option value="Bazo">Bazo</option>
                            <option value="Duppata">Duppata</option>
                            <option value="Gala">Gala</option>
                            <option value="Front Patch">Front patch</option>
                            <option value="Trouser">Trouser</option>
                          </select>
                        </div>

                        {/* SELECTED COLORS */}
                        <div>
                          <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={row.color}
                            onChange={(e) => handleColorChange(e, index)}
                            name="color"
                          >
                            <option value={""} disabled>
                              Select color
                            </option>
                            {color?.colors?.map((data) => (
                              <option value={data}>{data}</option>
                            ))}
                          </select>
                        </div>

                        {/* ENTER QUANITY */}
                        <div className="flex items-center">
                          <input
                            type="text"
                            placeholder="Enter Quantity"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                            value={isNaN(row.quantity) ? 0 : row.quantity}
                            onChange={(e) => handleQuantityChange(e, index)}
                          />

                          {formData?.category_quantity?.length > 1 && (
                            <button
                              onClick={() => deleteRow(index)}
                              className=" text-red-500  rounded-lg ms-auto inline-flex justify-center items-center"
                              type="button"
                            >
                              <MdOutlineDelete
                                size={20}
                                className="cursor-pointer text-red-500"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  <div className="flex justify-center pt-2">
                    {IsLoading ? (
                      <button
                        disabled
                        type="submit"
                        className="inline-block cursor-not-allowed rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                      >
                        Submiting...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
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
            onConfirm={handleUpdateCutting}
            onClose={closeUpdateRecievedModal}
          />
        )}

        {isCompletedConfirmOpen && (
          <ConfirmationModal
            title="Confirm Complete"
            message="Are you sure you want to Complete?"
            onConfirm={handleCompleteCutting}
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
          <ProcessBillModal
            onDataChange={HandleProcessBillDataChange}
            handleSubmit={generateBill}
            loading={generateCuttingBillLoading}
            closeModal={closeBillModal}
            Manual_No={SingleCutting.Manual_No}
            processBillAmount={Math.round(
              SingleCutting?.rate * SingleCutting?.r_quantity
            )}
          />
        )}
      </section>
    </>
  );
};

export default CuttingDetails;
