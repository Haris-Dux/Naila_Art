import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getAllProcessBill = "/api/processBillRouter/getAllProcessBills";
const getProcessBillById = "/api/processBillRouter/getProcessillById";


// GET ALL PROCESS BILL ASYNC
export const GetAllProcessBillAsync = createAsyncThunk("getAll/processBills", async (data) => {
    const searchQuery =
        data?.search !== undefined && data?.search !== null
            ? `&search=${data?.search}`
            : "";
    const category =
        data?.category !== undefined && data?.category !== null
            ? `&category=${data?.category}`
            : "";
    try {
        const response = await axios.post(`${getAllProcessBill}?&page=${data.page}${searchQuery}${category}`);
        return response.data;
    } catch (error) {
        console.log(error.response.data.error);
    }
}
)


// GET PROCESS BILL BY ID ASYNC
export const GetProcessBillByIdAsync = createAsyncThunk("getById/processBills", async (data) => {
    try {
        const response = await axios.post(getProcessBillById, data);
        return response.data;
    } catch (error) {
        console.log(error.response.data.error);
    }
}
)


const initialState = {
    ProcessBills: [],
    ProcessBillsDetails: [],
    loading: false,
};

const ProcessBillSlice = createSlice({
    name: "ProcessBillSlice",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder

            // GET ALL PROCESS BILL
            .addCase(GetAllProcessBillAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(GetAllProcessBillAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.ProcessBills = action.payload
            })

            // GET PROCESS BILL BY ID
            .addCase(GetProcessBillByIdAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(GetProcessBillByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.ProcessBillsDetails = action.payload
            })
    },
});

export default ProcessBillSlice.reducer;