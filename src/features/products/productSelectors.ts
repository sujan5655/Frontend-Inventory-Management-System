import type { RootState } from "../../app/store";

// =========================
// Public Products
// =========================

export const selectProducts = (state: RootState) => state.products.items;

export const selectProductsStatus = (state: RootState) => state.products.status;

export const selectProductsError = (state: RootState) => state.products.error;

// =========================
// Seller Products
// =========================

export const selectMyProducts = (state: RootState) => state.products.myItems;

export const selectMyProductsStatus = (state: RootState) =>
  state.products.myStatus;

export const selectMyProductsError = (state: RootState) =>
  state.products.myError;

export const selectProductDetail = (state: RootState) =>
  state.products.selectedProduct;

export const selectProductDetailStatus = (state: RootState) =>
  state.products.detailStatus;

export const selectProductDetailError = (state: RootState) =>
  state.products.detailError;
