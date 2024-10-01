import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GetAllBags } from "../../../features/InStockSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";

const Bag = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const [bagId, setBagId] = useState();
  const { loading, Bags } = useSelector((state) => state.InStock);

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    dispatch(GetAllBags({ page }));
  }, [page, dispatch]);

  const openModal = (id) => {
    setIsOpen(true);
    setBagId(id);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const filteredData = Bags?.data?.filter((data) => data.id === bagId);


  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[60vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Bag / Box
          </h1>

   
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

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
          <div className="relative overflow-x-auto mt-7">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3" scope="col">
                    Bill No
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Name
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Recently
                  </th>
                  <th className="px-6 py-3" scope="col">
                    R. Date
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Total Quantity
                  </th>
                  <th className="px-6 py-4 text-md" scope="col">
                    History
                  </th>
                </tr>
              </thead>
              <tbody>
                {Bags && Bags?.data?.length > 0 ? (
                  Bags?.data?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-6 py-4">{data.bill_no}</td>
                      <td className="px-6 py-4" scope="row">
                        {data.name}
                      </td>
                      <td className="px-6 py-4">{data.recently} p</td>
                      <td className="px-6 py-4">
                        {new Date(data?.r_Date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{data.totalQuantity} p</td>
                      <td className="pl-10 py-4">
                        <span onClick={() => openModal(data?.id)}>
                          <FaEye size={20} className="cursor-pointer" />
                        </span>
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



      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative scrollable-content h-[70vh]  py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bag / Box History
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
                      Bill No
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Name
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData?.map((item, index) =>
                      item?.all_Records?.map((data, subIndex) => (
                        <tr
                          key={`${index}-${subIndex}`}
                          className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                          <th
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            scope="row"
                          >
                            {data.bill_no}
                          </th>
                          <td className="px-6 py-4">
                            {new Date(data?.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{data.name}</td>
                          <td className="px-6 py-4">{data.quantity} p</td>
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
    </>
  );
};

export default Bag;
