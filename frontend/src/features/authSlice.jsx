import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const signupUrl = "http://localhost:8000/api/users/signup";
const loginUrl = "http://localhost:8000/api/users/login";
const forgetPassUrl = "http://localhost:8000/api/users/sendResetPasswordOTP";
const verifyOtpPassUrl = "http://localhost:8000/api/users/verifyOtp";
const resetPassUrl = "http://localhost:8000/api/users/updatePassword";
const getUsersForBranch  = "http://localhost:8000/api/users/getUsersForBranch";
//CREATE ASYNC THUNK
export const createuserAsync = createAsyncThunk(
  "user/create",
  async (formData) => {
    try {
      const response = await axios.post(signupUrl, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
);

// lOGIN ASYNC THUNK
export const loginuserAsync = createAsyncThunk(
  "user/login",
  async (formData) => {
    try {
      const response = await axios.post(loginUrl, formData);
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
export const forgetuserAsync = createAsyncThunk(
  "user/forget",
  async (formData) => {
    try {
      const response = await axios.post(forgetPassUrl, formData);
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
export const verifyOtpAsync = createAsyncThunk(
  "user/verify",
  async (formData) => {
    try {
      const response = await axios.post(verifyOtpPassUrl, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);


// RESET ASYNC THUNK
export const resetPassAsync = createAsyncThunk(
  "user/reset",
  async ({ id, resetPassword }) => {
    try {
      const response = await axios.post(resetPassUrl, { id, resetPassword });
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);


export const GetUserBYBranch = createAsyncThunk(
  "user/GetUserBYBranch",
  async (data) => {
    try {
      const response = await axios.post(getUsersForBranch, data);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);





// RESET PASSWORD ASYNC THUNK
// export const resetpasswordAsync = createAsyncThunk(
//   "user/resetPassword",
//   async ({ newPassword, confirmPassword, resetToken }) => {
//     try {
//       const response = await axios.post(resetPasswordUrl, {
//         newPassword,
//         confirmPassword,
//         resetToken,
//       });
//       toast.success(response.data.msg);
//       // console.log(response.data);
//       return response.data;
//     } catch (error) {
//       // console.log(error.response.data.msg);
//       toast.error(error.response.data.msg);
//     }
//   }
// );

// AUTH USER ASYNC THUNK
// export const authUserAsync = createAsyncThunk("users/authUser", async () => {
//   try {
//     const response = await axios.get(authUserUrl);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// LOGOUT ASYNC THUNK
// export const logoutUserAsync = createAsyncThunk("users/logout", async () => {
//   await axios.delete(logoutUrl);
// });

// INITIAL STATE
const initialState = {
  createUser: null,
  user: null,
  loading: false,
  userId: null,
  forgetPasswordEmail: null,
  resetPassword: null,
  validateToken: null,
  getUsersForBranch:[]
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // SIGN UP ADD CASE
      .addCase(createuserAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createuserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.createUser = action.payload;
      })

      // LOGIN ADD CASE
      .addCase(loginuserAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginuserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(forgetuserAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(forgetuserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
      })


      .addCase(GetUserBYBranch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetUserBYBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.getUsersForBranch = action.payload;
      })

    //       // RESET PASSWORD ADD CASE
    //       .addCase(resetpasswordAsync.pending, (state, action) => {
    //         state.loading = true;
    //       })
    //       .addCase(resetpasswordAsync.fulfilled, (state, action) => {
    //         state.loading = false;
    //         state.resetPassword = action.payload;
    //       })

    //       // AUTH USER ADD CASE
    //       .addCase(authUserAsync.pending, (state) => {
    //         state.loading = true;
    //       })
    //       .addCase(authUserAsync.fulfilled, (state, action) => {
    //         state.loading = false;
    //         state.user = action.payload;
    //       });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
