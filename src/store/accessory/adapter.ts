import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adapterApi from "src/api/accessory/adapter/adapter-api";
import { payloadCreator } from "src/utils/utils";

export const getAdapter = createAsyncThunk(
  "adapter/getAapter",
  payloadCreator(adapterApi.getAdapters),
);

export const getDetailAdapter = createAsyncThunk(
  "adapter/getDetailAdapter",
  payloadCreator(adapterApi.getDetailAdapter),
);
export const addAdapter = createAsyncThunk(
  "adapter/addAdapter",
  payloadCreator(adapterApi.addAdapter),
);

export const updateAdapter = createAsyncThunk(
  "adapter/updateAdapter",
  payloadCreator(adapterApi.updateAdapter),
);

export const deleteAdapter = createAsyncThunk(
  "adapter/deleteAdapter",
  payloadCreator(adapterApi.deleteAdapter),
);

interface IProudct {
  adapter: any;
  adapterDetail: any;
}

const initialState: IProudct = {
  adapter: [],
  adapterDetail: {},
};
const adapterlice = createSlice({
  name: "adapter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdapter.fulfilled, (state, { payload }) => {
      state.adapter = payload.data;
    });
    builder.addCase(getDetailAdapter.fulfilled, (state, { payload }) => {
      state.adapterDetail = payload.data?.data;
    });
  },
});

const adapterReducer = adapterlice.reducer;
export default adapterReducer;

