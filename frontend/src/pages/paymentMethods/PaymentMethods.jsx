import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPaymentMethodAsync,
  getAllPaymentMetodsAsync,
  updatePaymentMethodAsync,
} from "../../features/PaymentMethodsSlice";
import { IoPencilOutline } from "react-icons/io5";
import { logoutUserAsync } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

const PaymentMethods = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    active: null,
    id:""
  });

  const { loading,updateLoading, AllPaymentMethods,PaymentData } = useSelector(
    (state) => state.PaymentMethods ,
  );


  useEffect(() => {
    dispatch(getAllPaymentMetodsAsync());
  }, []);

  const closeModal = () => {
    setOpenModal(null);
  };

  const handleEdit = (data) => {
    setSelectedPaymentMethod(data);
    setFormData({
      name: data.name,
      active: data.active,
      id:data.id
    });
    setOpenModal("update");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createPaymentMethodAsync({ name: formData.name })).then((res) => {
      if (res.payload?.success) {
        dispatch(logoutUserAsync()).then((res) => {
          if (res.payload.success) {
            navigate("/");
          }
        });
        closeModal();
      }
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
  
    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== selectedPaymentMethod[key]) {
        updatedFields[key] = formData[key];
      }
    });
  
    if (Object.keys(updatedFields).length === 0) {
      return;
    }
  
  
    updatedFields.id = formData.id;
  
    dispatch(updatePaymentMethodAsync(updatedFields)).then((res) => {
      if (res.payload?.success) {
        dispatch(logoutUserAsync()).then((res) => {
          if (res.payload.success) {
            navigate("/");
          }
        });
        closeModal();
      }
    });
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Payment Methods
          </h1>
          <button
            onClick={() => {
              setOpenModal("create");
            }}
            className="custom-button inline-block rounded border border-gray-600 bg-gray-600 px-4 py-2.5 mx-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none active:text-gray-100"
          >
            Add New Payment Method
          </button>
        </div>

        <p className="w-full bg-gray-300 h-px my-5"></p>

        {loading ? (
          <div className="flex justify-center pt-16 items-center">
            <div
              className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="request_list px-3">
              <div className="overflow-x-auto">
                <table className="min-w-full overflow-hidden rounded-md shadow-md">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-900 dark:text-gray-200"
                      >
                        <button className="flex items-center gap-x-3 focus:outline-none">
                          <span>Full Name</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 dark:text-gray-200"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 dark:text-gray-200"
                      >
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {AllPaymentMethods && AllPaymentMethods.length > 0 ? (
                      AllPaymentMethods?.map((data, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                            {data?.name}
                          </td>
                          <td
                            className={`px-4  py-4 text-sm whitespace-nowrap ${
                              data?.active ? "text-green-500" : "text-red-500"
                            } `}
                          >
                            {data?.active ? "Active" : "Inactive"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                            <IoPencilOutline
                              size={22}
                              className="text-black cursor-pointer  rounded-md"
                              onClick={() => handleEdit(data)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="flex justify-center items-center mt-4">
                        <td className="text-lg font-semibold text-gray-600 text-center dark:text-gray-300">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      {/* UPDATE MODAL */}

      {openModal === "update" && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="fixed inset-0 bg-gray-800 opacity-75"
      onClick={closeModal}
    ></div>
    <div className="bg-white w-full max-w-lg p-6 rounded-lg z-50 dark:bg-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Update Payment Method
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleUpdate}
      >
        {/* Name input */}
        <div className="mb-4">
          <label
            htmlFor="updateName"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
          >
            Name
          </label>
          <input
            type="text"
            name="updateName"
            placeholder="Enter payment method name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
          />
        </div>

        {/* Status select */}
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
          >
            Status
          </label>
          <select
            value={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.value === "true" })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            disabled={updateLoading}
            onClick={closeModal}
            className={`px-4 py-2 rounded-md text-white 
              ${
                updateLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-500 hover:bg-gray-600 cursor-pointer"
              }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateLoading}
            className={`px-4 py-2 rounded-md text-white 
              ${
                updateLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    

      {openModal === "create" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-gray-800 opacity-75"
            onClick={closeModal}
          ></div>
          <div className="bg-white w-full max-w-lg p-6 rounded-lg z-50 dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Add New Payment Method
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter payment method name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* Warning with icon */}
              <div className="my-2 flex items-center text-yellow-600 text-sm">
                <span>
                  <strong>Warning:</strong> You will be logged out.
                </span>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  disabled={updateLoading}
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-md text-white 
                 ${
                   updateLoading
                     ? "bg-gray-300 cursor-not-allowed"
                     : "bg-gray-500 hover:bg-gray-600 cursor-pointer"
                 }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`px-4 py-2 rounded-md text-white 
                     ${
                       updateLoading
                         ? "bg-blue-300 cursor-not-allowed"
                         : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                     }`}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentMethods;
