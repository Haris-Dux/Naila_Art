import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getBuyerForBranch = "/api/buyers/getBuyersForBranch";
const getBuyerById = "/api/buyers/getBuyerById";
const markAsPaidForBuyersUrl = "/api/buyers/markAsPaidForBuyers";
const getBuyerBillHistoryForBranchUrl =
  "/api/buyers/getBuyerBillHistoryForBranch";
const addBuyerCheckUrl = "/api/buyers/checks/addBuyerCheck";
const updateBuyerCheckWithNewUrl = "/api/buyers/checks/updateBuyerCheckWithNew";
const markCheckAsPaidUrl = "/api/buyers/checks/markCheckAsPaid";
const getAllChecksForPartyUrl = "/api/buyers/checks/getAllChecksForParty";
const deleteCheckUrl = "/api/buyers/checks/deleteCheck";
const showNotificationsForChecksUrl =
  "/api/buyers/checks/showNotificationsForChecks";
const generateReturnBillWithoutRecordUrl =
  "/api/buyers/generateReturnBillWithoutRecord";
const getReturnBillWithoutRecordUrl = "/api/buyers/getReturnBillWithoutRecord";

// GET BUYER FOR BRANCH THUNK
export const getBuyerForBranchAsync = createAsyncThunk(
  "buyers/get",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    const status =
      data?.status !== undefined && data?.status !== null
        ? `&status=${data?.status}`
        : "";
    const branchId =
      data?.branchId !== undefined && data?.branchId !== null
        ? `&branchId=${data?.branchId}`
        : "";
    try {
      const response = await axios.post(
        `${getBuyerForBranch}?&page=${data.page}${searchQuery}${status}${branchId}`,
        { id: data.id }
      );
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET BUYER BY ID THUNK
export const getBuyerByIdAsync = createAsyncThunk(
  "buyers/getById",
  async (id) => {
    try {
      const response = await axios.post(getBuyerById, id);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET BUYER BILLS FOR BRANCH THUNK
export const getBuyerBillsHistoryForBranchAsync = createAsyncThunk(
  "buyers/BuyerBillsHistory",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    try {
      const response = await axios.post(
        `${getBuyerBillHistoryForBranchUrl}?&page=${data.page}${searchQuery}`,
        { id: data.id }
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

//MARK AS PAID BUYER ACCOUNT
export const markAsPaidAsync = createAsyncThunk(
  "Buyers/markAsPaid",
  async (data) => {
    try {
      const response = await axios.post(markAsPaidForBuyersUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

//ADD CHECK
export const addCheckAsync = createAsyncThunk(
  "Buyers/addCheck",
  async (data) => {
    try {
      const response = await axios.post(addBuyerCheckUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

//UPDATECHECK WITH NEW CHECK
export const updateBuyerCheckWithNewAsync = createAsyncThunk(
  "Buyers/updateCheck",
  async (data) => {
    try {
      const response = await axios.post(updateBuyerCheckWithNewUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

//MARK AS PAID CHECK
export const markAsPaidCheckAsync = createAsyncThunk(
  "Buyers/markAsPaidCheck",
  async (data) => {
    try {
      const response = await axios.post(markCheckAsPaidUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

//GET ALL CHECKS DATA FOR PARTY
export const getAllChecksForPartyAsync = createAsyncThunk(
  "Buyers/getAllChecksForParty",
  async (data) => {
    try {
      const response = await axios.post(getAllChecksForPartyUrl, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

//GET ALL CHECKS DATA FOR PARTY
export const deleteCheckAsync = createAsyncThunk(
  "Buyers/deleteCheckForParty",
  async (data) => {
    try {
      const response = await axios.post(deleteCheckUrl, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

//GET ALL CHECKS DATA FOR PARTY
export const showNotificationsForChecksAsync = createAsyncThunk(
  "Buyers/showNotificationsForChecks",
  async (data) => {
    try {
      const response = await axios.post(showNotificationsForChecksUrl, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

//GENERATE RETURN BILL(NO RECORD)
export const generateReturnBillNoRecordAsync = createAsyncThunk(
  "Buyers/ReturnBillNoRecordA",
  async (data) => {
    try {
      const response = await axios.post(
        generateReturnBillWithoutRecordUrl,
        data
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

//GET RETURN BILL(NO RECORD)
export const getReturnBillNoRecordAsync = createAsyncThunk(
  "Buyers/getReturnBillNoRecord",
  async (data) => {
    const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
    try {
      const response = await axios.post(
        `${getReturnBillWithoutRecordUrl}?&page=${data.page}${searchQuery}`,
        { id: data.id }
      );
      return response.data;
    } catch (error) {
     throw new Error(error);
    }
  }
);
// INITIAL STATE
const initialState = {
  Buyers: [],
  BuyerById: [],
  loading: false,
  BuyerBillHistory: [],
  billHistoryLoading: true,
  markAsPaidLoading: false,
  checkLoading: false,
  getBuyersChecksLoading: false,
  BuyersChecks: [],
  CheckNotifications: [],
  returnBillLoading: false,
  getReturnBillLoading: false,
  returnBillsNoRecord: [],
};

const BuyerSlice = createSlice({
  name: "BuyerSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      //SHOW NOTIFICATIONS DATA
      .addCase(showNotificationsForChecksAsync.pending, (state, action) => {
        state.getBuyersChecksLoading = true;
      })
      .addCase(showNotificationsForChecksAsync.fulfilled, (state, action) => {
        state.getBuyersChecksLoading = false;
        state.CheckNotifications = action.payload;
      })
      .addCase(showNotificationsForChecksAsync.rejected, (state, action) => {
        state.getBuyersChecksLoading = false;
        state.CheckNotifications = [];
      })

      //ADD CHECK
      .addCase(addCheckAsync.pending, (state, action) => {
        state.checkLoading = true;
      })
      .addCase(addCheckAsync.fulfilled, (state, action) => {
        state.checkLoading = false;
      })

      //GENERATE RETURN BILL(NO RECORD)
      .addCase(generateReturnBillNoRecordAsync.pending, (state, action) => {
        state.returnBillLoading = true;
      })
      .addCase(generateReturnBillNoRecordAsync.fulfilled, (state, action) => {
        state.returnBillLoading = false;
      })

      //GET GENERATE RETURN BILL(NO RECORD)
      .addCase(getReturnBillNoRecordAsync.pending, (state, action) => {
        state.getReturnBillLoading = true;
      })
      .addCase(getReturnBillNoRecordAsync.fulfilled, (state, action) => {
        state.getReturnBillLoading = false;
        state.returnBillsNoRecord = action.payload;
      })
      .addCase(getReturnBillNoRecordAsync.rejected, (state, action) => {
        state.getReturnBillLoading = false;
        state.returnBillsNoRecord = [];
      })

      //UPDATECHECK WITH NEW CHECK
      .addCase(updateBuyerCheckWithNewAsync.pending, (state, action) => {
        state.checkLoading = true;
      })
      .addCase(updateBuyerCheckWithNewAsync.fulfilled, (state, action) => {
        state.checkLoading = false;
      })

      //MARK AS PAID CHECK
      .addCase(markAsPaidCheckAsync.pending, (state, action) => {
        state.checkLoading = true;
      })
      .addCase(markAsPaidCheckAsync.fulfilled, (state, action) => {
        state.checkLoading = false;
      })

      //GET ALL CHECKS DATA FOR PARTY
      .addCase(getAllChecksForPartyAsync.pending, (state, action) => {
        state.getBuyersChecksLoading = true;
      })
      .addCase(getAllChecksForPartyAsync.fulfilled, (state, action) => {
        state.getBuyersChecksLoading = false;
        state.BuyersChecks = action.payload;
      })
      .addCase(getAllChecksForPartyAsync.rejected, (state, action) => {
        state.getBuyersChecksLoading = false;
        state.BuyersChecks = [];
      })

      //DELETE CHECK
      .addCase(deleteCheckAsync.pending, (state, action) => {
        state.checkLoading = true;
      })
      .addCase(deleteCheckAsync.fulfilled, (state, action) => {
        state.checkLoading = false;
      })

      //MARK AS PAID ACCOUNT
      .addCase(markAsPaidAsync.pending, (state, action) => {
        state.markAsPaidLoading = true;
      })
      .addCase(markAsPaidAsync.fulfilled, (state, action) => {
        state.markAsPaidLoading = false;
      })

      // GET BUYER FOR BRANCH
      .addCase(getBuyerForBranchAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBuyerForBranchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.Buyers = action.payload;
      })

      // GET BUYER FOR BRANCH
      .addCase(getBuyerByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBuyerByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.BuyerById = action.payload;
      })

      // GET BILL HISTORY LOADING
      .addCase(getBuyerBillsHistoryForBranchAsync.pending, (state) => {
        state.billHistoryLoading = true;
      })
      .addCase(
        getBuyerBillsHistoryForBranchAsync.fulfilled,
        (state, action) => {
          state.billHistoryLoading = false;
          state.BuyerBillHistory = action.payload;
        }
      );
  },
});

export default BuyerSlice.reducer;
