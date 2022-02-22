import { createSlice } from "@reduxjs/toolkit";
import { orderType } from "../interfaces/orderType";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    value: [],
  },
  reducers: {
    loadOrder: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { loadOrder } = orderSlice.actions;

export default orderSlice.reducer;
