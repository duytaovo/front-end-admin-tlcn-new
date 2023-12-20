import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cardGraphicApi from "src/api/cardGrap/cardGrap.api";
import laptopApi from "src/api/product/laptop/laptop-api";
import { payloadCreator } from "src/utils/utils";

export const getCardGraphic = createAsyncThunk(
  "cardGraphic/getCardGraphic",
  payloadCreator(cardGraphicApi.getCardGraphics),
);

export const getDetailCardGraphic = createAsyncThunk(
  "cardGraphic/getDetailCardGraphic",
  payloadCreator(cardGraphicApi.getDetailCardGraphic),
);
export const addCardGraphic = createAsyncThunk(
  "cardGraphic/addCardGraphic",
  payloadCreator(cardGraphicApi.addCardGraphic),
);

export const updateCardGraphic = createAsyncThunk(
  "cardGraphic/updateCardGraphic",
  payloadCreator(cardGraphicApi.updateCardGraphic),
);

export const deleteCardGraphic = createAsyncThunk(
  "cardGraphic/deleteCardGraphic",
  payloadCreator(cardGraphicApi.deleteCardGraphic),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
);
interface IProudct {
  cardGraphic: any;
  cardGraphicDetail: any;
}

const initialState: IProudct = {
  cardGraphic: [],
  cardGraphicDetail: {},
};
const cardGraphicSlice = createSlice({
  name: "cardGraphic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCardGraphic.fulfilled, (state, { payload }) => {
      state.cardGraphic = payload.data;
    });
    builder.addCase(getDetailCardGraphic.fulfilled, (state, { payload }) => {
      state.cardGraphicDetail = payload.data?.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.cardGraphic = payload.data;
    });
  },
});

const cardGraphicReducer = cardGraphicSlice.reducer;
export default cardGraphicReducer;

