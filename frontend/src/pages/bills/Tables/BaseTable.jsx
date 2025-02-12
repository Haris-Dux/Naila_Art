import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  deleteSelllerBillAsync,
  getAllPurchasingHistoryAsync,
} from "../../../features/SellerSlice";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";

const BaseTable = () => {
  const dispatch = useDispatch();

  const { loading, PurchasingHistory,deleteLoading } = useSelector((state) => state.Seller);

  const [baseId, setBaseId] = useState();
  const [search, setSearch] = useState();
  const [showConfirmationModal, setConfirmationModal] = useState();
  const [onConfitmation, setOnConfirmation] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    dispatch(getAllPurchasingHistoryAsync({ category: "Base", search, page }));
  }, [page, dispatch]);

  const renderPaginationLinks = () => {
    const totalPages = PurchasingHistory?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/purchasebills?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() =>
              dispatch(
                getAllPurchasingHistoryAsync({
                  category: "Base",
                  search,
                  page: i,
                })
              )
            }
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const ToDown = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          dispatch(getAllPurchasingHistoryAsync({ category: "Base", search, page }));
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
          <div className="relative overflow-x-auto mt-5 ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3" scope="col">
                    Name
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Bill No
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Category
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Quantity
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Rate
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Total
                  </th>
                  <th className="px-6 py-3" scope="col">
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
                      <td className="px-6 py-4" scope="row">
                        {data.name}
                      </td>
                      <th className="px-6 py-4 font-medium">{data?.bill_no}</th>
                      <td className="px-6 py-4">{data.category}</td>
                      <td className="px-6 py-4">
                        {new Date(data.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{data.quantity} m</td>
                      <td className="px-6 py-4">{data.rate}</td>
                      <td className="px-6 py-4">{data.total}</td>
                      <td className="px-6 py-4">
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

      {/* -------- PAGINATION -------- */}
      {PurchasingHistory?.totalPages && PurchasingHistory?.totalPages !== 1 ? <section className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {PurchasingHistory?.page > 1 ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/purchasebills?page=${page - 1}`}
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </Link>
              ) : (
                <button
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                  disabled
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              )}
            </li>
            {renderPaginationLinks()}
            <li>
              {PurchasingHistory?.totalPages !== page ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/purchasebills?page=${page + 1}`}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </Link>
              ) : (
                <button
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-not-allowed"
                  disabled
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </section> : null}

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-4xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
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
                <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      Category
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Color
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-3" scope="col">
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
                          <th className="px-6 py-4 font-medium" scope="row">
                            {data?.category}
                          </th>
                          <td className="px-6 py-4">{data?.colors}</td>
                          <td className="px-6 py-4">
                            {new Date(data?.Date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{data?.quantity} m</td>
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
            "Are you sure you want to Delete this bill? Note: The stock associated with this bill will not be deleted."
          }
          title={"Delete Base Bill"}
          updateStitchingLoading={deleteLoading}
        />
      )}
    </>
  );
};

export default BaseTable;
