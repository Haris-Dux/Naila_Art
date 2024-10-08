import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getBuyerForBranch = "/api/buyers/getBuyersForBranch";
const getBuyerById = "/api/buyers/getBuyerById";
const getBuyerBillHistoryForBranchUrl =
  "/api/buyers/getBuyerBillHistoryForBranch";

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

// INITIAL STATE
const initialState = {
  Buyers: [],
  BuyerById: [],
  loading: false,
  BuyerBillHistory:[],
  billHistoryLoading: true,
};

const BuyerSlice = createSlice({
  name: "BuyerSlice",
  initialState,
  extraReducers: (builder) => {
    builder

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
      .addCase(getBuyerBillsHistoryForBranchAsync.fulfilled, (state, action) => {
        state.billHistoryLoading = false;
        state.BuyerBillHistory = action.payload;
      });
  },
});

export default BuyerSlice.reducer;
