import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { filterApi } from "src/api/filter/filter.api";
import { LaptopDetail } from "src/types/allProductsType.interface";
import { payloadCreator } from "src/utils/utils";

export const getSort = createAsyncThunk(
  "filter/getSort",
  payloadCreator(filterApi.getSort),
);

export const getFilter = createAsyncThunk(
  "filter/getFilter",
  payloadCreator(filterApi.getFilter),
);

interface IProuduct {
  filter: any;
  filterDetail: LaptopDetail;
}
const data = {
  id: 2,
  gateway: "",
  operatingSystem: "macOs",
  monitor: "15.3 inch",
  special: " Bảo mật vân tay",
  maximumRam: 0,
  maximumRom: 0,
  processorId: 1,
  processorName: "Không có",
  ramId: 1,
  ramName: "Không có",
  romId: 1,
  romName: "Không có",
  graphicsCardId: 1,
  graphicsCardName: "Không có",
  productInfo: {
    brandId: 1,
    categoryId: 2,
    productId: 16,
    characteristicId: 3,
    productCode: "kymff2qsXC",
    name: "Laptop MacBook Air 15 inch M2 2023 8CPU/8GB/256GB/10GPU",
    description: "",
    design: "",
    dimension: "",
    mass: 1.51,
    launchTime: 2028,
    accessories: "",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 6,
        ram: "",
        storageCapacity: "",
        color: "",
        price: 0.0,
        salePrice: 0.0,
        depotId: 0,
        quantity: 0,
      },
    ],
    lstProductImageUrl: [],
    totalReview: 0,
    star: 0,
    slug: "",
  },
};
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
  sort: [],
  filter: [],
  filterDetail: data,
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSort.fulfilled, (state, { payload }) => {
      state.sort = payload.data;
    });
    builder.addCase(getFilter.fulfilled, (state, { payload }) => {
      state.filter = payload.data;
    });
  },
});

const filterReducer = filterSlice.reducer;
export default filterReducer;

