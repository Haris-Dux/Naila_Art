import { useCallback, useEffect, useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { GetAllBranches } from '../../features/InStockSlice';
import { validatePartyNameForMainBranchAsync, validatePartyNameForOtherBranchAsync } from '../../features/CashInOutSlice';
import moment from "moment-timezone";


const CashInOut = () => {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [validatePartyName, setvalidatePartyName] = useState();
    const [selectedParty, setSelectedParty] = useState();

    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

    const { user } = useSelector((state) => state.auth);
    const { Branches } = useSelector((state) => state.InStock);
    const { loading, mainBranchResponse, otherBranchResponse } = useSelector((state) => state.CashInOut);

    const [formData, setFormData] = useState({
        partyId: '',
        branchId: '',
        cash: '',
        date: today,
        payment_Method: '',
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBranchChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            branchId: value,
        }));
    };

    const handleValidateParty = useCallback((e) => {
        const value = e.target.value;
        setvalidatePartyName(value);

        if (value.length > 0) {
            const validateParty = user?.user?.role === "superadmin"
                ? validatePartyNameForMainBranchAsync
                : validatePartyNameForOtherBranchAsync;

            const timer = setTimeout(() => {
                dispatch(validateParty({ name: value }));
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [dispatch, user?.user?.role]);

    useEffect(() => {
        return () => {
            clearTimeout(handleValidateParty);
        };
    }, [handleValidateParty]);


    const handleSelectParty = (party) => {
        setSelectedParty(party);
        setFormData((prevData) => ({
            ...prevData,
            partyId: party?.id,
        }));
        closeModal();
    }

    console.log('formData', formData);

    const openModal = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        setIsOpen(false);
        setvalidatePartyName("");
        document.body.style.overflow = 'auto';
    };


    useEffect(() => {
        if (user?.user?.id) {
            dispatch(GetAllBranches({ id: user?.user?.id }));
        }
    }, [dispatch, user]);

    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-screen rounded-lg'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-4 lg:gap-6">
                    <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                        <div className="stat_data pl-4">
                            <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                                Today Cash In
                            </h3>
                            <div className="mt-3 flex justify-start items-center gap-3">
                                <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                                    232,789
                                </span>
                                <span className="text-gray-900 bg-gray-200 text-sm px-3 py-1 w-16 rounded-md">
                                    +1.5k
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                        <div className="stat_data pl-4">
                            <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                                Today Cash Out
                            </h3>
                            <div className="mt-3 flex justify-start items-center gap-3">
                                <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                                    232,789
                                </span>
                                <span className="text-gray-900 bg-gray-200 text-sm px-3 py-1 w-16 rounded-md">
                                    +1.5k
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-28 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex justify-start items-center">
                        <div className="stat_data pl-4">
                            <h3 className="text-gray-900 dark:text-gray-100 mt-1.5 text-md font-normal">
                                Today Cash In Hand
                            </h3>
                            <div className="mt-3 flex justify-start items-center gap-3">
                                <span className="text-gray-900 dark:text-gray-100 text-2xl font-semibold">
                                    232,789
                                </span>
                                <span className="text-gray-900 bg-gray-200 text-sm px-3 py-1 w-16 rounded-md">
                                    +1.5k
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* -------------- HEADER -------------- */}
                <div className="mt-4 header flex justify-between items-center pt-6 mx-2">
                    <h1 className='text-gray-800 dark:text-gray-200 text-3xl font-medium'>Cash In/Out</h1>
                </div>

                <p className='w-full bg-gray-300 h-px mt-5'></p>


                <div className="data mt-8">
                    <div className="mb-5 grid items-start grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* CASH */}
                        <div>
                            <input
                                name="cash"
                                type="number"
                                placeholder="Cash"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                value={formData?.cash}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* CHOOSE BRANCH NAME */}
                        {user?.user?.role === "superadmin" ? (
                            <div>
                                <select
                                    id="branches"
                                    name="branchId"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={formData.branchId}
                                    onChange={handleBranchChange}
                                >
                                    <option value="" disabled>Select Branch</option>
                                    {Branches?.map((branch) => (
                                        <option key={branch?.id} value={branch?.id}>
                                            {branch?.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : null}

                        {/* SELECT PARTY NAME */}
                        <div>
                            <input
                                name="partyId"
                                type="text"
                                placeholder="Select Party"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                onClick={openModal}
                                value={selectedParty?.name}
                                required
                                readOnly
                            />
                        </div>

                        {/* SELECTED PAYMENT METHOD */}
                        <div>
                            <select
                                id="payment-method"
                                name="payment_Method"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                value={formData?.payment_Method}
                                onChange={(e) =>
                                    setFormData({ ...formData, payment_Method: e.target.value })
                                }
                            >
                                <option value="" disabled>Select Payment Method</option>
                                <option value="cashInMeezanBank">Meezan Bank</option>
                                <option value="cashInJazzCash">Jazz Cash</option>
                                <option value="cashInEasyPaisa">EasyPaisa</option>
                                <option value="cashSale">Cash Sale</option>
                            </select>
                        </div>

                        {/* DATE */}
                        <div>
                            <input
                                type="date"
                                placeholder="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                value={formData?.date}
                                required
                                readOnly
                            />
                        </div>

                        <div className='cashIn'>
                            <button className='w-full rounded-md bg-[#04D000] text-white py-3'>
                                Cash In
                            </button>
                        </div>
                        <div className='cashOut'>
                            <button className='w-full rounded-md bg-[#E82B2B] text-white py-3'>
                                Cash Out
                            </button>
                        </div>
                    </div>
                </div>
            </section >


            {isOpen && (
                <div
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-gray-800 bg-opacity-50"
                >
                    <div className="relative py-8 px-3 w-full max-w-2xl max-h-full bg-white rounded-md shadow dark:bg-gray-700 overflow-y-auto">
                        {/* ------------- HEADER ------------- */}
                        <div className="flex items-center justify-between flex-col p-3 rounded-t dark:border-gray-600">
                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                                Search Party Name
                            </h3>
                        </div>

                        {/* ------------- BODY ------------- */}
                        <div className="px-3">
                            <div className="search_user flex justify-center flex-col pt-6 mt-0">
                                <input
                                    type="text"
                                    className="w-full py-2 pl-6 pr-4 text-gray-800 dark:text-gray-200 bg-transparent border border-[#D9D9D9] rounded-lg focus:border-[#D9D9D9] focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-[#D9D9D9] placeholder:text-sm dark:placeholder:text-gray-300"
                                    placeholder="Search by name"
                                    value={validatePartyName}
                                    onChange={handleValidateParty}
                                />

                                {user?.user?.role === "user" ? (
                                    <>
                                        {loading ? (
                                            <>
                                                <div className="py-6 flex justify-center items-center">
                                                    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {validatePartyName?.length > 0 && mainBranchResponse && mainBranchResponse?.Data && mainBranchResponse?.Data.length > 0 ? (
                                                    <ul className="mt-4 max-h-60 overflow-y-auto rounded-lg">
                                                        {mainBranchResponse?.Data[0].map((data) => (
                                                            <li key={data?.id}>
                                                                <button
                                                                    onClick={() => handleSelectParty(data)}
                                                                    className='py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between'>
                                                                    <span>{data?.name}</span><span>{data?.phone}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                        {mainBranchResponse?.Data[1].map((data) => (
                                                            <li key={data?.id}>
                                                                <button
                                                                    onClick={() => handleSelectParty(data)}
                                                                    className='py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between'>
                                                                    <span>{data?.name}</span><span>{data?.phone}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="mt-4 text-gray-600 pl-4">No matching buyers found.</p>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {loading ? (
                                            <>
                                                <div className="py-6 flex justify-center items-center">
                                                    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full " role="status" aria-label="loading">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {validatePartyName?.length > 0 && mainBranchResponse && mainBranchResponse?.Data && mainBranchResponse?.Data.length > 0 ? (
                                                    <ul className="mt-4 max-h-60 overflow-y-auto rounded-lg">
                                                        {mainBranchResponse?.Data[0].map((data) => (
                                                            <li key={data?.id}>
                                                                <button
                                                                    onClick={() => handleSelectParty(data)}
                                                                    className='py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between'>
                                                                    <span>{data?.name}</span><span>{data?.phone}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                        {mainBranchResponse?.Data[1].map((data) => (
                                                            <li key={data?.id}>
                                                                <button
                                                                    onClick={() => handleSelectParty(data)}
                                                                    className='py-2 px-4 border-b rounded hover:bg-gray-100 w-full flex justify-between'>
                                                                    <span>{data?.name}</span><span>{data?.phone}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="mt-4 text-gray-600 pl-4">No matching buyers found.</p>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="button absolute top-3 right-3">
                            <button
                                onClick={closeModal}
                                className="end-2.5 bg-gray-100 text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                    </div>
                </div >
            )}
        </>
    );
}

export default CashInOut;
