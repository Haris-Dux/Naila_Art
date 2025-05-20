import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  generateStitchingBillAsync,
  generateStitchingGatePssPdfAsync,
  GetSingleStitching,
  UpdateStitchingAsync,
} from "../../../features/stitching";

import ConfirmationModal from "../../../Component/Modal/ConfirmationModal";
import ProcessBillModal from "../../../Component/Modal/ProcessBillModal";

const StitchingDetails = () => {
  const { id } = useParams();
  const {
    SingleStitching,
    loading,
    updateStitchingLoading,
    StitchingBillLoading,
    StitchingpdfLoading,
  } = useSelector((state) => state.stitching);
  const dispatch = useDispatch();
  const [isUpdateReceivedConfirmOpen, setIsUpdateReceivedConfirmOpen] =
    useState(false);
  const [isCompletedConfirmOpen, setIsCompletedConfirmOpen] = useState(false);
  const [isGenerateGatePassOpen, setisGenerateGatePassOpen] = useState(false);
  const [processBillModal, setProcessBillModal] = useState(false);
  const [processBillData, setProcessBillData] = useState({});

  const [formData, setFormData] = useState({
    id: id,
    suits_category: [],
    dupatta_category: [],
  });

  useEffect(() => {
    const data = { id };
    dispatch(GetSingleStitching(data));
  }, [id, dispatch]);

  useEffect(() => {
    if (SingleStitching) {
      setFormData({
        ...formData,
        suits_category:
          SingleStitching.suits_category?.map((item) => ({
            id: item.id,
            return_quantity: item.recieved,
            cost_price: item.cost_price,
            sale_price: item.sale_price,
            category: item.category,
            color: item.color,
          })) || [],
        dupatta_category:
          SingleStitching.dupatta_category?.map((item) => ({
            id: item.id,
            return_quantity: item.recieved,
            cost_price: item.cost_price,
            sale_price: item.sale_price,
            category: item.category,
            color: item.color,
          })) || [],
      });
    }
  }, [SingleStitching]);

  const handleInputChange = (category, index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [category]: prevState[category]?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  //REMOVE EMPTY ARRAY
  const removeEmptyCategoryArrays = () => {
    const updatedData = { ...formData };
    if (updatedData.dupatta_category.length === 0) {
      delete updatedData.dupatta_category;
    } else if (updatedData.suits_category.length === 0) {
      delete updatedData.suits_category;
    }
    return updatedData;
  };

  const handleSubmitstitching = (e) => {
    e.preventDefault();
    const updatedData = removeEmptyCategoryArrays();
    dispatch(UpdateStitchingAsync(updatedData)).then((res) => {
      if (res.payload.success === true) {
        const data = { id };
        dispatch(GetSingleStitching(data));
        closeUpdateRecievedModal();
      }
    });
  };

  const handleCompletestitching = (e) => {
    e.preventDefault();
    dispatch(
      UpdateStitchingAsync({
        project_status: "Completed",
        id: id,
        suits_category: formData.suits_category,
        dupatta_category: formData.dupatta_category,
        d_no: SingleStitching?.design_no,
      })
    ).then((res) => {
      if (res.payload.success === true) {
        const data = { id };
        dispatch(GetSingleStitching(data));
        closeCompletedModal();
      }
    });
  };

  const handleCompletedClick = () => {
    setIsCompletedConfirmOpen(true);
  };

  const closeCompletedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleUpdateReceivedClick = () => {
    setIsUpdateReceivedConfirmOpen(true);
  };

  const closeUpdateRecievedModal = () => {
    setIsUpdateReceivedConfirmOpen(false);
    setIsCompletedConfirmOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleGenerateGatePassPDf = () => {
    dispatch(generateStitchingGatePssPdfAsync(SingleStitching));
    closeGatepassModal();
  };

  const generateBill = (e) => {
    e.preventDefault();
    const formData = {
      ...SingleStitching,
      process_Category: "Stitching",
      Stitching_id: SingleStitching?.id,
      Manual_No: processBillData.Manual_No,
      additionalExpenditure: processBillData.additionalExpenditure,

    };
    dispatch(generateStitchingBillAsync(formData)).then(() => {
      closeBillModal();
      setProcessBillData({});
    });
  };

  const openGenerateBillForm = () => {
    setProcessBillModal(true);
  };

  const closeBillModal = () => {
    setProcessBillModal(false);
  };

  const HandleProcessBillDataChange = (data) => {
    setProcessBillData(data);
  };

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        <div className="pt-16 flex justify-center mt-12 items-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </section>
    );
  };

  const handleOpenGatePassModal = () => {
    setisGenerateGatePassOpen(true);
  };

  const closeGatepassModal = () => {
    setisGenerateGatePassOpen(false);
    document.body.style.overflow = "auto";
  };


  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* HEADER */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Stitching Details
          </h1>
        </div>

        {/* DETAILS SECTION */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
            {/* ROW 1 */}
            <div className="box">
              <span className="font-medium">Party Name:</span>
              <span> {SingleStitching?.partyName}</span>
            </div>
            <div className="box">
              <span className="font-medium">Manual No:</span>
              <span> {SingleStitching?.Manual_No ?? '--'}</span>
            </div>
            <div className="box">
              <span className="font-medium">Design No:</span>
              <span> {SingleStitching?.design_no}</span>
            </div>
            <div className="box">
              <span className="font-medium">Rate:</span>
              <span> {SingleStitching?.rate}</span>
            </div>
            <div className="box">
              <span className="font-medium ">Project Status:</span>
              <span
                className={`${
                  SingleStitching.project_status === "Pending"
                    ? "text-yellow-300"
                    : "text-green-600"
                }`}
              >
                {SingleStitching?.project_status}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Date:</span>
              <span>
                {" "}
                {SingleStitching?.date}
              </span>
            </div>
            <div className="box">
              <span className="font-medium">Lace Quantity:</span>
              <span> {SingleStitching?.lace_quantity}</span>
            </div>
            <div className="box">
              <span className="font-medium">Quantity:</span>
              <span> {SingleStitching?.Quantity}</span>
            </div>
            <div className="box">
              <span className="font-medium">R. Quantity:</span>
              <span> {SingleStitching?.r_quantity}</span>
            </div>
            <div className="box ">
              <span className="font-medium">L.Category:</span>
              <span> {SingleStitching?.lace_category}</span>
            </div>
          </div>
        </div>

        {/* RECEIVED STOCK SECTION */}

        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
            <div className="box_1">
              <div className="flex items-center gap-40">
                {SingleStitching?.suits_category?.length > 0 && (
                  <div className="details space-y-2">
                    <h3 className="mb-4 font-semibold text-lg">
                      Received Shirt Colors
                    </h3>
                    {SingleStitching?.suits_category?.map((data, index) => (
                      <div
                        key={data.id}
                        className="details_box flex items-center gap-x-3"
                      >
                        <p className="w-44">
                          {data.color} ({data.quantity_in_no})
                        </p>
                        {/* RETURN QUANTITY */}
                        <input
                          type="text"
                          placeholder="R.Q"
                          className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                          value={
                            formData?.suits_category[index]?.return_quantity ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "suits_category",
                              index,
                              "return_quantity",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {SingleStitching?.dupatta_category?.length > 0 && (
                  <div className="details space-y-2">
                    <h3 className="mb-4 font-semibold text-lg">
                      Received Dupatta Colors
                    </h3>
                    {SingleStitching?.dupatta_category?.map((data, index) => (
                      <div
                        key={data.id}
                        className="details_box flex items-center gap-x-3"
                      >
                        <p className="w-44">
                          {data.color} ({data.quantity_in_no})
                        </p>
                        <input
                          type="text"
                          placeholder="R.Q"
                          className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                          value={
                            formData.dupatta_category[index]?.return_quantity ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "dupatta_category",
                              index,
                              "return_quantity",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          {SingleStitching?.project_status !== "Completed" && (
            <button
              className="px-3 py-2 text-sm rounded bg-blue-800 text-white border-none"
              onClick={handleUpdateReceivedClick}
            >
              Update Recived
            </button>
          )}
        </div>

        {/* BUTTONS BAR */}
        <div className="mt-6 flex justify-center items-center gap-x-5">
          {SingleStitching?.project_status !== "Completed" &&
            SingleStitching?.updated && (
              <button
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                onClick={handleCompletedClick}
              >
                Completed
              </button>
            )}

          {SingleStitching?.project_status === "Completed" &&
            !SingleStitching?.bill_generated && (
              <button
                onClick={openGenerateBillForm}
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
              >
                Generate Bill
              </button>
            )}
          {StitchingpdfLoading ? (
            <button
              disabled
              className="px-4 py-2.5 text-sm rounded cursor-progress bg-gray-400 dark:bg-gray-200 text-white dark:text-gray-800"
            >
              Generate Gate Pass
            </button>
          ) : (
            <button
              onClick={handleOpenGatePassModal}
              className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            >
              Generate Gate Pass
            </button>
          )}
          {SingleStitching?.project_status === "Completed" && !SingleStitching?.packed &&
              <Link
                className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                to={`/dashboard/packing-details/${SingleStitching?.id}`}
              >
                Packing
              </Link>
            }
        </div>

        {isUpdateReceivedConfirmOpen && (
          <ConfirmationModal
            title="Confirm Update"
            message="Are you sure you want to update the received items?"
            onConfirm={handleSubmitstitching}
            onClose={closeUpdateRecievedModal}
            updateStitchingLoading={updateStitchingLoading}
          />
        )}

        {isCompletedConfirmOpen && (
          <ConfirmationModal
            updateStitchingLoading={updateStitchingLoading}
            title="Confirm Complete"
            message="Are you sure you want to Complete?"
            onConfirm={handleCompletestitching}
            onClose={closeCompletedModal}
          />
        )}

        {isGenerateGatePassOpen && (
          <ConfirmationModal
            title="Confirmation"
            message="Are you sure you want to generate gatepass?"
            onConfirm={handleGenerateGatePassPDf}
            onClose={closeGatepassModal}
          />
        )}

      </section>

      {/* PROCESS BILL MODAL */}
      {processBillModal && (
        <ProcessBillModal
          onDataChange={HandleProcessBillDataChange}
          handleSubmit={generateBill}
          loading={StitchingBillLoading}
          closeModal={closeBillModal}
          Manual_No={SingleStitching?.Manual_No}
          processBillAmount={Math.round(
            SingleStitching?.rate * SingleStitching?.r_quantity
          )}
        />
      )}
    </>
  );
}

export default StitchingDetails;











