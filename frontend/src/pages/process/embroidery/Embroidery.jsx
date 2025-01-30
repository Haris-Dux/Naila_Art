import { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Box from "../../../Component/Embodiary/Box";
import { MdOutlineDelete } from "react-icons/md";
import {
  deleteEmbroideryAsync,
  getAllDesignNumbersAsync,
  GETEmbroidery,
  getHeadDataByDesignNoAsync,
  getPreviousDataBypartyNameAsync,
} from "../../../features/EmbroiderySlice";
import { useDispatch } from "react-redux";
import Select from "react-select";
import ReactSearchBox from "react-search-box";
import moment from "moment";
import DeleteModal from "../../../Component/Modal/DeleteModal";
import { GrPowerReset } from "react-icons/gr";
import { LuPackageCheck } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";

const Embroidery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [partyValue, setPartyValue] = useState("newParty");
  const {
    loading,
    embroidery,
    designNumbers,
    headStitchData,
    previousDataByPartyName,
    deleteLoadings,
  } = useSelector((state) => state.Embroidery);
  console.log('embroidery',embroidery);
  const [accountData, setAccountData] = useState(null);
  const page = embroidery?.page || "1";
  const dispatch = useDispatch();
  const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
  const [formData, setFormData] = useState({
    partyName: "",
    Manual_No: "",
    partytype: partyValue,
    date: today,
    per_suit: 0,
    rATE_per_stitching: "",
    project_status: "",
    design_no: "",
    discount: 0,
    discountType: "RS",
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
    dispatch(GETEmbroidery({ page }));
  }, [dispatch]);

  // Convert your design numbers into options for Select
  const designOptions = designNumbers.map((num) => ({
    value: num,
    label: num,
  }));

  const [filters, setFilters] = useState({
    Manual_No: "",
    partyName: "",
    project_status: ""
  });


  const calculateTotal = (formData1) => {
    const rate = parseFloat(formData.rATE_per_stitching) || 0;
    const stitches = [
      {
        value: formData1.Front_Stitch.value,
        head: formData1.Front_Stitch.head,
      },
      { value: formData1.Bazo_Stitch.value, head: formData1.Bazo_Stitch.head },
      { value: formData1.Gala_Stitch.value, head: formData1.Gala_Stitch.head },
      { value: formData1.Back_Stitch.value, head: formData1.Back_Stitch.head },
      {
        value: formData1.Pallu_Stitch.value,
        head: formData1.Pallu_Stitch.head,
      },
      {
        value: formData1.Trouser_Stitch.value,
        head: formData1.Trouser_Stitch.head,
      },
      {
        value: formData1.D_Patch_Stitch.value,
        head: formData1.D_Patch_Stitch.head,
      },
      {
        value: formData1.F_Patch_Stitch.value,
        head: formData1.F_Patch_Stitch.head,
      },
    ];

    const total = stitches.reduce((sum, stitch) => {
      const value = parseFloat(stitch.value) || 0;
      const head = parseFloat(stitch.head) || 0;
      const stitchTotal = (value / 1000) * rate * head;
      return sum + stitchTotal;
    }, 0);

    const roundedTotal = Math.round(total * 10000) / 10000;

    return roundedTotal;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [field, subField] = name.split(".");

    if (subField) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          [subField]: parseFloat(value),
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelected = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        design_no: e.value,
      };
    });
    dispatch(getHeadDataByDesignNoAsync({ design_no: e.value })).then((res) => {
      const categories = [
        "Front_Stitch",
        "Bazo_Stitch",
        "Gala_Stitch",
        "Back_Stitch",
        "Pallu_Stitch",
        "D_Patch_Stitch",
        "F_Patch_Stitch",
        "Trouser_Stitch",
      ];

      setFormData((prevState) => {
        const updatedData = { ...prevState };
        categories.forEach((item) => {
          if (res.payload[0][item]) {
            updatedData[item] = {
              value: res.payload[0][item].value,
              head: res.payload[0][item].head,
            };
          }
        });
        return updatedData;
      });
    });
  };

  useEffect(() => {
    if (
      formData.rATE_per_stitching ||
      formData.discountType ||
      formData.discount
    ) {
      let totalAmount = calculateTotal(formData);
      if (formData.discount !== "" && formData.discountType === "RS") {
        totalAmount = totalAmount - Number(formData.discount);
      } else if (formData.discount !== "" && formData.discountType === "%") {
        const discountAmount = (Number(formData.discount) / 100) * totalAmount;
        totalAmount = totalAmount - discountAmount;
      }
      setTotal(totalAmount);
    }
  }, [formData.rATE_per_stitching, formData.discountType, formData.discount]);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    dispatch(getAllDesignNumbersAsync());
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    setAccountData(null);
    setFormData({
      partyName: "",
      partytype: partyValue,
      date: today,
      per_suit: 0,
      rATE_per_stitching: "",
      project_status: "",
      design_no: "",
      discount: 0,
      discountType: "RS",
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
  };

  const filteredData = searchText
    ? embroidery?.data?.filter((item) =>
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
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${
              i === parseInt(page) ? "bg-[#252525] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => dispatch(GETEmbroidery({filters, page: i }))}
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const ToDown = (value) => {
    if(value === "+"){
      console.log('calling');
      dispatch(GETEmbroidery({filters, page: parseInt(page) + 1 }))
    } else if(value === "-"){
      dispatch(GETEmbroidery({ filters ,page: parseInt(page) - 1 }))
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

  const togleNameField = (e) => {
    const value = e.target.value;
    setPartyValue(value);
    setFormData((prev) => ({
      ...prev,
      partyName: "",
    }));
    setAccountData(null);
  };

  const handleSearchOldData = (value) => {
    dispatch(getPreviousDataBypartyNameAsync({ partyName: value }));
  };

  const searchResults = previousDataByPartyName?.embroideryData?.map((item) => {
    return {
      key: item.partyName,
      value: item.partyName,
    };
  });

  const handleSelectedRecord = (value) => {
    const Data = previousDataByPartyName?.accountData.find(
      (item) => item.partyName === value
    );
    setFormData((prev) => ({
      ...prev,
      partyName: value,
    }));
    if (Data?.partyName === value) {
      setAccountData(Data?.virtual_account);
    } else {
      setAccountData(false);
    }
  };

  const setAccountStatusColor = (status) => {
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

  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSelectedId(id);
  };

  const closedeleteModal = () => {
    setDeleteModal(false);
  };

  const handleDelete = () => {
    dispatch(deleteEmbroideryAsync({ id: selectedId })).then((res) => {
      if (res.payload.success === true) {
        dispatch(GETEmbroidery({ page: page }));
        closedeleteModal();
      }
    });
  };

 
  const handleChangeFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFiltersSearch = () => {
    dispatch(GETEmbroidery({ filters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      Manual_No: "",
      partyName: "",
      project_status: ""
    });
    dispatch(GETEmbroidery({ page: 1 }));
  };

  console.log('page',page);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[80vh] rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Embroidery
          </h1>

          {/* SEARCH FILTERS */}
          <div className="flex items-center gap-3 justify-center">
            {/* TRANSACTION TYPE */}
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
            {/* <!-- ADD BUTTON--> */}
            <button
              onClick={openModal}
              className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
            >
              <IoAdd size={22} className="text-white" />
            </button>
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
                    <th className="px-6 py-3 text-left font-medium" scope="col">
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
                    <th
                      className="px-6 py-3 font-medium text-center"
                      scope="col"
                    >
                      <span className="text-red-500">Qty</span>/
                      <span className="text-green-500">Suit Qty</span>
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
                          <div className="flex items-center justify-start gap-2">
                            <span className="text-green-500">
                              {data?.next_steps?.packing && (
                                <LuPackageCheck size={20} />
                              )}
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
                        <td className="px-6 text-center py-4">
                          <span className="text-red-500">
                            {data?.T_Quantity}
                          </span>
                          /
                          <span className="text-green-500">
                            {data?.T_Suit ?? "--"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {setStatusColor(data.project_status)}
                        </td>
                        <td className="pl-10 py-4 flex items-center  gap-3">
                          <Link to={`/dashboard/embroidery-details/${data.id}`}>
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
      <section section className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {embroidery?.page > 1 ? (
                <Link
                  onClick={() => ToDown("-")}
                  // to={`/dashboard/embroidery?page = ${page - 1}`}
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
              {embroidery?.totalPages !== parseInt(page) ? (
                <Link
                onClick={() => ToDown("+")}
                  // to={`/dashboard/embroidery?page = ${page + 1}`}
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

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4  px-3 w-full max-w-6xl bg-white rounded-md shadow dark:bg-gray-700 max-h-[85vh] scrollable-content overflow-y-auto">
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
            {/* ACCOUNT DATA */}
            {partyValue === "oldParty" && accountData === false ? (
              <div className=" px-8 py-2 flex justify-around items-center border-2 border-red-600 rounded-lg text-green-500 dark:text-green-500  dark:border-red-600">
                <p>Embroidery Data Found But No Bill Generated Yet</p>
              </div>
            ) : (
              <>
                {partyValue === "oldParty" && accountData !== null && (
                  <div className=" px-8 py-2 flex justify-around items-center border-2 rounded-lg text-gray-900 dark:text-gray-100  dark:border-gray-600">
                    <div className="box text-center">
                      <h3 className="pb-1 font-normal">Total Debit</h3>
                      <h3>{accountData?.total_debit || 0}</h3>
                    </div>
                    <div className="box text-center">
                      <h3 className="pb-1 font-normal">Total Credit</h3>
                      <h3>{accountData?.total_credit || 0}</h3>
                    </div>
                    <div className="box text-center">
                      <h3 className="pb-1 font-normal ">Total Balance</h3>
                      <h3>{accountData?.total_balance || 0}</h3>
                    </div>
                    <div className="box text-center">
                      <h3 className="pb-1 font-normal ">Status</h3>
                      <h3>
                        {setAccountStatusColor(accountData?.status) ||
                          "No Status"}
                      </h3>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ------------- BODY ------------- */}
            <div className="p-4 md:p-5">
              <div className="space-y-4">
                {/* INPUT FIELDS DETAILS */}
                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
                  {/* FIRST ROW */}
                  <div className="grid items-center h-full grid-cols-4 gap-1">
                    <label className="col-span-2 ">
                      <input
                        type="radio"
                        name="partyType"
                        value="oldParty"
                        className="bg-gray-50 cursor-pointer border mr-2 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={togleNameField}
                        required
                      />
                      Old Party
                    </label>
                    <label className="col-span-2 ">
                      <input
                        type="radio"
                        name="partyType"
                        value="newParty"
                        className="bg-gray-50 cursor-pointer border mr-2 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={togleNameField}
                        required
                        defaultChecked
                      />
                      New Party
                    </label>
                  </div>

                  <div>
                    {partyValue === "newParty" ? (
                      <input
                        name="partyName"
                        type="text"
                        placeholder="Party Name"
                        className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={formData.partyName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="custom-search-box relative">
                        <ReactSearchBox
                          key={searchResults?.key}
                          onSelect={(value) =>
                            handleSelectedRecord(value?.item?.key)
                          }
                          placeholder={
                            formData.partyName === ""
                              ? "Search Party Name"
                              : formData.partyName
                          }
                          data={searchResults}
                          onChange={(value) => handleSearchOldData(value)}
                          inputBorderColor="#D1D5DB"
                          inputBackgroundColor="#F9FAFB"
                        />
                        <style jsx>
                          {`
                            .react-search-box-dropdown {
                              position: absolute;
                              z-index: 50;
                              top: 100%;
                              left: 0;
                              width: 100%;
                            }
                          `}
                        </style>
                      </div>
                    )}
                  </div>
                  <input
                    name="Manual_No"
                    type="text"
                    placeholder="Manual Number"
                    className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                    value={formData.Manual_No}
                    onChange={handleInputChange}
                  />
                  <div>
                    <input
                      name="date"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="grid items-start grid-cols-3 gap-1">
                    <input
                      name="design_no"
                      type="text"
                      placeholder="Select or Enter D.N"
                      className="bg-gray-50 border col-span-2 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.design_no}
                      onChange={handleInputChange}
                    />
                    <div className="custom-reactSelect">
                      <Select
                        options={designOptions}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderRadius: 4,
                            borderColor: "#D1D5DB",
                            boxShadow: state.isFocused ? "none" : "none",
                            "&:hover": {
                              borderColor: "#D1D5DB",
                            },
                            padding: "2px",
                          }),
                        }}
                        placeholder=""
                        className="bg-gray-50   text-gray-900 rounded-md"
                        onChange={handleSelected}
                        value={
                          formData.design_no
                            ? {
                                value: formData.design_no,
                              }
                            : null
                        }
                      />
                    </div>
                  </div>

                  {/* SECOND ROW */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    {/* 1 */}
                    <input
                      name="Front_Stitch.value"
                      type="number"
                      placeholder="Front Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Front_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Front_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Front_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* 2 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Back_Stitch.value"
                      type="number"
                      placeholder="Back Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Back_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Back_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Back_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* 3 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Bazo_Stitch.value"
                      type="number"
                      placeholder="Bazu Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Bazo_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Bazo_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Bazo_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* 4 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Gala_Stitch.value"
                      type="number"
                      placeholder="Gala Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Gala_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Gala_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Gala_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* THIRD ROW */}
                  {/* 5 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="D_Patch_Stitch.value"
                      type="number"
                      placeholder="Dupatta Patch Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.D_Patch_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="D_Patch_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.D_Patch_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* 6 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Pallu_Stitch.value"
                      type="number"
                      placeholder="Pallu Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Pallu_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Pallu_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Pallu_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* 7 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="F_Patch_Stitch.value"
                      type="number"
                      placeholder="Front Patch Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.F_Patch_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="F_Patch_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.F_Patch_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* 8 */}
                  <div className="grid items-start grid-cols-3 gap-2">
                    <input
                      name="Trouser_Stitch.value"
                      type="number"
                      placeholder="Trouser Stitch"
                      className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Trouser_Stitch.value || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      name="Trouser_Stitch.head"
                      type="number"
                      placeholder="Head"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      value={formData.Trouser_Stitch.head || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* FOURTH ROW */}
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

                  {/* DISCOUNT FIELDS */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="flex">
                        <input
                          name="discount"
                          type="number"
                          placeholder="Enter Discount"
                          className="bg-gray-50 border rounded-tl-md rounded-bl-md border-gray-300 text-gray-900 text-sm focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          value={formData.discount || ""}
                          onChange={handleInputChange}
                          required
                        />
                        <select
                          name="discountType"
                          className="bg-gray-50 border rounded-tr-md rounded-br-md border-gray-300 text-gray-900 text-sm focus:ring-0 focus:border-gray-300 block  p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          value={formData.discountType}
                          onChange={handleInputChange}
                        >
                          <option value="RS">RS</option>
                          <option value="%">%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL AFTER DISCOUNT */}
                  <div>
                    <input
                      type="text"
                      value={formData.rATE_per_stitching ? total : 0}
                      readOnly
                      name="per_suit"
                      className="bg-gray-50 border-2 border-green-600  text-gray-900 text-sm rounded-md focus:ring-0 focus:border-green-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                </div>

                {/* SUIT DESCRIPION */}

                <Box
                  formData1={formData}
                  partyValue={partyValue}
                  setFormData1={setFormData}
                  closeModal={closeModal}
                  total={total}
                  DNO_ategory={headStitchData[0]?.shirt}
                  D_NO={headStitchData[0]?.design_no}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* DELETE MODAL */}
      {deleteModal && (
        <DeleteModal
          title={"Delete Embroidery"}
          message={"Are you sure want to delete this embroidery ?"}
          onClose={closedeleteModal}
          Loading={deleteLoadings}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default Embroidery;
