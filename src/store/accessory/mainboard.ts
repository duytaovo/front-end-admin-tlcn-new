import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import mainBoardApi from "src/api/accessory/mainBoard/mainBoard-api";
import { payloadCreator } from "src/utils/utils";

export const getMainboard = createAsyncThunk(
  "mainboard/getMainboard",
  payloadCreator(mainBoardApi.getMainboards),
);

export const getDetailMainboard = createAsyncThunk(
  "mainboard/getDetailMainboard",
  payloadCreator(mainBoardApi.getDetailMainboard),
);
export const addMainboard = createAsyncThunk(
  "mainboard/addMainboard",
  payloadCreator(mainBoardApi.addMainboard),
);

export const updateMainboard = createAsyncThunk(
  "mainboard/updateMainboard",
  payloadCreator(mainBoardApi.updateMainboard),
);

export const deleteMainboard = createAsyncThunk(
  "mainboard/deleteMainboard",
  payloadCreator(mainBoardApi.deleteMainboard),
);

interface IProudct {
  mainboard: any;
  mainboardDetail: any;
}

const initialState: IProudct = {
  mainboard: [],
  mainboardDetail: {},
};
const mainboardlice = createSlice({
  name: "mainboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addmainboard.fulfilled, (state, { payload }) => {
    //   state.mainboard = payload.data;
    // });
    builder.addCase(getMainboard.fulfilled, (state, { payload }) => {
      state.mainboard = payload.data;
    });
    builder.addCase(getDetailMainboard.fulfilled, (state, { payload }) => {
      state.mainboardDetail = payload.data;
    });
    // builder.addCase(updatemainboard.fulfilled, (state, { payload }) => {
    //   [state.mainboardDetail, ...payload.data];
    // });
    // builder.addCase(deletemainboard.fulfilled, (state, { payload }) => {
    //   state.mainboard = payload.data;
    // });
  },
});

const mainboardReducer = mainboardlice.reducer;
export default mainboardReducer;

