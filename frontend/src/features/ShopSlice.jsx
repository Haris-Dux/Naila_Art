import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const createShop = "/api/branches/createBranch";
const DeletShop = "/api/branches/deleteBranch";
const UpdateShop = "/api/branches/updateBranch";
const GetShop = "/api/branches/getAllBranches";


//CREATE ASYNC THUNK
export const createShopAsync = createAsyncThunk(
  "Shop/create",
  async (formData) => {
    try {
      const response = await axios.post(createShop, formData);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }
);

// lOGIN ASYNC THUNK
export const UpdateShopAsync = createAsyncThunk(
  "Shop/Update",
  async (formData) => {
    try {
      const response = await axios.post(UpdateShop, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);


// FORGET ASYNC THUNK
export const DeleteShop = createAsyncThunk(
  "Shop/Delete",
  async (formData) => {
    try {
      const response = await axios.post(DeletShop, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);


// VERIFY ASYNC THUNK
export const GetAllShop = createAsyncThunk(
  "Shop/Get",
  async (formData) => {
    try {
      const response = await axios.post(GetShop, formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error)
    }
  }
);



// INITIAL STATE
const initialState = {
  
  Shop: [],
  loading: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(createShopAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createShopAsync.fulfilled, (state, action) => {
        state.loading = false;
    
      })

      // LOGIN ADD CASE
      .addCase(GetAllShop.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllShop.fulfilled, (state, action) => {
        state.loading = false;
        state.Shop = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(UpdateShopAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateShopAsync.fulfilled, (state, action) => {
        state.loading = false;
      })

      
      .addCase(DeleteShop.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteShop.fulfilled, (state, action) => {
        state.loading = false;
      })
   
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
