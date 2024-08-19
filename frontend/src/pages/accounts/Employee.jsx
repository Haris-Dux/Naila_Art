import { useEffect, useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { CreateEmployee, GetEmployeeActive, GetEmployeePast, UpdateEmployee } from '../../features/AccountSlice';

const categories = ['Active Employee', 'Past Employee'];

const Employee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('Active Employee');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);


  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { loading, ActiveEmployees, PastEmployees } = useSelector((state) => state.Account);

  useEffect(() => {
    if (selectedCategory === 'Active Employee') {
      dispatch(GetEmployeeActive({ searchText, page: page }));
    } else {
      dispatch(GetEmployeePast({ searchText, page: page }));
    }
  }, [currentPage, searchText, dispatch, page]);

  const Employees = selectedCategory === 'Active Employee' ? ActiveEmployees : PastEmployees;


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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const payload = {
      search: value || "",
      page: 1,
    };

    if (selectedCategory === 'Active Employee') {
      dispatch(GetEmployeeActive(payload));
    } else {
      dispatch(GetEmployeePast(payload));
    }

    navigate(`/dashboard/employee?page=1`);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedFormData = { ...formData, id: selectedEmployee.id };

      dispatch(UpdateEmployee(updatedFormData))
        .then(() => {
          dispatch(GetEmployeeActive({ searchText, currentPage }));
          closeModal();
          setFormData('');
          setIsEditing(false);
        })

        .catch((error) => {
          console.error("Error updating employee:", error);
        });
    } else {
      dispatch(CreateEmployee(formData))
        .then(() => {
          dispatch(GetEmployeeActive({ searchText, currentPage }));
          closeModal();
          setFormData('');
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
    const data = {
      id: id,
      pastEmploye: true
    }
    dispatch(UpdateEmployee(data))
      .then(() => {
        dispatch(GetEmployeeActive(searchText))


        closeConfirmationModal()
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
    setIsEditing(false);
    setFormData('')


  };

  const openConfirmationModal = (employee) => {
    setIsConfirmationOpen(true);
    setSelectedEmployee(employee);

    document.body.style.overflow = 'hidden';
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    document.body.style.overflow = 'auto';
  };

  const paginationLinkClick = (i) => {

    const payload = {
      // search: search.length > 0 ? search : null,
      page: i
    }

    if (selectedCategory === 'Active Employee') {
      dispatch(GetEmployeeActive(payload));
    } else {
      dispatch(GetEmployeePast(payload));
    }
  }

  const renderPaginationLinks = () => {
    const totalPages = Employees?.totalPages;
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i} onClick={ToDown}>
          <Link
            to={`/dashboard/employee?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 ${i === page ? "bg-[#252525] text-white" : "hover:bg-gray-100"
              }`}
            onClick={() => paginationLinkClick(i)}
          >
            {i}
          </Link>
        </li >
      );
    }
    return paginationLinks;
  };

  const handleCategoryClick = (category) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category);
      setSearch("")


      const payload = {
        searchText: search || "",
        page: 1,
      };

      if (category === 'Active Employee') {
        dispatch(GetEmployeeActive(payload));
      } else {
        dispatch(GetEmployeePast(payload));
      }

      navigate(`/dashboard/employee?page=1`);
    }
  };

  const ToDown = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg'>
        {/* HEADER */}
        <div className="header flex justify-between items-center pt-6 mx-2">
          <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Employees</h1>

          {/* SEARCH BAR */}
          <div className="search_bar flex items-center gap-3 mr-2">
            <div className="relative mt-4 md:mt-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </span>
              <input
                type="text"
                className="md:w-64 lg:w-72 py-2 pl-10 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
                placeholder="Search by name"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs flex justify-between items-center my-5">
          <div className="tabs_button">
            {categories?.map((category) => (
              <button
                key={category}
                className={`border border-gray-500 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md transition-colors duration-300 ${selectedCategory === category
                  ? 'bg-[#252525] text-white dark:bg-white dark:text-gray-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
            <IoAdd size={22} className='text-white' />
          </button>
        </div>

        {loading ? (
          <div className="pt-16 flex justify-center mt-12 items-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full" role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="relative overflow-x-auto mt-5">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-md font-medium" scope="col"> Name</th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">Salary</th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">Advance</th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">Balance</th>
                    <th className="px-6 py-4 text-md font-medium" scope="col">Details</th>
                    {selectedCategory === 'Active Employee' && (
                      <th className="px-6 py-4 text-md font-medium" scope="col">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Employees?.employData && Employees?.employData?.length > 0 ? (
                    Employees?.employData?.map((employee, index) => (
                      <tr key={index} className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row">
                          <p>{employee.name}</p>
                        </th>

                        <td className="px-6 py-4 font-medium">{employee.salary} Rs</td>
                        <td className="px-6 py-4 font-medium">
                          {employee?.financeData && employee.financeData.length > 0 ? (
                            `${employee.financeData[employee.financeData.length - 1]?.balance < 0 ? 0 : employee.financeData[employee.financeData.length - 1]?.balance} Rs`
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {employee?.financeData && employee.financeData.length > 0 ? (
                            `${employee.financeData[employee.financeData.length - 1]?.balance} Rs`
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="pl-10 py-4">
                          <Link to={`/dashboard/employee-details/${employee.id}`}>
                            <FaEye size={20} className='cursor-pointer' />
                          </Link>
                        </td>
                        {selectedCategory === 'Active Employee' && (
                          <td className="pl-10 py-4 flex gap-2 mt-2">
                            <FaEdit size={20} className='cursor-pointer' onClick={() => handleEdit(employee)} />
                            <FaTrashAlt size={20} className='cursor-pointer' onClick={() => openConfirmationModal(employee)} />
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="w-full text-md font-semibold dark:text-white">
                      <td colSpan={6} className="px-6 py-4 font-medium text-center">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* -------- PAGINATION -------- */}
      <section className="flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
            <li>
              {Employees?.page > 1 ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/employee?page=${page - 1}`}
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
              {Employees?.totalPages !== page ? (
                <Link
                  onClick={ToDown}
                  to={`/dashboard/employee?page=${page + 1}`}
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

      {/* Modal */}
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
                      type='date'
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

      {isConfirmationOpen && (
        <div aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50">
          <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Credit Salary
              </h3>
              <button onClick={closeConfirmationModal} className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" type="button">
                <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              <p className="text-center text-gray-700 dark:text-gray-300">Are you sure you want to Delete the Employee?</p>
              <div className="flex justify-center pt-5 gap-3">
                <button onClick={() => handleDelete(selectedEmployee.id)} className="inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500">
                  Yes
                </button>
                <button onClick={closeConfirmationModal} className="inline-block rounded border border-gray-300 bg-gray-300 dark:bg-gray-400 px-10 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-400 focus:outline-none focus:ring">
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Employee;
