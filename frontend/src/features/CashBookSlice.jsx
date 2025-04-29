
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildQueryParams } from "../Utils/Common";

//API URL
const getAllCashBookEntriesUrl = `/api/cashBook/getAllCashBookEntries`;

export const getAllCashBookEntriesAsync = createAsyncThunk(
  "Cash Book/getAllCashBookEntries",
  async (filters) => {
    const query = buildQueryParams({
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          account: filters.account,
          transactionType: filters.transactionType,
        });
    try {
      const response = await axios.get(`${getAllCashBookEntriesUrl}?${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);


// INITIAL STATE
const initialState = {
  cashBookData: [],
  loading: false,
};

const CashBookSlice = createSlice({
  name: "CashBookSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      // GET ALL CASH BOOK ENTRIES
      .addCase(getAllCashBookEntriesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCashBookEntriesAsync.fulfilled, (state,action) => {
        state.loading = false;
        state.cashBookData = action.payload;
      })
      .addCase(getAllCashBookEntriesAsync.rejected, (state) => {
        state.loading = false;
        state.cashBookData = [];
      })
  },
});

export default CashBookSlice.reducer;
 