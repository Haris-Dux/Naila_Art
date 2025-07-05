import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { buildQueryParams } from "../Utils/Common";

//API URL
const addStone = "/api/process/stone/addStone";
const UpdateStone = "/api/process/stone/updateStone";
const getAllStone = "/api/process/stone/getAllStone";
const getSingleStone = "/api/process/stone/getStoneById";
const getColor = '/api/process/stone/getColorsForCurrentEmbroidery'
const generatePdf = "/api/processBillRouter/generateGatePassPdfFunction";
const generateProcessBillURL = "/api/processBillRouter/generateProcessBill";
const deleteStoneURL = "/api/process/stone/deleteStone";
const getStoneDataBypartyNameURL =
  "/api/process/stone/getStoneDataBypartyName";

//CREATE ASYNC THUNK
export const createStone = createAsyncThunk(
  "Stone/create",
  async (formData) => {
    try {
      const response = await axios.post(addStone, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {

      toast.error(error.response.data.error);
    }
  }
);

// VERIFY ASYNC THUNK
export const GetAllStone = createAsyncThunk("Stone/Get", async (data) => {
 const filters = data?.filters ?? {};
      const query = buildQueryParams({
        Manual_No: filters.Manual_No,
        partyName: filters.partyName,
        project_status: filters.project_status,
        page: data.page,
      });
  try {
    const response = await axios.post(`${getAllStone}?${query}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);

  }
}
);


export const GetSingleStone = createAsyncThunk("Stone/GetSingle", async (id) => {
  try {
    const response = await axios.post(getSingleStone, id);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);

  }
}
);

// DOWNLOAD GATEPASS PDF file
const downloadPDF = (response) => {
  if (response.headers && response.data) {
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers["content-disposition"];
    const filenameMatch =
      contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : "invoice.pdf";

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("Invalid response format");
  }
};

export const generateStoneGatePssPdfAsync = createAsyncThunk(
  "Stone/DownladPdf",
  async (data) => {
    try {
      const response = await axios.post(
        generatePdf,
        { data, category: "Stone" },
        { responseType: "arraybuffer" }
      );
      downloadPDF(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error downloading PDF");
    }
  }
);

//CREATE BILL FOR STONE
export const generateStoneBillAsync = createAsyncThunk(
  "Stone/generateProcessBil",
  async (formData) => {
    try {
      const response = await axios.post(generateProcessBillURL, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

//GET COLORS
export const getColorsForCurrentEmbroidery = createAsyncThunk(
  "Stone/GetColor",
  async (id) => {
    try {
      const response = await axios.post(getColor, id);
      
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// DELETE STONE ASYNC THUNK
export const deleteStoneAsync = createAsyncThunk(
  "Stone/deleteStone",
  async (data) => {
    try {
      const response = await axios.post(deleteStoneURL, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET STONE DATA BY PARTY NAME ASYNC THUNK
export const getStoneDataBypartyNameAsync = createAsyncThunk(
  "Stone/getStoneDataByPartyName",
  async (data) => {
    try {
      const response = await axios.post(getStoneDataBypartyNameURL, data);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);




// INITIAL STATE
const initialState = {
  Stone: [],
  SingleStone: {},
  color:[],
  loading: false,
  StonerpdfLoading: false,
  StnoneBillLoading: false,
  previousDataByPartyName: [],
  deleteloadings: false,
};

const StoneSlice = createSlice({
  name: "StoneSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

       // DATA BY PARTY NAME
       .addCase(getStoneDataBypartyNameAsync.pending, (state, action) => {
        state.previousDataByPartyName = true;
      })
      .addCase(getStoneDataBypartyNameAsync.fulfilled, (state, action) => {
        state.previousDataByPartyName = action.payload;
      })

      // DELETE STONE
      .addCase(deleteStoneAsync.pending, (state, action) => {
        state.deleteloadings = true;
      })
      .addCase(deleteStoneAsync.fulfilled, (state, action) => {
        state.deleteloadings = false;
      })

    // STONE BILL
    .addCase(generateStoneBillAsync.pending, (state, action) => {
      state.StnoneBillLoading = true;
    })
    .addCase(generateStoneBillAsync.fulfilled, (state, action) => {
      state.StnoneBillLoading = false;
    })

    //DOWNLOAD PDF
    .addCase(generateStoneGatePssPdfAsync.pending, (state) => {
      state.StonerpdfLoading = true;
    })
    .addCase(generateStoneGatePssPdfAsync.fulfilled, (state, action) => {
      state.StonerpdfLoading = false;
    })

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
