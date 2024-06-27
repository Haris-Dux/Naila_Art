import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addCutting = "http://localhost:8000/api/process/cutting/addCutting";
const DeletCutting = "http://localhost:8000/api/branches/deleteBranch";
const UpdateCutting = "http://localhost:8000/api/branches/updateBranch";
const getAllCutting = "http://localhost:8000/api/process/cutting/getAllCutting";
const getSingleCutting = "http://localhost:8000/api/process/cutting/getCuttingById";



//CREATE ASYNC THUNK
export const createCutting = createAsyncThunk(
  "Cutting/create",
  async (formData) => {
    try {
      const response = await axios.post(addCutting, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
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
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
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
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);


// VERIFY ASYNC THUNK
export const GetAllCutting = createAsyncThunk(
  "Cutting/Get",
  async (formData) => {
    try {
      const response = await axios.post(getAllCutting, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);



export const GetSingleCutting = createAsyncThunk(
"Cutting/GetSingle",
  async (id) => {
    try {
      const response = await axios.post(getSingleCutting, id);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);




// INITIAL STATE
const initialState = {
  
  Cutting: [],
  SingleCutting:{},
  loading: false,
};

const CuttingSlice = createSlice({
  name: "CuttingSlice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(createCutting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createCutting.fulfilled, (state, action) => {
        state.loading = false;
    
      })

      // LOGIN ADD CASE
      .addCase(GetAllCutting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllCutting.fulfilled, (state, action) => {
        state.loading = false;
        state.Cutting = action.payload;
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

      .addCase(GetSingleCutting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleCutting.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleCutting = action.payload
      })



      
   
  },
});

export const { reset } = CuttingSlice.actions;

export default CuttingSlice.reducer;
