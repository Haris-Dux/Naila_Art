import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteSelllerBillAsync, getAllPurchasingHistoryAsync } from "../../../features/SellerSlice";
import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import Pagination from "../../../Component/Common/Pagination";
import { getPageLimit } from "../../../Utils/Common";
import { MdDeleteOutline } from "react-icons/md";

const LaceTable = ({ filters = {} }) => {
  const dispatch = useDispatch();

  const { loading, PurchasingHistory , deleteLoading} = useSelector((state) => state.Seller);

   const [showConfirmationModal, setConfirmationModal] = useState();
    const [onConfitmation, setOnConfirmation] = useState(null);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);

  useEffect(() => {
    dispatch(getAllPurchasingHistoryAsync({ category: "Lace", ...filters, page, limit }));
  }, [page, limit, dispatch, filters]);



    const handleDelete = (id) => {
      const pyaload = { billId: id };
      setConfirmationModal(true);
      document.body.style.overflow = "hidden";
      const deleteBill = () => {
        dispatch(deleteSelllerBillAsync(pyaload)).then((res) => {
          if (res.payload.success) {
            closeModal();
            dispatch(getAllPurchasingHistoryAsync({ category: "Lace", ...filters, page, limit }));
          }
        });
      };
      setOnConfirmation(() => deleteBill)
    };

  const ToDown = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  
  const closeModal = () => {
    setConfirmationModal(false);
    setOnConfirmation(null)
    document.body.style.overflow = "auto";
  };


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
          <div className="relative overflow-x-auto mt-7">
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

      {/* CONFIRMATION MODAL */}
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={closeModal}
          onConfirm={onConfitmation}
          message={
            "Are you sure you want to Delete this bill? Note: The stock associated with this bill will be deleted as well."
          }
          title={"Delete Base Bill"}
          updateStitchingLoading={deleteLoading}
        />
      )}
    </>
  );
};

export default LaceTable;
