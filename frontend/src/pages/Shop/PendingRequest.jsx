import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingRequests,UpdateUser } from '../../features/authSlice';

const PendingRequest = () => {
  const dispatch = useDispatch();
  const { pendingRequest, loading } = useSelector((state) => state.auth);
  const [editedUsers, setEditedUsers] = useState([]);

  useEffect(() => {
    dispatch(getPendingRequests());
  }, [dispatch]);

  useEffect(() => {
    if (pendingRequest) {
      setEditedUsers(pendingRequest.map((user) => ({
        id: user.id,
        authenticated: user.authenticated
      })));
    }
  }, [pendingRequest]);

  const handleAuthenticatedChange = (e, index) => {
    const newAuthStatus = e.target.value === 'Authorized';
    const updatedUsers = [...editedUsers];
    updatedUsers[index].authenticated = newAuthStatus;
    setEditedUsers(updatedUsers);

    // Update user authenticated status in the backend
    const data = {
      id: updatedUsers[index].id,
      authenticated: newAuthStatus,
    };
    dispatch(UpdateUser(data))
      .then(() => {
        dispatch(getPendingRequests());
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
      {/* -------------- HEADER -------------- */}
      <div className="header flex justify-between items-center pt-6 mx-2">
        <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">Pending Requests</h1>

        {/* <!-- search bar --> */}
        <div className="search_bar relative mt-4 md:mt-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-800 dark:text-gray-200"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>

          <input
            type="text"
            className="md:w-64 lg:w-72 py-2 pl-10 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
            placeholder="Search by User name"
          />
        </div>
      </div>

      <p className="w-full bg-gray-300 h-px mt-5"></p>

      {/* -------------- TABLE -------------- */}
      {loading ? (
        <div className="pt-16 flex justify-center mt-12 items-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) :  pendingRequest && pendingRequest.length > 0 ? (
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3" scope="col">Name</th>
                <th className="px-6 py-3" scope="col">Email</th>
                <th className="px-6 py-3" scope="col">Authenticated</th>
              </tr>
            </thead>
            <tbody>
                
              {editedUsers.map((data, index) => (
                <tr
                  key={index}
                  className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row">
                    {pendingRequest[index].name}
                  </th>
                  <td className="px-6 py-4">{pendingRequest[index].email}</td>
                  <td className="px-6 py-4">
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      value={data.authenticated ? 'Authorized' : 'Unauthorized'}
                      onChange={(e) => handleAuthenticatedChange(e, index)}
                    >
                      <option value="Authorized">Authorized</option>
                      <option value="Unauthorized">Unauthorized</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ): (
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
