import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { GetSingleStone, UpdateStoneAsync } from "../../../features/stoneslice";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus } from "react-icons/fi";
import {
  createStitching,
  getStitchingByEmbroidery,
} from "../../../features/stitching";
import { GetAllLace } from "../../../features/InStockSlice";
import { GETEmbroiderySIngle } from "../../../features/EmbroiderySlice";
const StonesDetails = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { loading, SingleStone } = useSelector((state) => state.stone);
  const { Lace } = useSelector((state) => state.InStock);
  // const { stitchingEmbroidery } = useSelector((state) => state.stitching);

  const { SingleEmbroidery } = useSelector((state) => state.Embroidery);

  console.log("stitching data", SingleEmbroidery);
const navigate = useNavigate()
  const dispatch = useDispatch();
  console.log("lace data", Lace);







  useEffect(() => {
    const data = {
      id: id,
    };
    dispatch(GetSingleStone(data));
    dispatch(GetAllLace());
  }, [id]);

  useEffect(() => {
    if (SingleStone?.embroidery_Id) {
      const data = {
        id: SingleStone?.embroidery_Id,
      };
      dispatch(GETEmbroiderySIngle(data));
    }
  }, [SingleStone]);


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
    Quantity: "",
    lace_quantity: "",
    lace_category: "",
  });

  const [StoneData, setStoneData] = useState({
    id: SingleStone.id,
    project_status: "Completed",
    category_quantity: SingleStone.category_quantity || [
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
        project_status: "Completed",

        category_quantity: SingleStone.category_quantity || [
          {
            id: "",
            first:SingleStone?.category_quantity?.first || 0,
            second: SingleStone?.category_quantity?.second || 0,
            third:SingleStone?.category_quantity?.third || 0,
          },
        ],
      });
    }
  }, [SingleStone]);

  useEffect(() => {
    setFormData({
      serial_No: SingleStone?.serial_No || "",
      design_no: SingleStone?.design_no || "",
      date: SingleStone?.date || "",
      Quantity: SingleStone?.quantity,
      embroidery_Id: SingleStone?.id || "",
      suits_category: [initialRow], // You are setting category_quantity with initialRow
      dupatta_category: [initialRow], // You are setting category_quantity with initialRow
      lace_category: '',
    });
  }, [SingleStone]);






  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addNewRow = (categoryType) => {
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: [...prevState[categoryType], initialRow],
    }));
  };

  const handleCategoryChange = (e, index, categoryType) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType].map((row, i) =>
        i === index ? { ...row, category: value } : row
      ),
    }));
  };

  const handleColorChange = (e, index, categoryType) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType].map((row, i) =>
        i === index ? { ...row, color: value } : row
      ),
    }));
  };

  const handleQuantityChange = (e, index, categoryType) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [categoryType]: prevState[categoryType].map((row, i) =>
        i === index ? { ...row, quantity_in_no: value } : row
      ),
    }));
  };

  const handleSubmitstitching = (e) => {
    e.preventDefault();

    dispatch(createStitching(formData))
      .then(() => {
        closeModal();
        navigate("/dashboard/stitching");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateStone = (e) => {
    e.preventDefault();

    const updatedCategoryQuantity = SingleStone.category_quantity.map(
      (item, index) => ({
        ...StoneData.category_quantity[index],
        id: item.id,
      })
    );

    const updatedStoneData = {
      ...StoneData,
      category_quantity: updatedCategoryQuantity,
    };
    console.log("stone", updatedStoneData);
    dispatch(UpdateStoneAsync(updatedStoneData))
      .then(() => {
        const data = {
          id: id,
        };
        dispatch(GetSingleStone(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlstoneChange = (index, field, value) => {
    const updatedCategoryQuantity = StoneData.category_quantity.map(
      (item, i) => {
        if (i === index) {
          return {
            ...item,
            [field]: parseInt(value, 10), // Ensure the value is an integer
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
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  console.log("selectedDetails", SingleStone);

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
              <span className="font-medium">Serial No:</span>
              <span>{SingleStone?.serial_No}</span>
            </div>
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span>{SingleStone?.design_no}</span>
            </div>

            <div className="box">
              <span className="font-medium">Per Suit:</span>
              <span>{SingleStone?.rate}</span>
            </div>
            <div className="box">
              <span className="font-medium">Project Status:</span>
              <span className="text-green-600 dark:text-green-300">
                {" "}
                {SingleStone?.project_status}
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
                    <span className="w-32 font-semibold">{item.category}</span>
                    <input
                      type="number"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-white dark:text-gray-800"
                      value={item.first}
                      readOnly={SingleStone.project_status === "Completed"}
                      onChange={(e) =>
                        handlstoneChange(index, "first", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-white dark:text-gray-800"
                      value={item.second}
                      onChange={(e) =>
                        handlstoneChange(index, "second", e.target.value)
                      }
                      readOnly={SingleStone.project_status === "Completed"}
                    />
                    <input
                      type="number"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-white dark:text-gray-800"
                      value={item.third}
                      onChange={(e) =>
                        handlstoneChange(index, "third", e.target.value)
                      }
                      readOnly={SingleStone.project_status === "Completed"}
                    />
                    <input
                      type="text"
                      className="bg-[#EEEEEE] py-1 border-gray-300 w-[6.5rem] px-1 rounded-sm text-white dark:text-gray-800"
                      value={sum}
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
                    className="bg-[#EEEEEE] py-1 border-gray-300 px-3 rounded-sm text-white dark:text-gray-800"
                    readOnly
                    value={new Date(item?.createdAt).toLocaleDateString()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------------- BUTTONS BAR -------------- */}
        <div className="mt-10 flex justify-center items-center gap-x-5">
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={handleUpdateStone}
          >
            Completed
          </button>
          <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Bill
          </button>
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
      </section>

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-5xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Stitching Details
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
              <form className="space-y-4" onSubmit={handleSubmitstitching}>
                {/* INPUT FIELDS DETAILS */}
                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
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
                    />
                  </div>

                  {/* QUANTITY */}
                  <div>
                    <input
                      name="Quantity"
                      type="text"
                      placeholder="Quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Quantity}
                      onChange={handleChange}
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
                      value={new Date(formData?.date).toLocaleDateString()}
                
                    />
                  </div>

                  {/* PARTY NAME */}
                  <div>
                    <input
                      name="partyName"
                      type="text"
                      placeholder="Party Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.partyName}
                      onChange={handleChange}
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

                  {/* LACE QUANTITY */}
                  <div>
                    <input
                      name="lace_quantity"
                      type="number"
                      placeholder="Lace Quantity"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.lace_quantity}
                      onChange={handleChange}
                    />
                  </div>

                  {/* LACE CATEGORY */}

                  <div>
                    <select
                       name="lace_category"
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={formData.lace_category}
                      onChange={handleChange}
                    >
                            <option selected>Select Value</option>

                      {Lace?.map((item, index) => (
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

                  {formData.suits_category.map((row, index) => (
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
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Enter Quantity In No"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                          value={row.quantity_in_no}
                          onChange={(e) =>
                            handleQuantityChange(e, index, "suits_category")
                          }
                        />
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

                  {formData.dupatta_category.map((row, index) => (
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
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Enter Quantity In No"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                          value={row.quantity_in_no}
                          onChange={(e) =>
                            handleQuantityChange(e, index, "dupatta_category")
                          }
                        />
                      </div>
                    </div>
                  ))}
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
    </>
  );
};

export default StonesDetails;
