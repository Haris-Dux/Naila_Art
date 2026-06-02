import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  GetAllProcessBillAsync,
  GetAllPictureAccountsAsync,
} from "../../features/ProcessBillSlice";
import { useDispatch, useSelector } from "react-redux";
import BillFilters, {
  emptyBillFilters,
} from "../../Component/BillFilters/BillFilters";

const processCategories = [
  "Embroidery",
  "Calender",
  "Cutting",
  "Stone",
  "Stitching",
  "Pictures",
];

const ProcessBills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Embroidery");

  const [filters, setFilters] = useState(emptyBillFilters);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { loading, ProcessBills } = useSelector((state) => state.ProcessBill);

  useEffect(() => {
    const payload = {
      page: 1,
      category: selectedCategory || null,
    };
    dispatch(GetAllProcessBillAsync(payload));
  }, [dispatch]);

  const fetchProcessBills = ({
    category = selectedCategory,
    pageValue = page,
    filterValues = filters,
  } = {}) => {
    const payload = {
      page: pageValue,
      search: filterValues.search || undefined,
      dateFrom: filterValues.dateFrom || undefined,
      dateTo: filterValues.dateTo || undefined,
    };

    if (category === "Pictures") {
      dispatch(GetAllPictureAccountsAsync(payload));
    } else {
      dispatch(GetAllProcessBillAsync({ ...payload, category }));
    }
  };


  const handleCategoryFilterChange = (category) => {
    const nextCategory = category || "Embroidery";
    setSelectedCategory(nextCategory);
    setFilters(emptyBillFilters);
    fetchProcessBills({
      category: nextCategory,
      pageValue: 1,
      filterValues: emptyBillFilters,
    });
    navigate(`/dashboard/processbills?page=1`);
  };

  const handleFiltersSearch = () => {
    fetchProcessBills({ pageValue: 1 });
    navigate(`/dashboard/processbills?page=1`);
  };

  const handleResetFilters = () => {
    setFilters(emptyBillFilters);
    fetchProcessBills({ pageValue: 1, filterValues: emptyBillFilters });
    navigate(`/dashboard/processbills?page=1`);
  };

  const renderPaginationLinks = () => {
    const totalPages = ProcessBills?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/processbills?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() =>
              fetchProcessBills({ pageValue: i })
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
      case "Paid":
        return <span className="text-[#2ECC40]">{status}</span>;
      case "Unpaid":
        return <span className="text-red-700">{status}</span>;
      case "Advance Paid":
        return <span className="text-blue-700">{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Process Bills
          </h1>

          <BillFilters
            filters={filters}
            nameOptions={(ProcessBills?.partyNames || []).map((name) => ({
              value: name,
              label: name,
            }))}
            categoryOptions={processCategories.map((category) => ({
              value: category,
              label: category,
            }))}
            selectedCategory={selectedCategory}
            showCategoryFilter={true}
            namePlaceholder="Party Name"
            onChange={setFilters}
            onCategoryChange={handleCategoryFilterChange}
            onSearch={handleFiltersSearch}
            onReset={handleResetFilters}
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
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium" scope="col">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {ProcessBills && ProcessBills?.processBills?.length > 0 ? (
                  ProcessBills?.processBills?.map((data, index) => (
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
                      <td className="px-6 py-4">
                        {setStatusColor(data?.virtual_account?.status)}
                      </td>
                      <td className="pl-10 py-4">
                        <Link
                          to={`/dashboard/process-details/${data?.id}/${selectedCategory}`}
                        >
                          <FaEye size={20} className="cursor-pointer" />
                        </Link>
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
              {ProcessBills?.page > 1 ? (
                <Link
                  onClick={() => {
                    ToDown();
                    fetchProcessBills({ pageValue: page - 1 });
                  }}
                  to={`/dashboard/processbills?page=${page - 1}`}
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
              {ProcessBills?.totalPages !== page ? (
                <Link
                  onClick={() => {
                    ToDown();
                    fetchProcessBills({ pageValue: page + 1 });
                  }}
                  to={`/dashboard/processbills?page=${page + 1}`}
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
    </>
  );
};

export default ProcessBills;
