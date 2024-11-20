import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePicturesBillOrderAsync,
  deleteProcessBillAndOrderAsync,
  GetPicturesBillByIdAsync,
  GetProcessBillByIdAsync,
  markAsPaidAsync,
} from "../../features/ProcessBillSlice";
import { FaEye } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import DeleteModal from "../../Component/Modal/DeleteModal";
import ConfirmationModal from "../../Component/Modal/ConfirmationModal";
import PicturesOrder from "./Modals/PicturesOrder";

const ProcessDetails = () => {
  const dispatch = useDispatch();
  const { id, category } = useParams();
  const [deleteModal, setDeleteModal] = useState(false);
  const [openCModal, setCModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [picturesOrderModal, setpicturesOrderModal] = useState(false);
  const { loading, ProcessBillsDetails, deleteLoadings } = useSelector(
    (state) => state.ProcessBill
  );

  useEffect(() => {
    if (id && category === "Pictures") {
      dispatch(GetPicturesBillByIdAsync({ id }));
    } else if (id) {
      dispatch(GetProcessBillByIdAsync({ id }));
    }
  }, [dispatch, id]);

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSelectedId(id);
  };

  const closedeleteModal = () => {
    setDeleteModal(false);
  };

  const handleDelete = () => {
    if (category === "Pictures") {
      dispatch(deletePicturesBillOrderAsync({ id: selectedId })).then((res) => {
        if (res.payload.success === true) {
          dispatch(GetPicturesBillByIdAsync({ id }));
          closedeleteModal();
        }
      });
    } else {
      dispatch(
        deleteProcessBillAndOrderAsync({
          id: selectedId,
          process_Category: category,
        })
      ).then((res) => {
        if (res.payload.success === true) {
          dispatch(GetProcessBillByIdAsync({ id }));
          closedeleteModal();
        }
      });
    }
  };

  const openConfirmationModaL = () => {
    setCModal(true);
  };

  const closeConfirmationModal = () => {
    setCModal(false);
  };

  const UpdateAccount = () => {
    const modelCategory = category === "Pictures" ? "Pictures" : "Process";

    dispatch(markAsPaidAsync({ id, category: modelCategory})).then((res) => {
      if (res.payload.success === true) {
        if(category === "Pictures"){
          dispatch(GetPicturesBillByIdAsync({ id }));
        } else {
          dispatch(GetProcessBillByIdAsync({ id }));
        }
        setCModal(false);
      }
    });
  };

  const viewPicturesOrderData = (value) => {
    setpicturesOrderModal(true);
    setSelectedId(value);
  };

  const hidePicturesOrderData = () => {
    setpicturesOrderModal(false);
  };

  let category_path = "";
  switch (true) {
    case category === "Embroidery":
      category_path = "embroidery-details";
      break;
    case category === "Calender":
      category_path = "calendar-details";
      break;
    case category === "Cutting":
      category_path = "cutting-details";
      break;
    case category === "Stone":
      category_path = "stones-details";
      break;
    case category === "Stitching":
      category_path = "stitching-details";
      break;
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* BUYER DETAILS */}
        <div className="px-2 py-2 mb-3 grid border-2 mx-auto max-w-3xl  text-center rounded-lg grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-4 text-gray-900 dark:text-gray-100">
          <div className="box">
            <h3 className="pb-1 font-medium">Party Name</h3>
            <h3>{ProcessBillsDetails?.partyName}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium text-red-500">Total Debit</h3>
            <h3 className="font-medium text-red-500">
              {ProcessBillsDetails?.virtual_account?.total_debit === null
                ? "0"
                : ProcessBillsDetails?.virtual_account?.total_debit}
            </h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Total Credit</h3>
            <h3>
              {ProcessBillsDetails?.virtual_account?.total_credit === null
                ? "0"
                : ProcessBillsDetails?.virtual_account?.total_credit}
            </h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Total Balance</h3>
            <h3>
              {ProcessBillsDetails?.virtual_account?.total_balance === null
                ? "0"
                : ProcessBillsDetails?.virtual_account?.total_balance}
            </h3>
          </div>
        </div>

        {/* -------------- TABLE -------------- */}
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
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Particular
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Credit
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Debit
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ProcessBillsDetails &&
                ProcessBillsDetails?.credit_debit_history?.length > 0 ? (
                  ProcessBillsDetails?.credit_debit_history
                    ?.slice()
                    .reverse()
                    .map((data, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          data?.orderId === ""
                            ? "bg-red-500 text-white"
                            : "bg-white text-black"
                        } text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
                      >
                        <th
                          className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white"
                          scope="row"
                        >
                          <p>{data.date}</p>
                        </th>
                        <td className="px-6 py-4 font-medium">
                          {data.particular}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.credit === 0 || data.credit === null
                            ? "-"
                            : data.credit}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.debit === 0 || data.debit === null
                            ? "-"
                            : data.debit}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {data.balance === 0 || data.balance === null
                            ? "-"
                            : data.balance}
                        </td>
                        {data.orderId !== "" ? (
                          <td className="pl-10 py-4 flex items-center  gap-3">
                            {category === "Pictures" ? (
                              <button
                                onClick={() =>
                                  viewPicturesOrderData(data?.orderId)
                                }
                              >
                                <FaEye size={20} className="cursor-pointer" />
                              </button>
                            ) : (
                              <Link
                                to={`/dashboard/${category_path}/${data.orderId}`}
                              >
                                <FaEye size={20} className="cursor-pointer" />
                              </Link>
                            )}

                            <button
                              onClick={() => openDeleteModal(data.orderId)}
                            >
                              <MdOutlineDelete
                                size={20}
                                className="cursor-pointer text-red-500"
                              />
                            </button>
                          </td>
                        ) : (
                          <td className="px-6 py-4 font-medium">--</td>
                        )}
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
      {ProcessBillsDetails?.virtual_account?.status !== "Paid" && (
        <button
          onClick={openConfirmationModaL}
          className="mx-6 mt-5 bg-red-500  text-white dark:text-gray-100 px-5 py-2 text-sm rounded-md"
        >
          Mark As Paid
        </button>
      )}
      {deleteModal && (
        <DeleteModal
          title={"Delete Bill And Order"}
          message={"Are you sure want to delete this Bill and Order ?"}
          onClose={closedeleteModal}
          Loading={deleteLoadings}
          onConfirm={handleDelete}
        />
      )}

      {openCModal && (
        <ConfirmationModal
          onClose={closeConfirmationModal}
          onConfirm={UpdateAccount}
          message={"Are You sure want To Math This Account AS Paid."}
          title={"Mark Account As Paid"}
          updateStitchingLoading={loading}
        />
      )}

      {picturesOrderModal && (
        <PicturesOrder id={selectedId} closeModal={hidePicturesOrderData} />
      )}
    </>
  );
};

export default ProcessDetails;
