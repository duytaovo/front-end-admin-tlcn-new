import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: {
      data: [],
    },
  },
  reducers: {
    getResultSearch: (state, action) => {
      console.log(action.payload?.data?.data);
      state.search.data = action.payload?.data?.data;
    },
    removeResultSearch: (state) => {
      state.search.data = [];
    },
  },
});

export const { getResultSearch, removeResultSearch } = searchSlice.actions;

export default searchSlice.reducer;
