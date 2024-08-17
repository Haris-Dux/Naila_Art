import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingRequests, UpdateUser } from "../../features/authSlice";
import { GetAllShop } from "../../features/ShopSlice";
import toast from "react-hot-toast";

const PendingRequest = () => {
  const dispatch = useDispatch();
  const { pendingRequest, pendingRequestsLoading } = useSelector(
    (state) => state.auth
  );
  const { Shop } = useSelector((state) => state.Shop);
  const { user } = useSelector((state) => state.auth);
  const [editedUsers, setEditedUsers] = useState([]);

  // Fetch pending requests
  useEffect(() => {
    dispatch(getPendingRequests());
  }, [dispatch]);

  // Set initial values for users when pendingRequest changes
  useEffect(() => {
    if (pendingRequest) {
      setEditedUsers(
        pendingRequest.map((user) => ({
          id: user.id,
          authenticated: user.authenticated,
          branchId: ""
        }))
      );
    }
  }, [pendingRequest, Shop]);

  // Fetch all shops
  useEffect(() => {
    if (user?.user?.id) {
      dispatch(GetAllShop({ id: user.user.id }));
    }
  }, [dispatch, user]);

  // Handle branch change
  const handleBranchChange = (e, index) => {
    const updatedUsers = [...editedUsers];
    updatedUsers[index] = {
      ...updatedUsers[index],
      branchId: e.target.value,
    };
    setEditedUsers(updatedUsers);
  };

  // Handle authenticated change
  const handleAuthenticatedChange = (e, index) => {
    const updatedUsers = [...editedUsers];
    updatedUsers[index] = {
      ...updatedUsers[index],
      authenticated: e.target.value === "Authorized",
    };
    setEditedUsers(updatedUsers);
  };

  // Handle user update
  const handleUpdateUser = (index) => {
    const userData = editedUsers[index];
    if (userData.branchId && userData.authenticated === true ) {
      dispatch(UpdateUser(userData))
        .then((res) => {
          if (res.payload.success === true) {
            dispatch(getPendingRequests()); 
          }
        })
    } else {
      toast.error("Invalid Data to Authorize User");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
      <div className="header flex justify-between items-center pt-6 mx-2">
        <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
          Pending Requests
        </h1>
      </div>

      <p className="w-full bg-gray-300 h-px mt-5"></p>

      {pendingRequestsLoading ? (
        <div className="pt-16 flex justify-center mt-12 items-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : pendingRequest && pendingRequest.length > 0 ? (
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3" scope="col">
                  Name
                </th>
                <th className="px-6 py-3" scope="col">
                  Email
                </th>
                <th className="px-6 py-3" scope="col">
                  Authenticated
                </th>
                <th scope="col" className="px-6 py-3">
                  Branch
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {editedUsers?.map((data, index) => (
                <tr
                  key={index}
                  className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <th
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    scope="row"
                  >
                    {pendingRequest[index]?.name}
                  </th>
                  <td className="px-6 py-4">{pendingRequest[index]?.email}</td>
                  <td className="px-6 py-4">
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      value={data.authenticated ? "Authorized" : "Unauthorized"}
                      onChange={(e) => handleAuthenticatedChange(e, index)}
                    >
                      <option value="Authorized">Authorized</option>
                      <option value="Unauthorized">Unauthorized</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    <select
                      name="branchId"
                      value={data.branchId || "" }
                      onChange={(e) => handleBranchChange(e, index)}
                      className="px-3 py-2 border-none rounded-md dark:bg-gray-700"
                    >
                        <option value="">No branch selected</option>
                      {Shop?.map((shop) => (
                        <option key={shop?.id} value={shop?.id}>
                          {shop?.branchName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleUpdateUser(index)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-16">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            No Data Found
          </h2>
        </div>
      )}
    </section>
  );
};

export default PendingRequest;
