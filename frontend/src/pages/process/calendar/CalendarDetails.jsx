import { useNavigate, useParams } from "react-router-dom";
import { GetSingleCalender } from "../../../features/CalenderSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { createCutting } from "../../../features/CuttingSlice";
const CalendarDetails = () => {
    const { id } = useParams();
  const { loading,SingleCalender } = useSelector((state) => state.Calender);
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  

  const [CuttingData, setCuttingData] = useState({
    serial_No: '',
    partyName: '',
    design_no: '',
    date: '',  // Ensure this is initialized correctly
    T_Quantity: '',
    rate: 0,
    embroidery_Id: SingleCalender?.embroidery_Id || "",
  });


    useEffect(() => {
        const data = {
            id:id
        }
        dispatch(GetSingleCalender(data))
         }, [id,dispatch])



         useEffect(() => {
            setCuttingData({
             serial_No: SingleCalender?.serial_No || '',
             design_no: SingleCalender?.design_no || '',
             date: SingleCalender?.date || '',
             partyName:SingleCalender?.partyName || '',
           
             embroidery_Id: SingleCalender?.id || "",
            })
           }, [SingleCalender])



           const handleInputChangeCutting = (e) => {
            const { name, value } = e.target;
            setCalenderData((prevData) => ({
              ...prevData,
              [name]: value,
            }));
          };
          
          const handleSubmitCutting = (e) => {
            e.preventDefault();
          
            dispatch(createCutting(CuttingData))
            .then(() => {
              
                closeModal(); 
            navigate('/dashboard/calendar')


            })
            .catch((error) => {
                console.error("Error:", error);
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
        

 

    console.log('selectedDetails', SingleCalender);

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Calendar</h1>
                </div>

                {/* -------------- DETAILS SECTION -------------- */}
                <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
                        {/* FIRST ROW */}
                        <div className="box">
                            <span className="font-medium">Party Name:</span>
                            <span> M Umer</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Serial No:</span>
                            <span> A 0001</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Design No:</span>
                            <span> 794</span>
                        </div>

                        <div className="box">
                            <span className="font-medium">Rate:</span>
                            <span> 130</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Project Status:</span>
                            <span className="text-green-600 dark:text-green-300"> Complete</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Date:</span>
                            <span> 02-12-24</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Quantity:</span>
                            <span> 100 m</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">R. Quantity:</span>
                            <span> 100 m</span>
                        </div>
                    </div>
                </div>

                {/* ENTER RECEIVED QUANTITY */}
                <div className="my-10 px-3 text-gray-800 dark:text-gray-200">
                    <label htmlFor="received_quantity" className="font-semibold">Enter Received Quantity</label>
                    <input
                        id="received_quantity"
                        name="category"
                        type="text"
                        placeholder="Quantity"
                        className="bg-gray-50 mt-2 border max-w-xs border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                    />
                </div>

                {/* -------------- BUTTONS BAR -------------- */}
                <div className="mt-10 flex justify-center items-center gap-x-5">
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Completed</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Bill</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Gate Pass</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800" onClick={openModal}>Next Step</button>
                </div>


                {isOpen && (
        <div aria-hidden='true' className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50'>
          <div className='relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Cutting Details</h3>
              <button
                onClick={closeModal}
                className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                type='button'>
                <svg
                  aria-hidden='true'
                  className='w-3 h-3'
                  fill='none'
                  viewBox='0 0 14 14'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>

            <div className='p-4 md:p-5'>
              <form className='space-y-4' onSubmit={handleSubmitCutting}>
                <div className='mb-8 grid items-start grid-cols-1 lg:grid-cols-3 gap-5'>

                <div>
                    <input
                      name='serialNo'
                      type='text'
                      placeholder='serial No'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      value={CuttingData.serial_No}
                      onChange={handleInputChangeCutting}
                      required
                    />
                  </div>
                  <div>
                    <input
                      name='partyName'
                      type='text'
                      placeholder='Party Name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      value={CuttingData.partyName}
                      onChange={handleInputChangeCutting}

                      required
                    />
                  </div>

                  <div>
                    <input
                      name='design_no'
                      type='text'
                      placeholder='Design No'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      value={CuttingData.design_no}
                      onChange={handleInputChangeCutting}


                      required
                    />
                  </div>

                  <div>
                  <input
  name='date'
  type='date'
  placeholder='Date'
  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
  value={CuttingData.date}
  onChange={handleInputChangeCutting}

  required
/>

                  </div>

                  <div>
                    <input
                      name='quantity'
                      type='text'
                      placeholder='Quantity'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      value={CuttingData.T_Quantity}
                      onChange={handleInputChangeCutting}


                      required
                    />
                  </div>

                  <div>
                    <input
                      name='rate'
                      type='number'
                      placeholder='rate'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      value={CuttingData.rate}
                      onChange={handleInputChangeCalender}

                      required
                    />
                  </div>

                

                  {/* New input fields */}
               
                </div>

                <div className='flex justify-center pt-2'>
                  <button
                    type='submit'
                    className='inline-block rounded border border-gray-600 bg-gray-600 dark:bg-gray-500 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500'>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
            </section >
        </>
    )
}

export default CalendarDetails;