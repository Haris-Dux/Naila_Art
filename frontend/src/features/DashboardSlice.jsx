import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getDashboardDataForSuperAdmin = "/api/dashboardRouter/getDashBoardDataForSuperAdmin";
const getDashboardDataForBranch = "/api/dashboardRouter/getDashBoardDataForBranch";


// GET DATA FOR SUPER ADMIN THUNK
export const getDataForSuperAdminAsync = createAsyncThunk("dashboard/superAdmin", async () => {
    try {
        const response = await axios.post(getDashboardDataForSuperAdmin);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
   
    }
}
);


// GET DATA FOR OTHER THUNK
export const getDataForOtherBranchAsync = createAsyncThunk("dashboard/user", async () => {
    try {
        const response = await axios.post(getDashboardDataForBranch);
        return response.data;
    } catch (error) {
        throw new Error (error.response.data.error);
    }
}
);


// INITIAL STATE
const initialState = {
    DashboardData: [],
    loading: false,
};

const DashboardSlice = createSlice({
    name: "DashboardSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // GET DATA FOR SUPER ADMIN
            .addCase(getDataForSuperAdminAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDataForSuperAdminAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.DashboardData = action.payload
            })

            // GET DATA FOR OTHER
            .addCase(getDataForOtherBranchAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDataForOtherBranchAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.DashboardData = action.payload
            })
    },
});


export default DashboardSlice.reducer;

