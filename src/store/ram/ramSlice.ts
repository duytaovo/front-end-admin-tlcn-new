import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import laptopApi from "src/api/product/laptop/laptop-api";
import ramApi from "src/api/ram/ram.api";
import { payloadCreator } from "src/utils/utils";

export const getRams = createAsyncThunk(
  "ram/getRams",
  payloadCreator(ramApi.getRams),
);

export const getDetailRam = createAsyncThunk(
  "ram/getDetailRam",
  payloadCreator(ramApi.getDetailRam),
);
export const addRam = createAsyncThunk(
  "ram/addRam",
  payloadCreator(ramApi.addRam),
);

export const updateRam = createAsyncThunk(
  "ram/updateRam",
  payloadCreator(ramApi.updateRam),
);

export const deleteRam = createAsyncThunk(
  "ram/deleteRam",
  payloadCreator(ramApi.deleteRam),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
);
interface IProudct {
  ram: any;
  ramDetail: any;
}

const initialState: IProudct = {
  ram: [],
  ramDetail: {},
};
const ramSlice = createSlice({
  name: "ram",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRams.fulfilled, (state, { payload }) => {
      state.ram = payload.data;
    });
    builder.addCase(getDetailRam.fulfilled, (state, { payload }) => {
      state.ramDetail = payload.data.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.ram = payload.data;
    });
  },
});

const ramReducer = ramSlice.reducer;
export default ramReducer;

