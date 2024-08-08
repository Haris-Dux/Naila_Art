import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSingleStitching,
  UpdateStitchingAsync,
} from "../../../features/stitching";



const StitchingDetails = () => {
  const { id } = useParams();
  const { SingleStitching, loading } = useSelector((state) => state.stitching);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: id,
    project_status: "Completed",
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
        suits_category: SingleStitching.suits_category?.map((item) => ({
          id: item.id,
          return_quantity: item.recieved,
        })) || [],
        dupatta_category: SingleStitching.dupatta_category?.map((item) => ({
          id: item.id,
          return_quantity: item.recieved,
        })) || [],
      });
    }
  }, [SingleStitching]);

  const handleInputChange = (category, index, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [category]: prevState[category]?.map((item, i) =>
        i === index ? { ...item, return_quantity: value } : item
      ),
    }));
  };

  const handleSubmitstitching = (e) => {
    e.preventDefault();

    dispatch(UpdateStitchingAsync(formData))
      .then(() => {
        navigate("/dashboard/stitching");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
  }


  console.log("sitching", SingleStitching);

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
              <span className="font-medium">Serial No:</span>
              <span> {SingleStitching?.serial_No}</span>
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
              <span className="font-medium">Project Status:</span>
              <span> {SingleStitching?.project_status}</span>
            </div>
            <div className="box">
              <span className="font-medium">Date:</span>
              <span> {new Date(SingleStitching?.date).toLocaleDateString()}</span>
            </div>
            <div className="box">
              <span className="font-medium">Lace Quantity:</span>
              <span> {SingleStitching?.lace_quantity}</span>
            </div>
            <div className="box col-span-2">
              <span className="font-medium">Lace Category:</span>
              <span> {SingleStitching?.lace_category}</span>
            </div>
            <div className="box">
              <span className="font-medium">R. Quantity:</span>
              <span> {SingleStitching?.r_quantity}</span>
            </div>
          </div>
        </div>

        {/* RECEIVED STOCK SECTION */}
        <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
            <div className="box_1">
              <div className="flex items-center gap-10">
                <div className="details space-y-2">
                  <h3 className="mb-4 font-semibold text-lg">
                    Received Suits Colors
                  </h3>
                  {SingleStitching?.suits_category?.map((data, index) => (
                    <div
                      key={data.id}
                      className="details_box flex items-center gap-x-3"
                    >
                      <p className="w-44">
                        {data.color} ({data.quantity_in_no})
                      </p>
                      <input
                        type="text"
                        className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                        value={
                          formData?.suits_category[index]?.return_quantity || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "suits_category",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
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
                        className="bg-[#EEEEEE] py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-gray-900 dark:text-gray-900"
                        value={
                          formData.dupatta_category[index]?.return_quantity ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "dupatta_category",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS BAR */}
        <div className="mt-10 flex justify-center items-center gap-x-5">
          <button
            className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800"
            onClick={handleSubmitstitching}
          >
            Completed
          </button>
          <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Bill
          </button>
          <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">
            Generate Gate Pass
          </button>
          {/* <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800" >
            Next Step
          </button> */}
        </div>
      </section>
    </>
  );
};

export default StitchingDetails;
