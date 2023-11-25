import {
  AnyAction,
  Store,
  ThunkDispatch,
  configureStore,
} from "@reduxjs/toolkit";
import appReducer from "src/app.slice";
import userReducer from "./user/userSlice";
import smartPhoneReducer from "./product/smartPhoneSlice";
import categoryReducer from "./category/categorySlice";
import brandReducer from "./brand/brandSlice";
import laptopReducer from "./product/laptopSlice ";
import processorReducer from "./processor/processorSlice";
import ramReducer from "./ram/ramSlice";
import romReducer from "./rom/romSlice";
import cardGraphicReducer from "./cardGrap/cardGraphicSlice";
import characterReducer from "./characteristic/characteristicSlice";
import depotReducer from "./depot/depotSlice";
import tabletReducer from "./product/tabletSlice";
import smartWatchReducer from "./product/smartwatchSlice";
import orderReducer from "./order/orderSlice";
import commentsReducer from "./comment/commentsSlice";
import mouseReducer from "./accessory/mouse";
import keyboardReducer from "./accessory/keyboard";
import loudSpeakerReducer from "./accessory/loudSpeaker";

export const store = configureStore({
  reducer: {
    loading: appReducer,
    user: userReducer,
    orders: orderReducer,
    comment: commentsReducer,
    smartPhone: smartPhoneReducer,
    smartWatch: smartWatchReducer,
    laptop: laptopReducer,
    tablet: tabletReducer,
    category: categoryReducer,
    mouse: mouseReducer,
    keyboard: keyboardReducer,
    loudSpeaker: loudSpeakerReducer,
    brand: brandReducer,
    processor: processorReducer,
    ram: ramReducer,
    rom: romReducer,
    cardGraphic: cardGraphicReducer,
    character: characterReducer,
    depot: depotReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
  ],
});

// trích xuất type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 1. Get the root state's type from reducers

// 2. Create a type for thunk dispatch
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

// 3. Create a type for store using RootState and Thunk enabled dispatch
export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
  dispatch: AppThunkDispatch;
};

export default store;
