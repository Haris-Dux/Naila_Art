import { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { GetAllBags } from "../../../features/InStockSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";

const Bag = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const [bagId, setBagId] = useState();
  const { loading, Bags } = useSelector((state) => state.InStock);

  useEffect(() => {
    dispatch(GetAllBags());
    console.log("data", Bags);
  }, []);

  const openModal = (id) => {
    setIsOpen(true);
    setBagId(id);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const filteredData = Bags.filter((data) => data.id === bagId);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Bag / Box
          </h1>

          {/* <!-- search bar --> */}
          <div className="search_bar flex items-center gap-3 mr-2">
            <button
              onClick={openModal}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoAdd size={22} className="text-white" />
            </button>

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
                // value={searchText}
                // onChange={handleSearch}
              />
            </div>
          </div>
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
                {Bags && Bags.length > 0 ? (
                  Bags?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-md font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-6 py-4">{data.bill_no}</td>
                      <td className="px-6 py-4" scope="row">
                        {data.name}
                      </td>
                      <td className="px-6 py-4">{data.recently} m</td>
                      <td className="px-6 py-4">
                        {new Date(data?.r_Date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{data.totalQuantity} m</td>
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
          <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
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
                    filteredData.map((item, index) =>
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
                          <td className="px-6 py-4">{data.quantity} m</td>
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
