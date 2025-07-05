import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import { useDispatch } from "react-redux";

const ProcessFilters = ({handlers}) => {
  const {dispatchFunction,liftUpFiltersData} = handlers;
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    Manual_No: "",
    partyName: "",
    project_status: "",
  });
  const handleChangeFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFiltersSearch = () => {
    dispatch(dispatchFunction({ filters, page: 1 }));
    liftUpFiltersData(filters)
  };

  const handleResetFilters = () => {
    setFilters({
      Manual_No: "",
      partyName: "",
      project_status: "",
    });
    dispatch(dispatchFunction({ page: 1 }));
  };

  return (
    <div className="flex items-center gap-3 justify-center">
      {/* STATUS */}
      <select
        id="project_status"
        name="project_status"
        className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        value={filters.project_status}
        onChange={handleChangeFilters}
      >
        <option value="" disabled>
          Choose Status
        </option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>

      {/* Party Name */}
      <input
        name="partyName"
        type="text"
        className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        placeholder="Party Name"
        value={filters.partyName}
        onChange={handleChangeFilters}
      />

      {/* Manual Number */}
      <input
        name="Manual_No"
        type="text"
        className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        placeholder="Manual Number"
        value={filters.Manual_No}
        onChange={handleChangeFilters}
      />

      {/* SEARCH BUTTON */}
      <button
        onClick={handleFiltersSearch}
        type="button"
        className="flex items-center gap-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      >
        <CiSearch size={20} className="cursor-pointer" />
        Search
      </button>
      {/* RESET BUTTON */}
      <button
        onClick={handleResetFilters}
        className="flex items-center gap-2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      >
        <GrPowerReset size={20} className="cursor-pointer" />
        Reset
      </button>
    </div>
  );
};

export default ProcessFilters;
