import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  GetSingleCutting,
  Updatecuttingasync,
} from "../../../features/CuttingSlice";
import { FiPlus } from "react-icons/fi";
import { GetColorEmroidery, createStone } from "../../../features/stoneslice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
const CuttingDetails = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { loading, SingleCutting } = useSelector((state) => state.Cutting);
  const {  color } = useSelector((state) => state.stone);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] = useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  const [serial_No,setserial_No] = useState('')

  const [cuttingData, setcuttingData] = useState({
    id,
    r_quantity: "",
  });

  const initialRow = { category: "", color: "", quantity: 0 };

  const [formData, setFormData] = useState({
    partyName: "",
    serial_No: "",
    DesignNo: "",
    date: "",
    rate: "",
    category_quantity: [initialRow],
  });

  useEffect(() => {
    console.log(SingleCutting);
    setFormData({
      serial_No: SingleCutting?.serial_No || "",
      design_no: SingleCutting?.design_no || "",
      date: SingleCutting?.date ? SingleCutting?.date?.split("T")[0] : "",
      partyName: SingleCutting?.partyName || "",
      embroidery_Id: SingleCutting?.id || "",
      category_quantity: [initialRow], // You are setting category_quantity with initialRow
    });
   
  }, [SingleCutting]);

  useEffect(() => {
    setcuttingData({
      id:id,
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
      category_quantity: prevState.category_quantity.filter((_, i) => i !== index),
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
        i === index ? { ...row, quantity: value } : row
      ),
    }));
  };

  useEffect(() => {
    const data = {
      id: id,
    };
    dispatch(GetSingleCutting(data));
  }, [id, dispatch]);



  useEffect(() => {
    
    dispatch(GetColorEmroidery({id:formData?.serial_No}));
  }, [formData]);


  const handleInputChangeCutting = (e) => {
    const { name, value } = e.target;
    setcuttingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitstome = (e) => {
    e.preventDefault();

    console.log("frp", formData);

    dispatch(createStone(formData))
      .then(() => {
        closeModal();
        navigate("/dashboard/stones");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const  handleUpdateCutting = (e) => {
    e.preventDefault();

    const data = {
      id: id,
    };

    dispatch(Updatecuttingasync(cuttingData))
      .then(() => {
   

        dispatch(GetSingleCutting(data));
        closeUpdateRecievedModal()
    
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const handleCompleteCutting = (e) => {
    e.preventDefault();

    const data = {
      id: id,
    };

   
    dispatch(Updatecuttingasync({ project_status: "Completed",  id: id,}))
      .then(() => {
        dispatch(GetSingleCutting(data));
      closeCompletedModal()
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



  const handleCompletedClick = () => {
    
    setIsCompletedConfirmOpen(true);
  };

  const closeCompletedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleUpdateReceivedClick = () => {
    console.log("Update Received button clicked");
    setIsUpdateReceivedConfirmOpen(true);
  };

  const closeUpdateRecievedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
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
              <span className="font-medium">Serial No:</span>
              <span> {SingleCutting?.serial_No}</span>
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
              <span className="text-green-600 dark:text-green-300">
                {" "}
                {SingleCutting?.project_status}
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

          {SingleCutting?.project_status === "Completed" && (
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

              {/* ------------- BODY ------------- */}
              <div className="p-4 md:p-5">
                <form className="space-y-4" onSubmit={handleSubmitstome}>
                  {/* INPUT FIELDS DETAILS */}
                  <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                    <div>
                      <input
                        name="PartyName"
                        type="text"
                        placeholder="Party Name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={formData.partyName}
                        onChange={handleChange}
                      />
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
                      />
                    </div>
                    <div>
                      <input
                        name="DesignNo"
                        type="text"
                        placeholder="Design No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={formData.DesignNo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* DATE */}
                    <div>
                      <input
                        name="date"
                        type="date"
                        placeholder="Date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={formData.date}
                        onChange={handleChange}
                        required
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
                            <option value="Front patch">Front patch</option>
                            <option value="Trouser">Trouser</option>
                          </select>
                        </div>

                        {/* SELECTED COLORS */}
                        <div>
                          <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={row.color}
                            onChange={(e) => handleColorChange(e, index)}
                          >
                            <option selected>Select color</option>
                            <option value="red">red</option>
                            <option value="blue">blue</option>
                          </select>
                        </div>

                        {/* ENTER QUANITY */}
                        <div className="flex items-center">
        <input
          type="text"
          placeholder="Enter Quantity"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
          value={row.quantity}
          onChange={(e) => handleQuantityChange(e, index)}
        />
      

        {formData?.category_quantity?.length > 1 && (
                <button
                onClick={() => deleteRow(index)}
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
              )}
      </div>




                      </div>
                    ))}
                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
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
      </section>
    </>
  );
};

export default CuttingDetails;
