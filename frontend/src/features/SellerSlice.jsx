import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addSellerDetailsFromBase = "/api/sellerRouter/addInStockAndGeneraeSellerData_NEW";
const purchasingHistory = "/api/sellerRouter/getAllPurchasingHistory";

// ADD SELLER DETAILS FROM BASE THUNK
export const AddSellerDetailsFromAsync = createAsyncThunk("addSeller/details", async (data) => {
    try {
        const response = await axios.post(addSellerDetailsFromBase, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);

// GET ALL PURCHSING HISTORY THUNK
export const getAllPurchasingHistoryAsync = createAsyncThunk("getAll/PurchasingHistory", async (data) => {
    const searchQuery =
        data?.search !== undefined && data?.search !== null
            ? `&search=${data?.search}`
            : "";

    const category =
        data?.category !== undefined && data?.category !== null
            ? `&category=${data?.category}`
            : "";
    try {
        const response = await axios.post(`${purchasingHistory}?&page=${data.page}${category}${searchQuery}`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.error);
        console.log(error?.response?.data?.error);
    }
}
);


// INITIAL STATE
const initialState = {
    SellerData: [],
    PurchasingHistory: [],
    loading: false,
};

const SellerSlice = createSlice({
    name: "SellerSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // ADD SELLER DETAILS FROM BASE
            .addCase(AddSellerDetailsFromAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(AddSellerDetailsFromAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.SellerData = action.payload
            })


            // GET ALL PURCHSING HISTORY
            .addCase(getAllPurchasingHistoryAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllPurchasingHistoryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.PurchasingHistory = action.payload
            })
    },
});


export default SellerSlice.reducer;
