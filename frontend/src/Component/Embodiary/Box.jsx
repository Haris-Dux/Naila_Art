import React,{useState,useEffect} from 'react'
import Select from 'react-select'

import { Link } from "react-router-dom";
import { CreateEmbroidery } from '../../features/EmbroiderySlice';
import { FiPlus } from 'react-icons/fi';
import { useDispatch,useSelector } from "react-redux";

const Box = ({formData1,setFormData1}) => {

const dispatch = useDispatch()


    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]


      const colorItems = [
        { label: 'Red', value: 'Red' },
        { label: 'Green', value: 'Green' },
        { label: 'Blue', value: 'Blue' },
        { label: 'Yellow', value: 'Yellow' },
        { label: 'Cyan', value: 'Cyan' },
        { label: 'Magenta', value: 'Magenta' },
        { label: 'Orange', value: 'Orange' },
        { label: 'Purple', value: 'Purple' },
        { label: 'Pink', value: 'Pink' },
        { label: 'Brown', value: 'Brown' },
        { label: 'Black', value: 'Black' },
        { label: 'White', value: 'White' },
        { label: 'Gray', value: 'Gray' },
        { label: 'Lime', value: 'Lime' },
        { label: 'Navy', value: 'Navy' }
    ];
    


    const calculateTotal = (formData1) => {
        const rate = parseFloat(formData1.rATE_per_stitching) || 450; // Use formData1 rate if available
    
        const stitches = [
            { value: formData1.Front_Stitch, head: formData1.Front_StitchHead },
            { value: formData1.Bazo_Stitch, head: formData1.Bazo_StitchHead },
            { value: formData1.Gala_Stitch, head: formData1.Gala_StitchHead },
            { value: formData1.Back_Stitch, head: formData1.Back_StitchHead },
            { value: formData1.Pallu_Stitch, head: formData1.Pallu_StitchHead },
            { value: formData1.Trouser_Stitch, head: formData1.Trouser_StitchHead },
            { value: formData1.D_Patch_Stitch, head: formData1.D_Patch_StitchHead },
            { value: formData1.F_Patch_Stitch, head: formData1.FF_Patch_StitchHead }
        ];
    
        const total = stitches.reduce((sum, stitch) => {
            const value = parseFloat(stitch.value) || 0;
            const head = parseFloat(stitch.head) || 0;
            const stitchTotal = (value / 1000) * rate * head;
            console.log(`Stitch Value: ${value}, Head: ${head}, Stitch Total: ${stitchTotal}`);
            return sum + stitchTotal;
        }, 0);
    
        console.log(`Total: ${total}`);
        setFormData1(prevState => ({
            ...prevState,
            per_suit: total.toFixed(2) // Assuming you want to keep two decimal places
        }));
        return total;
    };

    const initialShirtRow = { category: "", color: "", quantity_in_no: 0, quantity_in_m: 0, received: 0 };
    const initialDupattaRow = { category: "", color: "", quantity_in_no: 0, quantity_in_m: 0, received: 0 };
    const initialTrouserRow = { category: "", color: "", quantity_in_no: 0, quantity_in_m: 0, received: 0 };
    const initialTissueRow = { category: "", color: "", QuantityInM: 0, QuantityInN: 0 };
    const [formData, setFormData] = useState({
        shirt: [initialShirtRow],
        duppata: [initialDupattaRow],
        trouser: [initialTrouserRow],
        tissue: [initialTissueRow],
   
      });

      const addNewRow = (field) => {
        setFormData(prevState => ({
          ...prevState,
          [field]: [...prevState[field], field === 'shirt' ? initialShirtRow : (field === 'duppata' ? initialDupattaRow : (field === 'trouser' ? initialTrouserRow : initialTissueRow))]
        }));
      };
    
      const handleInputChange = (e, index, type) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedArray = prevState[type].map((item, idx) =>
                idx === index ? { ...item, [name.split('.')[1]]: value } : item
            );
            return { ...prevState, [type]: updatedArray };
        });
    };


    const handleshirtCategory = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            shirt: prevState.shirt.map((item, idx) => 
                idx === index ? { ...item, category: newValue } : item
            )
        }));
    };
    
    const handleshirtColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            shirt: prevState.shirt.map((item, idx) => 
                idx === index ? { ...item, color: newValue } : item
            )
        }));
    };
    


    const handleduppataCategorey = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            duppata: prevState.duppata.map((item, idx) => 
                idx === index ? { ...item, category: newValue } : item
            )
        }));
    };
    
    const handleduppataColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            duppata: prevState.duppata.map((item, idx) => 
                idx === index ? { ...item, color: newValue } : item
            )
        }));
    };
    
    const handleTrouserCategorey = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            trouser: prevState.trouser.map((item, idx) => 
                idx === index ? { ...item, category: newValue } : item
            )
        }));
    };
    
    const handleTrouserColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            trouser: prevState.trouser.map((item, idx) => 
                idx === index ? { ...item, color: newValue } : item
            )
        }));
    };
    
    const handletissueCategorey = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            tissue: prevState.tissue.map((item, idx) => 
                idx === index ? { ...item, category: newValue } : item
            )
        }));
    };
    
    const handletissueColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            tissue: prevState.tissue.map((item, idx) => 
                idx === index ? { ...item, color: newValue } : item
            )
        }));
    };
    


    const handleSubmit = (event) => {

event.preventDefault()
        calculateTotal(formData1)
        const meregdata   = {
            ...formData1,...formData
        }
 console.log('final result',meregdata)
        dispatch(CreateEmbroidery(meregdata)).then(() => {
         
            // closeModal();
           
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

  return (

    <div>   
   <div className="box">
                                    <div className="header flex justify-between items-center">
                                        <p className="mt-3 text-gray-700  dark:text-white">Enter Suit Colors And Quantity:</p>
                                        <p onClick={() => addNewRow('shirt')}><FiPlus size={24} className=' cursor-pointer' /></p>
                                    </div>
                                    {formData.shirt.map((shirt, index) => (
    <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5" key={index}>
        <div>
            <Select options={options} onChange={(newValue) => handleshirtCategory(newValue, index)} />
        </div>
        <div>
            <Select options={colorItems} onChange={(newValue) => handleshirtColor(newValue, index)} />
        </div>
        <div>
            <input
                name="shirt.quantity_in_no"
                type="text"
                placeholder="Enter Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={shirt.quantity_in_no} // Accessing the quantity_in_no property of the shirt object
                onChange={(e) => handleInputChange(e, index, 'shirt')} // Passing index and type to handleInputChange
            />
        </div>
        <div>
            <input
                name="shirt.quantity_in_m"
                type="text"
                placeholder="Enter Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={shirt.quantity_in_m} // Accessing the quantity_in_m property of the shirt object
                onChange={(e) => handleInputChange(e, index, 'shirt')} // Passing index and type to handleInputChange
            />
        </div>
    </div>
))}


<div className="header flex justify-between items-center">

                                        <p className="mt-3 text-gray-700  dark:text-white">Enter Duppta Colors And Quantity :</p>
                                        <p onClick={() => addNewRow('duppata')}><FiPlus size={24} className=' cursor-pointer' /></p>

                                             </div>


                                             {formData.duppata.map((duppata, index) => (
    <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
        <div>
            <Select options={options} onChange={(newValue) => handleduppataCategorey(newValue, index)} />
        </div>
        <div>
            <Select options={colorItems} onChange={(newValue) => handleduppataColor(newValue, index)} />
        </div>
        <div>
            <input
                          name="duppata.quantity_in_no"

                type="text"
                placeholder="Enter Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={duppata.quantity_in_no}
                onChange={(e) => handleInputChange(e, index, 'duppata')}
            />
        </div>
        <div>
            <input
                                name="duppata.quantity_in_m"

                type="text"
                placeholder="Enter Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={duppata.quantity_in_m}
                onChange={(e) => handleInputChange(e, index, 'duppata')}
            />
        </div>
    </div>
))}


                                    <div className="header flex justify-between items-center">

                                        <p className="mt-3 text-gray-700  dark:text-white"> Enter Trousers Colors And Quantity :</p>
                                        <p onClick={() => addNewRow('trouser')}><FiPlus size={24} className=' cursor-pointer' /></p>
</div>


{formData.trouser.map((trouser, index) => (
    <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
        <div>
            <Select options={options} onChange={(newValue) => handleTrouserCategorey(newValue, index)} />
        </div>
        <div>
            <Select options={colorItems} onChange={(newValue) => handleTrouserColor(newValue, index)} />
        </div>
        <div>
            <input
                                          name="trouser.quantity_in_no"

                type="text"
                placeholder="Enter Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={trouser.quantity_in_no}
                onChange={(e) => handleInputChange(e, index, 'trouser')}
            />
        </div>
        <div>
            <input
                                              name="trouser.quantity_in_m"

                type="text"
                placeholder="Enter Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={trouser.quantity_in_m}
                onChange={(e) => handleInputChange(e, index, 'trouser')}
            />
        </div>
    </div>
))}


<div className="header flex justify-between items-center">

                                        <p className="mt-3 text-gray-700  dark:text-white">   Enter Tissue Colors And Quantity :</p>


                                        <p onClick={() => addNewRow('tissue')}><FiPlus size={24} className=' cursor-pointer' /></p>
</div>


{formData.tissue.map((tissue, index) => (
    <div className="mt-3 grid items-start grid-cols-1 lg:grid-cols-4 gap-5">
        <div>
            <Select options={options} onChange={(newValue) => handletissueCategorey(newValue, index)} />
        </div>
        <div>
            <Select options={colorItems} onChange={(newValue) => handletissueColor(newValue, index)} />
        </div>
        <div>
            <input
            name="tissue.QuantityInN"

                type="text"
                placeholder="Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={tissue.QuantityInN}
                onChange={(e) => handleInputChange(e, index, 'tissue')}
            />
        </div>
        <div>
            <input
            name="tissue.QuantityInM"
                type="text"
                placeholder="Quantity In M"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={tissue.QuantityInM}
                onChange={(e) => handleInputChange(e, index, 'tissue')}
            />
        </div>
    </div>
))}

                                </div>


<div className="flex justify-center pt-2">
<button
onClick={handleSubmit}
    className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
>
    Submit
</button>
</div>


</div>
  )
}

export default Box
