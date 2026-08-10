import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchProductsRequest,
  fetchMyProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  fetchProductDetailRequest,
} from "./productAPI";

import type { Product, ProductPayload } from "./productTypes";

// =========================
// Get All Products
// =========================

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await fetchProductsRequest();
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to fetch products",
    );
  }
});

// =========================
// Seller Products
// =========================

export const fetchMyProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchMyProducts", async (_, { rejectWithValue }) => {
  try {
    return await fetchMyProductsRequest();
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to fetch seller products",
    );
  }
});

// =========================
// Create Product
// =========================

export const createProduct = createAsyncThunk<
  Product,
  ProductPayload,
  { rejectValue: string }
>("products/createProduct", async (payload, { rejectWithValue }) => {
  try {
    return await createProductRequest(payload);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to create product",
    );
  }
});

// =========================
// Update Product
// =========================

export const updateProduct = createAsyncThunk<
  Product,
  {
    id: number;
    payload: Partial<ProductPayload>;
  },
  { rejectValue: string }
>("products/updateProduct", async (data, { rejectWithValue }) => {
  try {
    return await updateProductRequest(data.id, data.payload);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to update product",
    );
  }
});

// =========================
// Delete Product
// =========================

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await deleteProductRequest(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to delete product",
    );
  }
});

export const fetchProductDetail = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>(
  "products/fetchProductDetail",

  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductDetailRequest(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ?? "Failed to fetch product",
      );
    }
  },
);
