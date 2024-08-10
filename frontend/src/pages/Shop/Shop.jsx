import React, { useState, useEffect } from "react";
import { IoAdd, IoPencilOutline, IoTrash } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteShop,
  GetAllShop,
  UpdateShopAsync,
  createShopAsync,
} from "../../features/ShopSlice";
import {
  GetUserBYBranch,
  UpdateUser,
  getPendingRequests,
} from "../../features/authSlice";
import { Link } from "react-router-dom";

const Shop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading, Shop } = useSelector((state) => state.Shop);
  const {
    getUsersForBranch,
    pendingRequest,
    loading: pendingloading,
  } = useSelector((state) => state.auth);
  const [editShop, setEditShop] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    branchName: "",
  });
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [DeleteModal, setDeleteModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [editedUsers, setEditedUsers] = useState([]); // State to store edited users
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "",
    index: null,
  });

  useEffect(() => {
    dispatch(GetAllShop({ id: user?.user?.id }));
  }, [dispatch, user]);



  const handleEdit = (shop) => {
    setEditShop(shop);
    setFormData({ branchName: shop.branchName });
    setIsOpen(true);
  };

  const handleDelete = (shopId) => {
    setDeleteId(shopId);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const data = { branchId: deleteId };
      dispatch(DeleteShop(data))
        .then(() => {
          dispatch(GetAllShop({ id: user?.user?.id }));
          setDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (editShop) {
      data.branchId = editShop.id;
      dispatch(UpdateShopAsync(data))
        .then(() => {
          setFormData({ branchName: "" });
          setEditShop(null);
          closeModal();
          dispatch(GetAllShop({ id: user?.user?.id }));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      dispatch(createShopAsync(data))
        .then(() => {
          setFormData({ branchName: "" });
          closeModal();
          dispatch(GetAllShop({ id: user?.user?.id }));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const fetchBranchUser = (branchId) => {
    setSelectedShopId(branchId);
    const data = { branchId: branchId };
    dispatch(GetUserBYBranch(data));
  };

  const handleRoleChange = (e, index) => {
    const updatedUsers = [...editedUsers];
    updatedUsers[index] = {
      ...getUsersForBranch[index],
      role: e.target.value, // Capture the selected value
    };
    setEditedUsers(updatedUsers);
  
    setConfirmationModal({ isOpen: true, type: "role", index });
  };
  

  const handleAuthenticatedChange = (e, index) => {
    const updatedUsers = [...editedUsers];
    updatedUsers[index] = {
      ...getUsersForBranch[index],
      authenticated: e.target.value === "true", // Capture the selected value and convert to boolean
    };
    setEditedUsers(updatedUsers);
  
    setConfirmationModal({ isOpen: true, type: "authenticated", index });
  };
  
  const handleBranchChange = (e, index) => {
    const updatedUsers = [...editedUsers];
    updatedUsers[index] = {
      ...getUsersForBranch[index],
      branchId: e.target.value, // Capture the selected value
    };
    setEditedUsers(updatedUsers);
  
    setConfirmationModal({ isOpen: true, type: "branch", index });
  };
  

  const applyChanges = () => {
    const { index, type } = confirmationModal;
    const updatedUsers = [...editedUsers];
  
    if (type === "role") {
      updatedUsers[index] = {
        ...updatedUsers[index],
        role: updatedUsers[index]?.role,
      };
    } else if (type === "authenticated") {
      updatedUsers[index] = {
        ...updatedUsers[index],
        authenticated: updatedUsers[index]?.authenticated,
      };
    } else if (type === "branch") {
      updatedUsers[index] = {
        ...updatedUsers[index],
        branchId: updatedUsers[index]?.branchId,
      };
    }
  
    setEditedUsers(updatedUsers);
  
    const userData = updatedUsers[index];
    dispatch(UpdateUser(userData)).then(() => 
        {
        setConfirmationModal({ isOpen: false, type: "", index: null })
       fetchBranchUser(userData?.branchId)
        }
)
      .catch((error) => console.error("Error:", error));
  };
  
  
  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, type: "", index: null });
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Shop
          </h1>

          <div className="flex flex-row items-center">
            <button className="custom-button inline-block rounded border border-gray-600 bg-gray-600 px-4 py-2.5 mx-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none active:text-gray-100">
              <Link to={"/dashboard/PendingRequest"}>Pending Request</Link>
            </button>

            <div className="search_bar mr-2">
              <div className="relative mt-4 md:mt-0">
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
                  placeholder="Search by Design Number"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        <div className="tabs flex justify-between items-center my-5">
          <div className="tabs_button">
            {loading ? (
              <div className="flex justify-center  items-center">
                <div
                  className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              Shop?.map((data) => (
                <button
                  onClick={() => fetchBranchUser(data?.id)}
                  className={`inline-flex gap-4 border border-gray-500 ${
                    selectedShopId === data.id
                      ? "bg-blue-800 text-white border-none"
                      : "bg-white dark:bg-gray-700 text-black dark:text-gray-100"
                  } px-5 py-2 mx-2 text-sm rounded-md`}
                  key={data?.id}
                >
                  {data?.branchName}
                  <IoPencilOutline
                    size={22}
                    className="text-white"
                    onClick={() => handleEdit(data)}
                  />
                  <IoTrash
                    size={22}
                    className="text-white"
                    onClick={() => handleDelete(data?.id)}
                  />
                </button>
              ))
            )}
          </div>
          <button
            onClick={openModal}
            className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-700 focus:outline-none active:bg-gray-500 text-white"
          >
            <IoAdd size={28} />
          </button>
        </div>



        {selectedShopId && 
    
    
    pendingloading ? (
             <div className="pt-16 flex justify-center mt-12 items-center">
               <div
                 className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                 role="status"
                 aria-label="loading"
               >
                 <span className="sr-only">Loading...</span>
               </div>
             </div>
           ) : (
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
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 dark:text-gray-200"
                  >
                    Role
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 dark:text-gray-200"
                  >
                    Authentication Status
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-900 dark:text-gray-200"
                  >
                    Branch
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
  {  getUsersForBranch.length > 0 ?
  getUsersForBranch?.map((data, index) => (
    <tr key={data?.id}>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
        {data?.name}
      </td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
        {data?.email}
      </td>
      <td className="px-12 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
        <select
          name="role"
          value={editedUsers[index]?.role || data?.role}
          onChange={(e) => handleRoleChange(e, index)}
          className="px-3 py-2 border-none rounded-md dark:bg-gray-700"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
        <select
          name="authenticated"
          value={
            editedUsers[index]?.authenticated?.toString() ||
            data?.authenticated?.toString()
          }
          onChange={(e) => handleAuthenticatedChange(e, index)}
          className="px-3 py-2 border-none rounded-md dark:bg-gray-700"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
        <select
          name="branchId"
          value={editedUsers[index]?.branchId || data?.branchId}
          onChange={(e) => handleBranchChange(e, index)}
          className="px-3 py-2 border-none rounded-md dark:bg-gray-700"
        >
          {Shop?.map((shop) => (
            <option key={shop?.id} value={shop?.id}>
              {shop?.branchName}
            </option>
          ))}
        </select>
      </td>
    </tr>
  ))
  :
  <div className="flex justify-center items-center mt-4">
          <h2 className="text-lg font-semibold text-gray-600 text-center dark:text-gray-300">
            No Data Found
          </h2>
        </div>
}
</tbody>

            </table>
          </div>
        </div>

)}
      </section>

      {/* Delete Confirmation Modal */}
      {DeleteModal && (

<div className="fixed inset-0 flex items-center justify-center z-50">
<div className="bg-black bg-opacity-50 absolute inset-0"></div>
<div className="bg-white p-6 rounded-md z-10 dark:bg-gray-700">
  <p className="dark:text-white">Are you sure you want to delete this shop?</p>
  <div className="flex justify-end mt-4">
    <button
      onClick={() => setDeleteModal(false)}
      className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
    >
      Cancel
    </button>
    <button
      onClick={confirmDelete}
      className="px-4 py-2 bg-red-600 text-white rounded-md"
    >
      Delete
    </button>
  </div>
</div>
</div>









      
      )}

      {/* Confirmation Modal for Role/Authentication/Branch Change */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-md z-10 dark:bg-gray-700">
            <p className="dark:text-white">Are you sure you want to apply the changes?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeConfirmationModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={applyChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-gray-800 opacity-75"
            onClick={closeModal}
          ></div>
          <div className="bg-white w-full max-w-lg p-6 rounded-lg z-50 dark:bg-gray-700">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >
                  Branch Name
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={(e) =>
                    setFormData({ ...formData, branchName: e.target.value })
                  }
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {editShop ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
