import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import smartPhoneApi from "src/api/product/smartPhone/smart-phone-api";
import { SmartPhoneDetail } from "src/types/allProductsType.interface";
import { payloadCreator } from "src/utils/utils";

export const getSmartPhones = createAsyncThunk(
  "smartPhone/getSmartPhones",
  payloadCreator(smartPhoneApi.getSmartPhones),
);

export const getDetailPhone = createAsyncThunk(
  "smartPhone/getDetailPhone",
  payloadCreator(smartPhoneApi.getDetailSmartPhone),
);

export const getProductWithSlug = createAsyncThunk(
  "smartPhone/getProductWithSlug",
  payloadCreator(smartPhoneApi.getProductByProductSlugId),
);
export const addSmartPhone = createAsyncThunk(
  "smartPhone/addSmartPhone",
  payloadCreator(smartPhoneApi.addSmartPhone),
);

export const uploadImagesProductSmartPhone = createAsyncThunk(
  "smartPhone/uploadImagesProduct",
  payloadCreator(smartPhoneApi.uploadImageSmartPhone),
);

export const uploadManyImagesProductSmartPhone = createAsyncThunk(
  "smartPhone/uploadManyImagesProductSmartPhone",
  payloadCreator(smartPhoneApi.uploadManyImagesSmartPhone),
);

export const updateSmartPhone = createAsyncThunk(
  "smartPhone/updateSmartPhone",
  payloadCreator(smartPhoneApi.updateSmartPhone),
);

export const deleteSmartPhone = createAsyncThunk(
  "smartPhone/deleteSmartPhone",
  payloadCreator(smartPhoneApi.deleteSmartPhone),
);
export type SmartPhone = {
  data: any[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};
interface IProudct {
  smartPhone: any;
  smartPhoneDetail: SmartPhoneDetail;
  filter: SmartPhone;
}
const dataDetail: SmartPhoneDetail = {
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
        ram: " ",
        storageCapacity: "",
        color: "",
        price: 0,
        salePrice: 0,
        quantity: 1000,
        depotId: 1,
      },
      {
        typeId: 6,
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
const data = {
  data: [],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 1,
  totalPages: 1,
};
const initialState: IProudct = {
  smartPhone: [],
  smartPhoneDetail: dataDetail,
  filter: data,
};
const smartPhoneSlice = createSlice({
  name: "smartPhone",
  initialState,
  reducers: {
    handleFilterStore: (state, action) => {
      state.filter.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSmartPhones.fulfilled, (state, { payload }) => {
      state.smartPhone = payload.data;
    });
    builder.addCase(getDetailPhone.fulfilled, (state, { payload }) => {
      state.smartPhoneDetail = payload.data.data;
    });
    builder.addCase(getProductWithSlug.fulfilled, (state, { payload }) => {
      state.smartPhoneDetail = payload.data.data;
    });
  },
});
export const { handleFilterStore } = smartPhoneSlice.actions;

const smartPhoneReducer = smartPhoneSlice.reducer;
export default smartPhoneReducer;

