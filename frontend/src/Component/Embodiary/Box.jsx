import React,{useState,useEffect} from 'react'
import Select from 'react-select'

import { Link } from "react-router-dom";
import { CreateEmbroidery } from '../../features/EmbroiderySlice';
import { FiPlus } from 'react-icons/fi';
import { useDispatch,useSelector } from "react-redux";
import { GetAllBase } from '../../features/InStockSlice';
const Box = ({formData1,setFormData1}) => {
    const { loading,Base } = useSelector((state) => state.InStock);

const dispatch = useDispatch()
const [categoryOptions, setCategoryOptions] = useState([]);
const [colorOptions, setColorOptions] = useState([]);

useEffect(() => {
    if (!loading && Base) {
        // Extract unique categories
        const categories = [...new Set(Base.map(item => item.category))];
        const categoryOptions = categories.map(category => ({
            value: category,
            label: category
        }));
        setCategoryOptions(categoryOptions);
    }
}, [loading, Base]);


console.log(Base)

useEffect(() => {
    dispatch(GetAllBase())
     }, [])







    const calculateTotal = (formData1) => {
        const rate = parseFloat(formData1.rATE_per_stitching) || 450; // Use formData1 rate if available
console.log('rate',rate)
        const stitches = [
            { value: formData1.Front_Stitch.value, head: formData1.Front_Stitch.head },
            { value: formData1.Bazo_Stitch.value, head: formData1.Bazo_Stitch.head },
            { value: formData1.Gala_Stitch.value, head: formData1.Gala_Stitch.head },
            { value: formData1.Back_Stitch.value, head: formData1.Back_Stitch.head },
            { value: formData1.Pallu_Stitch.value, head: formData1.Pallu_Stitch.head },
            { value: formData1.Trouser_Stitch.value, head: formData1.Trouser_Stitch.head },
            { value: formData1.D_Patch_Stitch.value, head: formData1.D_Patch_Stitch.head },
            { value: formData1.F_Patch_Stitch.value, head: formData1.F_Patch_Stitch.head }
        ];
    
        const total = stitches.reduce((sum, stitch) => {
            const value = parseFloat(stitch.value) || 0;
            console.log('statiych valye',value)
            const head = parseFloat(stitch.head) || 0;
            console.log('statiych head',head)

            const stitchTotal = (value / 1000) * rate * head;
        
            return sum + stitchTotal;
        }, 0);
    
     
        return total;
    };

    const initialShirtRow = { category: "", color: "", quantity_in_no: 0, quantity_in_m: 0,  };
    const initialDupattaRow = { category: "", color: "", quantity_in_no: 0, quantity_in_m: 0,  };
    const initialTrouserRow = { category: "", color: "", quantity_in_no: 0, quantity_in_m: 0,  };
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
                idx === index ? { ...item, [name.split('.')[1]]: parseFloat(value) } : item
            );
            return { ...prevState, [type]: updatedArray };
        });
    };
    


    const handleshirtCategory = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            shirt: prevState.shirt.map((item, idx) =>
                idx === index ? { ...item, category: newValue.value } : item
            )
        }));
        console.log('selected value:', newValue);
    
        // Perform a case-insensitive comparison
        const selectedCategory = Base.filter(item =>
            item.category.toLowerCase() === newValue.value.toLowerCase()
        );
    
        const selectedCategoryColors = selectedCategory.map(item => ({
            value: item.colors,
            label: item.colors
        }));
    
    
        setColorOptions(selectedCategoryColors);
    };
    
    
    const handleshirtColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            shirt: prevState.shirt.map((item, idx) => 
                idx === index ? { ...item, color: newValue.value } : item
            )
        }));

       


    };
    


    const handleduppataCategorey = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            duppata: prevState.duppata.map((item, idx) => 
                idx === index ? { ...item, category: newValue.value } : item
            )
        }));
        const selectedCategory = Base.filter(item =>
            item.category.toLowerCase() === newValue.value.toLowerCase()
        );
    
        const selectedCategoryColors = selectedCategory.map(item => ({
            value: item.colors,
            label: item.colors
        }));
    
    
        setColorOptions(selectedCategoryColors);
    };
    
    const handleduppataColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            duppata: prevState.duppata.map((item, idx) => 
                idx === index ? { ...item, color: newValue.value } : item
            )
        }));
    };
    
    const handleTrouserCategorey = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            trouser: prevState.trouser.map((item, idx) => 
                idx === index ? { ...item, category: newValue.value } : item
            )
        }));
        const selectedCategory = Base.filter(item =>
            item.category.toLowerCase() === newValue.value.toLowerCase()
        );
    
        const selectedCategoryColors = selectedCategory.map(item => ({
            value: item.colors,
            label: item.colors
        }));
    
    
        setColorOptions(selectedCategoryColors);
    };
    
    const handleTrouserColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            trouser: prevState.trouser.map((item, idx) => 
                idx === index ? { ...item, color: newValue.value } : item
            )
        }));
    };
    
    const handletissueCategorey = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            tissue: prevState.tissue.map((item, idx) => 
                idx === index ? { ...item, category: newValue.value } : item
            )
        }));
        const selectedCategory = Base.filter(item =>
            item.category.toLowerCase() === newValue.value.toLowerCase()
        );
    
        const selectedCategoryColors = selectedCategory.map(item => ({
            value: item.colors,
            label: item.colors
        }));
    
    
        setColorOptions(selectedCategoryColors);
    };
    
    const handletissueColor = (newValue, index) => {
        setFormData(prevState => ({
            ...prevState,
            tissue: prevState.tissue.map((item, idx) => 
                idx === index ? { ...item, color: newValue.value } : item
            )
        }));
    };
    


    const handleSubmit = (event) => {



event.preventDefault();

const total = calculateTotal(formData1);

// Update formData1 with the new per_suit value
const updatedFormData1 = {
    ...formData1,
    per_suit:parseFloat(total.toFixed(2))  // Assuming you want to keep two decimal places
};

// Merge updatedFormData1 with formData
const meregdata = {
    ...updatedFormData1,
    ...formData
};

console.log('final result', meregdata);

dispatch(CreateEmbroidery(meregdata)).then(() => {
    dispatch(GetAllBase());
    // closeModal(); // Uncomment if you want to close the modal after submission
}).catch((error) => {
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
            <Select options={categoryOptions} onChange={(newValue) => handleshirtCategory(newValue, index)} />
        </div>
        <div>
            <Select options={colorOptions} onChange={(newValue) => handleshirtColor(newValue, index)} />
        </div>
        <div>
            <input
                name="shirt.quantity_in_no"
                type='number'

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
                type='number'

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
            <Select options={categoryOptions} onChange={(newValue) => handleduppataCategorey(newValue, index)} />
        </div>
        <div>
            <Select options={colorOptions} onChange={(newValue) => handleduppataColor(newValue, index)} />
        </div>
        <div>
            <input
                          name="duppata.quantity_in_no"

                          type='number'

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

                                type='number'

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
            <Select options={categoryOptions} onChange={(newValue) => handleTrouserCategorey(newValue, index)} />
        </div>
        <div>
            <Select options={colorOptions} onChange={(newValue) => handleTrouserColor(newValue, index)} />
        </div>
        <div>
            <input
                                          name="trouser.quantity_in_no"

            type='number'
               
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

                           type='number'

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
            <Select options={categoryOptions} onChange={(newValue) => handletissueCategorey(newValue, index)} />
        </div>
        <div>
            <Select options={colorOptions} onChange={(newValue) => handletissueColor(newValue, index)} />
        </div>
        <div>
            <input
            name="tissue.QuantityInN"

                type='number'
                placeholder="Quantity In No"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={tissue.QuantityInN}
                onChange={(e) => handleInputChange(e, index, 'tissue')}
            />
        </div>
        <div>
            <input
            name="tissue.QuantityInM"
            type='number'
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
