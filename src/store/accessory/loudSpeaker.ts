import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import loudSpeakerApi from "src/api/accessory/loudSpeaker/loudSpeaker-api";
import { payloadCreator } from "src/utils/utils";

export const getloudSpeaker = createAsyncThunk(
  "loudSpeaker/getloudSpeaker",
  payloadCreator(loudSpeakerApi.getloudSpeakers)
);

export const getDetailloudSpeaker = createAsyncThunk(
  "loudSpeaker/getDetailloudSpeaker",
  payloadCreator(loudSpeakerApi.getDetailloudSpeaker)
);
export const addloudSpeaker = createAsyncThunk(
  "loudSpeaker/addloudSpeaker",
  payloadCreator(loudSpeakerApi.addloudSpeaker)
);

export const updateloudSpeaker = createAsyncThunk(
  "loudSpeaker/updateloudSpeaker",
  payloadCreator(loudSpeakerApi.updateloudSpeaker)
);

export const deleteloudSpeaker = createAsyncThunk(
  "loudSpeaker/deleteloudSpeaker",
  payloadCreator(loudSpeakerApi.deleteloudSpeaker)
);

interface IProudct {
  loudSpeaker: any;
  loudSpeakerDetail: any;
}

const initialState: IProudct = {
  loudSpeaker: [],
  loudSpeakerDetail: {},
};
const loudSpeakerlice = createSlice({
  name: "loudSpeaker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addloudSpeaker.fulfilled, (state, { payload }) => {
    //   state.loudSpeaker = payload.data;
    // });
    builder.addCase(getloudSpeaker.fulfilled, (state, { payload }) => {
      state.loudSpeaker = payload.data;
    });
    builder.addCase(getDetailloudSpeaker.fulfilled, (state, { payload }) => {
      state.loudSpeakerDetail = payload.data;
    });
    // builder.addCase(updateloudSpeaker.fulfilled, (state, { payload }) => {
    //   [state.loudSpeakerDetail, ...payload.data];
    // });
    // builder.addCase(deleteloudSpeaker.fulfilled, (state, { payload }) => {
    //   state.loudSpeaker = payload.data;
    // });
  },
});

const loudSpeakerReducer = loudSpeakerlice.reducer;
export default loudSpeakerReducer;
