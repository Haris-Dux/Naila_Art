import { RxCross2 } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";

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

  if (category === "Suits") {
    return [
      { key: "design_no", label: "D# No", render: (row) => row.design_no || "--" },
      { key: "category", label: "Category", render: (row) => row.category || "--" },
      { key: "color", label: "Color", render: (row) => row.colour || "--" },
      { key: "quantity", label: "Qty", render: (row) => formatNumber(row.quantity) },
      { key: "cost_price", label: "Cost", render: (row) => formatNumber(row.cost_price) },
      { key: "sale_price", label: "Sale", render: (row) => formatNumber(row.sale_price) },
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

const PurchaseBillRowsModal = ({ isOpen, onClose, bill, category, onDeletePart }) => {
  if (!isOpen) return null;

  const rows = bill?.measurementData || [];
  const columns = getColumns(category);
  const suitCategories = [...new Set(rows.map((row) => row.category).filter(Boolean))];
  const canDeleteSuitParts =
    category === "Suits" &&
    onDeletePart &&
    !(rows.length === 1 && suitCategories.length === 1);

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
              {canDeleteSuitParts && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {suitCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        onDeletePart({
                          billId: bill?.id,
                          category: item,
                          scope: "category",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <MdDeleteOutline size={16} />
                      {item}
                    </button>
                  ))}
                </div>
              )}
              <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                <thead className="text-xs md:text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="px-3 py-3 text-center">
                        {column.label}
                      </th>
                    ))}
                    {canDeleteSuitParts && (
                      <th className="px-3 py-3 text-center">Action</th>
                    )}
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
                      {canDeleteSuitParts && (
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              onDeletePart({
                                billId: bill?.id,
                                rowId: row.id,
                                scope: "color",
                              })
                            }
                            title="Delete color"
                          >
                            <MdDeleteOutline
                              size={22}
                              className="cursor-pointer text-red-500"
                            />
                          </button>
                        </td>
                      )}
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
