import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import laptopApi from "src/api/product/laptop/laptop-api";
import { payloadCreator } from "src/utils/utils";

export const getLaptop = createAsyncThunk(
  "laptop/getLaptop",
  payloadCreator(laptopApi.getLaptops)
);

export const getLaptopWithPageNumber = createAsyncThunk(
  "laptop/getLaptopWithPageNumber",
  payloadCreator(laptopApi.getLaptopsWithPageNumber)
);

export const getLaptopWithPageNumberSize = createAsyncThunk(
  "laptop/getLaptopWithPageNumberSize",
  payloadCreator(laptopApi.getLaptopsWithPageNumberSize)
);

export const getDetailLaptop = createAsyncThunk(
  "laptop/getDetailLaptop",
  payloadCreator(laptopApi.getDetailLaptop)
);
export const addLaptop = createAsyncThunk(
  "laptop/addLaptop",
  payloadCreator(laptopApi.addLaptop)
);
// export const uploadImageProduct = createAsyncThunk(
//   "smartPhone/uploadImageProduct",
//   payloadCreator(laptopApi.)
// );
// export const uploadImagesProduct = createAsyncThunk(
//   "smartPhone/uploadImagesProduct",
//   payloadCreator(laptopApi.uploadImagesProduct)
// );
export const updateLaptop = createAsyncThunk(
  "laptop/updateLaptop",
  payloadCreator(laptopApi.updateLaptop)
);

export const deleteLaptop = createAsyncThunk(
  "laptop/deleteLaptop",
  payloadCreator(laptopApi.deleteLaptop)
);

interface IProudct {
  laptop: any;
  laptopDetail: any;
}

const initialState: IProudct = {
  laptop: [],
  laptopDetail: {},
};
const Laptoplice = createSlice({
  name: "laptop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(addlaptop.fulfilled, (state, { payload }) => {
    //   state.laptop = payload.data;
    // });
    builder.addCase(getLaptop.fulfilled, (state, { payload }) => {
      state.laptop = payload.data.data.data;
    });
    // builder.addCase(getDetaillaptop.fulfilled, (state, { payload }) => {
    //   state.laptopDetail = payload.data;
    // });
    // builder.addCase(updatelaptop.fulfilled, (state, { payload }) => {
    //   [state.laptopDetail, ...payload.data];
    // });
    // builder.addCase(deletelaptop.fulfilled, (state, { payload }) => {
    //   state.laptop = payload.data;
    // });
  },
});

const laptopReducer = Laptoplice.reducer;
export default laptopReducer;
