import { useState, useEffect } from "react";
// import data from './SuitsStockData';
import { FiPlus } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Box from "../../../Component/Embodiary/Box";
import { GETEmbroidery } from "../../../features/EmbroiderySlice";
import { useDispatch } from "react-redux";


const Embroidery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown1, setdropdown1] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { loading, embroidery } = useSelector((state) => state.Embroidery);
  const [search, setSearch] = useState();

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  console.log('embroidery', embroidery);

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
    project_status: "Pending",
   
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    dispatch(GETEmbroidery({ search, page }));
  }, [page, dispatch]);

  const calculateTotal = (formData1) => {
    const rate = parseFloat(formData1.rATE_per_stitching) || 450;
    const stitches = [
      { value: formData1.Front_Stitch.value, head: formData1.Front_Stitch.head },
      { value: formData1.Bazo_Stitch.value, head: formData1.Bazo_Stitch.head },
      { value: formData1.Gala_Stitch.value, head: formData1.Gala_Stitch.head },
      { value: formData1.Back_Stitch.value, head: formData1.Back_Stitch.head },
      { value: formData1.Pallu_Stitch.value, head: formData1.Pallu_Stitch.head },
      { value: formData1.Trouser_Stitch.value, head: formData1.Trouser_Stitch.head },
      { value: formData1.D_Patch_Stitch.value, head: formData1.D_Patch_Stitch.head },
      { value: formData1.F_Patch_Stitch.value, head: formData1.F_Patch_Stitch.head },
    ];

    const total = stitches.reduce((sum, stitch) => {
      const value = parseFloat(stitch.value) || 0;
      const head = parseFloat(stitch.head) || 0;
      const stitchTotal = (value / 1000) * rate * head;
      return sum + stitchTotal;
    }, 0);

    return total;
  };
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value === "") {
      dispatch(GETEmbroidery({ page }));
    } else {
      dispatch(GETEmbroidery({ search: value, page: 1 }));
    }
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


    setTotal(calculateTotal(formData));
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const filteredData = searchText ? embroidery?.data?.filter((item) =>
    item.partyName.toLowerCase().includes(searchText.toLowerCase())
  )
    : embroidery?.data;


  const renderPaginationLinks = () => {
    const totalPages = embroidery?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/embroidery?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
              }`}
            onClick={() => dispatch(GETEmbroidery({ page: i }))}
          >
            {i}
          </Link>
        </li >
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

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
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
                placeholder="Search by party name"
                value={search}
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
                        <td className="px-6 py-4">{new Date(data.date).toLocaleDateString()}</td>
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
          </>
        )}
      </section >

      {/* -------- PAGINATION -------- */}
      <section section className="flex justify-center" >
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {embroidery?.page > 1 ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/embroidery ? page = ${page - 1}`}
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
              {embroidery?.totalPages !== page ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/embroidery ? page = ${page + 1}`}
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
          </ul >
        </nav >
      </section >

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
                      value={formData.Front_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Front_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Front_Stitch.head || ""}

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
                      value={formData.Back_Stitch.value || ""}

                      onChange={handleInputChange}
                    />
                    <input
                      name="Back_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Back_Stitch.head || ""} 

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
                      value={formData.Bazo_Stitch.value || ""}

                      onChange={handleInputChange}
                    />
                    <input
                      name="Bazo_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Bazo_Stitch.head || ""}

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
                      value={formData.Gala_Stitch.value || ""}

                      onChange={handleInputChange}
                    />
                    <input
                      name="Gala_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Gala_Stitch.head || ""}

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
                      value={formData.D_Patch_Stitch.value || ""}

                      onChange={handleInputChange}
                    />
                    <input
                      name="D_Patch_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.D_Patch_Stitch.head || ""}

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
                      value={formData.Pallu_Stitch.value || ""}

                      onChange={handleInputChange}
                    />
                    <input
                      name="Pallu_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Pallu_Stitch.head || ""}

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
                      value={formData.F_Patch_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="F_Patch_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.F_Patch_Stitch.head || ""}
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
                      value={formData.Trouser_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Trouser_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.Trouser_Stitch.head || ""}
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
                      value={formData.rATE_per_stitching || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                  
                      <input
        type="text"
        value={total.toFixed(2)}
        readOnly
          name="per_suit"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          
      />
                  </div>
                </div>

                {/* SUIT DESCRIPION */}

                <Box formData1={formData} setFormData1={setFormData} closeModal={closeModal} total={total} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Embroidery;