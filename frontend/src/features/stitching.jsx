import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const addStitching = "/api/process/Stitching/addStitching";
const UpdateStitching = "/api/process/Stitching/updateStitching";
const getAllStitching = "/api/process/Stitching/getAllStitching";
const getSingleStitching = "/api/process/Stitching/getStitchingById";
const getStitchingByEmbroideryId = '/api/process/stitching/getStitchingByEmbroideryId'
const generatePdf = "/api/processBillRouter/generateGatePassPdfFunction"
const generateProcessBillURL = "/api/processBillRouter/generateProcessBill"


//CREATE ASYNC THUNK
export const createStitching = createAsyncThunk(
  "Shop/create",
  async (formData) => {
    try {
      const response = await axios.post(addStitching, formData);
      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error);
    }
  }
);

// lOGIN ASYNC THUNK
export const UpdateStitchingAsync = createAsyncThunk(
  "Stitching/Update",
  async (formData) => {
    try {
      const response = await axios.post(UpdateStitching, formData);
      toast.success(response.data.message);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

// VERIFY ASYNC THUNK
export const GetAllStitching = createAsyncThunk("Stitching/Get", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    // const response = await axios.post(getAllStitching, formData);
    const response = await axios.post(`${getAllStitching}?&page=${data.page}${searchQuery}`);
    // toast.success(response.data.message);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    toast.error(error.response.data.error);
  }
}
);

export const GetSingleStitching = createAsyncThunk(
  "Stitching/GetSingle",
  async (id) => {
    try {
      const response = await axios.post(getSingleStitching, id);
      // toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  }
);

export const getStitchingByEmbroidery = createAsyncThunk(
  "getStitchingByEmbroidery/getStitchingByEmbroideryGetSingle",
  async (id) => {
    try {
      const response = await axios.post(getStitchingByEmbroideryId, id);
      // toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
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

export const generateStitchingGatePssPdfAsync = createAsyncThunk(
  "Stitching/DownladPdf",
  async (data) => {
    try {
      const response = await axios.post(
        generatePdf,
        { data, category: "Stitching" },
        { responseType: "arraybuffer" }
      );
      downloadPDF(response);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error downloading PDF");
    }
  }
);

//CREATE BILL FOR STITCHING
export const generateStitchingBillAsync = createAsyncThunk(
  "Stitching/generateProcessBil",
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

  Stitching: [],
  SingleStitching: {},
  stitchingEmbroidery: {},
  loading: false,
  StitchingpdfLoading:false,
  StitchingBillLoading:false

};

const StitchingSlice = createSlice({
  name: "StitchingSlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

       // CALENDER BILL
       .addCase(generateStitchingBillAsync.pending, (state, action) => {
        state.StitchingBillLoading = true;
      })
      .addCase(generateStitchingBillAsync.fulfilled, (state, action) => {
        state.StitchingBillLoading = false;
      })

      //DOWNLOAD PDF
      .addCase(generateStitchingGatePssPdfAsync.pending, (state) => {
        state.StitchingpdfLoading = true;
      })
      .addCase(generateStitchingGatePssPdfAsync.fulfilled, (state, action) => {
        state.StitchingpdfLoading = false;
      })

      // Shop Add ADD CASE
      .addCase(createStitching.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createStitching.fulfilled, (state, action) => {
        state.loading = false;

      })

      // LOGIN ADD CASE
      .addCase(GetAllStitching.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllStitching.fulfilled, (state, action) => {
        state.loading = false;
        state.Stitching = action.payload;
      })

      // FORGET PASSWORD ADD CASE
      .addCase(UpdateStitchingAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateStitchingAsync.fulfilled, (state, action) => {
        state.loading = false;
      })


      .addCase(GetSingleStitching.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetSingleStitching.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleStitching = action.payload
      })

      .addCase(getStitchingByEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getStitchingByEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
        state.stitchingEmbroidery = action.payload
      })



  },
});

export const { reset } = StitchingSlice.actions;

export default StitchingSlice.reducer;
