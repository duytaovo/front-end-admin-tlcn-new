import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import microPhoneApi from "src/api/accessory/microPhone/microPhone-api";
import laptopApi from "src/api/product/laptop/laptop-api";
import { payloadCreator } from "src/utils/utils";

export const getMicrophone = createAsyncThunk(
  "microphone/getMicrophone",
  payloadCreator(microPhoneApi.getMicrophones),
);

export const getDetailMicrophone = createAsyncThunk(
  "microphone/getDetailMicrophone",
  payloadCreator(microPhoneApi.getDetailMicrophone),
);
export const addMicrophone = createAsyncThunk(
  "microphone/addMicrophone",
  payloadCreator(microPhoneApi.addMicrophone),
);

export const updateMicrophone = createAsyncThunk(
  "microphone/updateMicrophone",
  payloadCreator(microPhoneApi.updateMicrophone),
);

export const deleteMicrophone = createAsyncThunk(
  "microphone/deleteMicrophone",
  payloadCreator(microPhoneApi.deleteMicrophone),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
);
interface IProudct {
  microphone: any;
  microphoneDetail: any;
}

const initialState: IProudct = {
  microphone: [],
  microphoneDetail: {},
};
const microphonelice = createSlice({
  name: "microphone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMicrophone.fulfilled, (state, { payload }) => {
      state.microphone = payload.data;
    });
    builder.addCase(getDetailMicrophone.fulfilled, (state, { payload }) => {
      state.microphoneDetail = payload.data?.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.microphone = payload.data;
    });
  },
});

const microphoneReducer = microphonelice.reducer;
export default microphoneReducer;

