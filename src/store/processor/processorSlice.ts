import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import processorApi from "src/api/processor/processor.api";
import { payloadCreator } from "src/utils/utils";

export const getProcessor = createAsyncThunk(
  "processor/getProcessor",
  payloadCreator(processorApi.getProcessors)
);

export const getDetailProcessor = createAsyncThunk(
  "processor/getDetailProcessor",
  payloadCreator(processorApi.getDetailProcessor)
);
export const addProcessor = createAsyncThunk(
  "processor/addProcessor",
  payloadCreator(processorApi.addProcessor)
);

export const updateProcessor = createAsyncThunk(
  "processor/updateProcessor",
  payloadCreator(processorApi.updateProcessor)
);

export const deleteProcessor = createAsyncThunk(
  "processor/deleteProcessor",
  payloadCreator(processorApi.deleteProcessor)
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
    // builder.addCase(addProcessor.fulfilled, (state, { payload }) => {
    //   state.Processor = payload.data;
    // });
    builder.addCase(getProcessor.fulfilled, (state, { payload }) => {
      state.processor = payload.data;
    });
    // builder.addCase(getDetailProcessor.fulfilled, (state, { payload }) => {
    //   state.ProcessorDetail = payload.data;
    // });
    // builder.addCase(updateProcessor.fulfilled, (state, { payload }) => {
    //   [state.ProcessorDetail, ...payload.data];
    // });
    // builder.addCase(deleteProcessor.fulfilled, (state, { payload }) => {
    //   state.Processor = payload.data;
    // });
  },
});

const processorReducer = processorSlice.reducer;
export default processorReducer;
