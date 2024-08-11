import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const generateBuyerBillUrl = "/api/buyers/generateBuyersBillandAddBuyer";
const generateOldBuyerBillUrl = "/api/buyers/generateBillForOldbuyer";
const getSuitFromDesignUrl = "/api/buyers/validateD_NoAndGetSuitData";
const validateOldBuyerUrl = "/api/buyers/validateAndGetOldBuyerData";

// GENERATE BUYER BILL THUNK
export const generateBuyerBillAsync = createAsyncThunk("buyerBill/generate", async (billData) => {
    try {
        const response = await axios.post(generateBuyerBillUrl, billData);
        toast.success(response.data.message)
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);

// GENERATE BILL FOR OLDER BUYER THUNK
export const generateBillForOlderBuyerAsync = createAsyncThunk("OldbuyerBill/generate", async (billData) => {
    try {
        const response = await axios.post(generateOldBuyerBillUrl, billData);
        toast.success(response.data.message)
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);

// GET SUIT FROM DESIGN NO THUNK
export const getSuitFromDesignAsync = createAsyncThunk("buyerBill/getSuit", async (name) => {
    try {
        const response = await axios.post(getSuitFromDesignUrl, name);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);

// GET OLD BUYER DATA THUNK
export const validateOldBuyerAsync = createAsyncThunk("buyer/validate", async (name) => {
    try {
        const response = await axios.post(validateOldBuyerUrl, name);
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
    OldBuyerBilData: [],
    SuitFromDesign: [],
    OldBuyerData: [],
    getBuyerLoading: false,
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

            // GENERATE BILL FOR OLDER BUYER
            .addCase(generateBillForOlderBuyerAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateBillForOlderBuyerAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.OldBuyerBilData = action.payload
            })

            // GET SUIT FROM DESIGN NO
            .addCase(getSuitFromDesignAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSuitFromDesignAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.SuitFromDesign = action.payload
            })

            // GET OLD BUYER DATA
            .addCase(validateOldBuyerAsync.pending, (state) => {
                state.getBuyerLoading = true;
            })
            .addCase(validateOldBuyerAsync.fulfilled, (state, action) => {
                state.getBuyerLoading = false;
                state.OldBuyerData = action.payload
            })
    },
});


export default GenerateBillSlice.reducer;
