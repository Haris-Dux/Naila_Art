import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { buildQueryParams } from "../Utils/Common";


//API URL
const getDashboardDataForSuperAdmin =
  "/api/dashboardRouter/getDashBoardDataForSuperAdmin";
const getDashboardDataForBranch =
  "/api/dashboardRouter/getDashBoardDataForBranch";
const sendDashBoardAccessOTPUrl = "/api/dashboardRouter/sendDashBoardAccessOTP";
const verifyOtpForDasboardDataPUrl =
  "/api/dashboardRouter/verifyOtpForDasboardData";
const createTransactionUrl = "/api/dashboardRouter/makeTransactionInAccounts";
const transactionHistoryUrl = `/api/dashboardRouter/getTransactionsHistory`;

// GET DATA FOR SUPER ADMIN THUNK
export const getDataForSuperAdminAsync = createAsyncThunk(
  "dashboard/superAdmin",
  async () => {
    try {
      const response = await axios.get(getDashboardDataForSuperAdmin);
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

//TRANSACTION THUNK
export const createTransactionAsync = createAsyncThunk(
  "Transaction/createTransaction",
  async (data) => {
    try {
      const response = await axios.post(createTransactionUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

//GET  TRANSACTION HISTORY THUNK

export const getTransactionHIstoryAsync = createAsyncThunk(
  "Transaction/TransactionHistory",
  async ({page,filters}) => {
          
    const query = buildQueryParams({
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      account: filters.account,
      transactionType: filters.transactionType,
      page: page,
    });
    try {
      const response = await axios.post(`${transactionHistoryUrl}?${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

// INITIAL STATE
const initialState = {
  DashboardData: [],
  TransactionsHistory: [],
  loading: false,
  otpLoading: false,
  transactionLoading: false,
};

const DashboardSlice = createSlice({
  name: "DashboardSlice",
  initialState,
  reducers: {
  },
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

      // TRANSACTION CASES
      .addCase(createTransactionAsync.pending, (state) => {
        state.transactionLoading = true;
      })
      .addCase(createTransactionAsync.fulfilled, (state, action) => {
        state.transactionLoading = false;
      })
      .addCase(createTransactionAsync.rejected, (state, action) => {
        state.transactionLoading = false;
      })

      // GET TRANSACTION HISTORY
      .addCase(getTransactionHIstoryAsync.pending, (state) => {
        state.transactionLoading = true;
      })
      .addCase(getTransactionHIstoryAsync.fulfilled, (state, action) => {
        state.transactionLoading = false;
        state.TransactionsHistory = action.payload;
      })
      .addCase(getTransactionHIstoryAsync.rejected, (state, action) => {
        state.transactionLoading = false;
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
