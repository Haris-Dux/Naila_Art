import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { GETEmbroiderySIngle, UpdateEmbroidery } from "../../../features/EmbroiderySlice";
import { useSelector } from "react-redux";
const EmbroideryDetails = () => {
    const { id } = useParams();
const dispatch = useDispatch()

const { loading,SingleEmbroidery } = useSelector((state) => state.Embroidery);


const initialShirtRow = { category: "", color: "",  received:0 ,   };
const initialDupattaRow = { category: "", color: "",  received:0 ,   };
const initialTrouserRow = { category: "", color: "",  received:0 ,   };

const [formData, setFormData] = useState({
    shirt: [initialShirtRow],
    duppata: [initialDupattaRow],
    trouser: [initialTrouserRow],
project_status: "Completed",
id:id

  });



  const handleInputChange = (category, color, received, index, section) => {
    setFormData((prevState) => ({
        ...prevState,
        [section]: prevState[section].map((item, idx) =>
            idx === index ? { ...item, category, color, received } : item
        ),
    }));
};

    useEffect(() => {
        const data = {
            id:id
        }
        dispatch(GETEmbroiderySIngle(data))
         }, [id,dispatch])



         if (loading) {
            return (    
                <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>

            <div className="pt-16 flex justify-center mt-12 items-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
       </section>
        );
        
        }
    
        if (!SingleEmbroidery) {
            return <div>No data found.</div>;
        }
    
        const { partyName, serial_No, date, per_suit, project_status, design_no, shirt, duppata, trouser, T_Quantity_In_m, T_Quantity, Front_Stitch, Bazo_Stitch, Gala_Stitch, Back_Stitch, Pallu_Stitch, Trouser_Stitch, D_Patch_Stitch, F_Patch_Stitch, tissue } = SingleEmbroidery;



        const handleSubmit = (event) => {



            event.preventDefault();
            
           
            
            dispatch(UpdateEmbroidery(formData))
            .then(() => {
                dispatch(GETEmbroiderySIngle());
                closeModal();
            })
            .catch((error) => {
                console.error("Error:", error);
            });



                };



    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                {/* -------------- HEADER -------------- */}
                <div className="header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Embroidery Details</h1>
                </div>

                {/* -------------- DETAILS SECTION -------------- */}
                <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5 border border-gray-300 dark:border-gray-500 bg-[#F7F7F7] dark:bg-gray-800 rounded-md">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-x-2.5 gap-y-5 text-sm">
                        {/* FIRST ROW */}
                        <div className="box">
                            <span className="font-medium">Party Name:</span>
                            <span> {partyName}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Serial No:</span>
                            <span> {serial_No}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Date:</span>
                            <span>{date}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Per Suit:</span>
                            <span> {per_suit}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Project Status:</span>
                            <span className="text-green-600"> {project_status}</span>
                        </div>
                        {/* SECOND ROW */}
                        <div className="box">
                            <span className="font-medium">Design No:</span>
                            <span> {design_no}</span>
                        </div>
                        {shirt?.map((item, index) => (
                            <div key={index} className="box">
                                <span className="font-medium">Shirt M: {index + 1}:</span>
                                <span>  {item.quantity_in_m} m</span>
                            </div>
                        ))}
                     
                     {duppata?.map((item, index) => (
                            <div key={index} className="box">
                                <span className="font-medium">Dupatta M: {index + 1}:</span>
                                <span>  {item.quantity_in_m} m</span>
                            </div>
                        ))}
                       {trouser?.map((item, index) => (
                            <div key={index} className="box">
                                <span className="font-medium">Trouser M {index + 1}:</span>
                                <span>  {item.quantity_in_m} m</span>
                            </div>
                        ))}
                     
                      
                        <div className="box">
                            <span className="font-medium">Received Suit:</span>
                            <span> ---</span>
                        </div>
                        {/* THIRD ROW */}
                        <div className="box">
                            <span className="font-medium">T Quantity In M:</span>
                            <span> {T_Quantity_In_m} m</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">T Quantity:</span>
                            <span> {T_Quantity} Suit</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Front Stitch:</span>
                            <span> {Front_Stitch?.head}, {Front_Stitch?.value}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Bazo Stitch:</span>
                            <span> {Bazo_Stitch?.head}, {Bazo_Stitch?.value}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Gala Stitch:</span>
                            <span> {Gala_Stitch?.head}, {Gala_Stitch?.value}</span>
                        </div>
                        {/* FORTH ROW */}
                        <div className="box">
                            <span className="font-medium">Back Stitch:</span>
                             <span> {Back_Stitch?.head}, {Back_Stitch?.value}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Pallu Stitch:</span>
                             <span> {Pallu_Stitch?.head}, {Pallu_Stitch?.value}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">Trouser Stitch:</span>
                            <span> {Trouser_Stitch?.head}, {Trouser_Stitch?.value}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">D Patch Stitch:</span>
                            <span> {D_Patch_Stitch?.head}, {D_Patch_Stitch?.value}</span>
                        </div>
                        <div className="box">
                            <span className="font-medium">F Patch Stitch:</span>
                             <span> {F_Patch_Stitch?.head}, {F_Patch_Stitch?.value}</span>
                        </div>

                        {/* FIFTH ROW */}
                      
                        
                        <div className="box">
                            <span className="font-medium">Tissue:</span>
                            <span> {tissue} m</span>
                        </div>
                        
                    </div>
                </div>

                {/* -------------- RECEIVED STOCK SECTION -------------- */}
                <div className="details mx-2 mt-8 px-3 text-gray-800 dark:text-gray-200 py-5">
                    <div className="grid items-start grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-5 text-sm">
                        <div className="box_1">
                            <h3 className="mb-4 font-semibold text-lg">Received Shirts Colors</h3>

                            <div className="details space-y-2">
                            {shirt?.map((item) => (
                        <div key={item.id} className="details_box flex items-center gap-x-3">
                            <p>{item.category} - {item.color}</p>
                            <input 
                    type="text" 
                    className=" py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black" 

                    value={item.received} 
                    onChange={(e) => handleInputChange(item.category, item.color, e.target.value, index, 'shirt')} 
                />
                        </div>
                    ))}
                            </div>
                        </div>

                        <div className="box_2">
                            <h3 className="mb-4 font-semibold text-lg">Received Dupatta Colors</h3>

                            <div className="details space-y-2">
                            {duppata?.map((item) => (
                        <div key={item.id} className="details_box flex items-center gap-x-3">
                            <p>{item.category} - {item.color}</p>
                            <input 
                    type="text" 
                    className=" py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black" 
                    value={item.received} 
                    onChange={(e) => handleInputChange(item.category, item.color, e.target.value, index, 'duppata')} 
                />
                        </div>
                    ))}
                            </div>
                        </div>

                        <div className="box_3">
                            <h3 className="mb-4 font-semibold text-lg">Received Trousers Colors</h3>

                            <div className="details space-y-2">
                            {trouser?.map((item) => (
                        <div key={item.id} className="details_box flex items-center gap-x-3">
                            <p>{item.category} - {item.color}</p>
                            <input 
                    type="text" 
                    className=" py-1 border-gray-300 w-[4.5rem] px-1 rounded-sm text-black dark:text-black" 
 
                    value={item.received} 
                    onChange={(e) => handleInputChange(item.category, item.color, e.target.value, index, 'trouser')} 
                />
                        </div>
                    ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* -------------- BUTTONS BAR -------------- */}
                <div className="mt-10 flex justify-center items-center gap-x-5">
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800" onClick={handleSubmit}>Completed</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Bill</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Generate Gate Pass</button>
                    <button className="px-4 py-2.5 text-sm rounded bg-[#252525] dark:bg-gray-200 text-white dark:text-gray-800">Next Step</button>
                </div>
            </section >
        </>
    )
}

export default EmbroideryDetails
