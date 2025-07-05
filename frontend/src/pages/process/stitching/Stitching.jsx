import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  deleteStitchingAsync,
  GetAllStitching,
} from "../../../features/stitching";
import { MdOutlineDelete } from "react-icons/md";
import DeleteModal from "../../../Component/Modal/DeleteModal";
import { LuPackageCheck } from "react-icons/lu";
import ProcessFilters from "../../../Component/ProcessFilters/ProcessFilters";

const Stitching = () => {
  const dispatch = useDispatch();
  const { Stitching, loading, deleteloadings } = useSelector(
    (state) => state.stitching
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const page = Stitching?.page || "1";
    const [filters, setFilters] = useState(null)
  

  useEffect(() => {
    dispatch(GetAllStitching({ filters,page }));
  }, [dispatch]);

  const filteredData = Stitching?.data;
  const renderPaginationLinks = () => {
    const totalPages = Stitching?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            onClick={() => dispatch(GetAllStitching({ filters, page: i }))}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === Number(page) ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const ToDown = (value) => {
    if (value === "+") {
      dispatch(GetAllStitching({ filters, page: parseInt(page) + 1 }));
    } else if (value === "-") {
      dispatch(GetAllStitching({ filters, page: parseInt(page) - 1 }));
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const setStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return <span className="text-[#FFC107]">{status}</span>;
      case "Completed":
        return <span className="text-[#2ECC40]">{status}</span>;
      default:
        return "";
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSelectedId(id);
  };

  const closedeleteModal = () => {
    setDeleteModal(false);
  };

  const handleDelete = () => {
    dispatch(deleteStitchingAsync({ id: selectedId })).then((res) => {
      if (res.payload.success === true) {
        dispatch(GetAllStitching({ page: page }));
        closedeleteModal();
      }
    });
  };

   const liftUpFiltersData = (data) => {
    setFilters(data);
  };


  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[80vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Stitching
          </h1>

          {/* SEARCH FILTERS */}
          <ProcessFilters
            handlers={{ dispatchFunction: GetAllStitching, liftUpFiltersData }}
          />
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
          <>
            <div className="relative overflow-x-auto mt-5 ">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th
                      className="px-6 py-3 font-medium text-center"
                      scope="col"
                    >
                      <span className="text-red-500">S.N</span>/
                      <span className="text-green-600">M.N</span>
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
                      T Quantity
                    </th>
                    <th className="px-6 py-3 font-medium" scope="col">
                      R Quantity
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
                  {filteredData && filteredData?.length > 0 ? (
                    filteredData?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <th
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          scope="row"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-green-500">
                              {data?.packed && <LuPackageCheck size={20} />}
                            </span>
                            <div>
                              <span className="text-red-500">
                                {" "}
                                {data?.serial_No}
                              </span>
                              /
                              <span className="text-green-600">
                                {data?.Manual_No ?? "--"}
                              </span>
                            </div>
                          </div>
                        </th>
                        <td className="px-6 py-4">{data.partyName}</td>
                        <td className="px-6 py-4">{data.design_no}</td>
                        <td className="px-6 py-4">
                          {new Date(data.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{data.Quantity} suit</td>
                        <td className="px-6 py-4">
                          {data.r_quantity ? `${data.r_quantity} suit` : "--"}
                        </td>
                        <td className=" px-6 py-4">
                          {setStatusColor(data.project_status)}
                        </td>
                        <td className="pl-8 py-4 flex gap-3">
                          <Link to={`/dashboard/stitching-details/${data.id}`}>
                            <FaEye size={20} className="cursor-pointer" />
                          </Link>
                          {!data.bill_generated && (
                            <button onClick={() => openDeleteModal(data.id)}>
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
          </>
        )}
      </section>

      {/* -------- PAGINATION -------- */}
      <section className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {Stitching?.page > 1 ? (
                <Link
                  onClick={() => ToDown('-')}
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
              {Stitching?.totalPages !==Number(page) ? (
                <Link
                   onClick={() => ToDown('+')}
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
      {/* DELETE MODAL */}
      {deleteModal && (
        <DeleteModal
          title={"Delete Stitching"}
          message={"Are you sure want to delete this Stitching ?"}
          onClose={closedeleteModal}
          Loading={deleteloadings}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default Stitching;
