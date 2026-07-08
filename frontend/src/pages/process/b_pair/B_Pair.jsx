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
import Pagination from "../../../Component/Common/Pagination";
import { buildPaginationQuery, formatReadableDate, getPageLimit } from "../../../Utils/Common";

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
  const limit = getPageLimit(searchParams);
  const [deleteModal, setDeleteModal] = useState(false);

  const payload = {
    search,
    page,
    limit,
    category: selectedCategory,
  };

  useEffect(() => {
    dispatch(getbPairDataAsync(payload));
  }, [dispatch, page, limit]);

  const handleTabClick = (category) => {
    setSelectedCategory(category);
    setSearch("");

    const payload = {
      category: category,
      page: 1,
      limit,
    };
    dispatch(getbPairDataAsync(payload));
    navigate(`/dashboard/bpair${buildPaginationQuery(searchParams, { page: 1, limit })}`);
  };

  useEffect(() => {
    const payload = {
      search,
      category: selectedCategory,
      page: 1,
      limit,
    };
    dispatch(getbPairDataAsync(payload));
    navigate(`/dashboard/bpair${buildPaginationQuery(searchParams, { page: 1, limit })}`);
  }, [search, dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
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
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl lg:text-3xl font-medium">
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
          <div className="tabs_button flex flex-wrap gap-1">
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
              <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    S # No
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Party Name
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Design No
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Date
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Quantity
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Sold Quantity
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Rate
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
                    Status
                  </th>
                  <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-xs md:text-sm font-medium" scope="col">
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
                        className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        {data?.serial_No}
                      </th>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.partyName}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.design_no}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{formatReadableDate(data?.date)}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.quantity}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.sold_quantity}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">{data?.rate}</td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm">
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

      <Pagination
        currentPage={page}
        totalPages={B_pairData?.totalPages}
        totalRecords={B_pairData?.totalRecords}
        pageSize={limit}
      />

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
