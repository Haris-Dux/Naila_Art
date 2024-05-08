import React ,{ useState,useEffect}  from 'react'
import { IoAdd, IoPencilOutline, IoTrash } from "react-icons/io5";
import { useDispatch,useSelector } from "react-redux";
import { DeleteShop, GetAllShop, UpdateShopAsync, createShopAsync } from '../../features/ShopSlice';
import { GetUserBYBranch } from '../../features/authSlice';

const Shop = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const { loading,Shop } = useSelector((state) => state.Shop);
    const { getUsersForBranch } = useSelector((state) => state.auth);
    const [editShop, setEditShop] = useState(null);
    const [deleteId, setDeleteId] = useState(null); // State to st
    const [formData, setFormData] = useState({
        branchName: "",
    });
    const [DeleteModal, setDeleteModal] = useState(false);

    console.log('user data',getUsersForBranch)


    useEffect(() => {
   dispatch(GetAllShop())
    }, [])
    
    const handleEdit = (shop) => {
        setEditShop(shop);
        setFormData({ branchName: shop.branchName }); // Set form data for editing
        setIsOpen(true);
       
    };

    const handleDelete = (shopId) => {
        setDeleteId(shopId); // Set the ID of the shop to be deleted
        setDeleteModal(true); // Open confirmation modal
    };
    const confirmDelete = () => {
        if (deleteId) {
            dispatch(DeleteShop(deleteId))
                .then(() => {
                    dispatch(GetAllShop());
                    setDeleteModal(false); // Close modal after deletion
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData};
        if (editShop) {
            data._id = editShop._id; 

            console.log('delete icon',data)
            dispatch(UpdateShopAsync(data))
                .then(() => {
                    setFormData({ branchName: "" });
                    setEditShop(null);
                    closeModal();
                    dispatch(GetAllShop());
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            dispatch(createShopAsync(data))
                .then(() => {
                    setFormData({ branchName: "" });
                    closeModal();
                    dispatch(GetAllShop());
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };


    const fetchbrachUser = (branchId) => {
        const data = {
            branchId: branchId
        };
        dispatch(GetUserBYBranch(data));
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
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Shop</h1>

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
                                placeholder="Search by Design Number"
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
                    {Shop?.map((data) => (
    <button 
      onClick={() => fetchbrachUser(data?._id)}  className='inline-flex gap-4   border border-gray-500 bg-white dark:bg-gray-700 text-black dark:text-gray-100 px-5 py-2 mx-2 text-sm rounded-md' 
       
        key={data?._id} // Adding a key prop
    >
        {data?.branchName}


        <IoPencilOutline size={22} className='text-white' onClick={() => handleEdit(data)} />
        <IoTrash size={22} className='text-white' onClick={() => handleDelete(data._id)} />

    </button>
))}



                     
                    </div>

                    <button onClick={openModal} className="inline-block rounded-sm border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0">
                        <IoAdd size={22} className='text-white' />
                    </button>
                </div>


                {/* -------------- TABLE -------------- */}
                <div className="relative overflow-x-auto mt-5 ">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm text-gray-700  bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    D# No
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Colors
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Quantity
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Cost Prices
                                </th>
                                <th
                                    className="px-6 py-3"
                                    scope="col"
                                >
                                    Sales Prices
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {data.map((data, index) => (
                                <tr key={index} className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        scope="row"
                                    >
                                        {data.design_no}
                                    </th>
                                    <td className="px-6 py-4">
                                        {data.colors}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        Rs {data.cost_pirce}
                                    </td>
                                    <td className="px-6 py-4">
                                        {data.sale_pirce}
                                    </td>
                                </tr>
                            ))} */}
                        </tbody>
                    </table>
                </div>
            </section>

{isOpen && (
    <div
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
    >
        <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
            {/* ------------- HEADER ------------- */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editShop ? 'Edit Shop' : 'Add New Shop'}
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
                <form  className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="branchName"
                            type="text"
                            placeholder="Enter Shop Name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                            value={ formData.branchName}
                            onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}

                        />
                    </div>
                  

                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indgrayigo-500"
                        >
                           {editShop ? "Update": "Submit" }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)}



{DeleteModal && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-4 px-3 w-full max-w-md max-h-full bg-white rounded-md shadow dark:bg-gray-700">
                        <div className="p-5">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Are you sure you want to delete this shop?</h2>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setDeleteModal(false)}
                                    className="inline-block rounded border border-gray-600 bg-gray-600 px-4 py-2 text-sm font-medium text-white mr-2 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="inline-block rounded border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

</>

  )
}

export default Shop