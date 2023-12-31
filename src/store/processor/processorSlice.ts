import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import processorApi from "src/api/processor/processor.api";
import laptopApi from "src/api/product/laptop/laptop-api";
import { payloadCreator } from "src/utils/utils";

export const getProcessor = createAsyncThunk(
  "processor/getProcessor",
  payloadCreator(processorApi.getProcessors),
);

export const getDetailProcessor = createAsyncThunk(
  "processor/getDetailProcessor",
  payloadCreator(processorApi.getDetailProcessor),
);
export const addProcessor = createAsyncThunk(
  "processor/addProcessor",
  payloadCreator(processorApi.addProcessor),
);

export const updateProcessor = createAsyncThunk(
  "processor/updateProcessor",
  payloadCreator(processorApi.updateProcessor),
);

export const deleteProcessor = createAsyncThunk(
  "processor/deleteProcessor",
  payloadCreator(processorApi.deleteProcessor),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
);
interface IProudct {
  processor: any;
  processorDetail: any;
}

const initialState: IProudct = {
  processor: [],
  processorDetail: {},
};
const processorSlice = createSlice({
  name: "processor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProcessor.fulfilled, (state, { payload }) => {
      state.processor = payload.data;
    });
    builder.addCase(getDetailProcessor.fulfilled, (state, { payload }) => {
      state.processorDetail = payload.data?.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.processor = payload.data;
    });
  },
});

const processorReducer = processorSlice.reducer;
export default processorReducer;

