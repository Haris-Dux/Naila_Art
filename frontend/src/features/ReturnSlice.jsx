import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getAllReturnsForBranchUrl = `/api/returns/getAllReturnsForBranch`;
const createReturn = "/api/returns/createReturn";

// GET BUYER FOR BRANCH THUNK

export const getAllReturnsForBranch = createAsyncThunk(
  "ReturnBIlls/ReturnsForBranch",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    try {
      const response = await axios.post(
        `${getAllReturnsForBranchUrl}?&page=${data.page}${searchQuery}`,
        { id: data.id }
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

// GET BUYER FOR BRANCH THUNK
export const CreateReturnforBranch = createAsyncThunk(
  "Returns/create",
  async (data) => {
    try {
      const response = await axios.post(createReturn, data);
      toast.success(response.data.message)
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// INITIAL STATE
const initialState = {
  ReturnsBillHistory: {},
  Returnloading: false,
};

const ReturnSlice = createSlice({
  name: "ReturnSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      // GET BUYER FOR BRANCH
      .addCase(getAllReturnsForBranch.pending, (state) => {
        state.Returnloading = true;
      })
      .addCase(getAllReturnsForBranch.fulfilled, (state, action) => {
        state.Returnloading = false;
        state.ReturnsBillHistory = action.payload;
      })

      // GET BUYER FOR BRANCH
      .addCase(CreateReturnforBranch.pending, (state) => {
        state.Returnloading = true;
      })
      .addCase(CreateReturnforBranch.fulfilled, (state, action) => {
        state.Returnloading = false;
      });
  },
});

export default ReturnSlice.reducer;
