import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AssginStocktoBranch
} from "../../../features/InStockSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaDatabase, FaHistory } from "react-icons/fa";
import moment from "moment-timezone";

const AssignStock = () => {
  const { Branches, stockLoading } = useSelector((state) => state.InStock);
  const { user } = useSelector((state) => state.auth);
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState(
    () => JSON.parse(localStorage.getItem("selectedSuits")) || []
  );

  const [formData, setFormData] = useState({
    branchId: user?.user?.branchId || "",
    stock_Details: [],
  });

  const navigate = useNavigate();



  useEffect(() => {
    const updatedStockDetails = selectedItems.map((item) => ({
      Item_Id: item._id,
      category: item.category,
      color: item.color,
      quantity: item?.assignQuantity,
      cost_price: item.cost_price,
      sale_price: item.sale_price,
      d_no: item.d_no,
      date: today,
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      stock_Details: updatedStockDetails,
    }));

    localStorage.setItem("selectedSuits", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const handleBranchChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      branchId: e.target.value,
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
    localStorage.setItem("selectedSuits", JSON.stringify(updatedItems));
  };

  const handleAssignQuantityChange = (index, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      assignQuantity: value === "" ? null : Number(value),
    };

    const updatedStockDetails = updatedItems.map((item) => ({
      Item_Id: item._id,
      category: item.category,
      color: item.color,
      quantity: item.assignQuantity,
      cost_price: item.cost_price,
      sale_price: item.sale_price,
      d_no: item.d_no,
      date: today,
    }));

    setSelectedItems(updatedItems);
    setFormData((prevFormData) => ({
      ...prevFormData,
      stock_Details: updatedStockDetails,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const checkValidQuantity = formData.stock_Details.some(
      (item) => item.quantity === null || item.quantity === 0
    );
    if (formData.branchId === "") {
      toast.error("Please select a branch");
      return;
    }
    if (checkValidQuantity) {
      toast.error("Please assign valid quantity for all items");
      return;
    }
    dispatch(AssginStocktoBranch(formData)).then((res) => {
      if (res.payload.success === true) {
        navigate("/dashboard/suits");
        setFormData({
          branchId: "",
          stock_Details: [],
        });
        localStorage.setItem("selectedSuits", JSON.stringify([]));
      }
    });
  };

  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
      <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
        Send Stock To Branch
      </h1>

      <div className="flex justify-between items-center pt-6">
        <select
          id="branches"
          value={formData.branchId}
          onChange={handleBranchChange}
          className="bg-gray-50 w-48 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="" disabled>
            Choose Branch
          </option>
          {Branches?.map((data) => (
            <option key={data?.id} value={data?.id}>
              {data?.branchName}
            </option>
          ))}
        </select>
        <Link
          className="flex items-center justify-center gap-3 px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
          to={"/dashboard/AssignedStockHistory"}
        >
          Branch Stock Records
          <FaHistory size={20} className="cursor-pointer" />
        </Link>
      </div>

      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-6 py-3">D # No</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Colors</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Cost Prices</th>
              <th className="px-6 py-3">Sales Prices</th>
              <th className="px-6 py-3">Send Quantity</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.length > 0 ? (
              selectedItems.map((data, index) => (
                <tr
                  key={index}
                  className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <th className="px-6 py-4 font-medium" scope="row">
                    {data.d_no}
                  </th>
                  <td className="px-6 py-4">{data.category}</td>
                  <td className="px-6 py-4">{data.color}</td>
                  <td className="px-6 py-4">
                    {data.quantity}/T-{data.TotalQuantity}
                  </td>
                  <td className="px-6 py-4">{data.cost_price}</td>
                  <td className="px-6 py-4">{data.sale_price}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={data.assignQuantity}
                      onChange={(e) =>
                        handleAssignQuantityChange(index, e.target.value)
                      }
                      className="border border-gray-300 outline-none focus:outline-none focus:ring-0 focus:border-gray-900 rounded-md px-2 py-1 w-20 text-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="end-2.5 text-red-500 bg-transparent hover:bg-gray-200 hover:text-red-500 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 14 14"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="sr-only">Remove item</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="w-full flex justify-center items-center">
                <td className="text-xl mt-3" colSpan="8">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex justify-center pt-6">
          {stockLoading ? (
            <button
              disabled
              className="inline-block cursor-progress rounded border border-gray-600 bg-gray-300 px-10 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring active:text-indigo-500"
            >
              Send Stock
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
            >
              Send Stock
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default AssignStock;
