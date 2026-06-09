import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { getBuyerForBranchAsync } from "../../features/BuyerSlice";
import BillFilters, {
  emptyBillFilters,
} from "../../Component/BillFilters/BillFilters";
import { buyerStatusOptions } from "../../Utils/Common";

const initialBuyerFilters = {
  ...emptyBillFilters,
  status: "",
};

const PhoneComponent = ({ phone }) => {
  const maskPhoneNumber = (phone) => {
    if (phone.length > 3) {
      return phone.slice(0, 3) + "*******".slice(0, phone.length - 3);
    } else {
      return phone;
    }
  };

  return <p>{maskPhoneNumber(phone)}</p>;
};

const Buyers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialBuyerFilters);
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { user } = useSelector((state) => state.auth);
  const { Branches } = useSelector((state) => state.InStock);
  const { loading, Buyers } = useSelector((state) => state.Buyer);
  const [selectedBranchId, setSelectedBranchId] = useState();

  const getDefaultBranchId = () => user?.user?.branchId || Branches?.[0]?.id;

  const getBuyerPayload = ({
    branchId = selectedBranchId || getDefaultBranchId(),
    pageValue = page,
    filterValues = filters,
  } = {}) => ({
    id: user?.user?.id,
    branchId,
    page: pageValue,
    name: filterValues.name || undefined,
    status: filterValues.status || undefined,
  });

  useEffect(() => {
    if (Branches?.length > 0) {
      const branchId = selectedBranchId || getDefaultBranchId();
      const payload = getBuyerPayload({ branchId, pageValue: page });
      dispatch(getBuyerForBranchAsync(payload));

      setSelectedBranchId(branchId);
    }
  }, [user, dispatch, Branches, page]);

  const filteredData = Buyers?.buyers;

  const renderPaginationLinks = () => {
    const totalPages = Buyers?.totalPages;
    const paginationLinks = [];
    const visiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (startPage > 1) {
      paginationLinks.push(
        <li key="start-ellipsis" className="text-black my-auto">
          .....
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/buyers?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() =>
              dispatch(
                getBuyerForBranchAsync({
                  ...getBuyerPayload({ pageValue: i }),
                })
              )
            }
          >
            {i}
          </Link>
        </li>
      );
    }

    if (endPage < totalPages) {
      paginationLinks.push(
        <li key="end-ellipsis" className="text-black my-auto">
          .....
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

  const handleFiltersSearch = () => {
    dispatch(getBuyerForBranchAsync(getBuyerPayload({ pageValue: 1 })));
    navigate(`/dashboard/buyers?page=${1}`);
  };

  const handleFiltersChange = (nextFilters) => {
    const statusChanged = nextFilters.status !== filters.status;
    const updatedFilters = statusChanged
      ? { ...nextFilters, name: "" }
      : nextFilters;

    setFilters(updatedFilters);

    if (statusChanged) {
      dispatch(
        getBuyerForBranchAsync(
          getBuyerPayload({ pageValue: 1, filterValues: updatedFilters }),
        ),
      );
      navigate(`/dashboard/buyers?page=${1}`);
    }
  };

  const handleResetFilters = () => {
    setFilters(initialBuyerFilters);
    dispatch(
      getBuyerForBranchAsync(
        getBuyerPayload({ pageValue: 1, filterValues: initialBuyerFilters }),
      ),
    );
    navigate(`/dashboard/buyers?page=${1}`);
  };

  const handleBranchFilterChange = (branchId) => {
    const nextBranchId = branchId || getDefaultBranchId();
    setSelectedBranchId(nextBranchId);
    setFilters(initialBuyerFilters);

    const payload = getBuyerPayload({
      branchId: nextBranchId,
      pageValue: 1,
      filterValues: initialBuyerFilters,
    });
    dispatch(getBuyerForBranchAsync(payload));
    navigate(`/dashboard/buyers?page=${1}`);
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "Partially Paid":
        return <span className="text-[#FFC107]">{status}</span>;
      case "Paid":
        return <span className="text-[#2ECC40]">{status}</span>;
      case "Unpaid":
        return <span className="text-red-700">{status}</span>;
      case "Advance Paid":
        return <span className="text-blue-700">{status}</span>;
      default:
        return "";
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Buyers
          </h1>

          {/* <!-- search bar --> */}
          <BillFilters
            filters={filters}
            nameOptions={(Buyers?.buyerNames || []).map((name) => ({
              value: name,
              label: name,
            }))}
            branchOptions={(Branches || []).map((branch) => ({
              value: branch.id,
              label: branch.branchName,
            }))}
            selectedBranch={selectedBranchId}
            statusOptions={buyerStatusOptions}
            showBranchFilter={true}
            showStatusFilter={true}
            showDateFilters={false}
            namePlaceholder="Buyer"
            onChange={handleFiltersChange}
            onBranchChange={handleBranchFilterChange}
            onSearch={handleFiltersSearch}
            onReset={handleResetFilters}
          />
        </div>

        <p className="w-full bg-gray-300 h-px mt-5"></p>

        {/* -------------- TABLE -------------- */}

        <div className="relative overflow-x-auto mt-5 ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  <span className="text-red-500">S.N</span>-
                  <span className="text-green-600">A.S.N</span>
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Party Name
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  City
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Credit
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Debit
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Balance
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Status
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  Details
                </th>
                <th className="px-6 py-4 text-md font-medium" scope="col">
                  New Bill
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={8}>
                    <div className="min-h-[50vh] flex justify-center items-center">
                      <div
                        className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                        role="status"
                        aria-label="loading"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <td className="px-6 py-4  font-medium">
                        <span className="text-red-500">
                          {" "}
                          {data.serialNumber}
                        </span>
                        -<span className="text-green-600">{data.autoSN}</span>
                      </td>
                      <th
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        <p>{data.name}</p>
                        <PhoneComponent phone={data.phone} />
                      </th>
                      <td className="px-6 py-4 font-medium">{data.city}</td>
                      <td className="px-6 py-4 font-medium">
                        {data.virtual_account.total_credit} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.virtual_account.total_debit} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.virtual_account.total_balance} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {setStatusColor(data.virtual_account.status)}
                      </td>
                      <td className="pl-10 py-4">
                        <Link
                          onClick={() => window.scrollTo(0, 0)}
                          to={`/dashboard/buyers-details/${data.id}`}
                        >
                          <FaEye size={20} className="cursor-pointer" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <Link
                          to={`/dashboard/old-buyer-generate-bill/${data.id}`}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          <TfiWrite className="cursor-pointer" size={20} />
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
            )}
          </table>
        </div>
      </section>

      {/* -------- PAGINATION -------- */}
      {Buyers?.totalPages && Buyers?.totalPages !== 1 ? (
        <section className="flex justify-center">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
              <li>
                {Buyers?.page > 1 ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/buyers?page=${page - 1}`}
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
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 dark:bg-gray-700 dark:text-gray-400 rounded-s-lg cursor-not-allowed"
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
                {Buyers?.totalPages !== page ? (
                  <Link
                    onClick={ToDown}
                    to={`/dashboard/buyers?page=${page + 1}`}
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
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-700 dark:text-gray-400 rounded-e-lg cursor-not-allowed"
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
      ) : null}
    </>
  );
};

export default Buyers;
