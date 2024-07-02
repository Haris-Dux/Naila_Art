import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { GetSingleCutting, Updatecuttingasync } from "../../../features/CuttingSlice";
const CuttingDetails = () => {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const { loading,SingleCutting } = useSelector((state) => state.Cutting);

    const dispatch = useDispatch()

    const [cuttingData, setcuttingData] = useState({
        id,
        r_quantity: '',
        project_status: 'Completed',
      
      });

      const initialRow = { category: "", color: "", quantity: 0,   };

      const [formData, setFormData] = useState({
        PartyName: '',
        SerialNo: '',
        DesignNo: '',
        Date : '',
        rate: '',
        category_quantity:[initialRow]
       
      });

      useEffect(() => {
        setFormData({
         serial_No: SingleCutting?.serial_No || '',
         design_no: SingleCutting?.design_no || '',
         date: SingleCutting?.date || '',
         partyName:SingleCutting?.partyName || '',
         embroidery_Id: SingleCutting?.id || "",
         
       
        })
       }, [SingleCutting])


    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form Data:', formData);
      };

    

      useEffect(() => {
        const data = {
            id:id
        }
        dispatch(GetSingleCutting(data))
         }, [id,dispatch])





           const handleInputChangeCutting = (e) => {
            const { name, value } = e.target;
            setcuttingData((prevData) => ({
              ...prevData,
              [name]: value,
            }));
          };
          

       


        //   const handleSubmitCutting = (e) => {
        //     e.preventDefault();
          
        //     dispatch(createCutting(CuttingData))
        //     .then(() => {
              
        //         closeModal(); 
        //     navigate('/dashboard/cutting')


        //     })
        //     .catch((error) => {
        //         console.error("Error:", error);
        //     });



            
        //   };



          const handleCompleteCutting = (e) => {
            e.preventDefault();

             const data = {
            id:id
        }
        
          
            dispatch(Updatecuttingasync(cuttingData))
            .then(() => {
              
                closeModal(); 
                
         
                dispatch(GetSingleCutting(data))
                setcuttingData({
                    id: id,
                    r_quantity: '',
                    project_status: 'Completed',
                  });

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

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Cutting Details</h1>
                </div>

                {/* -------------- DETAILS SECTION -------------- */}
                <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
                        {/* FIRST ROW */}
                        <div className="box">
                            <span className="font-medium">Party Name:</span>
                            <span> {SingleCutting?.partyName}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Serial No:</span>
                            <span> {SingleCutting?.serial_No}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Design No:</span>
                            <span> {SingleCutting?.design_no}</span>
                        </div>

                        <div className="box">
                            <span className="font-medium">Rate:</span>
                            <span> {SingleCutting?.rate}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Project Status:</span>
                            <span className="text-green-600 dark:text-green-300"> Complete</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Date:</span>
                            <span> {SingleCutting?.date}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Quantity:</span>
                            <span>    {SingleCutting?.T_Quantity}  </span>
                        </div>
                        <div className="box">
                            <span className="font-medium">R. Quantity:</span>
                            <span>  {SingleCutting?.r_quantity}</span>
                        </div>
                    </div>
                </div>

                {/* RECEIVED SUITS COLORS */}
                <div className="my-10 px-3 text-gray-800 dark:text-gray-200">
                    <label htmlFor="received_quantity" className="font-semibold">Enter Received Quantity</label>
                    <input
                        id="r_quantity"
                        name="r_quantity"
                        type="text"
                        placeholder="Quantity"
                        className="bg-gray-50 mt-2 border max-w-xs border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        value={cuttingData.r_quantity}
                        onChange={handleInputChangeCutting}
                        disabled={SingleCutting?.project_status ===  'Completed'}
                    />
                </div>

                {/* -------------- BUTTONS BAR -------------- */}
                <div className="mt-10 flex justify-center items-center gap-x-5">
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800" onClick={handleCompleteCutting}>Completed</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Bill</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Gate Pass</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800" onClick={openModal}>Next Step</button>
                </div>

                {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-3xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Stone Details
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
                            <form className="space-y-4">

                                {/* INPUT FIELDS DETAILS */}
                                <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                                    {/* PARTY NAME */}
                                    <div>
                                        <input
                                            name="PartyName"
                                            type="text"
                                            placeholder="Party Name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            value={formData.PartyName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* SERIAL NO */}
                                    <div>
                                        <input
                                        name="SerialNo"
                                            type="text"
                                            placeholder="Serial No"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            value={formData.SerialNo}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* DESIGN NO */}
                                    <div>
                                        <input
                                        name="DesignNo"
                                            type="text"
                                            placeholder="Design No"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            value={formData.DesignNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>


                                <div className="mb-8 grid items-start grid-cols-1 lg:grid-cols-2 gap-5">
                                    {/* DATE */}
                                    <div>
                                        <input
                                        name="date"
                                            type="date"
                                            placeholder="Date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            value={formData.Date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* ENTER RATE */}
                                    <div>
                                        <input
                                        name="rate"
                                            type="text"
                                            placeholder="Enter Rate"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            value={formData.rate}
                                            onChange={handleChange}

                                        />
                                    </div>
                                </div>

                                <h2 className="block mb-0 text-sm font-medium text-gray-900 dark:text-white">
                                    Select an option
                                </h2>

                                <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                                    {/* SELECT CATEGORY */}
                                    <div>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option selected>
                                                Select Category
                                            </option>
                                            <option value="US">
                                                United States
                                            </option>
                                            <option value="CA">
                                                Canada
                                            </option>
                                        </select>
                                    </div>

                                    {/* SELECTED COLORS */}
                                    <div>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option selected>
                                                Select Colors
                                            </option>
                                            <option value="US">
                                                United States
                                            </option>
                                        </select>
                                    </div>

                                    {/* ENTER QUANITY */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter Quantity"
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
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            )}
   
          
            </section >
        </>
    )
}

export default CuttingDetails;