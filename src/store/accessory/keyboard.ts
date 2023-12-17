import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import keyboardApi from "src/api/accessory/keyboard/keyboard-api";
import { payloadCreator } from "src/utils/utils";

export const getKeyboard = createAsyncThunk(
  "keyboard/getkeyboard",
  payloadCreator(keyboardApi.getKeyboards),
);

export const getDetailkeyboard = createAsyncThunk(
  "keyboard/getDetailkeyboard",
  payloadCreator(keyboardApi.getDetailKeyboard),
);
export const addKeyboard = createAsyncThunk(
  "keyboard/addKeyboard",
  payloadCreator(keyboardApi.addKeyboard),
);

export const updateKeyboard = createAsyncThunk(
  "keyboard/updateKeyboard",
  payloadCreator(keyboardApi.updateKeyboard),
);

export const deleteKeyboard = createAsyncThunk(
  "keyboard/deleteKeyboard",
  payloadCreator(keyboardApi.deleteKeyboard),
);

interface IProudct {
  keyboard: any;
  keyboardDetail: any;
}

const initialState: IProudct = {
  keyboard: [],
  keyboardDetail: {},
};
const keyboardlice = createSlice({
  name: "keyboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getKeyboard.fulfilled, (state, { payload }) => {
      state.keyboard = payload.data;
    });
    builder.addCase(getDetailkeyboard.fulfilled, (state, { payload }) => {
      state.keyboardDetail = payload.data?.data;
    });
  },
});

const keyboardReducer = keyboardlice.reducer;
export default keyboardReducer;

