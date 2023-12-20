import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import laptopApi from "src/api/product/laptop/laptop-api";
import smartWatchApi from "src/api/product/smartWatch/smart-watch-api";
import { payloadCreator } from "src/utils/utils";

export const getSmartWatch = createAsyncThunk(
  "smartWatch/getSmartWatch",
  payloadCreator(smartWatchApi.getSmartWatchs),
);
export const getProductsFilterAccess = createAsyncThunk(
  "filter/getProductsFilterAccess",
  payloadCreator(laptopApi.getProductsFilterAccess),
);
export const getDetailSmartWatch = createAsyncThunk(
  "smartWatch/getDetailSmartWatch",
  payloadCreator(smartWatchApi.getDetailSmartWatch),
);
export const addSmartWatch = createAsyncThunk(
  "smartWatch/addSmartWatch",
  payloadCreator(smartWatchApi.addSmartWatch),
);

export const updateSmartWatch = createAsyncThunk(
  "smartWatch/updateSmartWatch",
  payloadCreator(smartWatchApi.updateSmartWatch),
);

export const deleteSmartWatch = createAsyncThunk(
  "smartWatch/deleteSmartWatch",
  payloadCreator(smartWatchApi.deleteSmartWatch),
);

interface IProudct {
  smartWatch: any;
  smartWatchDetail: any;
}
const dataDetail: any = {
  id: 3,
  monitor: "",
  operatingSystem: "",
  rearCamera: "",
  frontCamera: "",
  chip: "",
  sim: " ",
  battery: "",
  charging: "",
  networkSupport: "",
  productInfo: {
    brandId: 1,
    categoryId: 1,
    productId: 10,
    characteristicId: 7,
    productCode: "",
    name: "",
    description: "",
    design: " ",
    dimension: "",
    mass: 221.0,
    launchTime: 2023,
    accessories: "",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 5,
        ram: "",
        storageCapacity: "",
        color: "",
        price: 0,
        salePrice: 0,
        quantity: 1000,
        depotId: 1,
      },
    ],
    lstProductImageUrl: [],
    star: 4.9,
    totalReview: 100,
    slug: "",
  },
};
const initialState: IProudct = {
  smartWatch: [],
  smartWatchDetail: dataDetail,
};
const smartWatchSlice = createSlice({
  name: "smartWatch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSmartWatch.fulfilled, (state, { payload }) => {
      state.smartWatch = payload.data;
    });
    builder.addCase(getDetailSmartWatch.fulfilled, (state, { payload }) => {
      state.smartWatchDetail = payload.data.data;
    });
    builder.addCase(getProductsFilterAccess.fulfilled, (state, { payload }) => {
      state.smartWatch = payload.data;
    });
  },
});

const smartWatchReducer = smartWatchSlice.reducer;
export default smartWatchReducer;

