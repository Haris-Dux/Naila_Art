import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getDailySale = "/api/dailysale/getDailySaleHistoryForBranch";
const getDailySaleById = "/api/dailysale/getDailySaleById";

// GET DAILY SALE HISTORY THUNK
export const getDailySaleAsync = createAsyncThunk("dailysale/history", async (data) => {
    const date = data?.date ? `&search=${data.date}` : "";
    try {
        // const response = await axios.post(`${getDailySale}?&page=${data.page}${date}`, id);
        const response = await axios.post(`${getDailySale}?&page=${data.page}${date}`, { id: data.id });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);


// GET DAILY SALE BY ID THUNK
export const getDailySaleByIdAsync = createAsyncThunk("dailysale/byId", async (id) => {
    try {
        const response = await axios.post(getDailySaleById, id);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);


// INITIAL STATE
const initialState = {
    DailySaleHistory: [],
    DailySaleById: [],
    loading: false,
};

const DailySaleSlice = createSlice({
    name: "DailySaleSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // GET DAILY SALE HISTORY
            .addCase(getDailySaleAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDailySaleAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.DailySaleHistory = action.payload
            })

            // GET DAILY SALE BY ID
            .addCase(getDailySaleByIdAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDailySaleByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.DailySaleById = action.payload
            })
    },
});


export default DailySaleSlice.reducer;
