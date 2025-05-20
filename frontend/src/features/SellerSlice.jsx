import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addNewSellerDetails =
  "/api/sellerRouter/addInStockAndGeneraeSellerData_NEW";
const addOldSellerDetails =
  "/api/sellerRouter/addInStockAndGeneraeSellerData_OLD";
const purchasingHistory = "/api/sellerRouter/getAllPurchasingHistory";
const getAllSellerForPurchasingURL =
  "/api/sellerRouter/getAllSellersForPurchasing";
const getSellerByIdURL = "/api/sellerRouter/getSelleForPurchasingById";
const validateOldSeller = "/api/sellerRouter/validateAndGetOldSellerData";
const deleteSellerBillAndReverseStockUrl =
  "/api/sellerRouter/deleteSellerBillAndReverseStock";

// GET ALL SELLER FOR PURCHSING THUNK
export const getAllSellerForPurchasingAsync = createAsyncThunk(
  "get/allSellers",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
        const status =
        data?.status !== undefined && data?.status !== null
          ? `&status=${data?.status}`
          : "";
    const category =
      data?.category !== undefined && data?.category !== null
        ? `&category=${data?.category}`
        : "";
    try {
      const response = await axios.post(
        `${getAllSellerForPurchasingURL}?&page=${data.page}${category}${searchQuery}${status}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// GET SELLER BY ID THUNK
export const GetSellerByIdAsync = createAsyncThunk(
  "getSeller/id",
  async (id) => {
    try {
      const response = await axios.post(getSellerByIdURL, id);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// ADD SELLER DETAILS FROM BASE THUNK
export const AddSellerDetailsFromAsync = createAsyncThunk(
  "addSeller/details",
  async (data) => {
    try {
      const response = await axios.post(addNewSellerDetails, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// ADD OLD SELLER DETAILS THUNK
export const AddOldSellerDetailsFromAsync = createAsyncThunk(
  "addOldSeller/details",
  async (data) => {
    try {
      const response = await axios.post(addOldSellerDetails, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET ALL PURCHSING HISTORY THUNK
export const getAllPurchasingHistoryAsync = createAsyncThunk(
  "getAll/PurchasingHistory",
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
        `${purchasingHistory}?&page=${data.page}${category}${searchQuery}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// VALIDATE OLD SELLER THUNK
export const validateOldSellerAsync = createAsyncThunk(
  "Seller/validate",
  async (data) => {
    try {
      const response = await axios.post(validateOldSeller, data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// DELETE BILL AND REVERSE STOCK
export const deleteSelllerBillAsync = createAsyncThunk(
  "Seller/deleteBillAsync",
  async (data) => {
    try {
      const response = await axios.post(
        deleteSellerBillAndReverseStockUrl,
        data
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// INITIAL STATE
const initialState = {
  SellerData: [],
  OldSellerData: [],
  PurchasingHistory: [],
  AllSeller: [],
  SellerById: [],
  validateSeller: [],
  loading: false,
  addLoading: false,
  searchLoading: false,
  addSellerLoading: false,
  deleteLoading: false,
};

const SellerSlice = createSlice({
  name: "SellerSlice",
  initialState,
  reducers: {
    clearValiDateSeller: (state) => {
      state.validateSeller = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // GET ALL SELLER FOR PURCHSING
      .addCase(getAllSellerForPurchasingAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSellerForPurchasingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.AllSeller = action.payload;
      })

      // DELETE CASE
      .addCase(deleteSelllerBillAsync.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteSelllerBillAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
      })
      .addCase(deleteSelllerBillAsync.rejected, (state, action) => {
        state.deleteLoading = false;
      })

      // GET SELLER BY ID
      .addCase(GetSellerByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetSellerByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.SellerById = action.payload;
      })

      // ADD SELLER DETAILS
      .addCase(AddSellerDetailsFromAsync.pending, (state) => {
        state.addSellerLoading = true;
      })
      .addCase(AddSellerDetailsFromAsync.fulfilled, (state, action) => {
        state.addSellerLoading = false;
        state.SellerData = action.payload;
      })

      // ADD OLD SELLER DETAILS
      .addCase(AddOldSellerDetailsFromAsync.pending, (state) => {
        state.addSellerLoading = true;
      })
      .addCase(AddOldSellerDetailsFromAsync.fulfilled, (state, action) => {
        state.addSellerLoading = false;
        state.OldSellerData = action.payload;
      })

      // GET ALL PURCHSING HISTORY
      .addCase(getAllPurchasingHistoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPurchasingHistoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.PurchasingHistory = action.payload;
      })

      // VALIDATE OLD SELLER
      .addCase(validateOldSellerAsync.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(validateOldSellerAsync.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.validateSeller = action.payload;
      });
  },
});

export default SellerSlice.reducer;

export const { clearValiDateSeller } = SellerSlice.actions;
