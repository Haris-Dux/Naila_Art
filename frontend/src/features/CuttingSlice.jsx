import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addCutting = "/api/process/cutting/addCutting";
const UpdateCutting = "/api/process/cutting/updateCutting";
const getAllCutting = "/api/process/cutting/getAllCutting";
const getSingleCutting = "/api/process/cutting/getCuttingById";
const generatePdf = "/api/processBillRouter/generateGatePassPdfFunction";
const generateProcessBillURL = "/api/processBillRouter/generateProcessBill";



// CREATE CUTTING ASYNC THUNK
export const createCutting = createAsyncThunk(
  "Cutting/create",
  async (formData) => {
    try {
      const response = await axios.post(addCutting, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// UPDATE CUTTING ASYNC THUNK
export const Updatecuttingasync = createAsyncThunk(
  "cutting/Update",
  async (formData) => {
    try {
      const response = await axios.post(UpdateCutting, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// DELETE CUTTING ASYNC THUNK
export const DeleteShop = createAsyncThunk(
  "Shop/Delete",
  async (formData) => {
    try {
      const response = await axios.post(DeletShop, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
);

// GET ALL CUTTING ASYNC THUNK
export const GetAllCutting = createAsyncThunk("Cutting/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(`${getAllCutting}?&page=${data.page}${searchQuery}`);
 
    return response.data;
  } catch (error) {
  
    throw new Error(error.response.data.error);
  }
}
);

// GET SINGLE CUTTING
export const GetSingleCutting = createAsyncThunk(
  "Cutting/GetSingle",
  async (id) => {
    try {
      const response = await axios.post(getSingleCutting, id);
   
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

export const generateCuttingGatePssPdfAsync = createAsyncThunk(
  "Cutting/DownladPdf",
  async (data) => {
    try {
      const response = await axios.post(
        generatePdf,
        { data, category: "Cutting" },
        { responseType: "arraybuffer" }
      );
      downloadPDF(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error downloading PDF");
    }
  }
);

//CREATE BILL FOR EMBROIDERY
export const generateCuttingBillAsync = createAsyncThunk(
  "Cutting/generateProcessBil",
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




// INITIAL STATE
const initialState = {
  Cutting: [],
  SingleCutting: {},
  loading: false,
  CuttingpdfLoading: false,
  generateCuttingBillLoading: false,
};

const CuttingSlice = createSlice({
  name: "CuttingSlice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

     // CUTTING BILL
     .addCase(generateCuttingBillAsync.pending, (state, action) => {
      state.generateCuttingBillLoading = true;
    })
    .addCase(generateCuttingBillAsync.fulfilled, (state, action) => {
      state.generateCuttingBillLoading = false;
    })

    //DOWNLOAD PDF
    .addCase(generateCuttingGatePssPdfAsync.pending, (state) => {
      state.CuttingpdfLoading = true;
    })
    .addCase(generateCuttingGatePssPdfAsync.fulfilled, (state, action) => {
      state.CuttingpdfLoading = false;
    })

      // Shop Add ADD CASE
      .addCase(createCutting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createCutting.fulfilled, (state, action) => {
        state.loading = false;

      })

      // LOGIN ADD CASE
      .addCase(GetAllCutting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllCutting.fulfilled, (state, action) => {
        state.loading = false;
        state.Cutting = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(Updatecuttingasync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(Updatecuttingasync.fulfilled, (state, action) => {
        state.loading = false;
      })


      .addCase(DeleteShop.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(DeleteShop.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(GetSingleCutting.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleCutting.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleCutting = action.payload
      })
  },
});

export const { reset } = CuttingSlice.actions;

export default CuttingSlice.reducer;
