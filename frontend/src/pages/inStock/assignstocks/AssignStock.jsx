import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AssginStocktoBranch,
  GetAllBranches,
} from "../../../features/InStockSlice";
import { useNavigate } from "react-router-dom";

const AssignStock = () => {
  const { Branches, SuitLoading } = useSelector((state) => state.InStock);
  const { user } = useSelector((state) => state.auth);
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
    dispatch(GetAllBranches({ id: user?.user?.id }));
  }, [dispatch, user?.user?.id]);

  useEffect(() => {
    const updatedStockDetails = selectedItems.map((item) => ({
      Item_Id: item._id,
      category: item.category,
      color: item.color,
      quantity: item?.assignQuantity || 1,
      cost_price: item.cost_price,
      sale_price: item.sale_price,
      d_no: item.d_no,
      date: new Date().toISOString().split("T")[0],
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
    // Ensure the value is a number and within range
    const quantity = Number(value);
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      assignQuantity: Math.max(1, Math.min(quantity, updatedItems[index]?.TotalQuantity || 1)),
    };

    const updatedStockDetails = updatedItems.map((item) => ({
      Item_Id: item._id,
      category: item.category,
      color: item.color,
      quantity: item.assignQuantity || 1,
      cost_price: item.cost_price,
      sale_price: item.sale_price,
      d_no: item.d_no,
      date: new Date().toISOString().split("T")[0],
    }));

    setSelectedItems(updatedItems);
    setFormData((prevFormData) => ({
      ...prevFormData,
      stock_Details: updatedStockDetails,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        Assign Stock
      </h1>

      <div className="flex justify-center items-center pt-6">
        <select
          id="branches"
          value={formData.branchId}
          onChange={handleBranchChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="">Choose Branch</option>
          {Branches?.map((data) => (
            <option key={data.id} value={data.id}>
              {data?.branchName}
            </option>
          ))}
        </select>
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
              <th className="px-6 py-3">Assign Quantity</th>
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
                      min={1}
                      max={data?.TotalQuantity}
                      value={data.assignQuantity || ""}
                      onChange={(e) =>
                        handleAssignQuantityChange(index, e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 w-20 text-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
          {SuitLoading ? (
            <button
              disabled
              className="inline-block cursor-progress rounded border border-gray-600 bg-gray-400 px-10 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring active:text-indigo-500"
            >
              Submitting...
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
            >
              Assign Stock
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default AssignStock;
