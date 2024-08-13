import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const generateBuyerBillUrl = "/api/buyers/generateBuyersBillandAddBuyer";

// GENERATE BUYER BILL THUNK
export const generateBuyerBillAsync = createAsyncThunk("buyerBill/generate", async (billData) => {
    try {
        const response = await axios.post(generateBuyerBillUrl, billData);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);



// INITIAL STATE
const initialState = {
    BuyerBill: [],
    loading: false,
};

const GenerateBillSlice = createSlice({
    name: "GenerateBillSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // GENERATE BUYER BILL
            .addCase(generateBuyerBillAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateBuyerBillAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.BuyerBill = action.payload
            })
    },
});


export default GenerateBillSlice.reducer;
