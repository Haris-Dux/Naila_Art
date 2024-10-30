import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const generateProcessBill = "/api/processBillRouter/generateProcessBill";
const getAllProcessBill = "/api/processBillRouter/getAllProcessBills";
const getProcessBillById = "/api/processBillRouter/getProcessillById";
const getAllPictureAccountsURL = "/api/process/pictures/getAllPictureAccounts";

// GENERATE PROCESS BILL ASYNC
export const GenerateProcessBillAsync = createAsyncThunk(
  "generate/processBills",
  async (data) => {
    try {
      const response = await axios.post(generateProcessBill, data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET ALL PROCESS BILL ASYNC
export const GetAllProcessBillAsync = createAsyncThunk(
  "getAll/processBills",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    const category =
      data?.category !== undefined && data?.category !== null
        ? `&category=${data?.category}`
        : "";
    try {
      const response = await axios.post(
        `${getAllProcessBill}?&page=${data.page}${searchQuery}${category}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// GET PROCESS BILL BY ID ASYNC
export const GetProcessBillByIdAsync = createAsyncThunk(
  "getById/processBills",
  async (data) => {
    try {
      const response = await axios.post(getProcessBillById, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// GET ALL PROCESS BILL ASYNC
export const GetAllPictureAccountsAsync = createAsyncThunk(
  "pictures/getAllPictureAccounts",
  async (data) => {
    console.log('pictures being hit');

    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    try {
      const response = await axios.post(
        `${getAllPictureAccountsURL}?&page=${data.page}${searchQuery}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const initialState = {
  ProcessBills: [],
  picturesBills: [],
  ProcessBillsDetails: [],
  loading: false,
};

const ProcessBillSlice = createSlice({
  name: "ProcessBillSlice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // GENERATE PROCESS BILL
      .addCase(GenerateProcessBillAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GenerateProcessBillAsync.fulfilled, (state, action) => {
        state.loading = false;
      })

      // GET ALL PROCESS BILL
      .addCase(GetAllProcessBillAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllProcessBillAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ProcessBills = action.payload;
      })

      // GET ALL PICTURES BILL
      .addCase(GetAllPictureAccountsAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllPictureAccountsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.picturesBills = action.payload;
      })

      // GET PROCESS BILL BY ID
      .addCase(GetProcessBillByIdAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetProcessBillByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ProcessBillsDetails = action.payload;
      });
  },
});

export default ProcessBillSlice.reducer;
