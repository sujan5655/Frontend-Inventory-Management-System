import { createSlice } from "@reduxjs/toolkit";

import type { CartState } from "./cartTypes";

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cartThunk";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,

  status: "idle",

  error: null,
};
const recalculateCart = (state: CartState) => {
  state.totalItems = state.items.reduce(
    (total, item) => total + Number(item.quantity),
    0,
  );

  state.subtotal = state.items.reduce(
    (total, item) => total + Number(item.product_price) * Number(item.quantity),
    0,
  );
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.total_items;
        state.subtotal = Number(action.payload.subtotal);
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
        recalculateCart(state);
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        recalculateCart(state);
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.subtotal = 0;
      });
  },
});

export default cartSlice.reducer;
