import { createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "./categoryThunk";
import type { CategoryState } from "./categoryTypes";

const initialState: CategoryState = {
  items: [],
  status: "idle",
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load categories";
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to create category";
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update category";
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete category";
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
