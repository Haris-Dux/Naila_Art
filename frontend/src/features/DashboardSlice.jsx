import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getDashboardDataForSuperAdmin =
  "/api/dashboardRouter/getDashBoardDataForSuperAdmin";
const getDashboardDataForBranch =
  "/api/dashboardRouter/getDashBoardDataForBranch";
const sendDashBoardAccessOTPUrl = "/api/dashboardRouter/sendDashBoardAccessOTP";
const verifyOtpForDasboardDataPUrl =
  "/api/dashboardRouter/verifyOtpForDasboardData";

// GET DATA FOR SUPER ADMIN THUNK
export const getDataForSuperAdminAsync = createAsyncThunk(
  "dashboard/superAdmin",
  async () => {
    try {
      const response = await axios.post(getDashboardDataForSuperAdmin);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// GET DATA FOR OTHER THUNK
export const getDataForOtherBranchAsync = createAsyncThunk(
  "dashboard/user",
  async () => {
    try {
      const response = await axios.post(getDashboardDataForBranch);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const sendDashBoardAccessOTPAsync = createAsyncThunk(
  "dashboardAccess/sendDashBoardAccessToken",
  async () => {
    try {
      const response = await axios.post(sendDashBoardAccessOTPUrl);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const verifyOtpForDasboardDataAsync = createAsyncThunk(
  "dashboardAccess/verifyDashBoardAccessToken",
  async (data) => {
    try {
      const response = await axios.post(verifyOtpForDasboardDataPUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// INITIAL STATE
const initialState = {
  DashboardData: [],
  loading: false,
  otpLoading: false,
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
        state.DashboardData = action.payload;
      })
      .addCase(getDataForSuperAdminAsync.rejected, (state, action) => {
        state.loading = false;
      })

      // GET DATA FOR OTHER
      .addCase(getDataForOtherBranchAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDataForOtherBranchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.DashboardData = action.payload;
      })
      .addCase(getDataForOtherBranchAsync.rejected, (state, action) => {
        state.loading = false;
      })


      // OTP Cases
      .addCase(sendDashBoardAccessOTPAsync.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(sendDashBoardAccessOTPAsync.fulfilled, (state, action) => {
        state.otpLoading = false;
      })

      .addCase(verifyOtpForDasboardDataAsync.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(verifyOtpForDasboardDataAsync.fulfilled, (state, action) => {
        state.otpLoading = false;
      });
  },
});

export default DashboardSlice.reducer;
