import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import DeleteModal from "../../../Component/Modal/DeleteModal";
import { DeleteBpairSaleAsync, getbPairDataAsync } from "../../../features/B_pairSlice";
import { useDispatch, useSelector } from "react-redux";

const SaleHistoryModal = ({ data, closeModal , selectedCategory, page, search}) => {

  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const {deleteLoadings} = useSelector(
    (state) => state.B_Pair
  );

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSelectedId(id);
  };

  const closedeleteModal = () => {
    setDeleteModal(false);
  };

  const payload = {
    category: selectedCategory,
    page,
    search,
  };

  const handleDelete = () => {
    dispatch(DeleteBpairSaleAsync({ saleId: selectedId , id:data?.id })).then((res) => {
      if (res.payload.success === true) {
        setDeleteModal(false);
        closeModal();
        dispatch(getbPairDataAsync(payload));
      }
    });
  };

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
    >
      <div className="relative py-4 px-3 w-full max-w-5xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
        {/* ------------- HEADER ------------- */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            B Pair Sale History
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
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
            <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className=" px-6 py-3 text-center" scope="col">
                  Date
                </th>
                <th className=" px-6 py-3 text-center" scope="col">
                  Name
                </th>
                <th className=" px-6 py-3 text-center" scope="col">
                  Contact
                </th>
                <th className=" px-6 py-3 text-center" scope="col">
                  Amount
                </th>
                <th className=" px-6 py-3 text-center" scope="col">
                  Quantity
                </th>
                <th className=" px-6 py-3 text-center" scope="col">
                  P.Method
                </th>
                <th className=" px-6 py-3 text-center" scope="col">
                  Action
                </th>
              </tr>
            </thead>
          </table>
          <div className="scrollable-content h-[50vh] overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
              <tbody>
                {data && data?.seller_Details?.length > 0 ? (
                  data?.seller_Details
                    ?.slice()
                    .reverse()
                    .map((data, index) => (
                      <tr
                        key={index}
                        className={`${
                          data?.deleted ? "bg-red-500 text-white" : "bg-white"
                        } border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      >
                        <td className=" px-6 py-3 text-center" scope="row">
                          {data?.date}
                        </td>
                        <td className=" px-6 py-3 text-center">{data?.name}</td>
                        <td className="px-6 py-3 text-center">
                          {data?.contact}
                        </td>
                        <td className=" px-6 py-3 text-center">
                          {data?.amount}
                        </td>
                        <td className=" px-6 py-3 text-center">
                          {data?.quantity}
                        </td>
                        <td className=" px-6 py-3 text-center">
                          {data?.payment_Method}
                        </td>
                        <td className=" px-6 py-3 text-center">
                          {data?.deleted ? (
                            "--"
                          ) : (
                            <button onClick={() => openDeleteModal(data?.id)}>
                              <MdOutlineDelete
                                size={20}
                                className="cursor-pointer text-red-500"
                              />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr className="w-full flex justify-center items-center">
                    <td className="text-xl mt-3">No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
       {/* DELETE MODAL */}
       {deleteModal && (
        <DeleteModal
          title={"Delete B Pair"}
          message={"Are you sure want to delete this B Pair ?"}
          onClose={closedeleteModal}
          Loading={deleteLoadings}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default SaleHistoryModal;
