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
  smartPhone: any;
  smartPhoneDetail: SmartPhoneDetail;
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
  },
};
const initialState: IProudct = {
  smartPhone: [],
  smartPhoneDetail: dataDetail,
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
      state.smartPhone = payload.data;
    });
    builder.addCase(getDetailPhone.fulfilled, (state, { payload }) => {
      console.log(payload.data.data);
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
