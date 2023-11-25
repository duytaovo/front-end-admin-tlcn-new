import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import mouseApi from "src/api/accessory/mouse/mouse-api";
import { payloadCreator } from "src/utils/utils";

export const getMouse = createAsyncThunk(
  "mouse/getMouse",
  payloadCreator(mouseApi.getMouses)
);

export const getDetailMouse = createAsyncThunk(
  "mouse/getDetailMouse",
  payloadCreator(mouseApi.getDetailMouse)
);
export const addMouse = createAsyncThunk(
  "mouse/addMouse",
  payloadCreator(mouseApi.addMouse)
);

export const updateMouse = createAsyncThunk(
  "mouse/updateMouse",
  payloadCreator(mouseApi.updateMouse)
);

export const deleteMouse = createAsyncThunk(
  "mouse/deleteMouse",
  payloadCreator(mouseApi.deleteMouse)
);

interface IProudct {
  mouse: any;
  mouseDetail: any;
}

const initialState: IProudct = {
  mouse: [],
  mouseDetail: {},
};
const Mouselice = createSlice({
  name: "mouse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addmouse.fulfilled, (state, { payload }) => {
    //   state.mouse = payload.data;
    // });
    builder.addCase(getMouse.fulfilled, (state, { payload }) => {
      state.mouse = payload.data;
    });
    builder.addCase(getDetailMouse.fulfilled, (state, { payload }) => {
      state.mouseDetail = payload.data;
    });
    // builder.addCase(updatemouse.fulfilled, (state, { payload }) => {
    //   [state.mouseDetail, ...payload.data];
    // });
    // builder.addCase(deletemouse.fulfilled, (state, { payload }) => {
    //   state.mouse = payload.data;
    // });
  },
});

const mouseReducer = Mouselice.reducer;
export default mouseReducer;
