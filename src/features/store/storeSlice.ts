import { createSlice } from "@reduxjs/toolkit";
import {
  createStore,
  deleteStore,
  fetchAllStores,
  fetchMyStores,
  toggleStoreStatus,
  updateStore,
  updateStoreApproval,
} from "./storeThunk";
import type { StoreState } from "./storeTypes";

const initialState: StoreState = {
  items: [],
  status: "idle",
  error: null,

  allItems: [],
  allStatus: "idle",
  allError: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    clearStoreError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch my stores
      .addCase(fetchMyStores.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMyStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load your stores";
      })

      // create
      .addCase(createStore.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to create store";
      })

      // update
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update store";
      })

      // delete
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete store";
      })

      // toggle open/closed
      .addCase(toggleStoreStatus.fulfilled, (state, action) => {
        const store = state.items.find((s) => s.id === action.payload.id);
        if (store) store.is_open = action.payload.is_open;
        const adminStore = state.allItems.find((s) => s.id === action.payload.id);
        if (adminStore) adminStore.is_open = action.payload.is_open;
      })
      .addCase(toggleStoreStatus.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to toggle store status";
      })

      // ============================
      // Admin: fetch all stores
      // ============================
      .addCase(fetchAllStores.pending, (state) => {
        state.allStatus = "loading";
        state.allError = null;
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.allStatus = "succeeded";
        state.allItems = action.payload;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.allStatus = "failed";
        state.allError = action.payload ?? "Failed to load stores";
      })

      // ============================
      // Admin: approve / reject / suspend
      // ============================
      .addCase(updateStoreApproval.fulfilled, (state, action) => {
        const index = state.allItems.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.allItems[index] = action.payload;
      })
      .addCase(updateStoreApproval.rejected, (state, action) => {
        state.allError = action.payload ?? "Failed to update store status";
      });
  },
});

export const { clearStoreError } = storeSlice.actions;
export default storeSlice.reducer;
