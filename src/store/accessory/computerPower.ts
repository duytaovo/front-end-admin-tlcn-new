import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import computerPowerApi from "src/api/accessory/computerPower/computerPower-api";
import { payloadCreator } from "src/utils/utils";

export const getComputerPower = createAsyncThunk(
  "computerPower/getComputerPower",
  payloadCreator(computerPowerApi.getComputerPowers),
);

export const getDetailComputerPower = createAsyncThunk(
  "computerPower/getDetailComputerPower",
  payloadCreator(computerPowerApi.getDetailComputerPower),
);
export const addComputerPower = createAsyncThunk(
  "computerPower/addComputerPower",
  payloadCreator(computerPowerApi.addComputerPower),
);

export const updateComputerPower = createAsyncThunk(
  "computerPower/updateComputerPower",
  payloadCreator(computerPowerApi.updateComputerPower),
);

export const deleteComputerPower = createAsyncThunk(
  "computerPower/deleteComputerPower",
  payloadCreator(computerPowerApi.deleteComputerPower),
);

interface IProudct {
  computerPower: any;
  computerPowerDetail: any;
}

const initialState: IProudct = {
  computerPower: [],
  computerPowerDetail: {},
};
const computerPowerlice = createSlice({
  name: "computerPower",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addComputerPower.fulfilled, (state, { payload }) => {
    //   state.computerPower = payload.data;
    // });
    builder.addCase(getComputerPower.fulfilled, (state, { payload }) => {
      state.computerPower = payload.data;
    });
    builder.addCase(getDetailComputerPower.fulfilled, (state, { payload }) => {
      state.computerPowerDetail = payload.data;
    });
    // builder.addCase(computerPower.fulfilled, (state, { payload }) => {
    //   [state.computerPowerDetail, ...payload.data];
    // });
    // builder.addCase(computerPower.fulfilled, (state, { payload }) => {
    //   state.computerPower = payload.data;
    // });
  },
});

const computerPowerReducer = computerPowerlice.reducer;
export default computerPowerReducer;

