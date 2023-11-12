import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cardGraphicApi from "src/api/cardGrap/cardGrap.api";
import romApi from "src/api/rom/rom.api";
import { payloadCreator } from "src/utils/utils";

export const getRoms = createAsyncThunk(
  "rom/getRoms",
  payloadCreator(romApi.getRoms)
);

export const getDetailRom = createAsyncThunk(
  "rom/getDetailRom",
  payloadCreator(romApi.getDetailRom)
);
export const addRom = createAsyncThunk(
  "rom/addRom",
  payloadCreator(romApi.addRom)
);

export const updateRom = createAsyncThunk(
  "rom/updateRom",
  payloadCreator(romApi.updateRom)
);

export const deleteRom = createAsyncThunk(
  "rom/deleteRom",
  payloadCreator(romApi.deleteRom)
);

interface IProudct {
  rom: any;
  romDetail: any;
}

const initialState: IProudct = {
  rom: [],
  romDetail: {},
};
const romSlice = createSlice({
  name: "rom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addrom.fulfilled, (state, { payload }) => {
    //   state.rom = payload.data;
    // });
    builder.addCase(getRoms.fulfilled, (state, { payload }) => {
      state.rom = payload.data;
    });
    // builder.addCase(getDetailrom.fulfilled, (state, { payload }) => {
    //   state.romDetail = payload.data;
    // });
    // builder.addCase(updaterom.fulfilled, (state, { payload }) => {
    //   [state.romDetail, ...payload.data];
    // });
    // builder.addCase(deleterom.fulfilled, (state, { payload }) => {
    //   state.rom = payload.data;
    // });
  },
});

const romReducer = romSlice.reducer;
export default romReducer;
