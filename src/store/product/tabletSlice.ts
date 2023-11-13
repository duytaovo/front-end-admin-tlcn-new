import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tabletApi from "src/api/product/tablet/tablet-api";
import { payloadCreator } from "src/utils/utils";

export const getTablet = createAsyncThunk(
  "tablet/getTablet",
  payloadCreator(tabletApi.getTablets)
);

export const getDetailTablet = createAsyncThunk(
  "tablet/getDetailTablet",
  payloadCreator(tabletApi.getDetailTablet)
);

export const addTablet = createAsyncThunk(
  "tablet/addTablet",
  payloadCreator(tabletApi.addTablet)
);

export const updateTablet = createAsyncThunk(
  "tablet/updateTablet",
  payloadCreator(tabletApi.updateTablet)
);

export const deleteTablet = createAsyncThunk(
  "tablet/deleteTablet",
  payloadCreator(tabletApi.deleteTablet)
);

interface IProduct {
  tablet: any;
  tabletDetail: any;
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
    accessories: "Tai nghe, sạc",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 5,
        ram: " 8 GB",
        storageCapacity: "256 GB",
        color: "Titan tự nhiên",
        price: 0,
        salePrice: 0,
        quantity: 1000,
        depotId: 1,
      },
      {
        typeId: 6,
        ram: " 8 GB",
        storageCapacity: "512 GB",
        color: "1000",
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
const initialState: IProduct = {
  tablet: [],
  tabletDetail: dataDetail,
};

const TabletSlice = createSlice({
  name: "tablet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTablet.fulfilled, (state, { payload }) => {
      state.tablet = payload.data;
    });
    builder.addCase(getDetailTablet.fulfilled, (state, { payload }) => {
      state.tabletDetail = payload.data.data;
    });
  },
});

const tabletReducer = TabletSlice.reducer;
export default tabletReducer;
