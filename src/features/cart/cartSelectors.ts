import type { RootState } from "../../app/store";

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;

export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
