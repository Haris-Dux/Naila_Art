import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { CreateEmbroidery, GETEmbroidery } from "../../features/EmbroiderySlice";
import { FiPlus, FiTrash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllBase,
  GetAllBaseforEmroidery,
} from "../../features/InStockSlice";

const Box = ({ formData1, setFormData1, closeModal,total }) => {
  const { loading, BaseforEmroidery } = useSelector((state) => state.InStock);

  const dispatch = useDispatch();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [colorOptions2, setColorOptions2] = useState([]);
  const [colorOptions3, setColorOptions3] = useState([]);
  const [colorOptions4, setColorOptions4] = useState([]);

  useEffect(() => {
    if (!loading && BaseforEmroidery) {
      // Extract unique categories
      const categories = [
        ...new Set(BaseforEmroidery?.map((item) => item.category)),
      ];
      const categoryOptions = categories?.map((category) => ({
        value: category,
        label: category,
      }));
      setCategoryOptions(categoryOptions);
    }
  }, [loading, BaseforEmroidery]);

  console.log(BaseforEmroidery);

  useEffect(() => {
    dispatch(GetAllBaseforEmroidery());
  }, []);

 

  const initialShirtRow = {
    category: "",
    color: "",
    quantity_in_no: 0,
    quantity_in_m: 0,
  };
  const initialDupattaRow = {
    category: "",
    color: "",
    quantity_in_no: 0,
    quantity_in_m: 0,
  };
  const initialTrouserRow = {
    category: "",
    color: "",
    quantity_in_no: 0,
    quantity_in_m: 0,
  };
  const initialTissueRow = { category: "", color: "", quantity_in_m: 0 };
  const [formData, setFormData] = useState({
    shirt: [initialShirtRow],
    duppata: [initialDupattaRow],
    trouser: [initialTrouserRow],
    tissue: [initialTissueRow],
  });

  const addNewRow = (field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: [
        ...prevState[field],
        field === "shirt"
          ? initialShirtRow
          : field === "duppata"
            ? initialDupattaRow
            : field === "trouser"
              ? initialTrouserRow
              : initialTissueRow,
      ],
    }));
  };

  const deleteRow = (field, index) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: prevState[field].filter((_, idx) => idx !== index),
    }));
  };

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedArray = prevState[type]?.map((item, idx) =>
        idx === index
          ? { ...item, [name.split(".")[1]]: parseFloat(value) }
          : item
      );
      return { ...prevState, [type]: updatedArray };
    });
  };

  const handleshirtCategory = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      shirt: prevState.shirt?.map((item, idx) =>
        idx === index ? { ...item, category: newValue.value } : item
      ),
    }));
    console.log("selected value:", newValue);

    // Perform a case-insensitive comparison
    const selectedCategory = BaseforEmroidery.filter(
      (item) => item.category.toLowerCase() === newValue.value.toLowerCase()
    );

    const selectedCategoryColors = selectedCategory?.map((item) => ({
      value: item.colors,
      label: item.colors,
    }));

    setColorOptions(selectedCategoryColors);
  };

  const handleshirtColor = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      shirt: prevState.shirt?.map((item, idx) =>
        idx === index ? { ...item, color: newValue.value } : item
      ),
    }));
  };

  const handleduppataCategorey = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      duppata: prevState.duppata?.map((item, idx) =>
        idx === index ? { ...item, category: newValue.value } : item
      ),
    }));
    const selectedCategory = BaseforEmroidery?.filter(
      (item) => item.category.toLowerCase() === newValue.value.toLowerCase()
    );

    const selectedCategoryColors = selectedCategory?.map((item) => ({
      value: item.colors,
      label: item.colors,
    }));

    setColorOptions2(selectedCategoryColors);
  };

  const handleduppataColor = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      duppata: prevState.duppata?.map((item, idx) =>
        idx === index ? { ...item, color: newValue.value } : item
      ),
    }));
  };

  const handleTrouserCategorey = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      trouser: prevState.trouser?.map((item, idx) =>
        idx === index ? { ...item, category: newValue.value } : item
      ),
    }));
    const selectedCategory = BaseforEmroidery?.filter(
      (item) => item.category.toLowerCase() === newValue.value.toLowerCase()
    );

    const selectedCategoryColors = selectedCategory?.map((item) => ({
      value: item.colors,
      label: item.colors,
    }));

    setColorOptions3(selectedCategoryColors);
  };

  const handleTrouserColor = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      trouser: prevState.trouser?.map((item, idx) =>
        idx === index ? { ...item, color: newValue.value } : item
      ),
    }));
  };

  const handletissueCategorey = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      tissue: prevState.tissue?.map((item, idx) =>
        idx === index ? { ...item, category: newValue.value } : item
      ),
    }));
    const selectedCategory = BaseforEmroidery?.filter(
      (item) => item.category.toLowerCase() === newValue.value.toLowerCase()
    );

    const selectedCategoryColors = selectedCategory?.map((item) => ({
      value: item.colors,
      label: item.colors,
    }));

    setColorOptions4(selectedCategoryColors);
  };

  const handletissueColor = (newValue, index) => {
    setFormData((prevState) => ({
      ...prevState,
      tissue: prevState.tissue?.map((item, idx) =>
        idx === index ? { ...item, color: newValue.value } : item
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

  

    setFormData1((prevState) => ({
      ...prevState,
      per_suit:total,
    }));

    // Merge updated formData1 (without per_suit) with formData
    const { per_suit, ...restFormData1 } = formData1;
    const meregdata = {
      ...restFormData1,
      ...formData,
      per_suit: total.toFixed(2),
      T_Quantity : formData.shirt.reduce((total, item) => total + item.quantity_in_no, 0) + formData.duppata.reduce((total, item) => total + item.quantity_in_no, 0) + formData.trouser.reduce((total, item) => total + item.quantity_in_no, 0),
      T_Quantity_In_m : formData.shirt.reduce((total, item) => total + item.quantity_in_m, 0) + formData.duppata.reduce((total, item) => total + item.quantity_in_m, 0) + formData.trouser.reduce((total, item) => total + item.quantity_in_m, 0),


    };

    console.log("final result", meregdata);

    dispatch(CreateEmbroidery(meregdata))
      .then(() => {
        dispatch(GETEmbroidery({ page: 1 }));
        closeModal();
      }).catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div className="box">
        <div className="header flex justify-between items-center">
          <p className="mt-3 text-gray-700  dark:text-white">
            Enter Suit Colors And Quantity:
          </p>
          <p onClick={() => addNewRow("shirt")}>
            <FiPlus size={24} className=" cursor-pointer dark:text-white" />
          </p>
        </div>
        {formData?.shirt?.map((shirt, index) => (
          <div
            className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5"
            key={index}
          >
            <div>
              <Select
                options={categoryOptions}
                onChange={(newValue) => handleshirtCategory(newValue, index)}
              />
            </div>
            <div>
              <Select
                options={colorOptions}
                onChange={(newValue) => handleshirtColor(newValue, index)}
              />
            </div>
            <div>
              <input
                name="shirt.quantity_in_no"
                type="number"
                placeholder="Enter Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={shirt.quantity_in_no || ""} // Accessing the quantity_in_no property of the shirt object
                onChange={(e) => handleInputChange(e, index, "shirt")} // Passing index and type to handleInputChange
              />
            </div>
            <div className="flex items-center">
              <input
                name="shirt.quantity_in_m"
                type="number"
                placeholder="Enter Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={shirt.quantity_in_m || ""}
                onChange={(e) => handleInputChange(e, index, "shirt")}
              />
              {formData.shirt.length > 1 && (
                <button
                  onClick={() => deleteRow("shirt", index)}
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

        <div className="header flex justify-between items-center">
          <p className="mt-3 text-gray-700  dark:text-white">
            Enter Duppta Colors And Quantity :
          </p>
          <p onClick={() => addNewRow("duppata")}>
            <FiPlus size={24} className=" cursor-pointer dark:text-white" />
          </p>
        </div>

        {formData?.duppata?.map((duppata, index) => (
          <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
            <div>
              <Select
                options={categoryOptions}
                onChange={(newValue) => handleduppataCategorey(newValue, index)}
              />
            </div>
            <div>
              <Select
                options={colorOptions2}
                onChange={(newValue) => handleduppataColor(newValue, index)}
              />
            </div>
            <div>
              <input
                name="duppata.quantity_in_no"
                type="number"
                placeholder="Enter Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={duppata.quantity_in_no || ""}
                onChange={(e) => handleInputChange(e, index, "duppata")}
              />
            </div>
            <div className="flex items-center">
              <input
                name="duppata.quantity_in_m"
                type="number"
                placeholder="Enter Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={duppata.quantity_in_m || ""}
                onChange={(e) => handleInputChange(e, index, "duppata")}
              />
              {formData?.duppata?.length > 1 && (
                <button
                  onClick={() => deleteRow("duppata", index)}
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

        <div className="header flex justify-between items-center">
          <p className="mt-3 text-gray-700  dark:text-white">
            {" "}
            Enter Trousers Colors And Quantity :
          </p>
          <p onClick={() => addNewRow("trouser")}>
            <FiPlus size={24} className=" cursor-pointer dark:text-white" />
          </p>
        </div>

        {formData?.trouser?.map((trouser, index) => (
          <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
            <div>
              <Select
                options={categoryOptions}
                onChange={(newValue) => handleTrouserCategorey(newValue, index)}
              />
            </div>
            <div>
              <Select
                options={colorOptions3}
                onChange={(newValue) => handleTrouserColor(newValue, index)}
              />
            </div>
            <div>
              <input
                name="trouser.quantity_in_no"
                type="number"
                placeholder="Enter Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={trouser.quantity_in_no || ""}
                onChange={(e) => handleInputChange(e, index, "trouser")}
              />
            </div>
            <div className="flex items-center">
              <input
                name="trouser.quantity_in_m"
                type="number"
                placeholder="Enter Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={trouser.quantity_in_m || ""}
                onChange={(e) => handleInputChange(e, index, "trouser")}
              />


              {formData?.trouser?.length > 1 && (
                <button
                  onClick={() => deleteRow("trouser", index)}
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

        <div className="header flex justify-between items-center">
          <p className="mt-3 text-gray-700  dark:text-white">
            {" "}
            Enter Tissue Colors And Quantity :
          </p>

          <p onClick={() => addNewRow("tissue")}>
            <FiPlus size={24} className=" cursor-pointer dark:text-white" />
          </p>
        </div>

        {formData?.tissue?.map((tissue, index) => (
          <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
            <div>
              <Select
                options={categoryOptions}
                onChange={(newValue) => handletissueCategorey(newValue, index)}
              />
            </div>
            <div>
              <Select
                options={colorOptions4}
                onChange={(newValue) => handletissueColor(newValue, index)}
              />
            </div>

            <div className="flex items-center">
              <input
                name="tissue.quantity_in_m"
                type="number"
                placeholder="Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={tissue.quantity_in_m || ""}
                onChange={(e) => handleInputChange(e, index, "tissue")}
              />
              {formData?.tissue?.length > 1 && (
                <button
                  onClick={() => deleteRow("tissue", index)}
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
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleSubmit}
          className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
        >
          { "submit"}
        </button>
      </div>
    </div>
  );
};

export default Box