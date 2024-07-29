import { useState, useEffect } from "react";
// import data from './SuitsStockData';
import { FiPlus } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "../../../Component/Embodiary/Box";
import { GETEmbroidery } from "../../../features/EmbroiderySlice";
import { useDispatch } from "react-redux";
const Embroidery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown1, setdropdown1] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { loading, embroidery } = useSelector((state) => state.Embroidery);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    partyName: "",
    serial_No: "",
    date: "",
    per_suit: 0,
    rATE_per_stitching: "",
    project_status: "",
    design_no: "",
    received_suit: 0,
    T_Quantity_In_m: 0,
    T_Quantity: 0,
    Front_Stitch: { value: 0, head: 0 },
    Bazo_Stitch: { value: 0, head: 0 },
    Gala_Stitch: { value: 0, head: 0 },
    Back_Stitch: { value: 0, head: 0 },
    Pallu_Stitch: { value: 0, head: 0 },
    Trouser_Stitch: { value: 0, head: 0 },
    D_Patch_Stitch: { value: 0, head: 0 },
    F_Patch_Stitch: { value: 0, head: 0 },
    project_status: "pending",
    recieved_suit: 200,
    T_Quantity_In_m: 200,
    T_Quantity: 499,
  });

  useEffect(() => {
    dispatch(GETEmbroidery());
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const toggleDropdown = () => {
    setdropdown1(!dropdown1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");

    if (subField) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subField]: parseFloat(value), // Convert string to float
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value, // Convert string to float
      }));
    }
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const filteredData = searchText
    ? embroidery?.data?.filter((item) =>
        item.partyName.toLowerCase().includes(searchText.toLowerCase())
      )
    : embroidery?.data;

  const totalPages = embroidery?.totalPages || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Embroidery
          </h1>

          {/* <!-- ADD BUTTON & SEARCH BAR --> */}
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={openModal}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoAdd size={22} className="text-white" />
            </button>

            <div className="search_bar relative mt-4 md:mt-0">
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
                placeholder="Search by Party Name"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
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
          <>
            <div className="relative overflow-x-auto mt-5 ">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium" scope="col">
                      S # No
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      Party Name
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      Design No
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      Date
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      Quantity
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      Status
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <th
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        {index + 1}
                      </th>
                      <td className="px-6 py-4">{data.partyName}</td>
                      <td className="px-6 py-4">{data.design_no}</td>
                      <td className="px-6 py-4">{data.date}</td>
                      <td className="px-6 py-4">{data.quantity} Suit</td>
                      <td className="px-6 py-4">{data.project_status}</td>
                      <td className="pl-10 py-4">
                        <Link to={`/dashboard/embroidery-details/${data.id}`}>
                          <FaEye size={20} className="cursor-pointer" />
                        </Link>
                      </td>
                    </tr>
            ))) : (
              <tr className="w-full flex justify-center items-center">
                  <td className='text-xl mt-3'>No Data Available</td>
              </tr>
          )}


                </tbody>
              </table>
            </div>

            <nav
              className="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4"
              aria-label="Table navigation"
            >
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Previous
                  </button>
                </li>
                {[...Array(embroidery.totalPages)].map((_, pageIndex) => (
                  <li key={pageIndex}>
                    <button
                      onClick={() => setCurrentPage(pageIndex + 1)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight ${
                        currentPage === pageIndex + 1
                          ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === embroidery.totalPages}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </section>

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-6xl bg-white rounded-md shadow dark:bg-gray-700 max-h-screen overflow-y-auto">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Enter Embroidery Bill And Details
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
              <div className="space-y-4">
                {/* INPUT FIELDS DETAILS */}
                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                  {/* FIRST ROW */}
                  <div>
                    <input
                      name="partyName"
                      type="text"
                      placeholder="Party Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.partyName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="serial_No"
                      type="text"
                      placeholder="Serial No"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.serial_No}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="date"
                      type="date"
                      placeholder="Date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      name="design_no"
                      type="text"
                      placeholder="Design No"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.design_no}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* SECOND ROW */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Front_Stitch.value"
                      type="number"
                      placeholder="Front Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Front_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Front_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Front_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Back_Stitch.value"
                      type="number"
                      placeholder="Back Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Back_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Back_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Back_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Bazo_Stitch.value"
                      type="number"
                      placeholder="Bazu Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Bazo_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Bazo_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Bazo_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Gala_Stitch.value"
                      type="number"
                      placeholder="Gala Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Gala_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Gala_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Gala_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* THIRD ROW */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="D_Patch_Stitch.value"
                      type="number"
                      placeholder="Dupatta Patch Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.D_Patch_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="D_Patch_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.D_Patch_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Pallu_Stitch.value"
                      type="number"
                      placeholder="Pallu Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Pallu_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Pallu_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Pallu_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="F_Patch_Stitch.value"
                      type="number"
                      placeholder="Front Patch Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.F_Patch_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="F_Patch_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.F_Patch_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* FORTH ROW */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Trouser_Stitch.value"
                      type="number"
                      placeholder="Trouser Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Trouser_Stitch.value}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Trouser_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Trouser_Stitch.head}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <input
                      name="rATE_per_stitching"
                      type="number"
                      placeholder="Rate Per Stitch"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.rATE_per_stitching}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <input
                      name="per_suit"
                      type="number"
                      placeholder="Rate Per Suit"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.per_suit}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>

                {/* SUIT DESCRIPION */}

                <Box formData1={formData} setFormData1={setFormData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Embroidery;
