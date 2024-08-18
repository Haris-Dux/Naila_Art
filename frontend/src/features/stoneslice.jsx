import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addStone = "/api/process/stone/addStone";
const UpdateStone = "/api/process/stone/updateStone";
const getAllStone = "/api/process/stone/getAllStone";
const getSingleStone = "/api/process/stone/getStoneById";
const getColor = '/api/process/stone/getColorsForCurrentEmbroidery'


//CREATE ASYNC THUNK
export const createStone = createAsyncThunk(
  "Stone/create",
  async (formData) => {
    try {
      const response = await axios.post(addStone, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);

    }
  }
);

// lOGIN ASYNC THUNK
export const UpdateStoneAsync = createAsyncThunk(
  "Stone/Update",
  async (formData) => {
    try {
      const response = await axios.post(UpdateStone, formData);
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
export const GetAllStone = createAsyncThunk("Stone/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    // const response = await axios.post(getAllStone, formData);
    const response = await axios.post(`${getAllStone}?&page=${data.page}${searchQuery}`);
    // toast.success(response.data.message);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
}
);


export const GetSingleStone = createAsyncThunk("Stone/GetSingle", async (id) => {
  try {
    const response = await axios.post(getSingleStone, id);
    // toast.success(response.data.message);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
}
);


export const getColorsForCurrentEmbroidery = createAsyncThunk(
  "Stone/GetColor",
  async (id) => {
    try {
      const response = await axios.post(getColor, id);
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
  Stone: [],
  SingleStone: {},
  color:[],
  loading: false,
};

const StoneSlice = createSlice({
  name: "StoneSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(createStone.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createStone.fulfilled, (state, action) => {
        state.loading = false;

      })

      // LOGIN ADD CASE
      .addCase(GetAllStone.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllStone.fulfilled, (state, action) => {
        state.loading = false;
        state.Stone = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(UpdateStoneAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateStoneAsync.fulfilled, (state, action) => {
        state.loading = false;
      })


      .addCase(GetSingleStone.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleStone.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleStone = action.payload
      })

      .addCase(getColorsForCurrentEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getColorsForCurrentEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
        state.color = action.payload
      })




  },
});

export const { reset } = StoneSlice.actions;

export default StoneSlice.reducer;
