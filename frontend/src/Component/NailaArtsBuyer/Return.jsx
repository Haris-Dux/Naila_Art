import { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { CreateReturnforBranch } from "../../features/ReturnSlice";

const Return = ({ Buyerdata, closeModal, selected }) => {
  const [updatedSuitsData, setUpdatedSuitsData] = useState([]);
  const [T_Return_Amount, setT_Return_Amount] = useState(0); // Total Return Amount
  const [Amount_From_Balance, setAmount_From_Balance] = useState(Buyerdata?.virtual_account?.total_balance); // Default balance, change if needed
  const [Amount_From_TotalCash, setAmount_From_TotalCash] = useState(0); // Remaining amount to be paid
  const dispatch = useDispatch();
  const { loading } = useSelector(
    (state) => state.Buyer
  );

  const { loading:Returnloading } = useSelector(
    (state) => state.Return
  );

  // Initialize suits data when Buyerdata is available
  useEffect(() => {
    if (selected?.profitDataForHistory
        ) {
      const initializedSuitsData = selected.profitDataForHistory.map((data) => ({
        ...data,
        quantity: "",
        price: "",
      }));
      setUpdatedSuitsData(initializedSuitsData);
    }
  }, [Buyerdata]);

  // Calculate Total Return Amount whenever updatedSuitsData changes
  useEffect(() => {
    const totalReturnAmount = updatedSuitsData.reduce((total, data) => {
     
      const price = parseFloat(data.price) || 0;
      return total + price;
    }, 0);
    setT_Return_Amount(totalReturnAmount);
  }, [updatedSuitsData]);

  // Update Amount_From_TotalCash when Total Return Amount changes
  useEffect(() => {
    setAmount_From_TotalCash(Math.max(T_Return_Amount - Amount_From_Balance, 0));
  }, [T_Return_Amount, Amount_From_Balance]);

  const handleQuantityChange = (index, value) => {
    const newSuitsData = [...updatedSuitsData];
    newSuitsData[index] = { ...newSuitsData[index], quantity: value };
    setUpdatedSuitsData(newSuitsData);
  };

  const handlePriceChange = (index, value) => {
    const newSuitsData = [...updatedSuitsData];
    newSuitsData[index] = { ...newSuitsData[index], suitSalePrice: value };
    setUpdatedSuitsData(newSuitsData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      branchId: Buyerdata?.branchId,
      buyerId: Buyerdata?.id,
      bill_Id: selected?.id,
      partyName: Buyerdata?.name,
      serialNumber: Buyerdata?.serialNumber,
      phone: Buyerdata?.phone,
      date: "2024-09-22",
      bill_Date: selected?.date,
      T_Return_Amount,
      Amount_From_Balance,
      Amount_From_TotalCash,
      suits_data: updatedSuitsData.map((data) => ({
        id: data.id,
        quantity: parseInt(data.quantity, 10) || 0,
        profit: data.profit || 0,
        d_no: data.d_no,
        color: data.color,
        category: data.category || '',
        price: parseFloat(data.suitSalePrice) || 0,
      })),
    };

    console.log("formData", formData);
    dispatch(CreateReturnforBranch(formData)).then((res) => {
      if (res.payload.success === true) {
        closeModal();
      }
    });
  };




  
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-800 bg-opacity-50"
    >
      <div className="relative py-4 px-3 w-full max-w-5xl max-h-full bg-white rounded-md shadow dark:bg-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Return 
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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




{loading ?  


        <div className="py-4 flex justify-center mt-12 items-center">
          <div
            className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-gray-700 dark:text-gray-100 rounded-full "
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading.....</span>
          </div>
        </div>

      :
<> 
        <div className="px-2 py-2 mb-3 grid grid-cols-1 gap-4 border-b rounded-t lg:grid-cols-6 lg:gap-4 text-gray-900 dark:text-gray-100  dark:border-gray-600">
                    <div className="box">
                    <th className='pb-1 font-medium' scope="col">
                      <span className="text-red-500">S.N</span>-
                      <span className="text-green-600">A.S.N</span>
                    </th>
                    <span className="text-red-500">
                            {" "}
                            {Buyerdata?.serialNumber}
                          </span>
                          -<span className="text-green-600">{Buyerdata?.autoSN}</span>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Phone Number</h3>
                        <h3>{Buyerdata?.phone}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Bill By</h3>
                        <h3>{Buyerdata?.bill_by}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium text-red-500'>Total Debit</h3>
                        <h3 className='font-medium text-red-500'>{Buyerdata?.virtual_account?.total_debit}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Total Credit</h3>
                        <h3>{Buyerdata?.virtual_account?.total_credit}</h3>
                    </div>
                    <div className="box">
                        <h3 className='pb-1 font-medium'>Total Balance</h3>
                        <h3>{Buyerdata?.virtual_account?.total_balance}</h3>
                    </div>
                </div>


        {/* Return Amounts */}
        <div className=" px-2 py-2 flex justify-between items-center border-b rounded-t text-gray-900 dark:text-gray-100  dark:border-gray-600">
          <div className="box">
            <h3 className="pb-1 font-medium">T_Return_Amount</h3>
            <h3>{T_Return_Amount}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium">Amount From Balance</h3>
            <h3>{Amount_From_Balance}</h3>
          </div>
          <div className="box">
            <h3 className="pb-1 font-medium ">Amount From Total Cash</h3>
            <h3 className="font-medium ">{Amount_From_TotalCash}</h3>
          </div>
        </div>

        {/* Suits Data Input Table */}
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-4 text-md font-medium">D_No</th>
                <th className="px-6 py-4 text-md font-medium">Quantity</th>
                <th className="px-6 py-4 text-md font-medium">Price</th>
                <th className="px-6 py-4 text-md font-medium">Enter Quantity</th>
                <th className="px-6 py-4 text-md font-medium">Enter Price</th>
              </tr>
            </thead>
            <tbody>
              {updatedSuitsData?.length > 0 ? (
                updatedSuitsData.map((data, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b text-md font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <td className="px-6 py-4">{selected.profitDataForHistory[index].d_no}</td>
                    <td className="px-6 py-4">{selected.profitDataForHistory[index].quantity}</td>
                    <td className="px-6 py-4">{selected.profitDataForHistory[index].suitSalePrice}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={updatedSuitsData[index].quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 w-20 text-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        placeholder="Price"
                        value={updatedSuitsData[index].suitSalePrice}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 w-20 text-gray-700"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-xl mt-3" colSpan="7">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center pt-6">
        {Returnloading ? (
            <button
              disabled
              className="inline-block cursor-progress rounded border border-gray-600 bg-gray-300 px-10 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring active:text-indigo-500"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-block rounded border border-gray-600 bg-gray-600 px-10 py-2.5 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring active:text-indigo-500"
            >
             Submit
            </button>
          )}
        
            
        </div>

        </>
        }
      </div>
    </div>
  );
};

export default Return;
