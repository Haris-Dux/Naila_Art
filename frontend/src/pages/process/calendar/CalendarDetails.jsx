import { useNavigate, useParams } from "react-router-dom";
import {
  GetSingleCalender,
  UpdateCalenderAsync,
} from "../../../features/CalenderSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createCutting } from "../../../features/CuttingSlice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
const CalendarDetails = () => {
  const { id } = useParams();
  const { loading, SingleCalender } = useSelector((state) => state.Calender);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] = useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  


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
    id:id,
    r_quantity: "",
  });

  useEffect(() => {
    const data = {
      id: id,
    };
    dispatch(GetSingleCalender(data));
  }, [id, dispatch]);

  useEffect(() => {
    setCuttingData({
      serial_No: SingleCalender?.serial_No || "",
      design_no: SingleCalender?.design_no || "",
      date: SingleCalender?.date ? SingleCalender?.date?.split("T")[0] : "",
      partyName: SingleCalender?.partyName || "",
      embroidery_Id: SingleCalender?.id || "",
    });
  }, [SingleCalender]);


  useEffect(() => {
    setCalenderData({
      id:id,
      r_quantity: SingleCalender?.r_quantity || "",
      
    });
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

    console.log("cutting", CuttingData);

    dispatch(createCutting(CuttingData))
      .then((res) => {
        if (res.payload.success === true) {
        closeModal();
        navigate("/dashboard/cutting");
        }
      })
     
  };

  const handleCompleteCalender = (e) => {
    e.preventDefault();
    const data = {
      id: id,
    };
    dispatch(UpdateCalenderAsync({ project_status: "Completed", id: id }))
      .then(() => {
        dispatch(GetSingleCalender(data));
        closeCompletedModal()
       
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

    dispatch(UpdateCalenderAsync(CalenderData)).then(() => {
        dispatch(GetSingleCalender(data));
        closeUpdateRecievedModal()
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
    setIsOpen(false);
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






  console.log("selectedDetails", SingleCalender);

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
              <span className="font-medium">Serial No:</span>
              <span> {SingleCalender?.serial_No}</span>
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
              <span className="text-green-600 dark:text-green-300">
                {" "}
                {SingleCalender?.project_status}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Date:</span>
              <span>{new Date(SingleCalender?.date).toLocaleDateString()}</span>
            </div>
            <div className="box">
              <span className="font-medium">Quantity:</span>
              <span> {SingleCalender?.T_Quantity} </span>
            </div>
            <div className="box">
              <span className="font-medium">R. Quantity:</span>
              <span> {SingleCalender?.r_quantity}</span>
            </div>
          </div>
        </div>

        {/* ENTER RECEIVED QUANTITY */}
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
            value={CalenderData.r_quantity}
            onChange={handleInputChangeCalender}
            disabled={SingleCalender?.project_status === "Completed"}
          />
        </div>

        <div className="flex justify-center items-center">
          {SingleCalender?.project_status !== "Completed" && (
            <button
              className="px-4 py-2.5 text-sm rounded bg-blue-800 text-white border-none"
              onClick={handleUpdateReceivedClick}
            >
              Update Recived
            </button>
          )}
        </div>
        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-10 flex justify-center items-center gap-x-5">
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={handleCompletedClick}
          >
            Completed
          </button>
          {SingleCalender?.project_status === "Completed" && (
            <> 
          <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Bill
          </button>
       
          </>
)}
   <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Gate Pass
          </button>
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={openModal}
          >
            Next Step
          </button>
        </div>

        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
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

              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmitCutting}>
                  <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                    <div>
                      <input
                        name="serial_No"
                        type="text"
                        placeholder="serial No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.serial_No}
                        onChange={handleInputChangeCutting}
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="partyName"
                        type="text"
                        placeholder="Party Name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.partyName}
                        onChange={handleInputChangeCutting}
                        required
                      />
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
                      />
                    </div>

                    <div>
                      <input
                        name="date"
                        type="date"
                        placeholder="Date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CuttingData.date}
                        onChange={handleInputChangeCutting}
                        required
                      />
                    </div>

                    <div>
                      <input
                        name="T_Quantity"
                        type="text"
                        placeholder="Quantity"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                        onChange={handleInputChangeCutting}
                        required
                      />
                    </div>
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
      </section>
    </>
  );
};

export default CalendarDetails;
