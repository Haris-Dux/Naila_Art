import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  deleteSelllerBillAsync,
  getAllPurchasingHistoryAsync,
} from "../../../features/SellerSlice";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import Pagination from "../../../Component/Common/Pagination";
import { getPageLimit } from "../../../Utils/Common";

const BaseTable = ({ filters = {} }) => {
  const dispatch = useDispatch();

  const { loading, PurchasingHistory,deleteLoading } = useSelector((state) => state.Seller);

  const [baseId, setBaseId] = useState();
  const [showConfirmationModal, setConfirmationModal] = useState();
  const [onConfitmation, setOnConfirmation] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);

  useEffect(() => {
    dispatch(getAllPurchasingHistoryAsync({ category: "Base", ...filters, page, limit }));
  }, [page, limit, dispatch, filters]);


  const closeModal = () => {
    setIsOpen(false);
    setConfirmationModal(false);
    setOnConfirmation(null)
    document.body.style.overflow = "auto";
  };

  const handleDelete = (id) => {
    const pyaload = { billId: id };
    setConfirmationModal(true);
    const deleteBill = () => {
      dispatch(deleteSelllerBillAsync(pyaload)).then((res) => {
          if (res.payload.success) {
          closeModal();
          dispatch(getAllPurchasingHistoryAsync({ category: "Base", ...filters, page, limit }));
        }
      });
    };
    setOnConfirmation(() => deleteBill)
  };

  const filteredBaseData = useMemo(
    () => PurchasingHistory?.sellers?.filter((data) => data.id === baseId),
    [PurchasingHistory, baseId]
  );

  return (
    <>
      <section>
        {loading ? (
          <div className="pt-16 flex justify-center mt-12 min-h-screen  items-center">
            <div
              className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="relative overflow-x-auto mt-5 ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Name
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Bill No
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Category
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Date
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Quantity
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Rate
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Total
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {PurchasingHistory && PurchasingHistory?.sellers?.length > 0 ? (
                  PurchasingHistory?.sellers?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm" scope="row">
                        {data.name}
                      </td>
                      <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">{data?.bill_no}</th>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data.category}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">
                        {new Date(data.date).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data.quantity} m</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data.rate}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data.total}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">
                        <MdDeleteOutline
                          onClick={() => handleDelete(data.id)}
                          size={24}
                          className="cursor-pointer text-red-500"
                        />
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
        )}
      </section>

      <Pagination
        currentPage={page}
        totalPages={PurchasingHistory?.totalPages}
        totalRecords={PurchasingHistory?.totalRecords ?? PurchasingHistory?.sellerHistory}
        pageSize={limit}
      />

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Base History
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Category
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Color
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Date
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm" scope="col">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBaseData && filteredBaseData.length > 0 ? (
                    filteredBaseData?.map((item, index) =>
                      item?.all_Records?.map((data, subIndex) => (
                        <tr
                          key={`${index}-${subIndex}`}
                          className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm" scope="row">
                            {data?.category}
                          </th>
                          <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.colors}</td>
                          <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">
                            {new Date(data?.Date).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.quantity} m</td>
                        </tr>
                      ))
                    )
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
      )}
      {/* CONFIRMATION MODAL */}
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={closeModal}
          onConfirm={onConfitmation}
          message={
            "Are you sure you want to Delete this bill ?"
          }
          title={"Delete Base Bill"}
          updateStitchingLoading={deleteLoading}
        />
      )}
    </>
  );
};

export default BaseTable;
