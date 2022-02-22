import { createSlice } from "@reduxjs/toolkit";

export const currentPageSlice = createSlice({
  name: "currentPage",
  initialState: { value: "OrderPoint" },
  reducers: {
    changePage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changePage } = currentPageSlice.actions;

export default currentPageSlice.reducer;
