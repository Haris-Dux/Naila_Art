import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const createBag = "http://localhost:8000/api/stock/bags/addBagsAndBoxInStock";
const createLace = "http://localhost:8000/api/stock/lace/addLaceInStock";

const createAccesseries =
  "http://localhost:8000/api/stock/accessories/addAccesoriesInStock";
const createExpense = "http://localhost:8000/api/stock/expense/addExpense";

//CREATE ASYNC THUNK
export const createBagAsync = createAsyncThunk(
  "Box/create",
  async (formData) => {
    try {
      const response = await axios.post(createBag, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error?.response?.data?.error);
    }
  }
);

// lOGIN ASYNC THUNK
export const createLaceAsync = createAsyncThunk(
  "Lace/Create",
  async (formData) => {
    try {
      const response = await axios.post(createLace, formData);
      toast.success(response.data.message);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const createAsseceriesAsync = createAsyncThunk(
  "Asseceries/Create",
  async (formData) => {
    try {
      const response = await axios.post(createAccesseries, formData);
      toast.success(response.data.message);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const CeateExpenseAsync = createAsyncThunk(
  "Expense/Create",
  async (formData) => {
    try {
      const response = await axios.post(createExpense, formData);
      toast.success(response.data.message);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

// INITIAL STATE
const initialState = {
  Shop: [],
  loading: false,
};

const PurchaseSlice = createSlice({
  name: "PurchaseSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(createBagAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createBagAsync.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(createLaceAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createLaceAsync.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(createAsseceriesAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createAsseceriesAsync.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(CeateExpenseAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(CeateExpenseAsync.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export const { reset } = PurchaseSlice.actions;

export default PurchaseSlice.reducer;
