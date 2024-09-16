import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addStone = "/api/process/stone/addStone";
const UpdateStone = "/api/process/stone/updateStone";
const getAllStone = "/api/process/stone/getAllStone";
const getSingleStone = "/api/process/stone/getStoneById";
const getColor = '/api/process/stone/getColorsForCurrentEmbroidery'
const generatePdf = "/api/processBillRouter/generateGatePassPdfFunction";
const generateProcessBillURL = "/api/processBillRouter/generateProcessBill";


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
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(`${getAllStone}?&page=${data.page}${searchQuery}`);
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



// INITIAL STATE
const initialState = {
  Stone: [],
  SingleStone: {},
  color:[],
  loading: false,
  StonerpdfLoading: false,
  StnoneBillLoading: false,
};

const StoneSlice = createSlice({
  name: "StoneSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

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
