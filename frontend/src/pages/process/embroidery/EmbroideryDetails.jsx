import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  generateEmbroideryBillAsync,
  generateEmbroideryGatePssPdfAsync,
  GETEmbroiderySIngle,
  UpdateEmbroidery,
} from "../../../features/EmbroiderySlice";
import ReactSearchBox from "react-search-box";
import { useSelector } from "react-redux";
import {
  calenderDataBypartyNameAsync,
  createCalender,
} from "../../../features/CalenderSlice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import PictureOrderModal from "../../../Component/Embodiary/PictureOrderModal";
import ProcessBillModal from "../../../Component/Modal/ProcessBillModal";
import moment from "moment-timezone";
import toast from "react-hot-toast";

const EmbroideryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const [isOpen, setIsOpen] = useState(false);
  const [processBillModal, setProcessBillModal] = useState(false);
  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] =
    useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  const [isGenerateGatePassOpen, setisGenerateGatePassOpen] = useState(false);
  const [picturesModal, setPicturesMOdal] = useState(false);

  const { loading: IsLoading, previousDataByPartyName } = useSelector(
    (state) => state.Calender
  );

  const navigate = useNavigate();

  const {
    loading,
    UpdatEmbroideryloading,
    SingleEmbroidery,
    EmroiderypdfLoading,
    generateBillLoading,
  } = useSelector((state) => state.Embroidery);
  const [processBillData, setProcessBillData] = useState({});
  const [partyValue, setPartyValue] = useState("newParty");
  const [accountData, setAccountData] = useState(null);
  const [CalenderData, setCalenderData] = useState({
    serial_No: "",
    partyName: "",
    partytype: partyValue,
    design_no: "",
    date: today,
    T_Quantity: 0,
    rate: 0,
    embroidery_Id: SingleEmbroidery?.id || "",
  });

  useEffect(() => {
    setCalenderData({
      partytype: partyValue,
      partyName: "",
      serial_No: SingleEmbroidery?.serial_No || "",
      design_no: SingleEmbroidery?.design_no || "",
      date: today,
      embroidery_Id: SingleEmbroidery?.id || "",
    });
  }, [SingleEmbroidery, partyValue]);

  const initialShirtRow = { category: "", color: "", received: 0 };
  const initialDupattaRow = { category: "", color: "", received: 0 };
  const initialTrouserRow = { category: "", color: "", received: 0 };

  const [formData, setFormData] = useState({
    shirt: [initialShirtRow],
    duppata: [initialDupattaRow],
    trouser: [initialTrouserRow],
    id: id,
  });

  useEffect(() => {
    if (SingleEmbroidery) {
      setFormData({
        shirt: SingleEmbroidery.shirt || [
          { category: "", color: "", received: 0 },
        ],
        duppata: SingleEmbroidery.duppata || [
          { category: "", color: "", received: 0 },
        ],
        trouser: SingleEmbroidery.trouser || [
          { category: "", color: "", received: 0 },
        ],
        id: id,
      });
    }
  }, [SingleEmbroidery, id]);

  const handleInputChange = (category, color, received, index, section) => {
    const validReceived = isNaN(received) || received === "" ? 0 : received;
    setFormData((prevState) => {
      const updatedSection = prevState[section].map((item, idx) =>
        idx === index
          ? { ...item, category, color, received: validReceived }
          : item
      );

      return {
        ...prevState,
        [section]: updatedSection,
      };
    });
  };

  useEffect(() => {
    const data = {
      id: id,
    };
    dispatch(GETEmbroiderySIngle(data));
  }, [id, dispatch]);

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="pt-16 flex justify-center mt-12 items-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading.....</span>
          </div>
        </div>
      </section>
    );
  }

  if (!SingleEmbroidery) {
    return <div>No data found.</div>;
  }

  const {
    partyName,
    Manual_No,
    serial_No,
    date,
    per_suit,
    project_status,
    design_no,
    shirt,
    duppata,
    trouser,
    T_Quantity_In_m,
    T_Quantity,
    Front_Stitch,
    Bazo_Stitch,
    Gala_Stitch,
    Back_Stitch,
    Pallu_Stitch,
    Trouser_Stitch,
    D_Patch_Stitch,
    F_Patch_Stitch,
    tissue,
    bill_generated,
    pictures_Order,
    updated,
    discount,
    discountType,
    next_steps
  } = SingleEmbroidery;

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(UpdateEmbroidery(formData)).then((res) => {
      if (res.payload.success === true) {
        dispatch(GETEmbroiderySIngle({ id }));
        closeUpdateRecievedModal();
      }
    });
  };

  const handleCompleted = (event) => {
    event.preventDefault();

    dispatch(UpdateEmbroidery({ project_status: "Completed", id })).then(
      (res) => {
        if (res.payload.success === true) {
          dispatch(GETEmbroiderySIngle({ id }));
          closeCompletedModal();
        }
      }
    );
  };

  const handleInputChangeCalender = (e) => {
    const { name, value } = e.target;
    setCalenderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitCalender = (e) => {
    e.preventDefault();

    dispatch(createCalender(CalenderData)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
        navigate("/dashboard/calendar");
      }
    });
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setPartyValue("newParty");
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

  const handleOpenGatePassModal = () => {
    setisGenerateGatePassOpen(true);
  };

  const closeGatepassModal = () => {
    setisGenerateGatePassOpen(false);
    document.body.style.overflow = "auto";
  };

  const closeUpdateRecievedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleGenerateGatePassPDf = () => {
    dispatch(generateEmbroideryGatePssPdfAsync(SingleEmbroidery));
    closeGatepassModal();
  };

  const generateBill = (e) => {
    e.preventDefault();
    const formData = {
      ...SingleEmbroidery,
      process_Category: "Embroidery",
      Manual_No: processBillData.Manual_No,
      additionalExpenditure: processBillData.additionalExpenditure,
      Embroidery_id: SingleEmbroidery?.id,
      embroidery_Id: SingleEmbroidery?.id,
    };
    dispatch(generateEmbroideryBillAsync(formData)).then((res) => {
      if (res.payload.success === true) {
        setProcessBillModal(false);
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

  const openMoodalForPicturesOrder = () => {
    setPicturesMOdal(true);
  };

  const closeModalForPicturesOrder = () => {
    setPicturesMOdal(false);
  };

  const handleSelectedRecord = (value) => {
    const Data = previousDataByPartyName?.accountData.find(
      (item) => item.partyName === value
    );
    setCalenderData((prev) => ({
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
    setCalenderData((prev) => ({
      ...prev,
      partyName: "",
    }));
    setAccountData(null);
  };

  const handleSearchOldData = (value) => {
    dispatch(calenderDataBypartyNameAsync({ partyName: value }));
  };

  const searchResults = previousDataByPartyName?.calenderData?.map((item) => {
    return {
      key: item.partyName,
      value: item.partyName,
    };
  });

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

  const handleSkipStep = (e) => {
    const value = e.target.value;
    switch (true) {
      case value === "Cutting":
        navigate("/dashboard/calendar-details/null", {
          state: {
            embroidery_Id: SingleEmbroidery.id,
            design_no: SingleEmbroidery.design_no,
            serial_No: SingleEmbroidery.serial_No,
            from: location.pathname,
          },
        });
        break;

      case value === "Stones":
        navigate("/dashboard/cutting-details/null", {
          state: {
            embroidery_Id: SingleEmbroidery.id,
            design_no: SingleEmbroidery.design_no,
            serial_No: SingleEmbroidery.serial_No,
            from: location.pathname,
          },
        });
        break;

      case value === "Stitching":
        navigate("/dashboard/stones-details/null", {
          state: {
            embroidery_Id: SingleEmbroidery.id,
            design_no: SingleEmbroidery.design_no,
            serial_No: SingleEmbroidery.serial_No,
            from: location.pathname,
          },
        });
        break;

      case value === "Packing":
        if (SingleEmbroidery.T_Recieved_Suit === 0) {
          return toast.error("Invalid Recieved Suit Quantity");
        }
        navigate("/dashboard/packing-details/null", {
          state: {
            embroidery_Id: SingleEmbroidery.id,
            design_no: SingleEmbroidery.design_no,
            serial_No: SingleEmbroidery.serial_No,
            from: location.pathname,
            suits_category: SingleEmbroidery.shirt,
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
            Embroidery Details
          </h1>
        </div>

        {/* -------------- DETAILS SECTION -------------- */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
            {/* FIRST ROW */}
            <div className="box">
              <span className="font-medium">Party Name:</span>
              <span> {partyName}</span>
            </div>
            <div className="box">
              <span className="font-medium">Manual No:</span>
              <span> {Manual_No ?? "--"}</span>
            </div>
            <div className="box">
              <span className="font-medium">Date:</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="box">
              <span className="font-medium">Per Suit:</span>
              <span> {per_suit?.toFixed(2)}</span>
            </div>
            <div className="box">
              <span className="font-medium">Project Status:</span>
              <span className=""> {setStatusColor(project_status)}</span>
            </div>
            {/* SECOND ROW */}
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span> {design_no}</span>
            </div>
            {shirt &&
              shirt?.map((item, index) => (
                <div key={index} className="box">
                  <span className="font-medium">Shirt M: {index + 1}:</span>
                  <span> {item.quantity_in_m} m</span>
                </div>
              ))}

            {duppata &&
              duppata?.map((item, index) => (
                <div key={index} className="box">
                  <span className="font-medium">Dupatta M: {index + 1}:</span>
                  <span> {item.quantity_in_m} m</span>
                </div>
              ))}
            {trouser &&
              trouser?.map((item, index) => (
                <div key={index} className="box">
                  <span className="font-medium">Trouser M {index + 1}:</span>
                  <span> {item.quantity_in_m} m</span>
                </div>
              ))}

            <div className="box">
              <span className="font-medium">T Received :</span>
              <span>
                {" "}
                {SingleEmbroidery?.recieved_suit
                  ? SingleEmbroidery?.recieved_suit
                  : "---"}{" "}
              </span>
            </div>
            {/* THIRD ROW */}
            <div className="box">
              <span className="font-medium">T Quantity In M:</span>
              <span> {T_Quantity_In_m} m</span>
            </div>
            <div className="box">
              <span className="font-medium">T Quantity:</span>
              <span> {T_Quantity}</span>
            </div>
            <div className="box">
              <span className="font-medium">T Suit:</span>
              <span>
                {" "}
                {SingleEmbroidery?.T_Suit
                  ? SingleEmbroidery?.T_Suit
                  : "--"}{" "}
                Suit
              </span>
            </div>
            <div className="box">
              <span className="font-medium">T Recieved Suit:</span>
              <span>
                {" "}
                {SingleEmbroidery?.T_Recieved_Suit
                  ? SingleEmbroidery?.T_Recieved_Suit
                  : "--"}{" "}
                Suit
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Front Stitch:</span>
              <span>
                {" "}
                {Front_Stitch?.head}, {Front_Stitch?.value}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Bazo Stitch:</span>
              <span>
                {" "}
                {Bazo_Stitch?.head}, {Bazo_Stitch?.value}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Gala Stitch:</span>
              <span>
                {" "}
                {Gala_Stitch?.head}, {Gala_Stitch?.value}
              </span>
            </div>
            {/* FORTH ROW */}
            <div className="box">
              <span className="font-medium">Back Stitch:</span>
              <span>
                {" "}
                {Back_Stitch?.head}, {Back_Stitch?.value}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Pallu Stitch:</span>
              <span>
                {" "}
                {Pallu_Stitch?.head}, {Pallu_Stitch?.value}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Trouser Stitch:</span>
              <span>
                {" "}
                {Trouser_Stitch?.head}, {Trouser_Stitch?.value}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">D Patch Stitch:</span>
              <span>
                {" "}
                {D_Patch_Stitch?.head}, {D_Patch_Stitch?.value}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">F Patch Stitch:</span>
              <span>
                {" "}
                {F_Patch_Stitch?.head}, {F_Patch_Stitch?.value}
              </span>
            </div>

            {/* FIFTH ROW */}

            <div className="box">
              <span className="font-medium">Tissue:</span>
              <span> {tissue} m</span>
            </div>
            <div className="box">
              <span className="font-medium">Discount:</span>
              <span>
                {" "}
                {discount ?? "--"} {discountType}
              </span>
            </div>
          </div>
        </div>

        {/* -------------- RECEIVED STOCK SECTION -------------- */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
            {/* SHIRT DATA */}
            {formData?.shirt.length > 0 && (
              <div className="box_1">
                <h3 className="mb-4 font-semibold text-lg">
                  Received Shirts Colors
                </h3>
                <div className="details space-y-2">
                  {formData?.shirt?.map((item, index) => (
                    <div
                      key={index}
                      className="details_box flex items-center gap-x-3"
                    >
                      <p className="w-[13rem]">
                        {item.category} - {item.color} ({item?.quantity_in_no})
                        ({item?.quantity_in_m}m)
                      </p>

                      <input
                        type="text"
                        key={`shirt-${index}`}
                        className="py-1  border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black"
                        value={item.received} // Ensure this is tied to the state
                        onChange={(e) =>
                          handleInputChange(
                            item.category,
                            item.color,
                            parseInt(e.target.value),
                            index,
                            "shirt"
                          )
                        }
                        readOnly={project_status === "Completed"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* DUPPATA DATA */}
            {formData?.duppata.length > 0 && (
              <div className="box_2">
                <h3 className="mb-4 font-semibold text-lg">
                  Received Dupatta Colors
                </h3>
                <div className="details space-y-2">
                  {formData?.duppata?.map((item, index) => (
                    <div
                      key={index}
                      className="details_box flex items-center gap-x-3"
                    >
                      <p className="w-[13rem]">
                        {item.category} - {item.color} ({item?.quantity_in_no})
                        ({item?.quantity_in_m}m)
                      </p>
                      <input
                        type="text"
                        key={`duppata-${index}`}
                        className="py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black"
                        value={item.received}
                        onChange={(e) =>
                          handleInputChange(
                            item.category,
                            item.color,
                            parseInt(e.target.value),
                            index,
                            "duppata"
                          )
                        }
                        readOnly={project_status === "Completed"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* TROUSER DATA */}
            {formData?.trouser.length > 0 && (
              <div className="box_3">
                <h3 className="mb-4 font-semibold text-lg">
                  Received Trousers Colors
                </h3>
                <div className="details space-y-2">
                  {formData.trouser?.map((item, index) => (
                    <div
                      key={index}
                      className="details_box flex items-center gap-x-3"
                    >
                      <p className="w-[13rem]">
                        {item.category} - {item.color} ({item?.quantity_in_no})
                        ({item?.quantity_in_m}m)
                      </p>
                      <input
                        key={`trouser-${index}`}
                        type="text"
                        className="py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black"
                        value={item.received}
                        onChange={(e) =>
                          handleInputChange(
                            item.category,
                            item.color,
                            parseInt(e.target.value),
                            index,
                            "trouser"
                          )
                        }
                        readOnly={project_status === "Completed"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          {project_status !== "Completed" && (
            <button
              className="px-2 mt-2 py-2.5 text-sm rounded bg-blue-800 text-white border-none"
              onClick={handleUpdateReceivedClick}
            >
              Update Recived
            </button>
          )}
        </div>
        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-6 flex justify-center items-center gap-x-3">
          {project_status !== "Completed" && updated && (
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={handleCompletedClick}
            >
              Completed
            </button>
          )}
          {project_status === "Completed" && !bill_generated && (
            <button
              onClick={openGenerateBillForm}
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            >
              Generate Bill
            </button>
          )}
          {EmroiderypdfLoading ? (
            <button
              disabled
              className="px-4 py-2.5 hover:cursor-progress text-sm rounded bg-gray-400 dark:bg-gray-200 text-white dark:text-gray-800"
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

          {!next_steps?.packing && (
            <>
              {" "}
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
                <option value="Cutting">Cutting</option>
                <option value="Stones">Stone</option>
                <option value="Stitching">Stitching</option>
                <option value="Packing">Packing</option>
              </select>{" "}
            </>
          )}
          {pictures_Order === false && (
            <button
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              onClick={openMoodalForPicturesOrder}
            >
              Order Pictures
            </button>
          )}
        </div>

        {/* CALENDER DETAILS */}
        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Calendar Details
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
                <form className="space-y-4" onSubmit={handleSubmitCalender}>
                  <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                    {/* RADIO BUTTONS */}
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

                    <div>
                      {partyValue === "newParty" ? (
                        <input
                          name="partyName"
                          type="text"
                          placeholder="Party Name"
                          className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                          value={CalenderData.partyName}
                          onChange={handleInputChangeCalender}
                        />
                      ) : (
                        <div className="custom-search-box relative">
                          <ReactSearchBox
                            key={searchResults?.key}
                            onSelect={(value) =>
                              handleSelectedRecord(value?.item?.key)
                            }
                            placeholder={
                              CalenderData.partyName === ""
                                ? "Search"
                                : CalenderData.partyName
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
                        value={CalenderData.design_no}
                        onChange={handleInputChangeCalender}
                        required
                        readOnly
                      />
                    </div>

                    <div>
                      <input
                        name="date"
                        type="date"
                        placeholder="Date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData.date}
                        required
                        readOnly
                      />
                    </div>

                    <div>
                      <input
                        name="T_Quantity"
                        type="number"
                        placeholder="Quantity"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData.T_Quantity}
                        onChange={handleInputChangeCalender}
                        required
                      />
                    </div>

                    <div>
                      <input
                        name="rate"
                        type="number"
                        placeholder="rate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData.rate}
                        step="0.01"
                        onChange={handleInputChangeCalender}
                        required
                      />
                    </div>

                    <div>
                      <input
                        name="serialNo"
                        type="text"
                        placeholder="serial No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData?.serial_No}
                        onChange={handleInputChangeCalender}
                        required
                        readOnly
                      />
                    </div>

                    {/* New input fields */}
                  </div>

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

        {/* PICTURES ORDER MODAL */}
        {picturesModal && (
          <PictureOrderModal
            closeModal={closeModalForPicturesOrder}
            embroidery_Id={id}
            design_no={design_no}
            serial_No={serial_No}
          />
        )}

        {isUpdateReceivedConfirmOpen && (
          <ConfirmationModal
            UpdatEmbroideryloading={UpdatEmbroideryloading}
            title="Confirm Update"
            message="Are you sure you want to update the received items?"
            onConfirm={handleSubmit}
            onClose={closeUpdateRecievedModal}
          />
        )}

        {isCompletedConfirmOpen && (
          <ConfirmationModal
            UpdatEmbroideryloading={UpdatEmbroideryloading}
            title="Confirm Complete"
            message="Are you sure you want to Complete ?"
            onConfirm={handleCompleted}
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
            loading={generateBillLoading}
            closeModal={closeBillModal}
            Manual_No={SingleEmbroidery.Manual_No}
            processBillAmount={Math.round(
              SingleEmbroidery?.per_suit * SingleEmbroidery?.T_Recieved_Suit
            )}
          />
        )}
      </section>
    </>
  );
};

export default EmbroideryDetails;
