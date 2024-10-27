import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//API URL
const AddEmbroidery = "/api/process/embriodery/addEmbriodery";
const getEmbroidery = "/api/process/embriodery/getAllEmbroidery";
const getEmbroiderydetails = "/api/process/embriodery/getEmbroideryById";
const editEmbroidery = "/api/process/embriodery/updateEmbroidery";
const generatePdf = "/api/processBillRouter/generateGatePassPdfFunction";
const generateProcessBillURL = "/api/processBillRouter/generateProcessBill";
const getAllDesignNumbersURL = "/api/process/embriodery/getAllDesignNumbers";
const getHeadDataByDesignNoURL = "/api/process/embriodery/getHeadDataByDesignNo";
const getPreviousDataBypartyNameURL = "/api/process/embriodery/getPreviousDataBypartyName";




//CREATE ASYNC THUNK
export const CreateEmbroidery = createAsyncThunk(
  "Embroidery/create",
  async (formData) => {
    try {
      const response = await axios.post(AddEmbroidery, formData);
      toast.success(response.data.message);
      
      return response.data;
    } catch (error) {

      toast.error(error.response.data.error);

    }
  }
);

export const GETEmbroidery = createAsyncThunk("Embroidery/GET", async (data) => {
  const searchQuery =
    data?.search !== undefined && data?.search !== null
      ? `&search=${data?.search}`
      : "";
  try {
    const response = await axios.post(`${getEmbroidery}?&page=${data.page}${searchQuery}`);
    
    return response.data;
  } catch (error) {
    
    throw error;
  }
}
);

export const GETEmbroiderySIngle = createAsyncThunk(
  "EmbroideryDetails/GET",
  async (id) => {
    try {
      const response = await axios.post(getEmbroiderydetails, id);
      return response.data;
    } catch (error) {
    
      throw new Error(error.response.data.error);

    }
  }
);

export const UpdateEmbroidery = createAsyncThunk(
  "Embroidery/Update",
  async (formData) => {
    try {
      const response = await axios.post(editEmbroidery, formData);
      toast.success(response.data.message);
      
      return response.data;
    } catch (error) {
      
      toast.error(error.response.data.error);

    }
  }
);

// DOWNLOAD GATEPASS PDF file
const downloadPDF = (response) => {
  if (response.headers && response.data) {
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : 'invoice.pdf';

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('Invalid response format');
  }
};

export const generateEmbroideryGatePssPdfAsync = createAsyncThunk("Embroidery/DownladPdf", async (data) => {
  try {
    const response = await axios.post(generatePdf, {data,category:'Embroidery'}, { responseType: 'arraybuffer' });
    downloadPDF(response);
    return response;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Error downloading PDF');
  }
});

//CREATE BILL FOR EMBROIDERY
export const generateEmbroideryBillAsync = createAsyncThunk(
  "Embroidery/generateProcessBil",
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

//GET ALL DESIGN NUMBERS
export const getAllDesignNumbersAsync = createAsyncThunk("Embroider/getDesignNumbers", async () => {
  try {
    const response = await axios.post(getAllDesignNumbersURL);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  } 
});

//GET HEAD AND STITCH DATA
export const getHeadDataByDesignNoAsync = createAsyncThunk("Embroider/getHeadData", async (data) => {
  try {
    const response = await axios.post(getHeadDataByDesignNoURL,data);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  } 
})

//GET DATA FOR Old PARTY BY NAME

export const getPreviousDataBypartyNameAsync = createAsyncThunk("Embroider/getPreviousData", async (data) => {
  try {
    const response = await axios.post(getPreviousDataBypartyNameURL,data);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  } 
})



// INITIAL STATE
const initialState = {
  embroidery: [],
  SingleEmbroidery: {},
  loading: false,
  oldDataLoading:false,
  UpdatEmbroideryloading: false,
  EmroiderypdfLoading:false,
  generateBillLoading:false,
  designNumbers:[],
  headStitchData:[],
  previousDataByPartyName:[],
};

const EmbroiderySlice = createSlice({
  name: "EmbroiderySlice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Shop Add ADD CASE
      .addCase(CreateEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(CreateEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
      })

      // GET DESIGN NUMBERS CASES
      .addCase(getAllDesignNumbersAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllDesignNumbersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.designNumbers = action.payload;
      })
      .addCase(getAllDesignNumbersAsync.rejected, (state, action) => {
        state.loading = false;
      })

       // GET PREVIOUS DATA BY PARTY NAME
       .addCase(getPreviousDataBypartyNameAsync.pending, (state, action) => {
        state.oldDataLoading = true;
      })
      .addCase(getPreviousDataBypartyNameAsync.fulfilled, (state, action)  => {
        state.oldDataLoading = false;
        state.previousDataByPartyName = action.payload;
      })
      .addCase(getPreviousDataBypartyNameAsync.rejected, (state, action) => {
        state.oldDataLoading = false;
      })


      // GET HEAD STITCH DATA
      .addCase(getHeadDataByDesignNoAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getHeadDataByDesignNoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.headStitchData = action.payload;
      })
      .addCase(getHeadDataByDesignNoAsync.rejected, (state, action) => {
        state.loading = false;
      })

        // EMBROIDERY BILL 
        .addCase(generateEmbroideryBillAsync.pending, (state, action) => {
          state.generateBillLoading = true;
        })
        .addCase(generateEmbroideryBillAsync.fulfilled, (state, action) => {
          state.generateBillLoading = false;
  
        })


      .addCase(GETEmbroidery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GETEmbroidery.fulfilled, (state, action) => {
        state.loading = false;
        state.embroidery = action.payload

      })


      .addCase(GETEmbroiderySIngle.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GETEmbroiderySIngle.fulfilled, (state, action) => {
        state.loading = false;
        state.SingleEmbroidery = action.payload

      })


      .addCase(UpdateEmbroidery.pending, (state, action) => {
        state.UpdatEmbroideryloading = true;
      })
      .addCase(UpdateEmbroidery.fulfilled, (state, action) => {
        state.UpdatEmbroideryloading = false;
      })

         //DOWNLOAD PDF
         .addCase(generateEmbroideryGatePssPdfAsync.pending, (state) => {
          state.EmroiderypdfLoading = true;
      })
      .addCase(generateEmbroideryGatePssPdfAsync.fulfilled, (state, action) => {
          state.EmroiderypdfLoading = false;
          
      })




  },
});

export const { reset } = EmbroiderySlice.actions;

export default EmbroiderySlice.reducer;
