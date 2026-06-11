import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import {
  deleteCalenderAsync,
  GetAllCalender,
} from "../../../features/CalenderSlice";
import DeleteModal from "../../../Component/Modal/DeleteModal";
import { MdOutlineDelete } from "react-icons/md";
import ProcessFilters from "../../../Component/ProcessFilters/ProcessFilters";
import Pagination from "../../../Component/Common/Pagination";
import { getPageLimit } from "../../../Utils/Common";

const Calendar = () => {
  const dispatch = useDispatch();
  const { loading, Calender, deleteLoading } = useSelector(
    (state) => state.Calender
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);
  const [filters, setFilters] = useState(null);

  const filteredCalender = Calender?.data;
  useEffect(() => {
    dispatch(GetAllCalender({ filters, page, limit }));
  }, [dispatch, filters, page, limit]);


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
    dispatch(deleteCalenderAsync({ id: selectedId })).then((res) => {
      if (res.payload.success === true) {
        dispatch(GetAllCalender({ filters, page, limit }));
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
        <div className="header flex justify-between items-center mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Calendar
          </h1>
          {/* SEARCH FILTERS */}
          <ProcessFilters
            handlers={{ dispatchFunction: GetAllCalender, liftUpFiltersData }}
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
                    <th className="px-6 py-3 font-medium" scope="col">
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
                      Quantity
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
                  {filteredCalender && filteredCalender.length > 0 ? (
                    filteredCalender?.map((entry, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <th
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          scope="row"
                        >
                          <span className="text-red-500">
                            {" "}
                            {entry.serial_No}
                          </span>
                          /
                          <span className="text-green-600">
                            {entry.Manual_No ?? "--"}
                          </span>
                        </th>
                        <td className="px-6 py-4">{entry.partyName}</td>
                        <td className="px-6 py-4">{entry.design_no}</td>
                        <td className="px-6 py-4">{entry.date}</td>
                        <td className="px-6 py-4">{entry.T_Quantity} m</td>
                        <td className="px-6 py-4">
                          {setStatusColor(entry.project_status)}
                        </td>
                        <td className="pl-10 py-4 flex items-center gap-3">
                          <Link to={`/dashboard/calendar-details/${entry.id}`}>
                            <FaEye size={20} className="cursor-pointer" />
                          </Link>
                          {!entry.bill_generated && (
                            <button onClick={() => openDeleteModal(entry.id)}>
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

      <Pagination
        currentPage={page}
        totalPages={Calender?.totalPages}
        totalRecords={Calender?.totalRecords}
        pageSize={limit}
      />
      {/* DELETE MODAL */}
      {deleteModal && (
        <DeleteModal
          title={"Delete Calender"}
          message={"Are you sure want to delete this Calender ?"}
          onClose={closedeleteModal}
          Loading={deleteLoading}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default Calendar;
