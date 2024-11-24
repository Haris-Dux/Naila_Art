import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import BaseModals from "./Modals/BaseModals";
import LaceModal from "./Modals/LaceModal";
import BagModal from "./Modals/BagModal";
import AccessoriesModal from "./Modals/AccessoriesModal";
import { useDispatch, useSelector } from "react-redux";
import BaseTable from "./Tables/BaseTable";
import LaceTable from "./Tables/LaceTable";
import BagBoxTable from "./Tables/BagBoxTable";
import AccessoriesTable from "./Tables/AccessoriesTable";
import {
  clearValiDateSeller,
  getAllPurchasingHistoryAsync,
  validateOldSellerAsync,
} from "../../features/SellerSlice";

const PurchaseBills = () => {
  const dispatch = useDispatch();

  const [validateOldSeller, setValidateOldSeller] = useState("");
  const [sellerDetails, setSellerDetails] = useState("");
  const [searchUser, setSearchUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchModal, setSearchModal] = useState();

  const { loading, validateSeller } = useSelector((state) => state.Seller);

  const [search, setSearch] = useState();

  const [selectedCategory, setSelectedCategory] = useState("Base");
  const [clearFormData, SetClearFormData] = useState("");

  const handleTabClick = (category) => {
    setSelectedCategory(category);
  };

  const swapModal = () => {
    closeSearchModal();
    openModal();
    SetClearFormData("Remove");
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    dispatch(clearValiDateSeller());
    setSellerDetails("");
  };

  const openSearchModal = () => {
    setSearchModal(true);
  };

  const closeSearchModal = () => {
    setSearchModal(false);
    setSearchUser(false);
    setValidateOldSeller("");
  };

  const handleValidateOldSeller = (e) => {
    const value = e.target.value;
    setValidateOldSeller(value);

    if (value.length > 0) {
      const timer = setTimeout(() => {
        dispatch(validateOldSellerAsync({ name: value ,category:selectedCategory}));
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const payload = {
      page: 1,
      search: value,
      category: selectedCategory,
    };

    dispatch(getAllPurchasingHistoryAsync(payload));
  };

  const handleChooseSeller = (sellerId) => {
    if (sellerId) {
      const sellerData = validateSeller?.oldSellerData.find(
        (data) => data.id === sellerId
      );
      setSellerDetails(sellerData);
      closeSearchModal();
      openModal();
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg">
        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className="text-gray-800 dark:text-gray-200 text-3xl font-medium">
            Purchase Bills
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
                placeholder="Search by Name"
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
            {["Base", "Lace", "Bag/box", "Accessories"]?.map((category) => (
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
            ))}
          </div>

          {/* OPEN MODAL BUTTON */}
          <button
            onClick={openSearchModal}
            className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
          >
            <IoAdd size={22} className="text-white" />
          </button>
        </div>

        {selectedCategory === "Base" && <BaseTable />}
        {selectedCategory === "Lace" && <LaceTable />}
        {selectedCategory === "Bag/box" && <BagBoxTable />}
        {selectedCategory === "Accessories" && <AccessoriesTable />}
      </section>

      {/* ALL MODALS  */}
      {selectedCategory === "Base" && (
        <BaseModals
          isOpen={isOpen}
          closeModal={closeModal}
          sellerDetails={sellerDetails}
        />
      )}
      {selectedCategory === "Lace" && (
        <LaceModal
          isOpen={isOpen}
          closeModal={closeModal}
          sellerDetails={sellerDetails}
        />
      )}
      {selectedCategory === "Bag/box" && (
        <BagModal
          isOpen={isOpen}
          closeModal={closeModal}
          sellerDetails={sellerDetails}
        />
      )}
      {selectedCategory === "Accessories" && (
        <AccessoriesModal
          isOpen={isOpen}
          closeModal={closeModal}
          sellerDetails={sellerDetails}
          clearFormData={clearFormData}
        />
      )}

      {searchModal && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-8 px-3 w-full max-w-2xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between flex-col p-3 rounded-t dark:border-gray-600">
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                Generate Seller
              </h3>
            </div>

            {/* ------------- BODY ------------- */}
            <div className="p-3">
              <div className="flex justify-center items-center gap-x-4">
                <button
                  onClick={swapModal}
                  className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                >
                  New Seller
                </button>
                <button
                  onClick={() => setSearchUser(!searchUser)}
                  className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                >
                  Old Seller
                </button>
              </div>

              {searchUser && (
                <div className="search_user border-t flex justify-center flex-col pt-6 mt-6">
                  <input
                    type="text"
                    className="w-full py-2 pl-6 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
                    placeholder="Search by name"
                    value={validateOldSeller}
                    onChange={handleValidateOldSeller}
                  />

                  {/* Displaying names below the input */}
                  {loading ? (
                    <>
                      <div className="py-6 flex justify-center items-center">
                        <div
                          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                          role="status"
                          aria-label="loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {validateOldSeller.length > 0 &&
                      validateSeller &&
                      validateSeller?.oldSellerData &&
                      validateSeller?.oldSellerData.length > 0 ? (
                        <ul className="mt-4 max-h-60 overflow-y-auto border rounded-lg">
                          {validateSeller?.oldSellerData.map((seller) => (
                            <li key={seller.id}>
                              <button
                                onClick={() => handleChooseSeller(seller?.id)}
                                className="py-2 px-4 border-b rounded hover:bg-gray-100 w-full grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-2"
                              >
                                <span className="text-start">
                                  {seller?.name}
                                </span>
                                <span>{seller?.seller_stock_category}</span>
                                <span className="text-end">
                                  {seller?.phone}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-gray-600 pl-4">
                          No matching seller found.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="button absolute top-3 right-3">
              <button
                onClick={closeSearchModal}
                className="end-2.5 bg-gray-100 text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseBills;
