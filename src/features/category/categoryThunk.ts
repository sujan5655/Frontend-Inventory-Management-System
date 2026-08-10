import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  createCategoryRequest,
  deleteCategoryRequest,
  fetchCategoriesRequest,
  updateCategoryRequest,
} from "./categoryAPI";
import type { Category, CategoryPayload } from "./categoryTypes";

function extractError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (data && typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const firstValue = firstKey ? data[firstKey] : null;
      if (Array.isArray(firstValue)) return `${firstKey}: ${firstValue[0]}`;
      if (typeof firstValue === "string") return firstValue;
    }
  }
  return fallback;
}

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("category/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchCategoriesRequest();
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to load categories"));
  }
});

export const createCategory = createAsyncThunk<
  Category,
  CategoryPayload,
  { rejectValue: string }
>("category/create", async (payload, { rejectWithValue }) => {
  try {
    return await createCategoryRequest(payload);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to create category"));
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { id: number; payload: Partial<CategoryPayload> },
  { rejectValue: string }
>("category/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateCategoryRequest(id, payload);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to update category"));
  }
});

export const deleteCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("category/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteCategoryRequest(id);
    return id;
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to delete category"));
  }
});
