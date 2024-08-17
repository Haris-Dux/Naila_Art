import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  GETEmbroiderySIngle,
  UpdateEmbroidery,
} from "../../../features/EmbroiderySlice";
import { useSelector } from "react-redux";
import { createCalender } from "../../../features/CalenderSlice";
const EmbroideryDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { loading, SingleEmbroidery } = useSelector(
    (state) => state.Embroidery
  );

  const [CalenderData, setCalenderData] = useState({
    serial_No: "",
    partyName: "",
    design_no: "",
    date: "", // Ensure this is initialized correctly
    T_Quantity: "",
    rate: 0,
    embroidery_Id: SingleEmbroidery?.embroidery_Id || "",
  });

  useEffect(() => {
    console.log(SingleEmbroidery.date);
    setCalenderData({
      serial_No: SingleEmbroidery?.serial_No || "",
      design_no: SingleEmbroidery?.design_no || "",
      date: SingleEmbroidery?.date ? SingleEmbroidery?.date?.split("T")[0] : "",
      T_Quantity: SingleEmbroidery?.T_Quantity || "",

      embroidery_Id: SingleEmbroidery?.id || "",
    });
  }, [SingleEmbroidery]);

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
        shirt: SingleEmbroidery.shirt || [{ category: '', color: '', received: 0 }],
        duppata: SingleEmbroidery.duppata || [{ category: '', color: '', received: 0 }],
        trouser: SingleEmbroidery.trouser || [{ category: '', color: '', received: 0}],
        id: id,
      });
    }
  }, [SingleEmbroidery, id]);
  

  


  const handleInputChange = (category, color, received, index, section) => {
    console.log('Received:', received);
    setFormData((prevState) => {
      const updatedSection = prevState[section].map((item, idx) =>
        idx === index ? { ...item, category, color, received } : item
      );
      console.log('Updated Section:', updatedSection); // Log the updated section
      console.log('Updated Item:', updatedSection[index]); // Log the specific updated item
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
  } = SingleEmbroidery;

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("formdata", formData);

    dispatch(UpdateEmbroidery(formData))
      .then(() => {
        dispatch(GETEmbroiderySIngle({ id }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCompleted = (event) => {
    event.preventDefault();

    dispatch(UpdateEmbroidery({ project_status: "Completed",id }))
      .then(() => {
        dispatch(GETEmbroiderySIngle({ id }));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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

    dispatch(createCalender(CalenderData))
      .then(() => {
        closeModal(); // Close modal after submission
        navigate("/dashboard/calendar");
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
              <span className="font-medium">Serial No:</span>
              <span> {serial_No}</span>
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
              <span className="text-green-600"> {project_status}</span>
            </div>
            {/* SECOND ROW */}
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span> {design_no}</span>
            </div>
            {shirt?.map((item, index) => (
              <div key={index} className="box">
                <span className="font-medium">Shirt M: {index + 1}:</span>
                <span> {item.quantity_in_m} m</span>
              </div>
            ))}

            {duppata?.map((item, index) => (
              <div key={index} className="box">
                <span className="font-medium">Dupatta M: {index + 1}:</span>
                <span> {item.quantity_in_m} m</span>
              </div>
            ))}
            {trouser?.map((item, index) => (
              <div key={index} className="box">
                <span className="font-medium">Trouser M {index + 1}:</span>
                <span> {item.quantity_in_m} m</span>
              </div>
            ))}

            <div className="box">
              <span className="font-medium">Received Suit:</span>
              <span>{ SingleEmbroidery?.recieved_suit }</span>
              
            </div>
            {/* THIRD ROW */}
            <div className="box">
              <span className="font-medium">T Quantity In M:</span>
              <span> {T_Quantity_In_m} m</span>
            </div>
            <div className="box">
              <span className="font-medium">T Quantity:</span>
              <span> {T_Quantity} Suit</span>
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
          </div>
        </div>

        {/* -------------- RECEIVED STOCK SECTION -------------- */}

        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
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
                    <p>
                      {item.category} - {item.color}
                    </p>
                   

<input

  key={`shirt-${index}`}
  name={`shirt-${index}`}
  className="py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black"
  value={item.received}  // Ensure this is tied to the state
  onChange={(e) =>
    handleInputChange(
      item.category,
      item.color,
      e.target.value,  // Ensure the correct value is passed
      index,
      "shirt"  // Update this accordingly for different sections
    )
  }
  readOnly={project_status === "Completed"}
/>

                  </div>
                ))}
              </div>
            </div>
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
                    <p>
                      {item.category} - {item.color}
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
                          e.target.value,
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
                    <p>
                      {item.category} - {item.color}
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
                          e.target.value,
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
          </div>
        </div>
        <div className="flex justify-center items-center">   
          {project_status !== "Completed" && 
        <button
          className="px-4 py-2.5 text-sm rounded bg-blue-800 text-white border-none"
          onClick={handleSubmit}
        >
          Update Recived
        </button>
}

        </div>
        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-10 flex justify-center items-center gap-x-5">
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={handleCompleted}
          >
            Completed
          </button>
          {project_status === "Completed" && 
          <>  
          <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Bill
          </button>
          <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Gate Pass
          </button>
          </>
}
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
                <form className="space-y-4" onSubmit={handleSubmitCalender}>
                  <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                    <div>
                      <input
                        name="serialNo"
                        type="text"
                        placeholder="serial No"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData.serial_No}
                        onChange={handleInputChangeCalender}
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="partyName"
                        type="text"
                        placeholder="Party Name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData.partyName}
                        onChange={handleInputChangeCalender}
                        required
                      />
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
                      />
                    </div>

                    <div>
                      <input
                        name="date"
                        type="date"
                        placeholder="Date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={CalenderData.date}
                        onChange={handleInputChangeCalender}
                        required
                      />
                    </div>

                    <div>
                      <input
                        name="quantity"
                        type="text"
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
                        onChange={handleInputChangeCalender}
                        required
                      />
                    </div>

                    {/* New input fields */}
                  </div>

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
      </section>
    </>
  );
};

export default EmbroideryDetails;
