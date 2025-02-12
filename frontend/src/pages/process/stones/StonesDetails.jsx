import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  generateStoneBillAsync,
  generateStoneGatePssPdfAsync,
  GetSingleStone,
  UpdateStoneAsync,
} from "../../../features/stoneslice";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus } from "react-icons/fi";
import {
  createStitching,
  getStitchingDataBypartyNameAsync,
} from "../../../features/stitching";

import { GETEmbroiderySIngle } from "../../../features/EmbroiderySlice";
import { GetAllLaceForEmroidery } from "../../../features/InStockSlice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import toast from "react-hot-toast";
import ProcessBillModal from "../../../Component/Modal/ProcessBillModal";
import moment from "moment-timezone";
import ReactSearchBox from "react-search-box";
import { RxCross2 } from "react-icons/rx";

const StonesDetails = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { loading, SingleStone, StnoneBillLoading, StonerpdfLoading } =
    useSelector((state) => state.stone);
  const { LaceForEmroidery } = useSelector((state) => state.InStock);

  const { SingleEmbroidery } = useSelector((state) => state.Embroidery);
  const { loading: IsLoading, previousDataByPartyName } = useSelector(
    (state) => state.stitching
  );

  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] =
    useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  const [isGenerateGatePassOpen, setisGenerateGatePassOpen] = useState(false);
  const [processBillModal, setProcessBillModal] = useState(false);
  const [processBillData, setProcessBillData] = useState({});
  const [accountData, setAccountData] = useState(null);
  const [partyValue, setPartyValue] = useState("newParty");
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { embroidery_Id, design_no, serial_No, from } = location.state || {};

  useEffect(() => {
    if (id !== "null") {
      const data = {
        id: id,
      };
      dispatch(GetSingleStone(data));
    } else {
      openModal();
    }
    dispatch(GetAllLaceForEmroidery());
  }, [id]);

  useEffect(() => {
    if (SingleStone?.embroidery_Id || embroidery_Id) {
      const data = {
        id: SingleStone?.embroidery_Id || embroidery_Id,
      };
      dispatch(GETEmbroiderySIngle(data));
    }
  }, [id, SingleStone]);

  const initialRow = { category: "", color: "", quantity_in_no: 0 };

  const [formData, setFormData] = useState({
    partyName: "",
    serial_No: "",
    design_no: "",
    date: "",
    rate: "",
    embroidery_Id: "",
    suits_category: [initialRow],
    dupatta_category: [initialRow],
    lace_quantity: "",
    lace_category: "",
    Quantity: "",
  });

  const [StoneData, setStoneData] = useState({
    id: SingleStone?.id,
    category_quantity: SingleStone?.category_quantity || [
      {
        id: "",
        first: 0,
        second: 0,
        third: 0,
      },
    ],
  });

  useEffect(() => {
    if (SingleStone) {
      setStoneData({
        id: SingleStone.id,
        category_quantity: SingleStone?.category_quantity?.map((item) => ({
          id: item.id,
          first: item.recieved_Data?.first?.quantity || 0,
          second: item.recieved_Data?.second?.quantity || 0,
          third: item.recieved_Data?.third?.quantity || 0,
          category: item.category,
          color: item.color,
        })),
      });
    }
  }, [SingleStone]);

  useEffect(() => {
    setFormData({
      serial_No: SingleStone?.serial_No || serial_No || "",
      design_no: SingleStone?.design_no || design_no || "",
      embroidery_Id: SingleStone?.embroidery_Id || embroidery_Id || "",
      suits_category: [initialRow],
      dupatta_category: [initialRow],
      lace_category: "",
      date: today,
      partyName: "",
      partytype: partyValue,
    });
  }, [SingleStone, partyValue, id]);

  const [suitDataForPacking, setSuitDataForPacking] = useState();

  const [isPackingModalOpen, setPackingModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewRow = (categoryType) => {
    setFormData((prevState) => {
      const updatedCategory = prevState[categoryType] || [];
      const newCategoryArray = [...updatedCategory, initialRow];
      return {
        ...prevState,
        [categoryType]: newCategoryArray,
      };
    });
  };

  const removeRow = (categoryType, index) => {
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType].filter((_, idx) => idx !== index),
    }));
  };

  const handleCategoryChange = (e, index, categoryType) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType]?.map((row, i) =>
        i === index ? { ...row, category: value } : row
      ),
    }));
  };

  const handleColorChange = (e, index, categoryType) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType]?.map((row, i) =>
        i === index ? { ...row, color: value } : row
      ),
    }));
    getMaxQuantity(categoryType);
  };

  const handleQuantityChange = (e, index, categoryType) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType]?.map((row, i) =>
        i === index ? { ...row, quantity_in_no: value } : row
      ),
    }));
  };

  const getMaxQuantity = (categoryType) => {
    if (categoryType === "suits_category") {
      SingleEmbroidery?.shirt?.forEach((item) => {
        const { category, color, received } = item;
        formData?.suits_category.forEach((suit) => {
          setFormData((prevState) => ({
            ...prevState,
            suits_category: prevState.suits_category.map((suit) =>
              suit.category === category && suit.color === color
                ? { ...suit, MaxQuantity: received }
                : suit
            ),
          }));
        });
      });
    } else if (categoryType === "dupatta_category") {
      SingleEmbroidery?.duppata?.forEach((item) => {
        const { category, color, received } = item;
        formData?.suits_category.forEach((suit) => {
          setFormData((prevState) => ({
            ...prevState,
            dupatta_category: prevState.dupatta_category.map((dupatta) =>
              dupatta.category === category && dupatta.color === color
                ? { ...dupatta, MaxQuantity: received }
                : dupatta
            ),
          }));
        });
      });
    }
  };

  //CALCULAATE TOTAL QUANTITY FOR STITCHING DATA
  const validateValue = (value) => {
    return isNaN(value) || value === undefined || value === null
      ? 0
      : parseInt(value);
  };

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    if (formData.suits_category && formData.dupatta_category) {
      formData.suits_category.forEach((item) => {
        totalQuantity += validateValue(item.quantity_in_no);
      });
    } else if (formData.suits_category) {
      formData.suits_category.forEach((item) => {
        totalQuantity += validateValue(item.quantity_in_no);
      });
    } else if (formData.dupatta_category) {
      formData.dupatta_category.forEach((item) => {
        totalQuantity += validateValue(item.quantity_in_no);
      });
    }

    return totalQuantity;
  };

  //VALIDATE DUPATTA DATA
  const validateDupattaData = () => {
    if (formData.dupatta_category && formData.dupatta_category.length >= 0) {
      formData.dupatta_category = formData.dupatta_category.filter((item) => {
        return !(
          item.category === "" &&
          item.color === "" &&
          item.quantity_in_no === 0
        );
      });
      if (formData.dupatta_category.length === 0) {
        delete formData.dupatta_category;
      }
    } else if (
      formData.dupatta_category &&
      formData.dupatta_category.length === 0
    ) {
      delete formData.dupatta_category;
    }
  };

  //VALIDATE SUITS DATA
  const validateSuitData = () => {
    if (formData.suits_category && formData.suits_category.length >= 0) {
      formData.suits_category = formData.suits_category.filter((item) => {
        return !(
          item.category === "" &&
          item.color === "" &&
          item.quantity_in_no === 0
        );
      });
      if (formData.suits_category.length === 0) {
        delete formData.suits_category;
      }
    } else if (
      formData.suits_category &&
      formData.suits_category.length === 0
    ) {
      delete formData.suits_category;
    }
  };

  const handleSubmitstitching = (e) => {
    e.preventDefault();
    validateDupattaData();
    validateSuitData();
    if (!formData.dupatta_category && !formData.suits_category) {
      toast.error("Please add Duppata or Shirt Data");
    } else {
      calculateTotalQuantity();
      dispatch(
        createStitching({ ...formData, Quantity: calculateTotalQuantity() })
      ).then((res) => {
        if (res.payload.success === true) {
          closeModal();
          navigate("/dashboard/stitching");
        }
      });
    }
  };

  const handleUpdateStone = (e) => {
    e.preventDefault();

    const updatedCategoryQuantity = SingleStone?.category_quantity?.map(
      (item, index) => ({
        ...StoneData?.category_quantity[index],
        id: item.id,
      })
    );

    const updatedStoneData = {
      ...StoneData,
      category_quantity: updatedCategoryQuantity,
      totalQuantity: SingleStone?.category_quantity?.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    };

    dispatch(UpdateStoneAsync(updatedStoneData))
      .then((res) => {
        if (res.payload.success) {
          const data = {
            id: id,
          };
          dispatch(GetSingleStone(data));
          closeUpdateRecievedModal();
        }
      })
      .catch(() => {
        closeUpdateRecievedModal();
      });
  };

  const handleCompleteStone = (e) => {
    e.preventDefault();

    dispatch(
      UpdateStoneAsync({
        id: SingleStone?.id,
        T_Quantity: SingleStone?.category_quantity?.reduce(
          (total, item) => total + item.quantity,
          0
        ),
        project_status: "Completed",
      })
    ).then(() => {
      const data = {
        id: id,
      };
      dispatch(GetSingleStone(data));
      closeCompletedModal();
    });
  };

  const handlstoneChange = (index, field, value) => {
    const updatedCategoryQuantity = StoneData?.category_quantity?.map(
      (item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: parseInt(value, 10),
          };
        }
        return item;
      }
    );

    setStoneData({
      ...StoneData,
      category_quantity: updatedCategoryQuantity,
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

  const T_Quantity = SingleStone?.category_quantity?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleGenerateGatePassPDf = () => {
    const data = { ...SingleStone, T_Quantity };
    dispatch(generateStoneGatePssPdfAsync(data));
    closeGatepassModal();
  };

  const Front_category = SingleStone?.category_quantity?.find(
    (item) => item.category === "Front"
  );
  const T_QuantityForBill = Front_category?.recieved_Data?.r_total;

  const generateBill = (e) => {
    e.preventDefault();
    if (!T_QuantityForBill || T_QuantityForBill === 0) {
      toast.error("Unable To Generate Bill Because Front Category Is Missing");
      return;
    }
    const formData = {
      ...SingleStone,
      r_quantity: T_QuantityForBill,
      process_Category: "Stone",
      Stone_id: SingleStone.id,
      Manual_No: processBillData.Manual_No,
      additionalExpenditure: processBillData.additionalExpenditure,
    };
    dispatch(generateStoneBillAsync(formData)).then((res) => {
      if (res.payload.success) {
        closeBillModal();
      }
    });
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

  const handleOpenGatePassModal = () => {
    setisGenerateGatePassOpen(true);
  };

  const closeGatepassModal = () => {
    setisGenerateGatePassOpen(false);
    document.body.style.overflow = "auto";
  };

  const openGenerateBillForm = () => {
    setProcessBillModal(true);
  };

  const closeBillModal = () => {
    setProcessBillModal(false);
    setBilldata({
      Manual_No: "",
      additionalExpenditure: "",
    });
  };

  const HandleProcessBillDataChange = (data) => {
    setProcessBillData(data);
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
    dispatch(getStitchingDataBypartyNameAsync({ partyName: value }));
  };

  const searchResults = previousDataByPartyName?.stitchingData?.map((item) => {
    return {
      key: item.partyName,
      value: item.partyName,
    };
  });

  const openPackingMOdal = () => {
    const developData = [];
    if (SingleStone.project_status !== "Completed") {
      return toast.error("Please Complete Project");
    }

    //PUSH DATA INTO THE PACKING DATA
    SingleStone?.category_quantity?.forEach((item) => {
      const data = {
        category: SingleEmbroidery?.shirt[0]?.category,
        stoneCategory: item.category,
        received: "",
        color: item?.color,
      };
      developData.push(data);
    });
    setSuitDataForPacking(developData);
    setPackingModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePackingMOdal = () => {
    setPackingModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleSkipStep = () => {
    if (SingleStone.project_status !== "Completed") {
      return toast.error("Please Complete Project");
    }
    navigate("/dashboard/packing-details/null", {
      state: {
        embroidery_Id: SingleEmbroidery.id,
        design_no: SingleStone.design_no,
        serial_No: SingleStone.serial_No,
        from: location.pathname,
        suits_category: suitDataForPacking,
      },
    });
  };

  const removeRowForPackingData = (index) => {
    setSuitDataForPacking((prevState) => {
      const newState = prevState.filter((_, idx) => idx !== index);
      return newState;
    });
  };


  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Stones Details
          </h1>
        </div>

        {/* -------------- DETAILS SECTION -------------- */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
            {/* FIRST ROW */}
            <div className="box">
              <span className="font-medium">Party Name:</span>
              <span> {SingleStone?.partyName}</span>
            </div>
            <div className="box">
              <span className="font-medium">Manual No:</span>
              <span>{SingleStone?.Manual_No ?? "--"}</span>
            </div>
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span>{SingleStone?.design_no}</span>
            </div>

            <div className="box">
              <span className="font-medium">Total Quantity:</span>
              <span>
                {" "}
                {SingleStone?.category_quantity?.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}{" "}
              </span>
            </div>

            <div className="box">
              <span className="font-medium">R Quantity:</span>
              <span>
                {" "}
                {SingleStone?.r_quantity ? SingleStone?.r_quantity : "--"}
              </span>
            </div>

            <div className="box">
              <span className="font-medium">Per Suit:</span>
              <span>{SingleStone?.rate}</span>
            </div>
            <div className="box">
              <span className="font-medium">Project Status:</span>
              <span className="">
                {" "}
                {setStatusColor(SingleStone?.project_status)}
              </span>
            </div>

            {SingleStone?.category_quantity?.map((item, index) => (
              <div className="box" key={index}>
                <span className="font-medium">{item.category}:</span>
                <span> {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECEIVED SUITS COLORS */}
        <div className="my-10 px-3 text-gray-800 dark:text-gray-200">
          <h2 className="text-lg font-semibold">Received Suits Colors</h2>

          <div className="flex justify-between items-start flex-wrap gap-x-20">
            {/* DETAILS */}
            <div className="details">
              {StoneData?.category_quantity?.map((item, index) => {
                const sum = item.first + item.second + item.third;

                return (
                  <div
                    key={item.id}
                    className="line my-3 flex justify-between items-center gap-x-6 "
                  >
                    <span className="w-[7rem] font-bold text-sm">
                      {item.category}
                    </span>
                    <span className="w-[7rem] text-sm">({item.color})</span>
                    <input
                      type="number"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[3rem] px-1 rounded-sm text-black  dark:text-gray-800"
                      value={item.first}
                      readOnly={SingleStone.project_status === "Completed"}
                      onChange={(e) =>
                        handlstoneChange(index, "first", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[3rem] px-1 rounded-sm text-black  dark:text-gray-800"
                      value={item.second}
                      onChange={(e) =>
                        handlstoneChange(index, "second", e.target.value)
                      }
                      readOnly={SingleStone.project_status === "Completed"}
                    />
                    <input
                      type="number"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[3rem] px-1 rounded-sm text-black  dark:text-gray-800"
                      value={item.third}
                      onChange={(e) =>
                        handlstoneChange(index, "third", e.target.value)
                      }
                      readOnly={SingleStone.project_status === "Completed"}
                    />
                    <input
                      type="text"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[4rem] px-1 rounded-sm text-black  dark:text-gray-800"
                      value={isNaN(sum) ? 0 : sum}
                      readOnly
                    />
                  </div>
                );
              })}
            </div>

            {/* RECENT DETAILS */}
            <div className="recent_details">
              {SingleStone?.category_quantity?.map((item, index) => (
                <div
                  key={index}
                  className="line my-3 flex justify-between items-center gap-x-4"
                >
                  <span className="w-28 font-semibold">Recent Date</span>
                  <input
                    type="text"
                    className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm text-black  dark:text-gray-800"
                    readOnly
                    value={new Date(item?.createdAt).toLocaleDateString()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          {SingleStone?.project_status !== "Completed" && (
            <button
              className="px-3 py-2 text-sm rounded bg-blue-800 text-white border-none"
              onClick={handleUpdateReceivedClick}
            >
              Update Recived
            </button>
          )}
        </div>

        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-6 flex justify-center items-center gap-x-5">
          {SingleStone?.project_status !== "Completed" &&
            SingleStone?.updated && (
              <button
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white  dark:text-gray-800"
                onClick={handleCompletedClick}
              >
                Completed
              </button>
            )}
          {SingleStone?.project_status === "Completed" &&
            !SingleStone?.bill_generated && (
              <button
                onClick={openGenerateBillForm}
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              >
                Generate Bill
              </button>
            )}
          {StonerpdfLoading ? (
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
          <button
            onClick={openPackingMOdal}
            className="px-4 py-2.5 cursor-pointer text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
          >
           Skip To Packing
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative scrollable-content h-[90vh] py-4 px-3 w-full max-w-5xl bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold  text-gray-900 dark:text-white">
                Stitching
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
              <form className="space-y-4" onSubmit={handleSubmitstitching}>
                {/* INPUT FIELDS DETAILS */}
                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
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

                  {/* PARTY NAME */}
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

                  {/* SERIAL NO */}
                  <div>
                    <input
                      name="serial_No"
                      type="text"
                      placeholder="Serial No"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.serial_No}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>

                  {/* DESIGN NO */}
                  <div>
                    <input
                      name="design_no"
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
                      type="text"
                      placeholder="Date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.date}
                      readOnly
                    />
                  </div>

                  {/* ENTER RATE */}
                  <div>
                    <input
                      name="rate"
                      type="text"
                      placeholder="Enter Rate"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      step="0.01"
                      value={formData?.rate}
                      onChange={handleChange}
                    />
                  </div>

                  {/* LACE QUANTITY */}
                  <div>
                    <input
                      name="lace_quantity"
                      type="number"
                      placeholder="Lace Quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData?.lace_quantity}
                      onChange={handleChange}
                    />
                  </div>

                  {/* LACE CATEGORY */}

                  <div>
                    <select
                      name="lace_category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={formData?.lace_category}
                      onChange={handleChange}
                    >
                      <option selected>Select Value</option>

                      {LaceForEmroidery?.map((item, index) => (
                        <option value={item.category}>{item.category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="box">
                  <div className="flex justify-between items-center ">
                    <h2 className="block mb-0 text-sm font-medium text-gray-900 dark:text-white">
                      Enter Suit Colors And Quantity :
                    </h2>
                    <p
                      onClick={() => addNewRow("suits_category")}
                      className="cursor-pointer"
                    >
                      <FiPlus size={24} className=" dark:text-white" />
                    </p>
                  </div>

                  {/* SUITS DATA */}

                  {formData?.suits_category?.map((row, index) => (
                    <div className="my-5 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                      {/* SELECT CATEGORY */}
                      <div>
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={row.category}
                          onChange={(e) =>
                            handleCategoryChange(e, index, "suits_category")
                          }
                        >
                          <option selected>Select Value</option>

                          {SingleEmbroidery?.shirt?.map((item, index) => (
                            <option value={item?.category}>
                              {item?.category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* SELECTED COLORS */}
                      <div>
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={row.color}
                          onChange={(e) =>
                            handleColorChange(e, index, "suits_category")
                          }
                        >
                          <option selected>Select Value</option>

                          {SingleEmbroidery?.shirt?.map((item, index) => (
                            <option value={item?.color}>{item?.color}</option>
                          ))}
                        </select>
                      </div>

                      {/* ENTER QUANITY */}
                      <div className="col-span-2 flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Enter Quantity In No"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          value={row.quantity_in_no || ""}
                          onChange={(e) =>
                            handleQuantityChange(e, index, "suits_category")
                          }
                        />
                        <span className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  font-semibold rounded-md focus:ring-0 focus:border-gray-300 block w-28 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                          A.Q : {row.MaxQuantity || 0}
                        </span>
                        {formData?.suits_category?.length > 1 && (
                          <button
                            onClick={() => removeRow("suits_category", index)}
                            className="end-2.5 text-red-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="box">
                  <div className="flex justify-between items-center ">
                    <h2 className="block mb-0 text-sm font-medium text-gray-900 dark:text-white">
                      Enter Dupatta Colors And Quantity :
                    </h2>
                    <p
                      onClick={() => addNewRow("dupatta_category")}
                      className="cursor-pointer"
                    >
                      <FiPlus size={24} className=" dark:text-white" />
                    </p>
                  </div>

                  {formData?.dupatta_category?.map((row, index) => (
                    <div className="my-5 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                      {/* SELECT CATEGORY */}
                      <div>
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={row.category}
                          onChange={(e) =>
                            handleCategoryChange(e, index, "dupatta_category")
                          }
                        >
                          <option selected>Select Value</option>

                          {SingleEmbroidery?.duppata?.map((item, index) => (
                            <option value={item?.category}>
                              {item?.category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* SELECTED COLORS */}
                      <div>
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={row.color}
                          onChange={(e) =>
                            handleColorChange(e, index, "dupatta_category")
                          }
                        >
                          <option selected>Select Value</option>

                          {SingleEmbroidery?.duppata?.map((item, index) => (
                            <option value={item?.color}>{item?.color}</option>
                          ))}
                        </select>
                      </div>

                      {/* ENTER QUANITY */}
                      <div className="col-span-2 gap-3 flex items-center">
                        <input
                          type="text"
                          placeholder="Enter Quantity In No"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          value={row.quantity_in_no || ""}
                          onChange={(e) =>
                            handleQuantityChange(e, index, "dupatta_category")
                          }
                        />
                        <span className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  font-semibold rounded-md focus:ring-0 focus:border-gray-300 block w-28 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                          A.Q : {row.MaxQuantity || 0}
                        </span>
                        {formData?.dupatta_category?.length > 1 && (
                          <button
                            onClick={() => removeRow("dupatta_category", index)}
                            className="end-2.5 text-red-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                        )}
                      </div>
                    </div>
                  ))}
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

      {isUpdateReceivedConfirmOpen && (
        <ConfirmationModal
          title="Confirm Update"
          message="Are you sure you want to update the received items?"
          onConfirm={handleUpdateStone}
          onClose={closeUpdateRecievedModal}
        />
      )}

      {isCompletedConfirmOpen && (
        <ConfirmationModal
          title="Confirm Complete"
          message="Are you sure you want to Complete?"
          onConfirm={handleCompleteStone}
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
          loading={StnoneBillLoading}
          closeModal={closeBillModal}
          Manual_No={SingleStone?.Manual_No}
          processBillAmount={Math.round(
            SingleStone?.rate * SingleStone?.r_quantity
          )}
        />
      )}

      {/* PACKING DATA MODAL */}
      {isPackingModalOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-lg max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Details For Packing
              </h3>
              <button
                onClick={closePackingMOdal}
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
            <div className="p-2">
              <h3 className="mb-2">
                Category :{" "}
                <span className="text-red-500 font-bold">
                  {SingleEmbroidery?.shirt[0]?.category}
                </span>
              </h3>
              <form onSubmit={handleSkipStep}>
                {suitDataForPacking?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 mb-2"
                  >
                    <div>
                      <input
                        name="category"
                        type="text"
                        placeholder="Categoty"
                        value={item.stoneCategory}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        readOnly
                      />
                    </div>

                    <div>
                      <input
                        name="color"
                        type="text"
                        placeholder="Colour"
                        value={item.color}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        readOnly
                      />
                    </div>

                    <div>
  <input
    name="received"
    type="number"
    placeholder="Enter Quantity"
    value={item.received || ""}
    onChange={(event) => {
      const value = parseInt(event.target.value, 10) || 0;
      setSuitDataForPacking((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, received: value } : item
        )
      );
    }}
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
    required
  />
</div>

                    <div>
                      <RxCross2
                        onClick={() => removeRowForPackingData(index)}
                        size={24}
                        className="text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-0 active:text-indgrayigo-500"
                  >
                    Move To Packing
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

export default StonesDetails;
