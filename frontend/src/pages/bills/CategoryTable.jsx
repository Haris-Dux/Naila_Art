import React from 'react';

const CategoryTable = ({ category, data }) => {
    const filteredData = data.filter(item => item.category === category);

    if (category === 'Base') {
        return (
            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Design # No</th>
                            <th className="px-6 py-3">Colors</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Cost Price</th>
                            <th className="px-6 py-3">Sales Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.design_no}</td>
                                <td className="px-6 py-4">{item.colors}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.cost_pirce}</td>
                                <td className="px-6 py-4">{item.sale_pirce}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else if (category === 'Lace') {
        return (
            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Design # No</th>
                            <th className="px-6 py-3">Colors</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Cost Price</th>
                            <th className="px-6 py-3">Sales Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.design_no}</td>
                                <td className="px-6 py-4">{item.colors}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.cost_pirce}</td>
                                <td className="px-6 py-4">{item.sale_pirce}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else if (category === 'Bag') {
        return (
            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Design # No</th>
                            <th className="px-6 py-3">Colors</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Cost Price</th>
                            <th className="px-6 py-3">Sales Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.design_no}</td>
                                <td className="px-6 py-4">{item.colors}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.cost_pirce}</td>
                                <td className="px-6 py-4">{item.sale_pirce}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else if (category === 'Accessories') {
        return (
            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Design # No</th>
                            <th className="px-6 py-3">Colors</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Cost Price</th>
                            <th className="px-6 py-3">Sales Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.design_no}</td>
                                <td className="px-6 py-4">{item.colors}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.cost_pirce}</td>
                                <td className="px-6 py-4">{item.sale_pirce}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else if (category === 'Expense') {
        return (
            <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Design # No</th>
                            <th className="px-6 py-3">Colors</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Cost Price</th>
                            <th className="px-6 py-3">Sales Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.design_no}</td>
                                <td className="px-6 py-4">{item.colors}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.cost_pirce}</td>
                                <td className="px-6 py-4">{item.sale_pirce}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return null;
    }
};

export default CategoryTable;
