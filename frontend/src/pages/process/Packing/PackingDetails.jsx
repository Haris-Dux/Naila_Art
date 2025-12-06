import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addInStockFromPackagingAsync,
  GetSingleStitching,
} from "../../../features/stitching";
import { GETEmbroiderySIngle } from "../../../features/EmbroiderySlice";
import { FaEye } from "react-icons/fa";
import PicturesOrder from "../../bills/Modals/PicturesOrder";
import { CgShoppingBag } from "react-icons/cg";
import { AiOutlinePicture } from "react-icons/ai";

const PackingDetails = () => {
  const { id } = useParams();
  const { SingleStitching, loading, addInStockLoading } = useSelector(
    (state) => state.stitching
  );
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [picturesOrderModal, setpicturesOrderModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    d_no: "",
    useBags: false,
    embroidery_Id: "",
    suits_category: [],
    dupatta_category: [],
    Manual_No: null,
    serial_No: null,
  });

  const { SingleEmbroidery } = useSelector((state) => state.Embroidery);
  const { embroidery_Id, design_no, serial_No, Manual_No, suits_category } =
    location.state || {};

  useEffect(() => {
    if (
      id === "null" &&
      [embroidery_Id, design_no, serial_No, suits_category].some(
        (value) => value === undefined
      )
    ) {
      navigate("/dashboard/embroidery");
    }
  }, [embroidery_Id, design_no, serial_No, suits_category, id]);

  useEffect(() => {
    if (id !== "null") {
      const data = { id };
      dispatch(GetSingleStitching(data));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (
      SingleStitching &&
      SingleStitching?.suits_category?.length > 0 &&
      SingleStitching?.dupatta_category?.length > 0
    ) {
      setFormData({
        ...formData,
        d_no: SingleStitching?.design_no,
        embroidery_Id: SingleStitching?.embroidery_Id,
        packing_Id: SingleStitching.id,
        Manual_No: SingleStitching.Manual_No,
        serial_No: SingleStitching.serial_No,
        suits_category:
          SingleStitching.suits_category?.map((item) => ({
            id: item.id,
            return_quantity: item.recieved,
            cost_price: item.cost_price,
            sale_price: item.sale_price,
            category: item.category,
            color: item.color,
          })) || [],
      });
    } else if (
      SingleStitching &&
      (SingleStitching?.suits_category?.length === 0 ||
        SingleStitching?.suits_category === null) &&
      SingleStitching?.dupatta_category?.length > 0
    ) {
      setFormData({
        ...formData,
        d_no: SingleStitching?.design_no,
        embroidery_Id: SingleStitching?.embroidery_Id,
        packing_Id: SingleStitching.id,
        Manual_No: SingleStitching.Manual_No,
        serial_No: SingleStitching.serial_No,
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
    } else if (
      SingleStitching &&
      SingleStitching?.suits_category?.length > 0 &&
      (SingleStitching?.dupatta_category?.length === 0 ||
        SingleStitching?.dupatta_category === null)
    ) {
      setFormData({
        ...formData,
        d_no: SingleStitching?.design_no,
        embroidery_Id: SingleStitching?.embroidery_Id,
        packing_Id: SingleStitching.id,
        Manual_No: SingleStitching.Manual_No,
        serial_No: SingleStitching.serial_No,
        suits_category:
          SingleStitching.suits_category?.map((item) => ({
            id: item.id,
            return_quantity: item.recieved,
            cost_price: item.cost_price,
            sale_price: item.sale_price,
            category: item.category,
            color: item.color,
          })) || [],
      });
    } else if (id === "null" && suits_category?.length > 0) {
      setFormData({
        ...formData,
        d_no: design_no,
        embroidery_Id: embroidery_Id,
        Manual_No: Manual_No,
        serial_No: serial_No,
        suits_category:
          (suits_category &&
            suits_category?.map((item) => ({
              id: item.id,
              return_quantity: item.received,
              cost_price: item.cost_price,
              sale_price: item.sale_price,
              category: item.category,
              color: item.color,
            }))) ||
          [],
      });
    }
    const idData = SingleStitching.embroidery_Id || embroidery_Id;
    dispatch(GETEmbroiderySIngle({ id: idData }));
  }, [SingleStitching, id]);

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
  }

  const handleInputChange = (category, index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [category]: prevState[category]?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddInStock = (e) => {
    e.preventDefault();
    dispatch(addInStockFromPackagingAsync(formData)).then((res) => {
      if (res.payload.success) {
        closeConfirmationModal();
        navigate("/dashboard/suits");
      }
    });
  };

  const openConfirmationModal = () => {
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
  };

  const viewPicturesOrderData = () => {
    setpicturesOrderModal(true);
  };

  const hidePicturesOrderData = () => {
    setpicturesOrderModal(false);
  };

  const handleChecked = (e) => {
    const value = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      useBags: value,
    }));
  };

  const suitMapdata = SingleStitching?.suits_category || suits_category;

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* HEADER */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Packing Details
          </h1>
        </div>

        {/* DETAILS SECTION */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-x-2 gap-y-5 text-center text-sm">
            {/* ROW 1 */}
            <div className="box">
              <span className="font-medium">Serial No:</span>
              <span> {SingleStitching?.serial_No || serial_No}</span>
            </div>
            <div className="box">
              <span className="font-medium">Manual No:</span>
              <span> {SingleStitching?.Manual_No || Manual_No}</span>
            </div>

            <div className="box">
              <span className="font-medium">Design No:</span>
              <span> {SingleStitching?.design_no || design_no}</span>
            </div>
            <div className="box">
              <span className="font-medium">Additional Cost:</span>
              <span> {SingleEmbroidery?.additionalExpenditure}</span>
            </div>
            <div className="box flex gap-2">
              <span className="font-medium">Pictures Order :</span>
              <span>
                {SingleEmbroidery?.pictures_Order ? (
                  <span>
                    <FaEye
                      onClick={viewPicturesOrderData}
                      size={20}
                      className="cursor-pointer"
                    />
                  </span>
                ) : (
                  <span className="text-red-500"> No Order </span>
                )}
              </span>
            </div>
            <div className="box flex gap-2">
              <span className="font-medium">Use Bags:</span>
              <span>
                <input
                  type="checkbox"
                  id="useBags"
                  className="w-5 h-5 text-blue-600 bg-gray-200 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  onChange={handleChecked}
                />
              </span>
            </div>
          </div>
        </div>

        {/* RECEIVED STOCK SECTION */}

        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
            <div className="box_1">
              <div className="flex items-center gap-40">
                {SingleStitching?.suits_category?.length > 0 ||
                (suits_category?.length > 0 && id === "null") ? (
                  <div className="details space-y-2">
                    <h3 className="mb-4 font-semibold text-lg">
                      Shirt Data For Stock
                    </h3>
                    {suitMapdata?.map((data, index) => (
                      <div
                        key={data.id}
                        className="details_box flex items-center gap-x-3"
                      >
                        <p className="w-44">{data.color}</p>
                        {/* RETURN QUANTITY */}
                        <input
                          type="text"
                          placeholder="R.Q"
                          className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                          value={
                            formData?.suits_category[index]?.return_quantity
                          }
                          readOnly
                        />
                        <>
                          <input
                            type="number"
                            placeholder="C.P"
                            className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                            value={
                              formData?.suits_category[index]?.cost_price || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "suits_category",
                                index,
                                "cost_price",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="number"
                            placeholder="S.P"
                            className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                            value={
                              formData?.suits_category[index]?.sale_price || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "suits_category",
                                index,
                                "sale_price",
                                e.target.value
                              )
                            }
                          />{" "}
                        </>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* DUPPATTA SECTION */}
                {SingleStitching?.dupatta_category?.length > 0 &&
                  SingleStitching?.suits_category?.length === 0 && (
                    <div className="details space-y-2">
                      <h3 className="mb-4 font-semibold text-lg">
                        Duppata Data For Stock
                      </h3>

                      {SingleStitching?.dupatta_category?.map((data, index) => (
                        <div
                          key={data.id}
                          className="details_box flex items-center gap-x-3"
                        >
                          <p className="w-44">{data.color}</p>
                          {/* RETURN QUANTITY */}
                          <input
                            type="text"
                            placeholder="R.Q"
                            className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                            value={
                              formData?.dupatta_category[index]?.return_quantity
                            }
                            readOnly
                          />
                          <>
                            <input
                              type="number"
                              placeholder="C.P"
                              className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                              value={
                                formData?.dupatta_category[index]?.cost_price ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "dupatta_category",
                                  index,
                                  "cost_price",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="number"
                              placeholder="S.P"
                              className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                              value={
                                formData?.dupatta_category[index]?.sale_price ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "dupatta_category",
                                  index,
                                  "sale_price",
                                  e.target.value
                                )
                              }
                            />{" "}
                          </>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS BAR */}
        <div className="mt-6 flex justify-center items-center gap-x-5">
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={openConfirmationModal}
          >
            Add In Stock
          </button>
        </div>

        {/* ADD IN STOCK CONFIRMATION MODAL */}
        {confirmationModal && (
          <div
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
          >
            <div className="relative py-4 px-3 w-full max-w-lg bg-white rounded-md shadow dark:bg-gray-700">
              <div className="flex items-center justify-center p-4 border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add In Stock
                </h3>
              </div>
              <div className="p-2">
                <p className="text-gray-700 text-center dark:text-gray-300">
                  Are you sure you want this quantity with this price to be
                  added in stock?
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 my-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm">
                <CgShoppingBag
                  size={28}
                  className={`${
                    formData?.useBags ? "text-green-500" : "text-red-500"
                  }`}
                />

                <div className="flex flex-col leading-tight">
                  <p
                    className={`font-semibold text-base ${
                      formData?.useBags ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formData?.useBags
                      ? "Packing Bags Selected"
                      : "No Packing Bags Selected"}
                  </p>
                 
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 my-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm">
                <AiOutlinePicture
                  size={28}
                  className={`${
                    SingleEmbroidery?.pictures_Order
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />

                <div className="flex flex-col leading-tight">
                  <p
                    className={`font-semibold text-base ${
                      SingleEmbroidery?.pictures_Order
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {SingleEmbroidery?.pictures_Order
                      ? "Order Includes Pictures"
                      : "No Pictures Added"}
                  </p>
                 
                </div>
              </div>

              <div className="flex justify-center p-2">
                <button
                  onClick={closeConfirmationModal}
                  className="px-4 py-2 text-sm rounded bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white mr-2"
                >
                  Cancel
                </button>
                {addInStockLoading ? (
                  <button
                    disabled
                    className="px-4 py-2.5 cursor-not-allowed text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    onClick={handleAddInStock}
                    className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
                  >
                    Confirm
                  </button>
                )}
              </div>

              <div className="button_box absolute top-6 right-6">
                <button
                  onClick={closeConfirmationModal}
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            </div>
          </div>
        )}
      </section>

      {picturesOrderModal && (
        <PicturesOrder
          id={SingleEmbroidery?.id || embroidery_Id}
          closeModal={hidePicturesOrderData}
        />
      )}
    </>
  );
};

export default PackingDetails;
