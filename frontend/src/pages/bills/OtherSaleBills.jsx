import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getAllOtherSaleBillsAsync } from "../../features/OtherSale";
import Pagination from "../../Component/Common/Pagination";
import { formatReadableDate, getPageLimit } from "../../Utils/Common";

const OtherSaleBills = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);
  const { otherSaleBillsLoading, otherSaleBills } = useSelector(
    (state) => state.OtherBills
  );
  useEffect(() => {
    const payload = {
      page,
      limit,
    };
    dispatch(getAllOtherSaleBillsAsync(payload));
  }, [page, limit]);


  const searchTimerRef = useRef();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const payload = {
      search: value.length > 0 ? value : undefined,
    };
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      dispatch(getAllOtherSaleBillsAsync(payload));
    }, 1000);
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl lg:text-3xl font-medium">
            Other Sale Bills
          </h1>

          {/* <!-- search bar --> */}
          <div className="search_bar flex items-center gap-3 mr-2">
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
                placeholder="Search by name"
                value={search}
                onChange={(e) => handleSearch(e)}
              />
            </div>
          </div>
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABLE -------------- */}

        {otherSaleBillsLoading ? (
          <div className="min-h-[90vh] flex justify-center items-center">
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
            <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-2 text-base py-2" scope="col">
                    Sr.
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Party Name
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Amount
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    City
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Cargo
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Phone
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Date
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Bill By
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Payment Method
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Quantity
                  </th>
                  <th className="px-2 text-base py-2" scope="col">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {otherSaleBills && otherSaleBills?.data?.length > 0 ? (
                  otherSaleBills?.data?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-2 py-2">{index + 1}</td>
                      <td className="px-2 py-2">{data.name}</td>
                      <td className="px-2 py-2">{data.amount} Rs</td>
                      <td className="px-2 py-2">{data.city}</td>
                      <td className="px-2 py-2">{data.cargo}</td>
                      <td className="px-2 py-2">{data.phone}</td>
                      <td className="px-2 py-2">{formatReadableDate(data.date)}</td>
                      <td className="px-2 py-2">{data.bill_by}</td>
                      <td className="px-2 py-2">{data.payment_Method}</td>
                      <td className="px-2 py-2">{data.quantity}</td>
                      <td className="px-2 py-2 max-w-[200px] ">{data.note}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="w-full flex justify-center items-center">
                    <td className="text-sm mt-3">No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Pagination
        currentPage={page}
        totalPages={otherSaleBills?.totalPages}
        totalRecords={otherSaleBills?.totalRecords}
        pageSize={limit}
      />
    </>
  );
};

export default OtherSaleBills;
