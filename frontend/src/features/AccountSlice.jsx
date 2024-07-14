import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addEmployee = "http://localhost:8000/api/employe/addEmploye";




//CREATE ASYNC THUNK
export const CreateEmployee = createAsyncThunk(
  "Employee/create",
  async (formData) => {
    try {
      const response = await axios.post(addEmployee, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);



const initialState = {
  
  Employee: [],
  loading: false,
};

const AccountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

     
      .addCase(CreateEmployee.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(CreateEmployee.fulfilled, (state, action) => {
        state.loading = false;
    
      })

    



      
   
  },
});

export const { reset } = AccountSlice.actions;

export default AccountSlice.reducer;
