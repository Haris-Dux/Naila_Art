import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const getaccessories = "/api/stock/accessories/getAllAccesoriesInStock";
const getBags = "/api/stock/bags/getAllBagsAndBox";
const getBase = "/api/stock/base/getAllBases";
const getAllCategoryForBaseUrl = "/api/stock/base/getAllCategoriesForbase";
const getLace = "/api/stock/lace/getAllLaceStock";
const getSuits = "/api/stock/suits/getAllSuits";
const getAllCategoryForSuitsUrl = "/api/stock/suits/getAllCategoriesForSuits";
const getExpense = "/api/stock/expense/getAllExpenses";
const getExpenseForBranchUrl = "/api/stock/expense/getExpensesForBranch";
const AddSuits = "/api/stock/suits/addBaseInStock";

// GET ALL BRANCHES API
const getAllBranches = "/api/branches/getAllBranches";

export const AddSuit = createAsyncThunk("Suit/Create", async (formData) => {
  try {
    const response = await axios.post(AddSuits, formData);
    toast.success(response.data.message);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllSuit = createAsyncThunk("Suit/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";

  const category =
    data?.category !== undefined && data?.category !== null
      ? `&category=${data?.category}`
      : "";
  try {
    const response = await axios.post(`${getSuits}?&page=${data.page}${category}${searchQuery}`);
    // toast.success(response.data.message);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllCategoriesForSuits = createAsyncThunk("SuitsCategories/Get", async () => {
  try {
    const response = await axios.post(getAllCategoryForSuitsUrl);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllBase = createAsyncThunk("Base/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";

  const category =
    data?.category !== undefined && data?.category !== null
      ? `&category=${data?.category}`
      : "";
  try {
    const response = await axios.post(`${getBase}?&page=${data.page}${category}${searchQuery}`);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllCategoriesForBase = createAsyncThunk("BaseCategories/Get", async () => {
  try {
    const response = await axios.post(getAllCategoryForBaseUrl);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllLace = createAsyncThunk("Lace/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(`${getLace}?&page=${data.page}${searchQuery}`);
    // toast.success(response.data.message);

    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllBags = createAsyncThunk("Bags/Get", async () => {
  try {
    const response = await axios.post(getBags);
    // toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

export const GetAllaccessories = createAsyncThunk(
  "accessories/Get",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";
    try {
      const response = await axios.post(`${getaccessories}?&page=${data.page}${searchQuery}`);
      // toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllExpense = createAsyncThunk("Expense/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  const branchId =
    data?.branchId !== undefined && data?.branchId !== null
      ? `&branchId=${data?.branchId}`
      : "";
  try {
    const response = await axios.post(`${getExpense}?&page=${data.page}${branchId}${searchQuery}`);;
    // toast.success(response.data.message);

    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    // toast.error(error.response.data.error);
  }
});

// export const GetAllExpenseForBranch = createAsyncThunk("ExpenseForBranch/Get", async (fromData) => {
//   try {
//     const response = await axios.post(getExpenseForBranchUrl, fromData);
//     // toast.success(response.data.message);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.log(error.response.data.error);
//     // toast.error(error.response.data.error);
//   }
// });

export const GetAllBranches = createAsyncThunk("Branches/GetAll", async (id) => {
  try {
    const response = await axios.post(getAllBranches, id);
    // toast.success(response.data.message);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
});

// INITIAL STATE
const initialState = {
  Suit: [],
  Base: [],
  BaseCategories: [],
  SuitCategories: [],
  Lace: [],
  Bags: [],
  accessories: [],
  Expense: [],
  // SingleBranchExpense: [],
  loading: false,
  GetSuitloading: false,
  Branches: [],
};

const InStockSlic = createSlice({
  name: "InStock",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(GetAllaccessories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllaccessories.fulfilled, (state, action) => {
        state.loading = false;
        state.accessories = action.payload;
      })

      .addCase(GetAllBags.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBags.fulfilled, (state, action) => {
        state.loading = false;
        state.Bags = action.payload;
      })

      .addCase(GetAllCategoriesForBase.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllCategoriesForBase.fulfilled, (state, action) => {
        state.loading = false;
        state.BaseCategories = action.payload;
      })

      .addCase(GetAllCategoriesForSuits.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllCategoriesForSuits.fulfilled, (state, action) => {
        state.loading = false;
        state.SuitCategories = action.payload;
      })

      .addCase(GetAllBase.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBase.fulfilled, (state, action) => {
        state.loading = false;
        state.Base = action.payload;
      })

      .addCase(GetAllLace.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllLace.fulfilled, (state, action) => {
        state.loading = false;
        state.Lace = action.payload;
      })

      .addCase(GetAllSuit.pending, (state, action) => {
        state.GetSuitloading = true;
      })
      .addCase(GetAllSuit.fulfilled, (state, action) => {
        state.GetSuitloading = false;
        state.Suit = action.payload;
      })

      .addCase(GetAllExpense.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.Expense = action.payload;
      })

      // .addCase(GetAllExpenseForBranch.pending, (state, action) => {
      //   state.loading = true;
      // })
      // .addCase(GetAllExpenseForBranch.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.SingleBranchExpense = action.payload;
      // })

      .addCase(AddSuit.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AddSuit.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(GetAllBranches.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.Branches = action.payload;
      });
  },
});

export const { reset } = InStockSlic.actions;

export default InStockSlic.reducer;
