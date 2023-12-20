import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cardGraphicApi from "src/api/cardGrap/cardGrap.api";
import laptopApi from "src/api/product/laptop/laptop-api";
import romApi from "src/api/rom/rom.api";
import { payloadCreator } from "src/utils/utils";

export const getRoms = createAsyncThunk(
  "rom/getRoms",
  payloadCreator(romApi.getRoms),
);

export const getDetailRom = createAsyncThunk(
  "rom/getDetailRom",
  payloadCreator(romApi.getDetailRom),
);
export const addRom = createAsyncThunk(
  "rom/addRom",
  payloadCreator(romApi.addRom),
);

export const updateRom = createAsyncThunk(
  "rom/updateRom",
  payloadCreator(romApi.updateRom),
);

export const deleteRom = createAsyncThunk(
  "rom/deleteRom",
  payloadCreator(romApi.deleteRom),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
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
    builder.addCase(getRoms.fulfilled, (state, { payload }) => {
      state.rom = payload.data;
    });
    builder.addCase(getDetailRom.fulfilled, (state, { payload }) => {
      state.romDetail = payload.data.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.rom = payload.data;
    });
  },
});

const romReducer = romSlice.reducer;
export default romReducer;

