import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";
import {
  deleteBuyerBillAsync,
  getBuyerBillsHistoryForBranchAsync,
  getBuyerByIdAsync,
} from "../../features/BuyerSlice";
import Return from "./Modals/Return";
import { IoDocumentTextOutline } from "react-icons/io5";
import Icon from "../../Component/Common/Icons";
import DeleteModal from "../../Component/Modal/DeleteModal";
import BillFilters, {
  emptyBillFilters,
} from "../../Component/BillFilters/BillFilters";
import Pagination from "../../Component/Common/Pagination";
import { buildPaginationQuery, getPageLimit } from "../../Utils/Common";

const NailaArtsBuyer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [otherBillModal, setOthebillNodal] = useState(false);
  const [returnModal, setreturnModal] = useState(false);
  const [selected, setselected] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [filters, setFilters] = useState(emptyBillFilters);
  const [suitSaleData, setSuitSaleData] = useState("");
  const [otherBillData, setOtherBillData] = useState("");

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = getPageLimit(searchParams);

  const { user } = useSelector((state) => state.auth);
  const { loading: branchesLoading, Branches } = useSelector(
    (state) => state.InStock
  );
  const { BuyerBillHistory, billHistoryLoading, BuyerById, deleteBillLoading } = useSelector(
    (state) => state.Buyer
  );
  const [selectedBranchId, setSelectedBranchId] = useState();

  const getDefaultBranchId = () => user?.user?.branchId || Branches?.[0]?.id;

  const getBillPayload = ({
    branchId = selectedBranchId || getDefaultBranchId(),
    pageValue = page,
    filterValues = filters,
  } = {}) => ({
    id: branchId,
    page: pageValue,
    limit,
    name: filterValues.name || undefined,
    city: filterValues.city || undefined,
    dateFrom: filterValues.dateFrom || undefined,
    dateTo: filterValues.dateTo || undefined,
  });


  useEffect(() => {
    if (selected) {
      dispatch(getBuyerByIdAsync({ id: selected?.buyerId }));
    }
  }, [selected]);

  useEffect(() => {
    if (Branches?.length > 0) {
      const branchId = selectedBranchId || getDefaultBranchId();
      const payload = getBillPayload({ branchId, pageValue: page });
      dispatch(getBuyerBillsHistoryForBranchAsync(payload));

      setSelectedBranchId(branchId);
    }
  }, [user, dispatch, Branches, page, limit]);



  const openModal = (data) => {
    setSuitSaleData(data);
    setIsOpen(true);
  };

  const openOtheBillMOdal = (data) => {
    setOtherBillData(data);
    setOthebillNodal(true);
  };

  const closeModal = () => {
    setSuitSaleData("");
    setOtherBillData("");
    setIsOpen(false);
    setOthebillNodal(false);
  };

  const openReturnModal = (data) => {
    setselected(data);
    setreturnModal(true);
    document.body.style.overflow = "hidden";
  };
  const closeReturnModal = () => {
    setselected("");
    setreturnModal(false);
    document.body.style.overflow = "auto";
  };

  const handleFiltersSearch = () => {
    dispatch(getBuyerBillsHistoryForBranchAsync(getBillPayload({ pageValue: 1 })));
    navigate(`/dashboard/naila-arts-buyer${buildPaginationQuery(searchParams, { page: 1, limit })}`);
  };

  const handleResetFilters = () => {
    setFilters(emptyBillFilters);
    dispatch(
      getBuyerBillsHistoryForBranchAsync(
        getBillPayload({ pageValue: 1, filterValues: emptyBillFilters }),
      ),
    );
    navigate(`/dashboard/naila-arts-buyer${buildPaginationQuery(searchParams, { page: 1, limit })}`);
  };

  const handleFilterBranchChange = (branchId) => {
    const nextBranchId = branchId || getDefaultBranchId();
    setSelectedBranchId(nextBranchId);
    setFilters(emptyBillFilters);
    dispatch(
      getBuyerBillsHistoryForBranchAsync(
        getBillPayload({
          branchId: nextBranchId,
          pageValue: 1,
          filterValues: emptyBillFilters,
        }),
      ),
    );
    navigate(`/dashboard/naila-arts-buyer${buildPaginationQuery(searchParams, { page: 1, limit })}`);
  };

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setToDelete(id);
    document.body.style.overflow = "hidden";
  };
  
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setToDelete(null);
    document.body.style.overflow = "auto";
  };

  const handleDeleteBill = () => {
    dispatch(deleteBuyerBillAsync(toDelete)).then((res) => {
      if(res.payload.succes){
        const payload = getBillPayload();
      closeDeleteModal();
      dispatch(getBuyerBillsHistoryForBranchAsync(payload));
      }
    })
  }

  return (
    <>

        <>
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-2 px-2 md:mx-4 md:px-4 lg:mx-6 lg:px-5 py-6 min-h-[70vh] rounded-lg">
  

            {/* -------------- HEADER -------------- */}
            <div className="header flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-6 mx-2">
              <h1 className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl lg:text-3xl font-medium">
                Buyers Bills
              </h1>

              {/* <!-- search bar --> */}
              <div className="search_bar flex flex-wrap items-center justify-end gap-3 mr-2">
 
                <BillFilters
                  filters={filters}
                  nameOptions={(BuyerBillHistory?.buyerNames || []).map((name) => ({
                    value: name,
                    label: name,
                  }))}
                  cityOptions={(BuyerBillHistory?.buyerCities || []).map((city) => ({
                    value: city,
                    label: city,
                  }))}
                  branchOptions={(Branches || []).map((branch) => ({
                    value: branch.id,
                    label: branch.branchName,
                  }))}
                  selectedBranch={selectedBranchId}
                  showBranchFilter={true}
                  showCityFilter={true}
                  namePlaceholder="Buyer"
                  onChange={setFilters}
                  onBranchChange={handleFilterBranchChange}
                  onSearch={handleFiltersSearch}
                  onReset={handleResetFilters}
                />
                             <Link
                  className=" bg-[#374151] hover:bg-gray-500 text-white px-3 py-2 rounded-md"
                  to={"/dashboard/naila-arts-return-bills"}
                >
                  Return Bills
                </Link>
              </div>
            </div>

            <p className="w-full bg-gray-300 h-px mt-5"></p>

            {/* -------------- TABLE -------------- */}
      {billHistoryLoading || branchesLoading ? (
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      <span className="text-red-500">S.N</span>-
                      <span className="text-green-600">A.S.N</span>
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Party Name
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      City
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                     Method
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Total
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Paid
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Remaining
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Profit
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Date
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Details
                    </th>
                    <th className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-xs md:text-sm font-medium" scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BuyerBillHistory && BuyerBillHistory?.data?.length > 0 ? (
                    BuyerBillHistory?.data?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          <span className="text-red-500">
                            {" "}
                            {data.serialNumber}
                          </span>
                          -<span className="text-green-600">{data.autoSN}</span>
                        </td>
                        <th
                          className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-gray-900 text-xs md:text-sm"
                         
                        >
                          <p>{data.name}</p>
                          {data.phone} 
                        </th>
                          <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.city ?? "--"} 
                        </td>
                          <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.payment_Method ?? "--"} 
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.total} Rs
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.paid} Rs
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.remaining} Rs
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">
                          {data.TotalProfit} Rs
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 font-medium text-xs md:text-sm">{data.date}</td>
                        <td className="pl-4 md:pl-6 lg:pl-10 py-2 md:py-3 lg:py-4 flex gap-2">
                          <button
                            onClick={() =>
                              openModal(data?.profitDataForHistory)
                            }
                          >
                            <FaEye size={20} className="cursor-pointer mt-2" />
                          </button>
                          {data?.other_Bill_Data && (
                            <button
                              onClick={() =>
                                openOtheBillMOdal(data?.other_Bill_Data)
                              }
                            >
                              <IoDocumentTextOutline
                                size={20}
                                className="cursor-pointer"
                              />
                            </button>
                          )}
                        </td>
                        <td className="pl-4 md:pl-6 lg:pl-10 py-2 md:py-3 lg:py-4">
                          <button onClick={() => openReturnModal(data)}>
                            <FaEdit size={20} className="cursor-pointer" />
                          </button>
                         {data?.canDelete && <button onClick={() => openDeleteModal(data.id)}>
                           <Icon name="delete" size={20}/>
                          </button>}
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
            totalPages={BuyerBillHistory?.totalPages}
            totalRecords={BuyerBillHistory?.totalRecords}
            pageSize={limit}
          />
        </>
     
      {/* Suit Histoty Modal */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Suit History
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className=" px-6 py-3 text-center" scope="col">
                      D # No
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Category
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Color
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Quantity
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Sale Price
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="scrollable-content h-[50vh] overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    {suitSaleData?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <td className=" px-6 py-3 text-center">{data?.d_no}</td>
                        <td className=" px-6 py-3 text-center">
                          {data?.category}
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-center text-xs md:text-sm">{data?.color}</td>
                        <td className=" px-6 py-3 text-center">
                          {data?.quantity}
                        </td>
                        <td className=" px-6 py-3 text-center">
                          {data?.suitSalePrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTHE BILL DETAILS MODAL */}
      {otherBillModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-[95%] max-w-xl bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Other Bill Details
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
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Quantity
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Amount
                    </th>
                    <th className=" px-6 py-3 text-center" scope="col">
                      Note
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="scrollable-content  overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr className="bg-white border-b text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <td className=" px-6 py-3 text-center">
                        {otherBillData?.o_b_quantity}
                      </td>
                      <td className=" px-6 py-3 text-center">
                        {otherBillData?.o_b_amount}
                      </td>
                      <td className="px-2 py-2 md:px-4 md:py-3 lg:px-6 lg:py-3 text-center text-xs md:text-sm">
                        {otherBillData?.o_b_note}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Return Bill Modal  */}
      {returnModal && (
        <Return
          closeModal={closeReturnModal}
          Buyerdata={BuyerById}
          selected={selected}
        />
      )}

      {/* Delete Confiramtion Modal */}
      {deleteModal && <DeleteModal
      onClose={closeDeleteModal}
      onConfirm={handleDeleteBill}
      message={"Are you sure want to delete this bill ?"}
      title={"Delete Bill"}
      Loading={deleteBillLoading}
      />}
    </>
  );
};

export default NailaArtsBuyer;
