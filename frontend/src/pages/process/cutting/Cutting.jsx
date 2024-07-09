import React ,{useState, useEffect}  from 'react'
import { useDispatch,useSelector } from "react-redux";
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GetAllCutting } from '../../../features/CuttingSlice';
const Cutting = () => {

    const dispatch = useDispatch()
    const { loading,Cutting } = useSelector((state) => state.Cutting);
    const [currentPage, setCurrentPage] = useState(1);

    
    useEffect(() => {
      dispatch(GetAllCutting())
       }, [])
  
  
  
       const totalPages = Cutting?.totalPages || 1;

       const handleNextPage = () => {
         if (currentPage < totalPages) {
           setCurrentPage(currentPage + 1);
         }
       };
     
       const handlePreviousPage = () => {
         if (currentPage > 1) {
           setCurrentPage(currentPage - 1);
         }
       };



   

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Cutting</h1>

                    {/* <!-- search bar --> */}
                    <div className="flex items-center gap-2 mr-2">
                     

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
                                placeholder="Search by Design Number"
                            // value={searchText}
                            // onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <p className='w-full bg-gray-300 h-px mt-5'></p>


                {/* -------------- TABLE -------------- */}

                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (


<>   

                <div className="relative overflow-x-auto mt-5 ">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Sr # No
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Party Name
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Design No
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Date
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Quantity
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    R Quantity
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Status
                                </th>
                                <th
                                    className="px-6 py-3 font-medium"
                                    scope="col"
                                >
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Cutting?.data?.map((data, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        scope="row"
                                    >
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        {data.partyName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.design_no}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.quantity} y
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.r_quantity} y
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.project_status}
                                    </td>
                                    <td className="pl-10 py-4">
                                        <Link to={`/dashboard/cutting-details/${data.id}`}>
                                            <FaEye size={20} className='cursor-pointer' />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



<nav
className="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4"
aria-label="Table navigation"
>
<ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
  <li>
    <button
      onClick={handlePreviousPage}
      disabled={currentPage === 1}
      className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      Previous
    </button>
  </li>
  {[...Array(Cutting.totalPages)].map((_, pageIndex) => (
    <li key={pageIndex}>
      <button
        onClick={() => setCurrentPage(pageIndex + 1)}
        className={`flex items-center justify-center px-3 h-8 leading-tight ${
          currentPage === pageIndex + 1
            ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        }`}
      >
        {pageIndex + 1}
      </button>
    </li>
  ))}
  <li>
    <button
      onClick={handleNextPage}
      disabled={currentPage === Cutting.totalPages}
      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      Next
    </button>
  </li>
</ul>
</nav>


</>
   )}
                
            </section >


          
        </>
    )
}

export default Cutting;
