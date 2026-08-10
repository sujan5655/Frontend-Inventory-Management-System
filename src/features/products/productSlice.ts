import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProducts,
  fetchMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductDetail,
} from "./productThunk";

import type { ProductState } from "./productTypes";

const initialState: ProductState = {
  items: [],
  myItems: [],

  status: "idle",
  myStatus: "idle",

  error: null,
  myError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    clearProductError(state) {
      state.error = null;
    },

    clearMyProductError(state) {
      state.myError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================
      // Fetch All Products
      // ============================

      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // ============================
      // Fetch My Products
      // ============================

      .addCase(fetchMyProducts.pending, (state) => {
        state.myStatus = "loading";
        state.myError = null;
      })

      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myStatus = "succeeded";
        state.myItems = action.payload;
      })

      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.myStatus = "failed";
        state.myError = action.payload as string;
      })

      // ============================
      // Create Product
      // ============================

      .addCase(createProduct.fulfilled, (state, action) => {
        state.myItems.unshift(action.payload);

        // Optional: add to public products if visible immediately
        state.items.unshift(action.payload);
      })

      // ============================
      // Update Product
      // ============================

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.myItems = state.myItems.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        );

        state.items = state.items.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        );
      })

      // ============================
      // Delete Product
      // ============================

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.myItems = state.myItems.filter(
          (product) => product.id !== action.payload,
        );

        state.items = state.items.filter(
          (product) => product.id !== action.payload,
        );
      })

      .addCase(fetchProductDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })

      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload as string;
      });
  },
});

export const { clearProductError, clearMyProductError } = productSlice.actions;

export default productSlice.reducer;
