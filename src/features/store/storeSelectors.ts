import type { RootState } from "../../app/store";

export const selectMyStores = (state: RootState) => state.store.items;
export const selectStoreStatus = (state: RootState) => state.store.status;
export const selectStoreError = (state: RootState) => state.store.error;

export const selectAllStores = (state: RootState) => state.store.allItems;
export const selectAllStoresStatus = (state: RootState) => state.store.allStatus;
export const selectAllStoresError = (state: RootState) => state.store.allError;
