import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const AddEmbroidery = "http://localhost:8000/api/process/embriodery/addEmbriodery";




//CREATE ASYNC THUNK
export const CreateEmbroidery = createAsyncThunk(
  "Embroidery/create",
  async (formData) => {
    try {
      const response = await axios.post(AddEmbroidery, formData);
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
  
  Embroidery: [],
  loading: false,
};

const EmbroiderySlice = createSlice({
  name: "EmbroiderySlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(CreateEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(CreateEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
    
      })


    
   
  },
});

export const { reset } = EmbroiderySlice.actions;

export default EmbroiderySlice.reducer;
