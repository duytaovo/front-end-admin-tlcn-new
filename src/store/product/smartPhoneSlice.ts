import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import smartPhoneApi from "src/api/product/smartPhone/smart-phone-api";
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
  smartPhoneDetail: any;
}

const initialState: IProudct = {
  smartPhone: [],
  smartPhoneDetail: {},
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
