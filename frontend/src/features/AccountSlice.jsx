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
const addLeaveUrl = '/api/employ/addLeave'
const addOvertimeUrl = '/api/employ/addOvertime'


export const CreateEmployee = createAsyncThunk(
  "Employee/create",
  async (formData) => {
    try {
      const response = await axios.post(addEmployee, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const GetEmployeeActive = createAsyncThunk("Employee/GetActiveEmployee", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(`${ActiveEmployee}?&page=${data.page}${searchQuery}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
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
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
)

export const GetEmployeeById = createAsyncThunk(
  "Employee/SingleEmployee",
  async (id) => {
    try {
      const response = await axios.post(EmployeeByID, id);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const UpdateEmployee = createAsyncThunk(
  "Employee/Update",
  async (formData) => {
    try {
      const response = await axios.post(Update, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const AddCreditDebit = createAsyncThunk(
  "Employee/Debitcredit",
  async (formData) => {
    try {
      const response = await axios.post(Debitcredit, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
     toast.error(error.response.data.error);
    }
  }
);

export const CreditSalary = createAsyncThunk(
  "Employee/CreaditEmployeeSalary",
  async (formData) => {
    try {
      const response = await axios.post(creditEmployeeeSalary, formData);
      toast.success(response.data.message);
      
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const addLeaveAsync = createAsyncThunk(
  "Employee/markLeave",
  async (formData) => {
    try {
      const response = await axios.post(addLeaveUrl, formData);
      toast.success(response.data.message);
      
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const addOvertimeHoursAsync = createAsyncThunk(
  "Employee/addOvertime",
  async (formData) => {
    try {
      const response = await axios.post(addOvertimeUrl, formData);
      toast.success(response.data.message);
      
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);






const initialState = {
  Employees: [],
  ActiveEmployees: [],
  PastEmployees: [],
  Employee: {},
  loading: false,
  employeEditLoading:false
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
        state.employeEditLoading = true;
      })
      .addCase(CreateEmployee.fulfilled, (state, action) => {
        state.employeEditLoading = false;

      })

      .addCase(addLeaveAsync.pending, (state, action) => {
        state.employeEditLoading = true;
      })
      .addCase(addLeaveAsync.fulfilled, (state, action) => {
        state.employeEditLoading = false;

      })

      .addCase(GetEmployeeActive.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetEmployeeActive.fulfilled, (state, action) => {
        state.loading = false;
        state.ActiveEmployees = action.payload
      })

      .addCase(GetEmployeePast.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetEmployeePast.fulfilled, (state, action) => {
        state.loading = false;
        state.PastEmployees = action.payload
      })


      .addCase(GetEmployeeById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.Employee = action.payload
      })


      .addCase(UpdateEmployee.pending, (state, action) => {
        state.employeEditLoading = true;
      })
      .addCase(UpdateEmployee.fulfilled, (state, action) => {
        state.employeEditLoading = false;
      })


      .addCase(AddCreditDebit.pending, (state, action) => {
        state.employeEditLoading = true;
      })
      .addCase(AddCreditDebit.fulfilled, (state, action) => {
        state.employeEditLoading = false;
      })


      .addCase(CreditSalary.pending, (state, action) => {
        state.employeEditLoading = true;
      })
      .addCase(CreditSalary.fulfilled, (state, action) => {
        state.employeEditLoading = false;
      })
  },
});

export const { reset } = AccountSlice.actions;

export default AccountSlice.reducer;
