import { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";

const data = [
  {
    id: 1,
    name: "M Amir",
    phone: '0324700802',
    credit: 10000,
    debit: 12000,
    balance: 435135,
    status: "Paid",
  },
  {
    id: 2,
    name: "M Amir",
    phone: '0324700802',
    credit: 10000,
    debit: 12000,
    balance: 435135,
    status: "Partially Paid",
  },
]

const PhoneComponent = ({ phone }) => {
  const maskPhoneNumber = (phone) => {
    if (phone.length > 3) {
      return phone.slice(0, 3) + '*******'.slice(0, phone.length - 3);
    } else {
      return phone;
    }
  };

  return (
    <p>{maskPhoneNumber(phone)}</p>
  );
};

const Buyers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading } = useSelector((state) => state.InStock);


  // State variables to hold form data
  const [formData, setFormData] = useState({
    category: "",
    color: "",
    quantity: "",
    cost_price: "",
    sale_price: "",
    d_no: ""
  });

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch action with form data
    // dispatch(AddSuit(formData)).then(() => {
    //   dispatch(GetAllSuit())
    //   closeModal();
    // }).catch((error) => {
    //   console.error("Error adding suit:", error);
    // });
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
        {/* UPPER TABS */}
        <div className="mb-3 upper_tabs flex justify-start items-center">
          <h2 className='px-6 py-2 mr-2 rounded-lg text-black dark:text-gray-800 bg-gray-200 border border-gray-100 cursor-pointer'>Head Office</h2>
          <h2 className='px-6 py-2 mr-2 rounded-lg text-black dark:text-gray-100 border border-gray-600 cursor-pointer'>Brand Azam Market</h2>
          <h2 className='px-6 py-2 mr-2 rounded-lg text-black dark:text-gray-100 border border-gray-600 cursor-pointer'>Brand Faisalabad</h2>
        </div>

        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Buyers</h1>

          {/* <!-- search bar --> */}
          <div className="search_bar flex items-center gap-3 mr-2">
            <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
              <IoAdd size={22} className='text-white' />
            </button>

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
                placeholder="Search by Party Name"
              // value={searchText}
              // onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <p className='w-full bg-gray-300 h-px mt-5'></p>

        {/* -------------- TABS -------------- */}
        <div className="tabs flex justify-between items-center my-5">
          <div className="tabs_button">
            <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>All</button>
            <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Paid</button>
            <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Pending</button>
            <button className='border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md'>Partially Paid</button>
          </div>
        </div>

        {/* -------------- TABLE -------------- */}
        {loading ? (
          <div className="pt-16 flex justify-center mt-12 items-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="relative overflow-x-auto mt-5 ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Party Name
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Credit
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Debit
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Balance
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data?.map((data, index) => (
                    <tr key={index} className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        scope="row"
                      >
                        <p>{data.name}</p>
                        <PhoneComponent phone={data.phone} />
                      </th>
                      <td className="px-6 py-4 font-medium">
                        {data.credit} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.debit} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.balance} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.status}
                      </td>
                      <td className="pl-10 py-4">
                        <Link to={`/dashboard/buyers-details/${data.id}`}>
                          <FaEye size={20} className='cursor-pointer' />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="w-full flex justify-center items-center">
                    <td className='text-xl mt-3'>No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div >
        )}
      </section >

      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Suit
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    name="category"
                    type="text"
                    placeholder="Enter Category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    name="color"
                    type="text"
                    placeholder="Enter Color"
                    value={formData.color}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    name="quantity"
                    type="text"
                    placeholder="Enter Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    name="cost_price"
                    type="text"
                    placeholder="Enter Cost Price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    name="sale_price"
                    type="text"
                    placeholder="Enter Sale Price"
                    value={formData.sale_price}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <input
                    name="d_no"
                    type="text"
                    placeholder="Enter Design Number"
                    value={formData.d_no}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buyers;
