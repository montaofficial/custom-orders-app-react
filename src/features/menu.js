import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: { value: [] },
  reducers: {
    load: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { load } = menuSlice.actions;

export default menuSlice.reducer;
