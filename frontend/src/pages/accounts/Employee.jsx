import { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { CreateEmployee } from '../../features/AccountSlice';
import { useDispatch } from 'react-redux';
import {  FaEdit, FaTrashAlt } from "react-icons/fa";

const data = [
  {
    id: 1,
    name: "M Umer",
    phone: '0324700802',
    salary: 10000,
    advance: 0,
    balance: 25000,
  },
  {
    id: 2,
    name: "Usama",
    phone: '0324700802',
    salary: 10000,
    advance: 5000,
    balance: 25000,
  },
]

const categories = ['Active Employee', 'Past Employee'];


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

const Employee = () => {

const [isOpen, setIsOpen] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);
const { loading } = useSelector((state) => state.InStock);
const dispatch = useDispatch();
const [selectedCategory, setSelectedCategory] = useState('ActiveEmployee');


const [formData, setFormData] = useState({
  name: "",
  father_Name: "",
  CNIC: "",
  phone_number: "",
  address: "",
  father_phone_number: "",
  last_work_place: "",
  designation: "",
  salary: "",
  joininig_date: "",
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
    if (isEditing) {
      dispatch(UpdateEmployee({ id: selectedEmployee.id, ...formData }))
        .then(() => {
          closeModal();
        })
        .catch((error) => {
          console.error("Error updating employee:", error);
        });
    } else {
      dispatch(CreateEmployee(formData))
        .then(() => {
          closeModal();
        })
        .catch((error) => {
          console.error("Error adding employee:", error);
        });
    }
  };
  const handleEdit = (employee) => {
    setFormData(employee);
    setSelectedEmployee(employee);
    setIsEditing(true);
    openModal();
  };

  const handleDelete = (id) => {
    dispatch(DeleteEmployee(id))
      .then(() => {
        console.log("Employee deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
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

        {/* -------------- HEADER -------------- */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Employees</h1>

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
                placeholder="Search by Employee Name"
              // value={searchText}
              // onChange={handleSearch}
              />
            </div>
          </div>
        </div>



        <div className="tabs flex justify-between items-center my-5">
                    <div className="tabs_button">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`border border-gray-500 dark:bg-gray-700 text-gray-900  dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md ${selectedCategory === category ? 'bg-[#252525] text-white dark:bg-white dark:text-gray-900   ' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
              <IoAdd size={22} className='text-white' />
            </button>
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
                    Employee Name
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Salary
                  </th>
                  <th
                    className="px-6 py-4 text-md font-medium"
                    scope="col"
                  >
                    Advance
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
                    Details
                  </th>
                  <th className="px-6 py-4 text-md font-medium" scope="col">Actions</th>
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
                        {data.salary} Rs
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data?.advance === 0 ? "-" : (<>{data?.advance}Rs</>)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {data.balance} Rs
                      </td>
                      <td className="pl-10 py-4">
                        <Link to={`/dashboard/employee-details/${data.id}`}>
                          <FaEye size={20} className='cursor-pointer' />
                        </Link>
                      </td>

                      <td className="pl-10 py-4 flex gap-2 mt-2">
                      
                        <FaEdit size={20} className='cursor-pointer' onClick={() => handleEdit(data)} />
                        <FaTrashAlt size={20} className='cursor-pointer' onClick={() => handleDelete(data.id)} />
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
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
        >
          <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Employee Form
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
              <form className="space-y-4" onSubmit={handleSubmit}>

                {/* FIRST ROW */}
                <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* NAME */}
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     
                      required
                    />
                  </div>

                  {/* FATHER NAME */}
                  <div>
                    <input
                      type="text"
                      placeholder="Father Name"
                      name="father_Name"
                      id="father_Name"
                      value={formData.father_Name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* CNIC */}
                  <div>
                    <input
                      type="text"
                      placeholder="CNIC"
                      name="CNIC"
                      id="CNIC"
                      value={formData.CNIC}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>


                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* PHONE NUMBER */}
                  <div>
                    <input
                      type="number"
                      placeholder="Phone Number"
                      name="phone_number"
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* FATHER CNIC */}
                  <div>
                    <input
                      type="number"
                      placeholder="Father CNIC"
                      name="father_phone_number"
                      id="father_phone_number"
                      value={formData.father_phone_number}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* LAST WORK PLACE */}
                  <div>
                    <input
                      type="text"
                      placeholder="Last Work Place"
                      name="last_work_place"
                      id="last_work_place"
                      value={formData.last_work_place}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* LAST ROW */}
                <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* DESIGNATION */}
                  <div>
                    <input
                      type="text"
                      placeholder="Designation"
                      name="designation"
                      id="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* SALARY */}
                  <div>
                    <input
                      type="number"
                      placeholder="Salary"
                      name="salary"
                      id="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  {/* JOINING DATE */}
                  <div>
                    <input
                      type="date"
                      placeholder="Joining Date"
                      name="joininig_date"
                      id="joininig_date"
                      value={formData.joininig_date}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                  >
                  {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div >
      )}
    </>
  );
}

export default Employee;