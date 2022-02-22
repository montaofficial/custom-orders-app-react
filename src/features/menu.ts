import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: { value: [] },
  reducers: {
    loadMenu: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { loadMenu } = menuSlice.actions;

export default menuSlice.reducer;
