import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getaccessories = "http://localhost:8000/api/stock/accessories/getAllAccesoriesInStock";
const getBags = 'http://localhost:8000/api/stock/bags/getAllBagsAndBox'
const getBase = 'http://localhost:8000/api/stock/base/getAllBases'
const getLace = 'http://localhost:8000/api/stock/lace/getAllLaceStock'
const getSuits = 'http://localhost:8000/api/stock/suits/getAllSuits'
const getExpense = 'http://localhost:8000/api/stock/expense/getAllExpenses'



export const GetAllaccessories = createAsyncThunk(
  "accessories/Get",
  async () => {
    try {
      const response = await axios.post(getaccessories);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllBags = createAsyncThunk(
  "Bags/Get",
  async () => {
    try {
      const response = await axios.post(getBags);
      // toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllBase = createAsyncThunk(
  "Base/Get",
  async () => {
    try {
      const response = await axios.post(getBase);
      // toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllLace = createAsyncThunk(
  "Lace/Get",
  async () => {
    try {
      const response = await axios.post(getLace);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllSuit = createAsyncThunk(
  "Suit/Get",
  async () => {
    try {
      const response = await axios.post(getSuits);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllExpense = createAsyncThunk(
  "Expense/Get",
  async () => {
    try {
      const response = await axios.post(getExpense);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);


// INITIAL STATE
const initialState = {
  Suit: [],
  Base: [],
  Lace: [],
  Bags: [],
  accessories: [],
  Expense: [],
  loading: false,
};

const InStockSlic = createSlice({
  name: "InStock",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(GetAllaccessories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllaccessories.fulfilled, (state, action) => {
        state.loading = false;
        state.accessories = action.payload;
      })
      .addCase(GetAllBags.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBags.fulfilled, (state, action) => {
        state.loading = false;
        state.Bags = action.payload;
      })

      .addCase(GetAllBase.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBase.fulfilled, (state, action) => {
        state.loading = false;
        state.Base = action.payload;
      })

      .addCase(GetAllLace.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllLace.fulfilled, (state, action) => {
        state.loading = false;
        state.Lace = action.payload;
      })

      .addCase(GetAllSuit.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllSuit.fulfilled, (state, action) => {
        state.loading = false;
        state.Suit = action.payload;
      })

      .addCase(GetAllExpense.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.Expense = action.payload;
      })
  },
});

export const { reset } = InStockSlic.actions;

export default InStockSlic.reducer;
