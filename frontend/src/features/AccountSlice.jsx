import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addEmployee = "/api/employ/addEmploye";
const ActiveEmployee = "/api/employ/getAllActiveEmploye";
const PastEmployee = "/api/employ/getAllPastEmploye";
const EmployeeByID = "/api/employ/getEmployeDataById";
const Update = "/api/employ/updateEmploye";
const Debitcredit = "/api/employ/creditDebitBalance";
const creditEmployeeeSalary = '/api/employ/creditSalaryForSingleEmploye'



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





export const GetEmployeeActive = createAsyncThunk(
  "Employee/GetActiveEmployee",
  async (data) => {
    const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
    try {
      const response = await axios.post(`${ActiveEmployee}?&page=${data.page}${searchQuery}`);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
  )


export const GetEmployeePast = createAsyncThunk(
  "Employee/GetEmplpyeePast",
  async (data) => {
    const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
    try {
      const response = await axios.post(`${PastEmployee}?&page=${data.page}${searchQuery}`);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
  )





export const GetEmployeeById = createAsyncThunk(
  "Employee/SingleEmployee",
  async (id) => {
    try {
      const response = await axios.post(EmployeeByID, id);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);



export const UpdateEmployee = createAsyncThunk(
  "Employee/Update",
  async (formData) => {
    try {
      const response = await axios.post(Update, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);


export const AddCreditDebit = createAsyncThunk(
  "Employee/Debitcredit",
  async (formData) => {
    try {
      const response = await axios.post(Debitcredit, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);



export const CreditSalary = createAsyncThunk(
  "Employee/CreaditEmployeeSalary",
  async (formData) => {
    try {
      const response = await axios.post(creditEmployeeeSalary, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);








const initialState = {

  Employees: [],
  Employee: {},
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


      .addCase(GetEmployeeActive.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetEmployeeActive.fulfilled, (state, action) => {
        state.loading = false;
        state.Employees = action.payload

      })
      .addCase(GetEmployeePast.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetEmployeePast.fulfilled, (state, action) => {
        state.loading = false;
        state.Employees = action.payload


      })


      .addCase(GetEmployeeById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.Employee = action.payload


      })



      .addCase(UpdateEmployee.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateEmployee.fulfilled, (state, action) => {
        state.loading = false;



      })


      .addCase(AddCreditDebit.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddCreditDebit.fulfilled, (state, action) => {
        state.loading = false;



      })


      .addCase(CreditSalary.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(CreditSalary.fulfilled, (state, action) => {
        state.loading = false;



      })






  },
});

export const { reset } = AccountSlice.actions;

export default AccountSlice.reducer;
