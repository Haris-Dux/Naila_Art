import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { buildQueryParams } from "../Utils/Common";
import { getStorage, setStorage } from "../../hooks/use-local-storage";

//API URL
const getaccessories = "/api/stock/accessories/getAllAccesoriesInStock";
const updateaccessories = "/api/stock/accessories/updateAllAccesoriesInStock";
const getBags = "/api/stock/bags/getAllBagsAndBox";
const getBase = "/api/stock/base/getAllBases";
const getBaseforEmroidery = "/api/stock/base/getAllBasesForEmbroidery";
const getAllCategoryForBaseUrl = "/api/stock/base/getAllCategoriesForbase";
const getLace = "/api/stock/lace/getAllLaceStock";
const GetLaceForEmroidery = "/api/stock/lace/getAllLaceForEmbroidery";
const getSuits = "/api/stock/suits/getAllSuits";
const getAllCategoryForSuitsUrl = "/api/stock/suits/getAllCategoriesForSuits";
const getExpense = "/api/stock/expense/getAllExpenses";
const createExpenseCategoryUrl = "/api/stock/expense/createExpenseCategory";
const updateExpenseCategoryUrl = "/api/stock/expense/updateExpenseCategory";
const getExpensesCategoriesUrl = "/api/stock/expense/getExpensesCategories";
const getExpenseStatsUrl = "/api/stock/expense/getExpenseStats";
const deleteEXpenseUrl = "/api/stock/expense/deleteExpense";
const AddSuits = "/api/stock/suits/addBaseInStock";
const assignStock = "/api/branches/assignStockToBranch";
const getAllSuitsStockForBranch = "/api/branches/getAllSuitsStockForBranch";
const AllSuitsStockHistoryUrl = "/api/branches/getAllBranchStockHistory";
const approveOrRejectStockUrl = "/api/branches/approveOrRejectStock";
const deleteBaseStockUrl = "/api/stock/base/deleteBaseStock";
const getPendingStockForBranchUrl = "/api/branches/getPendingStockForBranch";

// GET ALL BRANCHES API
const getAllBranches = "/api/branches/getAllBranches";

