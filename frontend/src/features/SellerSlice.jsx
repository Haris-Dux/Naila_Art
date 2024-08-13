import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addSellerDetailsFromBase = "/api/sellerRouter/addInStockAndGeneraeSellerData_NEW";

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




// INITIAL STATE
const initialState = {
    SellerData: [],
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
    },
});


export default SellerSlice.reducer;