import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const AddEmbroidery = "http://localhost:8000/api/process/embriodery/addEmbriodery";
const getEmbroidery = "http://localhost:8000/api/process/embriodery/getAllEmbroidery";
const getEmbroiderydetails = "http://localhost:8000/api/process/embriodery/getEmbroideryById";

const editEmbroidery = "http://localhost:8000/api/process/embriodery/updateEmbroidery";
const deleteEmbroidery = "http://localhost:8000/api/process/embriodery/addEmbriodery";






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


export const GETEmbroidery = createAsyncThunk(
  "Embroidery/GET",
  async (currentPage) => {
    try {
      const response = await axios.post(`${getEmbroidery}?page=${currentPage}`);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
      // Assuming you want to re-throw the error to handle it elsewhere
      throw error;
    }
  }
);



export const GETEmbroiderySIngle = createAsyncThunk(
  "EmbroideryDetails/GET",
  async (id) => {
    try {
      const response = await axios.post(getEmbroiderydetails,id);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);

    }
  }
);



export const UpdateEmbroidery = createAsyncThunk(
  "Embroidery/Update",
  async (formData) => {
    try {
      const response = await axios.post(editEmbroidery, formData);
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
  
  embroidery: [],
  SingleEmbroidery:{

  },
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


      .addCase(GETEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GETEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
        state.embroidery = action.payload
    
      })


      .addCase(GETEmbroiderySIngle.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GETEmbroiderySIngle.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleEmbroidery = action.payload
    
      })
   

      .addCase(UpdateEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
      
    
      })
   



  },
});

export const { reset } = EmbroiderySlice.actions;

export default EmbroiderySlice.reducer;
