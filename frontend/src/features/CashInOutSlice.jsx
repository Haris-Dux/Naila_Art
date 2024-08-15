import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const cashIn = "/api/cashInOut/cashIn";
const cashOut = "/api/cashInOut/cashOut";
const validatePartyNameForMainBranch = "/api/cashInOut/validatePartyNameForMainBranch";
const validatePartyNameForOtherBranch = "/api/cashInOut/validatePartyNameForOtherBranches";

// CASH IN THUNK
export const cashInAsync = createAsyncThunk("cashInOut/cashIn", async (data) => {
    try {
        const response = await axios.post(cashIn, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);

// CASH OUT THUNK
export const cashOutAsync = createAsyncThunk("cashInOut/cashOut", async (data) => {
    try {
        const response = await axios.post(cashOut, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);

// VALIDATE PARTY NAME FOR MAIN BRANCH THUNK
export const validatePartyNameForMainBranchAsync = createAsyncThunk("validate/mainBranch", async (data) => {
    try {
        const response = await axios.post(validatePartyNameForMainBranch, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);


// VALIDATE PARTY NAME FOR OTHER BRANCH THUNK
export const validatePartyNameForOtherBranchAsync = createAsyncThunk("validate/otherBranch", async (data) => {
    try {
        const response = await axios.post(validatePartyNameForOtherBranch, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);


// INITIAL STATE
const initialState = {
    loading: false,
    cashInResponse: [],
    cashOutResponse: [],
    mainBranchResponse: [],
    otherBranchResponse: [],
};

const CashInOutSlice = createSlice({
    name: "CashInOutSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // CASH IN
            .addCase(cashInAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(cashInAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cashInResponse = action.payload
            })

            // CASH OUT
            .addCase(cashOutAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(cashOutAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.cashOutResponse = action.payload
            })

            // VALIDATE PARTY NAME FOR MAIN BRANCH
            .addCase(validatePartyNameForMainBranchAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(validatePartyNameForMainBranchAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.mainBranchResponse = action.payload
            })

            // VALIDATE PARTY NAME FOR OTHER BRANCH
            .addCase(validatePartyNameForOtherBranchAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(validatePartyNameForOtherBranchAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.otherBranchResponse = action.payload
            })
    },
});


export default CashInOutSlice.reducer;