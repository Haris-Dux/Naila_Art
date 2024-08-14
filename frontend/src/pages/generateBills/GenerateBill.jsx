import React, { useEffect, useState } from 'react'
import { IoAdd } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { GetAllBags, GetAllBranches } from '../../features/InStockSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { generateBuyerBillAsync, getSuitFromDesignAsync } from '../../features/GenerateBillSlice';
import PreviewBill from './PreviewBill';


const GenerateBill = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { Branches } = useSelector((state) => state.InStock);
    const { Bags } = useSelector((state) => state.InStock);
    const { SuitFromDesign } = useSelector((state) => state.BuyerBills);

    const [billData, setBillData] = useState({
        branchId: user?.user?.role === "superadmin" ? "" : user?.user?.branchId,
        serialNumber: '',
        name: '',
        city: '',
        cargo: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        bill_by: '',
        payment_Method: '',
        total: '',
        paid: '',
        remaining: '',
        discount: '',
        packaging: {
            name: '',
            id: '',
            quantity: ''
        },
        suits_data: [
            { id: '', quantity: '', d_no: '', color: '', price: '' }
        ]
    });

    const [suitOptions, setSuitOptions] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    const handlePreviewClick = () => {
        setShowPreview(true);
        window.scrollTo(0, 0);
    };

    const handleReturnClick = () => {
        setShowPreview(false);
    };

    useEffect(() => {
        if (user?.user?.id) {
            dispatch(GetAllBranches({ id: user?.user?.id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        dispatch(GetAllBags());
    }, [dispatch]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update the state with the new value
        const updatedBillData = {
            ...billData,
            [name]: value
        };

        // Convert total and paid to numbers for calculation
        const total = parseInt(updatedBillData.total, 10) || 0;
        const paid = parseInt(updatedBillData.paid, 10) || 0;

        // Calculate remaining value if total or paid has changed
        if (name === 'total' || name === 'paid') {
            updatedBillData.remaining = total - paid;
        }

        setBillData(updatedBillData);
    };

    const handlePackagingChange = (e) => {
        const { name, value } = e.target;

        if (name === "packagingType") {
            const selectedOption = Bags.data.find(bag => bag.id === value);
            setBillData((prevState) => ({
                ...prevState,
                packaging: {
                    ...prevState.packaging,
                    name: selectedOption?.name || '',
                    id: selectedOption?.id || ''
                }
            }));
        } else if (name === "quantity") {
            setBillData((prevState) => ({
                ...prevState,
                packaging: {
                    ...prevState.packaging,
                    quantity: value
                }
            }));
        }
    };

    const handleBranchChange = (e) => {
        const { value } = e.target;
        setBillData((prevState) => ({
            ...prevState,
            branchId: value,
        }));
    };

    const addNewRow = () => {
        setBillData(prevData => ({
            ...prevData,
            suits_data: [
                ...prevData.suits_data,
                { id: '', quantity: '', d_no: '', color: '', price: '' }
            ]
        }));
    };

    const handleSuitDataChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSuitsData = [...billData.suits_data];
        updatedSuitsData[index] = { ...updatedSuitsData[index], [name]: value };
        setBillData(prevData => ({
            ...prevData,
            suits_data: updatedSuitsData
        }));
    };

    const removeRow = (index) => {
        setBillData(prevData => ({
            ...prevData,
            suits_data: prevData.suits_data.filter((_, i) => i !== index)
        }));
    };

    const handleSuitChange = (index, e) => {
        const { name, value } = e.target;
        const newSuitsData = [...billData.suits_data];
        newSuitsData[index][name] = value;

        if (name === 'd_no') {
            dispatch(getSuitFromDesignAsync({ d_no: value })).then(response => {
                if (Array.isArray(response)) {
                    const colors = response.map(item => item.color);
                    setSuitOptions(colors);
                } else {
                    setSuitOptions([]);
                }
            });
        }

        setBillData({ ...billData, suits_data: newSuitsData });
    };

    const handleColorChange = (index, e) => {
        const selectedColor = e.target.value;

        const selectedSuit = SuitFromDesign.find(suit => suit.color === selectedColor);

        setBillData(prevState => {
            const updatedSuitsData = [...prevState.suits_data];
            updatedSuitsData[index] = {
                ...updatedSuitsData[index],
                color: selectedColor,
                id: selectedSuit?.id || '',
            };

            return {
                ...prevState,
                suits_data: updatedSuitsData,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const modifiedBillData = {
            ...billData,
            discount: Number(billData.discount),
            paid: Number(billData.paid),
            remaining: Number(billData.remaining),
            total: Number(billData.total),
            packaging: {
                ...billData.packaging,
                quantity: Number(billData.packaging.quantity)
            },
            suits_data: billData.suits_data.map(suit => ({
                ...suit,
                quantity: Number(suit.quantity),
                d_no: Number(suit.d_no),
                price: Number(suit.price)
            }))
        };


        // Check Branch ID
        if (modifiedBillData.branchId === "") {
            toast.error("Please Select Branch");
            return;
        }

        dispatch(generateBuyerBillAsync(modifiedBillData))
            .then((res) => {
                if (res.payload.succes === true) {
                    setBillData({
                        branchId: '',
                        serialNumber: '',
                        name: '',
                        city: '',
                        cargo: '',
                        phone: '',
                        date: new Date().toISOString().split('T')[0],
                        bill_by: '',
                        payment_Method: '',
                        total: '',
                        paid: '',
                        remaining: '',
                        discount: '',
                        packaging: {
                            name: '',
                            id: '',
                            quantity: ''
                        },
                        suits_data: [
                            { id: '', quantity: '', d_no: '', color: '', price: '' }
                        ]
                    });
                }
            });
    };

    return (
        <>
            {showPreview ? (
                <PreviewBill billData={billData} onReturnClick={handleReturnClick} />
            ) : (
                <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 overflow-y-auto min-h-screen rounded-lg'>
                    <div className="content">
                        <div className="header pt-3 pb-5 w-full border-b">
                            <h2 className="text-3xl font-medium text-center">Generate Bill</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* INPUT FIELDS DETAILS */}
                        <div className="fields">
                            {/* FIRST ROW */}
                            <div className="mb-5 pt-10 grid items-start grid-cols-2 lg:grid-cols-4 gap-5">
                                <div>
                                    <input
                                        name="serialNumber"
                                        type="text"
                                        placeholder="Serial No"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.serialNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="city"
                                        type="text"
                                        placeholder="City"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="cargo"
                                        type="text"
                                        placeholder="Cargo"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.cargo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* SECOND ROW */}
                            <div className="mb-4 grid items-start grid-cols-2 lg:grid-cols-4 gap-5">
                                <div>
                                    <input
                                        name="phone"
                                        type="number"
                                        placeholder="Phone"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="date"
                                        type="date"
                                        placeholder="Date"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.date}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <input
                                        name="bill_by"
                                        type="text"
                                        placeholder="Bill By"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.bill_by}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <select
                                        id="payment-method"
                                        name="payment_Method"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.payment_Method}
                                        onChange={(e) =>
                                            setBillData({ ...billData, payment_Method: e.target.value })
                                        }
                                    >
                                        <option value="" disabled>Select Payment Method</option>
                                        <option value="cashInMeezanBank">Meezan Bank</option>
                                        <option value="cashInJazzCash">Jazz Cash</option>
                                        <option value="cashInEasyPaisa">EasyPaisa</option>
                                        <option value="cashSale">Cash Sale</option>
                                    </select>
                                </div>
                            </div>

                            {/* THIRD ROW */}
                            <div className="mb-4 grid items-start grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <select
                                        id="packaging"
                                        name="packagingType"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.packaging.id}
                                        onChange={handlePackagingChange}
                                    >
                                        <option value="" disabled>Select Packaging</option>
                                        {Bags?.data?.map((bag) => (
                                            <option key={bag.id} value={bag.id}>
                                                {bag.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <input
                                        name="quantity"
                                        type="number"
                                        placeholder="Packaging Quantity"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.packaging.quantity}
                                        onChange={handlePackagingChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name='discount'
                                        type="number"
                                        placeholder="Discount"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.discount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* FORTH ROW */}
                            <div className={`mb-4 grid items-start grid-cols-2 gap-5 ${user?.user?.role === "superadmin" ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                                <div>
                                    <input
                                        name='total'
                                        type="number"
                                        placeholder="Total"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.total}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name='paid'
                                        type="number"
                                        placeholder="Paid"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.paid}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name='remaining'
                                        type="number"
                                        placeholder="Remaining"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={billData.remaining}
                                        readOnly // Set to read-only since it's calculated
                                    />
                                </div>
                                {user?.user?.role === "superadmin" ? (
                                    <div>
                                        <select
                                            id="branches"
                                            name="branchId"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={billData.branchId}
                                            onChange={handleBranchChange}
                                        >
                                            <option value="" disabled>Select Branch</option>
                                            {Branches?.map((branch) => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.branchName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : null}
                            </div>
                        </div>


                        {/* DESIGN FIELDS */}
                        <div className="fields mt-10">
                            {/* header */}
                            <div className="header flex justify-between items-center">
                                <h3 className='text-xl font-medium'>Enter Design Number</h3>

                                <button
                                    type="button"
                                    onClick={addNewRow}
                                    className="inline-block rounded-md border border-gray-700 bg-gray-600 p-1.5 hover:bg-gray-800 focus:outline-none focus:ring-0"
                                >
                                    <IoAdd size={22} className='text-white' />
                                </button>
                            </div>

                            {/* fields */}
                            <div className="mb-5 pt-3 space-y-5">
                                {billData.suits_data.map((suit, index) => (
                                    <div key={index} className="flex items-center justify-between gap-x-4">
                                        <div className="grid items-start grid-cols-1 lg:grid-cols-4 gap-5 w-full">
                                            <div>
                                                <input
                                                    name="d_no"
                                                    type="text"
                                                    placeholder="Design No"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={suit.d_no}
                                                    onChange={(e) => handleSuitChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    id="color"
                                                    name="color"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={suit.color}
                                                    onChange={(e) => handleColorChange(index, e)}
                                                >
                                                    <option value="" disabled>Choose Color</option>
                                                    {SuitFromDesign?.map((item, idx) => (
                                                        <option key={idx} value={item.color}>
                                                            {item.color}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <input
                                                    name='quantity'
                                                    type="number"
                                                    placeholder="Enter Quantity"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={suit.quantity}
                                                    onChange={(e) => handleSuitDataChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    name='price'
                                                    type="number"
                                                    placeholder="Prices"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                    value={suit.price}
                                                    onChange={(e) => handleSuitDataChange(index, e)}
                                                    required
                                                />

                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="inline-block rounded-md border border-red-700 bg-red-700 p-1.5 hover:bg-red-800 text-white"
                                            >
                                                <IoTrashOutline size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-center gap-x-4 pt-6">
                            <button
                                type="button"
                                onClick={handlePreviewClick}
                                className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-gray-500"
                            >
                                Preview Bill
                            </button>
                            <button
                                type="submit"
                                className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-gray-500"
                            >
                                Generate Bill
                            </button>
                        </div>
                    </form>
                </section >
            )}
        </>
    )
}

export default GenerateBill;
