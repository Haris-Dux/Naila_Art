import React ,{ useState,useEffect}  from 'react'
import { IoAdd, IoPencilOutline, IoTrash } from "react-icons/io5";
import { useDispatch,useSelector } from "react-redux";
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GetAllCalender } from '../../../features/CalenderSlice';

const Calendar = () => {
 
  const dispatch = useDispatch()
  const { loading,Calender } = useSelector((state) => state.Calender);
  const [currentPage, setCurrentPage] = useState(1);



  
  useEffect(() => {
    dispatch(GetAllCalender())
     }, [])


    const openModal = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const totalPages = Calender?.totalPages || 1;

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
        <div className='header flex justify-between items-center pt-6 mx-2'>
          <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Calendar</h1>

          {/* <!-- search bar --> */}
   
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

        <div className='relative overflow-x-auto mt-5 '>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200'>
              <tr>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Sr # No
                </th>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Party Name
                </th>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Design No
                </th>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Date
                </th>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Quantity
                </th>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Status
                </th>
                <th className='px-6 py-3 font-medium' scope='col'>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {Calender?.data?.map((entry, index) => (
                <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
                  <th className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white' scope='row'>
                    {index + 1}
                  </th>
                  <td className='px-6 py-4'>{entry.partyName}</td>
                  <td className='px-6 py-4'>{entry.design_no}</td>
                  <td className='px-6 py-4'>{entry.date}</td>
                  <td className='px-6 py-4'>{entry.quantity} y</td>
                  <td className='px-6 py-4'>{entry.project_status}</td>
                  <td className='pl-10 py-4'>
                    <Link to={`/dashboard/calendar-details/${entry.id}`}>
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
  {[...Array(Calender.totalPages)].map((_, pageIndex) => (
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
      disabled={currentPage === Calender.totalPages}
      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      Next
    </button>
  </li>
</ul>
</nav>


</>
            )}

      </section>

      {/* Modal for adding new entry */}

    </>
  );
};

export default Calendar;
