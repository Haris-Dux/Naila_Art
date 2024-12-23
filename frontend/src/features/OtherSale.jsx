import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const generateOtherBillUrl = `/api/otherSale/generateOtherSaleBill`;
const getAllOtherSaleBillsUrl = `/api/otherSale/getAllOtherSaleBills`;

export const getAllOtherSaleBillsAsync = createAsyncThunk(
  "OtherBills/getAllOtherSaleBills",
  async (data) => {
    const search =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    try {
      const response = await axios.post(
        `${getAllOtherSaleBillsUrl}?&page=${data.page}${search}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

// GENERATE OTHER SALE
export const generateOtherSaleAsync = createAsyncThunk(
  "OtherBills/generateOtherBills",
  async (data) => {
    try {
      const response = await axios.post(generateOtherBillUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

// INITIAL STATE
const initialState = {
  otherSaleBills: [],
  generateOtherSaleLoading: false,
  otherSaleBillsLoading: false,
};

const OtherBillSlice = createSlice({
  name: "OtherBillSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      // GENERATE OTHER SALE
      .addCase(generateOtherSaleAsync.pending, (state) => {
        state.generateOtherSaleLoading = true;
      })
      .addCase(generateOtherSaleAsync.fulfilled, (state) => {
        state.generateOtherSaleLoading = false;
      })

      // GENERATE OTHER SALE
      .addCase(getAllOtherSaleBillsAsync.pending, (state) => {
        state.otherSaleBillsLoading = true;
      })
      .addCase(getAllOtherSaleBillsAsync.fulfilled, (state,action) => {
        state.otherSaleBillsLoading = false;
        state.otherSaleBills = action.payload;
      });
  },
});

export default OtherBillSlice.reducer;
