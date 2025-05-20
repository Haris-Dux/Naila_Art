import React, { useEffect, useState } from "react";
import { FaCartPlus, FaEye } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteBpairAsync,
  getbPairDataAsync,
} from "../../../features/B_pairSlice";
import Sale_Modal from "./Sale_Modal";
import SaleHistoryModal from "./SaleHistoryModal";
import { MdOutlineDelete } from "react-icons/md";
import DeleteModal from "../../../Component/Modal/DeleteModal";

const B_Pair = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { B_pairDataLoading, B_pairData, deleteLoadings } = useSelector(
    (state) => state.B_Pair
  );

  const [selectedCategory, setSelectedCategory] = useState("Embroidery");

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [OpenSaleModal, setOpenSaleModal] = useState(false);
  const [saleHistoryData, setSaleHistoryData] = useState([]);
  const [bppairId, setBppairId] = useState("");
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || 1, 10);
  const [deleteModal, setDeleteModal] = useState(false);

  const payload = {
    search,
    page,
    category: selectedCategory,
  };

  useEffect(() => {
    dispatch(getbPairDataAsync(payload));
  }, [dispatch, page]);

  const handleTabClick = (category) => {
    setSelectedCategory(category);
    setSearch("");

    const payload = {
      category: category,
      page: 1,
    };
    dispatch(getbPairDataAsync(payload));
    navigate(`/dashboard/bpair?page=1`);
  };

  useEffect(() => {
    const payload = {
      search,
      category: selectedCategory,
      page: 1,
    };
    dispatch(getbPairDataAsync(payload));
    navigate(`/dashboard/bpair?page=1`);
  }, [search, dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const renderPaginationLinks = () => {
    const totalPages = B_pairData?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/bpair?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() =>
              dispatch(
                getbPairDataAsync({
                  search,
                  category: selectedCategory,
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

  const setStatusColor = (status) => {
    switch (status) {
      case "Sold":
        return <span className="text-[#2ECC40]">{status}</span>;
      case "UnSold":
        return <span className="text-red-700">{status}</span>;
      case "Partially Sold":
        return <span className="text-[#FFC107]">{status}</span>;
      default:
        return "No Status";
    }
  };

  const openModal = (id) => {
    setIsOpen(true);
    setBppairId(id);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openSaleHistoryModal = (data) => {
    setOpenSaleModal(true);
    setSaleHistoryData(data);
  };

  const closeSaleHistoryModal = () => {
    setOpenSaleModal(false);
    setSaleHistoryData([]);
  };

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setBppairId(id);
  };

  const closedeleteModal = () => {
    setDeleteModal(false);
  };

  const handleDelete = () => {
    dispatch(DeleteBpairAsync({ id: bppairId })).then((res) => {
      if (res.payload.success === true) {
        setDeleteModal(false);
        dispatch(getbPairDataAsync(payload));
      }
    });
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            B Pair
          </h1>

          {/* <!-- search bar --> */}
          <div className="search_bar mr-2">
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
                placeholder="Search by Name or D No"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABS -------------- */}
        <div className="tabs flex justify-between items-center my-5">
          <div className="tabs_button">
            {["Embroidery", "Calender", "Cutting", "Stone", "Stitching"]?.map(
              (category) => (
                <button
                  key={category}
                  className={`border border-gray-500  text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md ${
                    selectedCategory === category
                      ? "bg-gray-800 text-white dark:bg-gray-600  dark:text-white"
                      : ""
                  }`}
                  onClick={() => handleTabClick(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* -------------- TABLE -------------- */}
        {B_pairDataLoading ? (
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
                    Sold Quantity
                  </th>
                  <th className="px-6 py-3 font-medium" scope="col">
                    Rate
                  </th>
                  <th className="px-6 py-3 font-medium" scope="col">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {B_pairData && B_pairData?.data?.length > 0 ? (
                  B_pairData?.data?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <th
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        {data?.serial_No}
                      </th>
                      <td className="px-6 py-4">{data?.partyName}</td>
                      <td className="px-6 py-4">{data?.design_no}</td>
                      <td className="px-6 py-4">{data?.date}</td>
                      <td className="px-6 py-4">{data?.quantity}</td>
                      <td className="px-6 py-4">{data?.sold_quantity}</td>
                      <td className="px-6 py-4">{data?.rate}</td>
                      <td className="px-6 py-4">
                        {setStatusColor(data?.status)}
                      </td>
                      <td className="pl-8 py-4 flex gap-3">
                        {data?.status !== "Sold" && (
                          <Link onClick={() => openModal(data.id)}>
                            <FaCartPlus size={20} className="cursor-pointer" />
                          </Link>
                        )}

                        {data?.status !== "UnSold" && (
                          <Link onClick={() => openSaleHistoryModal(data)}>
                            <FaEye size={20} className="cursor-pointer" />
                          </Link>
                        )}
                        {data?.status === "UnSold" && (
                          <button onClick={() => openDeleteModal(data?.id)}>
                            <MdOutlineDelete
                              size={20}
                              className="cursor-pointer text-red-500"
                            />
                          </button>
                        )}
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
      <section className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {B_pairData?.page > 1 ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/bpair?page=${page - 1}`}
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
              {B_pairData?.totalPages !== page ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/bpair?page=${page + 1}`}
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
      </section>

      {/* SALE MODAL */}
      {isOpen && (
        <Sale_Modal
          selectedCategory={selectedCategory}
          page={page}
          search={search}
          closeModal={closeModal}
          id={bppairId}
        />
      )}
      {/* HIATORY MODAL */}
      {OpenSaleModal && (
        <SaleHistoryModal
          data={saleHistoryData}
          selectedCategory={selectedCategory}
          page={page}
          search={search}
          closeModal={closeSaleHistoryModal}
        />
      )}
      {/* DELETE MODAL */}
      {deleteModal && (
        <DeleteModal
          title={"Delete B Pair"}
          message={"Are you sure want to delete this B Pair ?"}
          onClose={closedeleteModal}
          Loading={deleteLoadings}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default B_Pair;
