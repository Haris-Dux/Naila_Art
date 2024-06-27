import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addCalender = "http://localhost:8000/api/process/calender/addCalender";
const DeletCalender = "http://localhost:8000/api/branches/deleteBranch";
const UpdateCalender = "http://localhost:8000/api/branches/updateBranch";
const getAllCalender = "http://localhost:8000/api/process/calender/getAllCalender";
const getSingleCalender = "http://localhost:8000/api/process/calender/getCalenderById";



//CREATE ASYNC THUNK
export const createCalender = createAsyncThunk(
  "Shop/create",
  async (formData) => {
    try {
      const response = await axios.post(addCalender, formData);
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
export const GetAllCalender = createAsyncThunk(
  "Calender/Get",
  async (formData) => {
    try {
      const response = await axios.post(getAllCalender, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);



export const GetSingleCalender = createAsyncThunk(
"Calender/GetSingle",
  async (id) => {
    try {
      const response = await axios.post(getSingleCalender, id);
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
  
  Calender: [],
  SingleCalender:{},
  loading: false,
};

const CalenderSlice = createSlice({
  name: "CalenderSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(createCalender.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createCalender.fulfilled, (state, action) => {
        state.loading = false;
    
      })

      // LOGIN ADD CASE
      .addCase(GetAllCalender.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllCalender.fulfilled, (state, action) => {
        state.loading = false;
        state.Calender = action.payload;
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

      .addCase(GetSingleCalender.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleCalender.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleCalender = action.payload
      })



      
   
  },
});

export const { reset } = CalenderSlice.actions;

export default CalenderSlice.reducer;
