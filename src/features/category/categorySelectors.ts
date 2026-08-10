import type { RootState } from "../../app/store";

export const selectCategories = (state: RootState) => state.category.items;
export const selectCategoryStatus = (state: RootState) => state.category.status;
export const selectCategoryError = (state: RootState) => state.category.error;
