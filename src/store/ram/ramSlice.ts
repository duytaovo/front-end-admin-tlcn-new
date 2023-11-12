import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cardGraphicApi from "src/api/cardGrap/cardGrap.api";
import ramApi from "src/api/ram/ram.api";
import { payloadCreator } from "src/utils/utils";

export const getRams = createAsyncThunk(
  "ram/getRams",
  payloadCreator(ramApi.getRams)
);

export const getDetailRam = createAsyncThunk(
  "ram/getDetailRam",
  payloadCreator(ramApi.getDetailRam)
);
export const addRam = createAsyncThunk(
  "ram/addRam",
  payloadCreator(ramApi.addRam)
);

export const updateRam = createAsyncThunk(
  "ram/updateRam",
  payloadCreator(ramApi.updateRam)
);

export const deleteRam = createAsyncThunk(
  "ram/deleteRam",
  payloadCreator(ramApi.deleteRam)
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
    // builder.addCase(addram.fulfilled, (state, { payload }) => {
    //   state.ram = payload.data;
    // });
    builder.addCase(getRams.fulfilled, (state, { payload }) => {
      state.ram = payload.data;
    });
    // builder.addCase(getDetailram.fulfilled, (state, { payload }) => {
    //   state.ramDetail = payload.data;
    // });
    // builder.addCase(updateram.fulfilled, (state, { payload }) => {
    //   [state.ramDetail, ...payload.data];
    // });
    // builder.addCase(deleteram.fulfilled, (state, { payload }) => {
    //   state.ram = payload.data;
    // });
  },
});

const ramReducer = ramSlice.reducer;
export default ramReducer;
