import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const getbPairUrl = "/api/b_PairRouter/getAllBPairs";
const saleBPairUrl = "/api/b_PairRouter/saleBPair";
const reverseBpairSaleUrl = "/api/b_PairRouter/reverseBpairSale";
const deletebPairUrl = `/api/b_PairRouter/deletebPair`;

export const getbPairDataAsync = createAsyncThunk(
  "b_pair/getBpair",
  async (data) => {
    try {
      const search =
        data?.search !== undefined && data?.search !== null
          ? `&search=${data?.search}`
          : "";
      const response = await axios.post(
        `${getbPairUrl}?page=${data.page}&category=${data?.category}${search}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const salebPairAsync = createAsyncThunk(
  "b_pair/saleBPairSale",
  async (data) => {
    try {
      const response = await axios.post(saleBPairUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const DeleteBpairSaleAsync = createAsyncThunk(
  "b_pair/deleteBPairSale",
  async (data) => {
    try {
      const response = await axios.post(reverseBpairSaleUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const DeleteBpairAsync = createAsyncThunk(
  "b_pair/deleteBPairAsync",
  async (data) => {
    try {
      const response = await axios.delete(`${deletebPairUrl}/${data.id}`);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

const initailState = {
  B_pairData: [],
  B_pairDataLoading: false,
  saleB_pairLoading: false,
  deleteLoadings: false,
};

const B_PairSlice = createSlice({
  name: "b_pair",
  initialState: initailState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //GET BPAIR DATA
      .addCase(getbPairDataAsync.pending, (state) => {
        state.B_pairDataLoading = true;
      })
      .addCase(getbPairDataAsync.fulfilled, (state, action) => {
        state.B_pairDataLoading = false;
        state.B_pairData = action.payload;
      })

      //DELETE BPAIR SAlE DATA
      .addCase(DeleteBpairSaleAsync.pending, (state) => {
        state.deleteLoadings = true;
      })
      .addCase(DeleteBpairSaleAsync.fulfilled, (state) => {
        state.deleteLoadings = false;
      })

      //DELETE BPAIR SAlE DATA
      .addCase(DeleteBpairAsync.pending, (state) => {
        state.deleteLoadings = true;
      })
      .addCase(DeleteBpairAsync.fulfilled, (state) => {
        state.deleteLoadings = false;
      })

      //SALE BPAIR
      .addCase(salebPairAsync.pending, (state) => {
        state.saleB_pairLoading = true;
      })
      .addCase(salebPairAsync.fulfilled, (state) => {
        state.saleB_pairLoading = false;
      });
  },
});

export default B_PairSlice.reducer;
