import { RxCross2 } from "react-icons/rx";

const formatNumber = (value) => {
  const number = Number(value || 0);
  return Number.isInteger(number) ? number : Number(number.toFixed(3));
};

const getColumns = (category) => {
  if (category === "Base") {
    return [
      { key: "colour", label: "Color", render: (row) => row.colour || "--" },
      { key: "roleQuantity", label: "Qty", render: (row) => formatNumber(row.roleQuantity) },
      { key: "measurement", label: "Measurement", render: (row) => formatNumber(row.measurement) },
      { key: "rate", label: "Price", render: (row) => formatNumber(row.rate) },
      { key: "rowTotal", label: "Total", render: (row) => formatNumber(row.rowTotal) },
    ];
  }

  if (category === "Lace") {
    return [
      { key: "roleQuantity", label: "Qty", render: (row) => formatNumber(row.roleQuantity) },
      { key: "measurement", label: "Measurement", render: (row) => formatNumber(row.measurement) },
      { key: "rate", label: "Price", render: (row) => formatNumber(row.rate) },
      { key: "rowQuantity", label: "Row Qty", render: (row) => `${formatNumber(row.rowQuantity)} m` },
      { key: "rowTotal", label: "Total", render: (row) => formatNumber(row.rowTotal) },
    ];
  }

  return [
    { key: "category", label: "Category", render: (row) => row.category || "--" },
    { key: "roleQuantity", label: "Qty", render: (row) => formatNumber(row.roleQuantity) },
    { key: "rate", label: "Price", render: (row) => formatNumber(row.rate) },
    { key: "rowTotal", label: "Total", render: (row) => formatNumber(row.rowTotal) },
  ];
};

const PurchaseBillRowsModal = ({ isOpen, onClose, bill, category }) => {
  if (!isOpen) return null;

  const rows = bill?.measurementData || [];
  const columns = getColumns(category);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
    >
      <div className="relative py-4 px-3 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-md shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {category} Details
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
              Bill No {bill?.bill_no || "--"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            type="button"
          >
            <RxCross2 size={18} />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="p-4 md:p-5">
          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="px-3 py-3 text-center">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={`${category}-${bill?.bill_no || "bill"}-${index}`}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-3 py-3 text-center font-medium text-gray-900 dark:text-white"
                        >
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              No row details available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseBillRowsModal;
