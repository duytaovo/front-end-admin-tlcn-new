import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import smartPhoneApi from "src/api/product/smartPhone/smart-phone-api";
import {
  ListSmartPhone,
  SmartPhoneDetail,
} from "src/types/allProductsType.interface";
import { payloadCreator } from "src/utils/utils";

export const getSmartPhones = createAsyncThunk(
  "smartPhone/getSmartPhones",
  payloadCreator(smartPhoneApi.getSmartPhones)
);

export const getSmartPhonesWithPageNumber = createAsyncThunk(
  "smartPhone/getSmartPhonesWithPageNumber",
  payloadCreator(smartPhoneApi.getSmartPhonesWithPageNumber)
);

export const getSmartPhonesWithPageNumberSize = createAsyncThunk(
  "smartPhone/getSmartPhonesWithPageNumberSize",
  payloadCreator(smartPhoneApi.getSmartPhonesWithPageNumberSize)
);

export const getDetailPhone = createAsyncThunk(
  "smartPhone/getDetailPhone",
  payloadCreator(smartPhoneApi.getDetailSmartPhone)
);
export const addSmartPhone = createAsyncThunk(
  "smartPhone/addSmartPhone",
  payloadCreator(smartPhoneApi.addSmartPhone)
);
// export const uploadImageProduct = createAsyncThunk(
//   "smartPhone/uploadImageProduct",
//   payloadCreator(smartPhoneApi.)
// );
// export const uploadImagesProduct = createAsyncThunk(
//   "smartPhone/uploadImagesProduct",
//   payloadCreator(smartPhoneApi.uploadImagesProduct)
// );
export const updateSmartPhone = createAsyncThunk(
  "smartPhone/updateSmartPhone",
  payloadCreator(smartPhoneApi.updateSmartPhone)
);

export const deleteSmartPhone = createAsyncThunk(
  "smartPhone/deleteSmartPhone",
  payloadCreator(smartPhoneApi.deleteSmartPhone)
);

interface IProudct {
  smartPhone: ListSmartPhone[];
  smartPhoneDetail: SmartPhoneDetail;
}
const data = {
  id: 8,
  monitor: "6.7 - Tần số quét 60 Hz",
  operatingSystem: "iOS",
  rearCamera: "Chính 48 MP & Phụ 12 MP",
  frontCamera: "12 MP",
  chip: "Apple A16 Bionic 6 nhân",
  sim: "1 Nano SIM & 1 eSIM",
  battery: "4383 mAh",
  charging: " 20 W",
  networkSupport: "5G",
  productInfo: {
    brandId: 1,
    categoryId: 1,
    productId: 8,
    characteristicId: 1,
    totalReview: 0,
    star: 0,
    productCode: "xQzA1slnwb",
    name: "",
    description: "",
    design: "",
    dimension: "",
    mass: 201.0,
    launchTime: 2023,
    accessories: "",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 7,
        ram: "6 GB",
        storageCapacity: "128 GB",
        color: "Hồng nhạt",
        price: 25600000.0,
        salePrice: 253000000.0,
      },
      {
        typeId: 8,
        ram: "6GB",
        storageCapacity: "256GB",
        color: "Đen ",
        price: 28500000.0,
        salePrice: 28000000.0,
      },
    ],
    lstProductImageUrl: [
      "https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-hong-2.jpg",
      "https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-hong-3.jpg",
    ],
  },
};
const initialState: IProudct = {
  smartPhone: [],
  smartPhoneDetail: data,
};
const smartPhoneSlice = createSlice({
  name: "smartPhone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addSmartPhone.fulfilled, (state, { payload }) => {
    //   state.smartPhone = payload.data;
    // });
    builder.addCase(getSmartPhones.fulfilled, (state, { payload }) => {
      state.smartPhone = payload.data.data.data;
    });
    builder.addCase(getDetailPhone.fulfilled, (state, { payload }) => {
      state.smartPhoneDetail = payload.data.data;
    });
    // builder.addCase(updatesmartPhone.fulfilled, (state, { payload }) => {
    //   [state.smartPhoneDetail, ...payload.data];
    // });
    // builder.addCase(deletesmartPhone.fulfilled, (state, { payload }) => {
    //   state.smartPhone = payload.data;
    // });
  },
});

const smartPhoneReducer = smartPhoneSlice.reducer;
export default smartPhoneReducer;
