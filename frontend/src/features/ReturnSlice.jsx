import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getAllReturnsForBranchUrl = "api/returns/getAllReturnsForBranch?search";
const createReturn = "/api/returns/createReturn";


// GET BUYER FOR BRANCH THUNK
export const getAllReturnsForBranch = createAsyncThunk(
  "Returns/get",
  async (data) => {
   
    try {
      const response = await axios.post(getAllReturnsForBranchUrl,
        { id: data.id }
      );
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);



// GET BUYER FOR BRANCH THUNK
export const CreateReturnforBranch = createAsyncThunk(
    "Returns/create",
    async (data) => {
     
      try {
        const response = await axios.post(createReturn,data);
        return response.data;
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  );
  


// INITIAL STATE
const initialState = {
  ReturnDetails: {},
  loading: false,
};

const ReturnSlice = createSlice({
  name: "ReturnSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      // GET BUYER FOR BRANCH
      .addCase(getAllReturnsForBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReturnsForBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.Returns = action.payload;
      })

  
  },
});

export default ReturnSlice.reducer;
