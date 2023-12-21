import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monitorApi from "src/api/accessory/monitor/monitor-api";
import laptopApi from "src/api/product/laptop/laptop-api";
import { payloadCreator } from "src/utils/utils";

export const getMonitor = createAsyncThunk(
  "monitor/getMonitor",
  payloadCreator(monitorApi.getMonitors),
);

export const getDetailMonitor = createAsyncThunk(
  "monitor/getDetailMonitor",
  payloadCreator(monitorApi.getDetailMonitor),
);
export const addMonitor = createAsyncThunk(
  "monitor/addMonitor",
  payloadCreator(monitorApi.addMonitor),
);

export const updateMonitor = createAsyncThunk(
  "monitor/updateMonitor",
  payloadCreator(monitorApi.updateMonitor),
);

export const deleteMonitor = createAsyncThunk(
  "monitor/deleteMonitor",
  payloadCreator(monitorApi.deleteMonitor),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
);
interface IProudct {
  monitor: any;
  monitorDetail: any;
}

const initialState: IProudct = {
  monitor: [],
  monitorDetail: {},
};
const monitorlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMonitor.fulfilled, (state, { payload }) => {
      state.monitor = payload.data;
    });
    builder.addCase(getDetailMonitor.fulfilled, (state, { payload }) => {
      state.monitorDetail = payload.data?.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.monitor = payload.data;
    });
  },
});

const monitorReducer = monitorlice.reducer;
export default monitorReducer;

