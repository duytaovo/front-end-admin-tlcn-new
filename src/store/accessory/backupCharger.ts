import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import backupChargerApi from "src/api/accessory/backupCharger/backupCharger-api";
import { payloadCreator } from "src/utils/utils";

export const getBackupCharger = createAsyncThunk(
  "backupCharger/getBackupCharger",
  payloadCreator(backupChargerApi.getBackupChargers),
);

export const getDetailBackupCharger = createAsyncThunk(
  "backupCharger/getDetailBackupCharger",
  payloadCreator(backupChargerApi.getDetailBackupCharger),
);
export const addBackupCharger = createAsyncThunk(
  "backupCharger/addBackupCharger",
  payloadCreator(backupChargerApi.addBackupCharger),
);

export const updateBackupCharger = createAsyncThunk(
  "backupCharger/updateBackupCharger",
  payloadCreator(backupChargerApi.updateBackupCharger),
);

export const deleteBackupCharger = createAsyncThunk(
  "backupCharger/deleteBackupCharger",
  payloadCreator(backupChargerApi.deleteBackupCharger),
);

interface IProudct {
  backupCharger: any;
  backupChargerDetail: any;
}

const initialState: IProudct = {
  backupCharger: [],
  backupChargerDetail: {},
};
const backupChargerlice = createSlice({
  name: "backupCharger",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBackupCharger.fulfilled, (state, { payload }) => {
      state.backupCharger = payload.data;
    });
    builder.addCase(getDetailBackupCharger.fulfilled, (state, { payload }) => {
      state.backupChargerDetail = payload.data;
    });
  },
});

const backupChargerReducer = backupChargerlice.reducer;
export default backupChargerReducer;