export const AddSuit = createAsyncThunk("Suit/Create", async (formData) => {
  try {
    const response = await axios.post(AddSuits, formData);
    toast.success(response.data.message);

    return response.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
});

export const AssginStocktoBranch = createAsyncThunk(
  "AssginStocktoBranch/Create",
  async (formData) => {
    try {
      const response = await axios.post(assignStock, formData);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const AllBranchStockHistoryAsync = createAsyncThunk(
  "StocktoBranch/AllBranchStockHistory",
  async (data) => {
    try {
      const response = await axios.post(
        `${AllSuitsStockHistoryUrl}?page=${data.page}&branchId=${data.branchId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const approveOrRejectStock = createAsyncThunk(
  "approveOrRejectStock/Create",
  async (formData) => {
    try {
      const response = await axios.post(approveOrRejectStockUrl, formData);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

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
    const response = await axios.post(
      `${getSuits}?&page=${data.page}${category}${searchQuery}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const GetAllStockForBranch = createAsyncThunk(
  "StockForBranch/Get",
  async (data) => {
    const searchQuery =
      data?.search !== undefined && data?.search !== null
        ? `&search=${data?.search}`
        : "";

    const category =
      data?.category !== undefined && data?.category !== null
        ? `&category=${data?.category}`
        : "";

    try {
      // Make POST request with id and search query in body
      const response = await axios.post(
        `${getAllSuitsStockForBranch}?&page=${data.page}${category}${searchQuery}`,
        {
          id: data.id,
        }
      );
      return response.data;
    } catch (error) {
      // Handle error by throwing the appropriate message
      throw new Error(error.response?.data?.error || "An error occurred");
    }
  }
);

export const GetAllCategoriesForSuits = createAsyncThunk(
  "SuitsCategories/Get",
  async () => {
    try {
      const response = await axios.post(getAllCategoryForSuitsUrl);

      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

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
    const response = await axios.post(
      `${getBase}?&page=${data.page}${category}${searchQuery}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const GetAllBaseforEmroidery = createAsyncThunk(
  "BaseforEmroifery/Get",
  async (data) => {
    try {
      const response = await axios.post(`${getBaseforEmroidery}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const GetAllCategoriesForBase = createAsyncThunk(
  "BaseCategories/Get",
  async () => {
    try {
      const response = await axios.post(getAllCategoryForBaseUrl);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllLace = createAsyncThunk("Lace/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(
      `${getLace}?&page=${data.page}${searchQuery}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const GetAllLaceForEmroidery = createAsyncThunk(
  "LaceForEmroidery/Get",
  async () => {
    try {
      const response = await axios.post(GetLaceForEmroidery);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const GetAllBags = createAsyncThunk("Bags/Get", async () => {
  try {
    const response = await axios.post(getBags);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
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
      const response = await axios.post(
        `${getaccessories}?&page=${data.page}${searchQuery}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const UpdateUsedAccessories = createAsyncThunk(
  "usedAccessories/Get",
  async (data) => {
    try {
      const response = await axios.post(updateaccessories, data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const GetAllExpense = createAsyncThunk("Expense/Get", async (data) => {
  const category =
    data?.categoryId !== undefined && data?.categoryId !== null
      ? `&category=${data?.categoryId}`
      : "";
  const branchId =
    data?.branchId !== undefined && data?.branchId !== null
      ? `&branchId=${data?.branchId}`
      : "";
  try {
    const response = await axios.post(
      `${getExpense}?&page=${data.page}${branchId}${category}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const GetAllBranches = createAsyncThunk("Branches/GetAll", async () => {
  try {
    const response = await axios.post(getAllBranches);

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

// DELETE EXPENSE
export const DeleteExpenseAsync = createAsyncThunk(
  "Expense/deleteExpense",
  async (id) => {
    try {
      const response = await axios.post(deleteEXpenseUrl, id);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// CREATE EXPENSE CATEGORY
export const createExpenseCategoryAsync = createAsyncThunk(
  "Expense/CreateCategory",
  async (data) => {
    try {
      const response = await axios.post(createExpenseCategoryUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

// UPDATE EXPENSE CATEGORY
export const updateExpenseCategoryAsync = createAsyncThunk(
  "Expense/updateExpense",
  async (data) => {
    try {
      const response = await axios.post(updateExpenseCategoryUrl, data);
      toast.success(response.data.message);

      return response.data;
    } catch (error) {
      toast.error(error.response.data);
    }
  }
);

// GET EXPENSE CATEGORY
export const getExpenseCategoriesAsync = createAsyncThunk(
  "Expense/expenseCategories",
  async () => {
    try {
      const response = await axios.post(getExpensesCategoriesUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

//GET EXPENSE STATS
export const getExpenseStatsAsync = createAsyncThunk(
  "Expense/ExpenseStats",
  async (data) => {
    const query = buildQueryParams({
      branchId: data.branchId,
      year: data.year,
    });
    try {
      const response = await axios.get(`${getExpenseStatsUrl}?${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// DELETE BASE STOCK
export const DeleteBaseStockAsync = createAsyncThunk(
  "Base/DeleteBaseStock",
  async (data) => {
    try {
      const response = await axios.post(deleteBaseStockUrl, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

export const getPendingStockForBranchAsync = createAsyncThunk(
  "Branches/getAllPendingStock",
  async () => {
    try {
      const response = await axios.post(getPendingStockForBranchUrl);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// INITIAL STATE
const sessionStorageKey = "branches"
const initialState = {
  SuitLoading: false,
  UsedAccessoriesLoading: false,
  Suit: [],
  Base: [],
  BaseforEmroidery: [],
  BaseCategories: [],
  SuitCategories: [],
  Lace: [],
  LaceForEmroidery: [],
  Bags: [],
  accessories: [],
  Expense: [],
  ExpenseLoading: false,
  loading: false,
  GetSuitloading: false,
  Branches: getStorage(sessionStorageKey) || [],
  suitStocks: [],
  StockHistory: [],
  StockHistoryLoading: false,
  stockLoading: false,
  addSuitLoading: false,
  deleteLodaing: false,
  pendingStock: [],
  ExpenseCategories: [],
  ExpenseStats: [],
  ExpenseCategoryLoading: false,
  ExpenseUpdateLoading: false,
  ExpenseStatsLoading: false,
};

const InStockSlic = createSlice({
  name: "InStock",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      //PENDING STOCK FOR BRANCH
      .addCase(getPendingStockForBranchAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPendingStockForBranchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingStock = action.payload;
      })
      .addCase(getPendingStockForBranchAsync.rejected, (state, action) => {
        state.loading = false;
        state.pendingStock = [];
      })

      .addCase(GetAllaccessories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllaccessories.fulfilled, (state, action) => {
        state.loading = false;
        state.accessories = action.payload;
      })

      //DELETE EXPENSE STOCK
      .addCase(DeleteExpenseAsync.pending, (state, action) => {
        state.deleteLodaing = true;
      })
      .addCase(DeleteExpenseAsync.fulfilled, (state, action) => {
        state.deleteLodaing = false;
      })
      .addCase(DeleteExpenseAsync.rejected, (state, action) => {
        state.deleteLodaing = false;
      })

      //ADD EXPENSE CATEGORY
      .addCase(createExpenseCategoryAsync.pending, (state, action) => {
        state.ExpenseUpdateLoading = true;
      })
      .addCase(createExpenseCategoryAsync.fulfilled, (state, action) => {
        state.ExpenseUpdateLoading = false;
      })
      .addCase(createExpenseCategoryAsync.rejected, (state, action) => {
        state.ExpenseUpdateLoading = false;
      })

      //UPDATE EXPENSE CATEGORY
      .addCase(updateExpenseCategoryAsync.pending, (state, action) => {
        state.ExpenseUpdateLoading = true;
      })
      .addCase(updateExpenseCategoryAsync.fulfilled, (state, action) => {
        state.ExpenseUpdateLoading = false;
      })
      .addCase(updateExpenseCategoryAsync.rejected, (state, action) => {
        state.ExpenseUpdateLoading = false;
      })

      //GET EXPENSE CATEGORIES
      .addCase(getExpenseCategoriesAsync.pending, (state, action) => {
        state.ExpenseCategoryLoading = true;
      })
      .addCase(getExpenseCategoriesAsync.fulfilled, (state, action) => {
        state.ExpenseCategoryLoading = false;
        state.ExpenseCategories = action.payload;
      })
      .addCase(getExpenseCategoriesAsync.rejected, (state, action) => {
        state.ExpenseCategoryLoading = false;
        state.ExpenseCategories = [];
      })

      //GET EXPENSE STATS
      .addCase(getExpenseStatsAsync.pending, (state, action) => {
        state.ExpenseStatsLoading = true;
      })
      .addCase(getExpenseStatsAsync.fulfilled, (state, action) => {
        state.ExpenseStatsLoading = false;
        state.ExpenseStats = action.payload;
      })
      .addCase(getExpenseStatsAsync.rejected, (state, action) => {
        state.ExpenseStatsLoading = false;
        state.ExpenseStats = [];
      })

      //DELETE BASE STOCK
      .addCase(DeleteBaseStockAsync.pending, (state, action) => {
        state.deleteLodaing = true;
      })
      .addCase(DeleteBaseStockAsync.fulfilled, (state, action) => {
        state.deleteLodaing = false;
      })
      .addCase(DeleteBaseStockAsync.rejected, (state, action) => {
        state.deleteLodaing = false;
      })

      .addCase(UpdateUsedAccessories.pending, (state, action) => {
        state.UsedAccessoriesLoading = true;
      })
      .addCase(UpdateUsedAccessories.fulfilled, (state, action) => {
        state.UsedAccessoriesLoading = false;
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

      .addCase(GetAllBaseforEmroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBaseforEmroidery.fulfilled, (state, action) => {
        state.loading = false;
        state.BaseforEmroidery = action.payload;
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

      .addCase(GetAllStockForBranch.pending, (state, action) => {
        state.GetSuitloading = true;
      })
      .addCase(GetAllStockForBranch.fulfilled, (state, action) => {
        state.GetSuitloading = false;
        state.suitStocks = action.payload;
      })

      .addCase(AllBranchStockHistoryAsync.pending, (state, action) => {
        state.StockHistoryLoading = true;
      })
      .addCase(AllBranchStockHistoryAsync.fulfilled, (state, action) => {
        state.StockHistoryLoading = false;
        state.StockHistory = action.payload;
      })

      .addCase(GetAllExpense.pending, (state, action) => {
        state.ExpenseLoading = true;
      })
      .addCase(GetAllExpense.fulfilled, (state, action) => {
        state.ExpenseLoading = false;
        state.Expense = action.payload;
      })

      .addCase(GetAllExpense.rejected, (state, action) => {
        state.ExpenseLoading = false;
      })

      .addCase(AddSuit.pending, (state) => {
        state.addSuitLoading = true;
      })
      .addCase(AddSuit.fulfilled, (state, action) => {
        state.addSuitLoading = false;
      })

      .addCase(approveOrRejectStock.pending, (state) => {
        state.stockLoading = true;
      })
      .addCase(approveOrRejectStock.fulfilled, (state, action) => {
        state.stockLoading = false;
      })

      .addCase(AssginStocktoBranch.pending, (state) => {
        state.stockLoading = true;
      })
      .addCase(AssginStocktoBranch.fulfilled, (state, action) => {
        state.stockLoading = false;
      })
      .addCase(GetAllBranches.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.Branches = action.payload;
        setStorage(sessionStorageKey,action.payload)
      })

      .addCase(GetAllLaceForEmroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllLaceForEmroidery.fulfilled, (state, action) => {
        state.loading = false;
        state.LaceForEmroidery = action.payload;
      });
  },
});

export const { reset } = InStockSlic.actions;

export default InStockSlic.reducer;
