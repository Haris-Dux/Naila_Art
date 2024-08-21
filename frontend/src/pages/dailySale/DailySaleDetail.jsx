import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDailySaleByIdAsync } from "../../features/DailySaleSlice";

const DailySaleDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { loading, DailySaleById } = useSelector((state) => state.DailySale);

    useEffect(() => {
        if (id) {
            dispatch(getDailySaleByIdAsync({ id }));
        }
    }, [dispatch, id]);

    return (
        <>

            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg">
                {loading ? (
                    <div className="pt-16 flex justify-center mt-12 items-center">
                        <div
                            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
                            role="status"
                            aria-label="loading"
                        >
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="content">
                        {/* HEADER */}
                        <div className="header pt-3 pb-4 w-full border-b">
                            <h2 className="text-3xl font-medium text-center">Daily Sale</h2>
                        </div>

                        {/* ALL ENTRIES */}
                        <div className="data px-6 pt-12 w-full">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-12">
                                {/* -------- LEFT -------- */}
                                <div className="left w-full">
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Total Sale:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.totalSale} />
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Cash in Meezan Bank:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.cashInMeezanBank} />
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Cash in EasyPaisa:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.cashInEasyPaisa} />
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Today Buyer Credit:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.todayBuyerCredit} />
                                    </div>
                                </div>

                                {/* -------- RIGHT -------- */}
                                <div className="right w-full">
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Cash in Jazz Cash:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.cashInJazzCash} />
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Today Expense:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.totalExpense} />
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Today buyer debit:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.todayBuyerDebit} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MAIN DATA */}
                        <div className="data px-6 pt-12 w-full">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-12">
                                {/* -------- LEFT -------- */}
                                <div className="left w-full">
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Cash Sale:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.cashSale} />
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Total Profit:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.totalProfit} />
                                    </div>
                                </div>

                                {/* -------- RIGHT -------- */}
                                <div className="right w-full">
                                    <div className="flex justify-center items-center gap-4 mb-3">
                                        <div className="title w-full text-md font-medium">Total Cash:</div>
                                        <input className="border border-gray-200 text-sm rounded-md" type="number" value={DailySaleById?.saleData?.totalCash} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default DailySaleDetail;
