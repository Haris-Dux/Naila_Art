import React from 'react'
import { HiPhone } from "react-icons/hi";

const PreviewBill = () => {
    return (
        <>
            <section className='w-full'>
                <div className="max-w-6xl mx-auto px-4">

                    {/* HEADER */}
                    <div className="header p-4">
                        <div className="grid grid-cols-1 gap-0 lg:grid-cols-3 lg:gap-0">
                            {/* logo */}
                            <div className="logo border-r border-gray-600">
                                <img src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/Naila_1.png?v=1721839653" alt="logo" />
                            </div>

                            {/* company details */}
                            <div className="company_header col-span-2 pl-8 py-6">
                                <h2 className='mb-4 text-2xl font-medium'>Naila Arts</h2>
                                <h2 className='px-3 py-1 inline text-xl rounded-md font-light tracking-wide bg-gray-800 text-white'>ہمارے ہاں ہر قسم کی فینسی رپلیکا کی تمام ورائٹی ہول سیل ریٹ پر دستیاب ہے</h2>
                                <h2 className='mt-4 text-2xl font-medium'>ہول سیل ڈیلر</h2>

                                <div className="mt-6 owner_details flex justify-start items-center gap-x-14">
                                    <div className="bilal space-y-1 flex gap-x-2">
                                        <HiPhone className='mt-3' size={20} />
                                        <div className="details">
                                            <h2 className='font-medium'>Bilal Sheikh</h2>
                                            <p>0324-4103514</p>
                                            <p>0332-4867447</p>
                                        </div>
                                    </div>
                                    <div className="amir space-y-1 flex gap-x-2">
                                        <HiPhone className='mt-3' size={20} />
                                        <div className="details">
                                            <h2 className='font-medium'>Amir Sheikh</h2>
                                            <p>0309-7026733</p>
                                            <p>0335-4299291</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COMPANY DETAILS */}
                    <div className="company_details">
                        <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
                            <div className='flex justify-start items-center'>
                                <span className='w-[7rem]'>Serial No: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                            <div className='flex justify-start items-center'>
                                <span>Name: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                            <div className='flex justify-start items-center'>
                                <span>City: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                            <div className='flex justify-start items-center'>
                                <span>Cargo: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>

                            {/* SECOND ROW */}
                            <div className='flex justify-start items-center'>
                                <span className='text-start'>Phone: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                            <div className='flex justify-start items-center'>
                                <span className='text-start'>Date: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                            <div className='flex justify-start items-center'>
                                <span className='text-start w-[4rem]'>Bill By: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                            <div className='flex justify-start items-center'>
                                <span className='text-start w-[4rem]'>Bill By: </span>
                                <input type="text" className='border-none w-full' readOnly placeholder='____________' />
                            </div>
                        </div>
                    </div>

                    {/* PREVIEW TABLE */}
                    <div className="preview_table mt-8">
                        <div className="table_head">
                            <div className="grid grid-cols-2 gap-0 lg:grid-cols-6 bg-[#252525] text-white">
                                <h2 className='pl-3 border py-3'>Qty</h2>
                                <h2 className='pl-3 border py-3'>Dgn No</h2>
                                <h2 className='col-span-2 pl-3 border py-3'>Colors</h2>
                                <h2 className='pl-3 border py-3'>Rate</h2>
                                <h2 className='pl-3 border py-3'>Amount</h2>
                            </div>
                        </div>
                        <div className="table_body">
                            {[1, 2, 3, 4, 5].map((data, index) => (
                                <div className="grid grid-cols-2 gap-0 lg:grid-cols-6 text-black">
                                    <h2 className='pl-3 border py-3'>{index + 1}</h2>
                                    <h2 className='pl-3 border py-3'>1122</h2>
                                    <h2 className='col-span-2 pl-3 border py-3'>Black</h2>
                                    <h2 className='pl-3 border py-3'>2000</h2>
                                    <h2 className='pl-3 border py-3'>4000</h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="total">
                        <div className="grid grid-cols-2 gap-0 lg:grid-cols-3 text-black">
                            <div className="content col-span-2 py-10">
                                <h2 className='text-3xl font-normal'>بل کہ بغیر مال کی واپسی یا تبدیلی نہیں کی جائے گی</h2>
                            </div>

                            <div className="total border border-gray-400">
                                <div className="total flex bg-[#252525] text-white justify-start items-center w-full">
                                    <h2 className='pl-3 py-3 w-full border-r'>Total</h2>
                                    <h2 className='pl-3 py-3 w-full'></h2>
                                </div>
                                <div className="total flex justify-start items-center w-full">
                                    <h2 className='pl-3 py-3 w-full border-r'>Discount %</h2>
                                    <h2 className='pl-3 py-3 w-full'></h2>
                                </div>
                                <div className="total flex bg-[#252525] text-white justify-start items-center w-full">
                                    <h2 className='pl-3 py-3 w-full border-r'>Advance</h2>
                                    <h2 className='pl-3 py-3 w-full'></h2>
                                </div>
                                <div className="total flex justify-start items-center w-full">
                                    <h2 className='pl-3 py-3 w-full border-r'>Balance</h2>
                                    <h2 className='pl-3 py-3 w-full'></h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACCOUNT DETAILS */}
                    <div className="account_details border-y mt-5 pt-4 pb-10">
                        <h2 className='text-lg font-medium'>Account Detail:</h2>

                        <div className="grid grid-cols-2 gap-0 lg:grid-cols-3 text-black">
                            <div className="mt-2 details space-y-1 border-r">
                                <h2>Title: Bilal Ali</h2>
                                <h2>Bank: Meezan Bank</h2>
                                <h2>Account No: 289379283928323</h2>
                            </div>
                            <div className="mt-2 details space-y-1 border-r pl-4">
                                <h2>Title: Bilal Ali</h2>
                                <h2>Bank: Meezan Bank</h2>
                                <h2>Account No: 289379283928323</h2>
                            </div>
                            <div className="mt-2 details space-y-1 pl-4">
                                <h2>Title: Bilal Ali</h2>
                                <h2>Bank: Meezan Bank</h2>
                                <h2>Account No: 289379283928323</h2>
                            </div>
                        </div>
                    </div>

                    <div className="address text-center py-4">
                        <h2 className='text-xl'>Address: دوکان نمبر UK-66G سنٹر اعظم کلاتھ مارکیٹ لاہور ۔</h2>
                    </div>
                    <div className="address text-center py-4 bg-[#252525] text-white rounded-t-md">
                        <h2 className='text-xl'>ہماری دعا ہے ہم سے لئے گئے مال میں آپکے لئے خیر و برکت ہو۔</h2>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PreviewBill;
