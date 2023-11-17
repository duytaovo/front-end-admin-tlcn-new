import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderApi } from "src/api/order/orderApi.api";
import { payloadCreator } from "src/utils/utils";

export const getPurchases = createAsyncThunk(
  "orders/getPurchases",
  payloadCreator(orderApi.getPurchases)
);

export const getPurchasesById = createAsyncThunk(
  "orders/getPurchasesById",
  payloadCreator(orderApi.getPurchaseById)
);

export const updatePurchasesSuccess = createAsyncThunk(
  "orders/updatePurchasesSuccess",
  payloadCreator(orderApi.putOrderSuccess)
);

export const updatePurchasesDelivery = createAsyncThunk(
  "orders/updatePurchasesDelivery",
  payloadCreator(orderApi.putOrderDelivery)
);

export const updatePurchasesConfirm = createAsyncThunk(
  "orders/updatePurchasesConfirm",
  payloadCreator(orderApi.putOrderConfirm)
);

export const updatePurchasesCancel = createAsyncThunk(
  "orders/updatePurchasesCancel",
  payloadCreator(orderApi.putOrderCancel)
);
const datamau = {
  code: 0,
  message: "",
  data: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 2,
    data: [],
  },
};
const initialState = {
  order: datamau,
  orderDetail: {},
};

export const orders = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPurchases.fulfilled, (state, { payload }) => {
      state.order = payload.data;
    });
    builder.addCase(getPurchasesById.fulfilled, (state, { payload }) => {
      state.orderDetail = payload.data.data;
    });
  },
});

const orderReducer = orders.reducer;
export default orderReducer;
