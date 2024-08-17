import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addCalender = "/api/process/calender/addCalender";
const UpdateCalender = "/api/process/calender/updateCalender";
const getAllCalender = "/api/process/calender/getAllCalender";
const getSingleCalender = "/api/process/calender/getCalenderById";



// CREATE CALENDER THUNK
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

// UPDATE CALENDER THUNK
export const UpdateCalenderAsync = createAsyncThunk(
  "Calender/Update",
  async (formData) => {
    try {
      const response = await axios.post(UpdateCalender, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET ALL CALENDER THUNK
export const GetAllCalender = createAsyncThunk("Calender/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(`${getAllCalender}?&page=${data.page}${searchQuery}`);
    // toast.success(response.data.message);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
}
);

// GET SINGLE CALENDER THUNK
export const GetSingleCalender = createAsyncThunk(
  "Calender/GetSingle",
  async (id) => {
    try {
      const response = await axios.post(getSingleCalender, id);
      // toast.success(response.data.message);
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
  SingleCalender: {},
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
      .addCase(UpdateCalenderAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateCalenderAsync.fulfilled, (state, action) => {
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
