import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addStitching = "http://localhost:8000/api/process/Stitching/addStitching";

const UpdateStitching = "http://localhost:8000/api/process/Stitching/updateStitching";
const getAllStitching = "http://localhost:8000/api/process/Stitching/getAllStitching";
const getSingleStitching = "http://localhost:8000/api/process/Stitching/getStitchingById";



//CREATE ASYNC THUNK
export const createStitching = createAsyncThunk(
  "Shop/create",
  async (formData) => {
    try {
      const response = await axios.post(addStitching, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);

// lOGIN ASYNC THUNK
export const UpdateStitchingAsync = createAsyncThunk(
  "Stitching/Update",
  async (formData) => {
    try {
      const response = await axios.post(UpdateStitching, formData);
      toast.success(response.data.message);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);





// VERIFY ASYNC THUNK
export const GetAllStitching = createAsyncThunk(
  "Stitching/Get",
  async (formData) => {
    try {
      const response = await axios.post(getAllStitching, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);



export const GetSingleStitching = createAsyncThunk(
"Stitching/GetSingle",
  async (id) => {
    try {
      const response = await axios.post(getSingleStitching, id);
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
  
  Stitching: [],
  SingleStitching:{},
  loading: false,
};

const StitchingSlice = createSlice({
  name: "StitchingSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(createStitching.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createStitching.fulfilled, (state, action) => {
        state.loading = false;
    
      })

      // LOGIN ADD CASE
      .addCase(GetAllStitching.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllStitching.fulfilled, (state, action) => {
        state.loading = false;
        state.Stitching = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(UpdateStitchingAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateStitchingAsync.fulfilled, (state, action) => {
        state.loading = false;
      })


      .addCase(GetSingleStitching.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleStitching.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleStitching = action.payload
      })



      
   
  },
});

export const { reset } = StitchingSlice.actions;

export default StitchingSlice.reducer;
