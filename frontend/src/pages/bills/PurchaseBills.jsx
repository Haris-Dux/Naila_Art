import { useEffect, useState } from 'react'
import data from './PurchaseBillsData';
import { Link, useSearchParams } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import CategoryTable from './CategoryTable';
import BaseModals from './Modals/BaseModals';
import LaceModal from './Modals/LaceModal';
import BagModal from './Modals/BagModal';
import AccessoriesModal from './Modals/AccessoriesModal';
import ExpenseModal from './Modals/ExpenseModal';
import { useDispatch } from 'react-redux';
import { GetAllBags, GetAllBase, GetAllExpense, GetAllLace, GetAllaccessories } from '../../features/InStockSlice';

const PurchaseBills = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);

    const [selectedCategory, setSelectedCategory] = useState('Base');
    // const filteredData = data.filter(item => item.category === selectedCategory);

    useEffect(() => {
        dispatch(GetAllBase())
        dispatch(GetAllLace())
        dispatch(GetAllBags())
        dispatch(GetAllaccessories())
        dispatch(GetAllExpense({ page }))
    }, [])

    const handleTabClick = (category) => {
        setSelectedCategory(category);
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
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Purchase Bills
                    </h1>

                    {/* <!-- search bar --> */}
                    <div className="search_bar mr-2">
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
                                placeholder="Search by Bill Number"
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
                        {['Base', 'Lace', 'Bag & Box', 'Accessories', 'Expense']?.map((category) => (
                            <button
                                key={category}
                                className={`border border-gray-500  text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md ${selectedCategory === category ? 'bg-gray-800 text-white dark:bg-gray-600  dark:text-white' : ''}`}
                                onClick={() => handleTabClick(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
                        <IoAdd size={22} className='text-white' />
                    </button>
                </div>

                <CategoryTable category={selectedCategory} />
            </section >



            {/* ALL MODALS  */}
            {selectedCategory === 'Base' && <BaseModals isOpen={isOpen} closeModal={closeModal} />}
            {selectedCategory === 'Lace' && <LaceModal isOpen={isOpen} closeModal={closeModal} />}
            {selectedCategory === 'Bag & Box' && <BagModal isOpen={isOpen} closeModal={closeModal} />}
            {selectedCategory === 'Accessories' && <AccessoriesModal isOpen={isOpen} closeModal={closeModal} />}
            {selectedCategory === 'Expense' && <ExpenseModal isOpen={isOpen} closeModal={closeModal} />}

           
        </>
    )
}

export default PurchaseBills
