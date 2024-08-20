import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const signupUrl = "/api/users/signup";
const loginUrl = "/api/users/login";
const userSessionUrl = "/api/users/persistUserSession";
const logoutUrl = "/api/users/logout";
const authUserSessionUrl = "/api/users/persistUserSession"
const forgetPassUrl = "/api/users/sendResetPasswordOTP";
const verifyOtpPassUrl = "/api/users/verifyOtp";
const resetPassUrl = "/api/users/updatePassword";
const getUsersForBranch = "/api/users/getUsersForBranch";
const updateUser  = '/api/users/updateUser'
const pendingRequest = '/api/users/getPendingRequests'

//CREATE ASYNC THUNK
export const createuserAsync = createAsyncThunk(
  "user/create",
  async (formData) => {
    try {
      const response = await axios.post(signupUrl, formData);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// lOGIN ASYNC THUNK
export const loginuserAsync = createAsyncThunk(
  "user/login",
  async (formData) => {
    try {
      const response = await axios.post(loginUrl, formData);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const userSessionAsync = createAsyncThunk("user/session", async () => {
  try {
    const response = await axios.get(userSessionUrl);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

// Logout Function
export const logoutUserAsync = createAsyncThunk("user/logout", async () => {
  try {
    const response = await axios.delete(logoutUrl);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
});

// FORGET ASYNC THUNK
export const forgetuserAsync = createAsyncThunk(
  "user/forget",
  async (formData) => {
    try {
      const response = await axios.post(forgetPassUrl, formData);
      toast.success(response.data.message);
    return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const GetUserBYBranch = createAsyncThunk(
  "user/GetUserBYBranch",
  async (data) => {
    try {
      const response = await axios.post(getUsersForBranch, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
      
    }
  }
);

export const getPendingRequests = createAsyncThunk(
  "user/PendingRequestsUser",
  async () => {
    try {
      const response = await axios.post(pendingRequest);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const UpdateUser = createAsyncThunk(
  "user/uppdateUser",
  async (data) => {
    try {
      const response = await axios.post(updateUser, data);
      toast.success(response.data.message);  
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// AUTH USER ASYNC THUNK - UPDATED
export const authUserAsync = createAsyncThunk("users/authClientSessionEverytime", async (_, thunkAPI) => {
  thunkAPI.dispatch(setLoading(true));
  try {
    const response = await axios.get(authUserSessionUrl);
    return response.data;
  } catch (error) {
    thunkAPI.dispatch(RemoveUserData());
    console.log(error.response.data.message);
  } finally {
    thunkAPI.dispatch(setLoading(false));
  }
});


// INITIAL STATE
const initialState = {
  createUser: null,
  user: null,
  loading: false,
  userId: null,
  forgetPasswordEmail: null,
  resetPassword: null,
  validateToken: null,
  getUsersForBranch: [],
  pendingRequest:[],
  pendingRequestsLoading:false
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    RemoveUserData: (state) => {
      state.user = null;
    },
    addUserData: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // SIGN UP ADD CASE
      .addCase(createuserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(createuserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.createUser = action.payload;
      })

      // LOGIN ADD CASE
      .addCase(loginuserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginuserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginuserAsync.rejected, (state) => {
        state.loading = false;
      })

      // Session ADD CASE
      .addCase(userSessionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(userSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(forgetuserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgetuserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.userId;
      })


      // VERIFY OTP ADD CASE
      .addCase(verifyOtpAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.loading = false;
      })

      // VERIFY OTP ADD CASE
      .addCase(resetPassAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassAsync.fulfilled, (state) => {
        state.loading = false;
      })


      .addCase(GetUserBYBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetUserBYBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.getUsersForBranch = action.payload;
      })

      .addCase(authUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(authUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(UpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateUser.fulfilled, (state, ) => {
        state.loading = false;
      
      })


      .addCase(getPendingRequests.pending, (state) => {
        state.pendingRequestsLoading = true;
      })
      .addCase(getPendingRequests.fulfilled, (state,action ) => {
        state.pendingRequestsLoading = false;
        state.pendingRequest = action.payload;
      })


      .addCase(logoutUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      });

  },
});

export const {setLoading, reset } = authSlice.actions;

export default authSlice.reducer;
