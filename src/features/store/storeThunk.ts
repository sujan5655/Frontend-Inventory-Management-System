import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  createStoreRequest,
  deleteStoreRequest,
  fetchAllStoresRequest,
  fetchMyStoresRequest,
  toggleStoreStatusRequest,
  updateStoreApprovalRequest,
  updateStoreRequest,
} from "./storeAPI";
import type { Store, StorePayload } from "./storeTypes";

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

export const fetchMyStores = createAsyncThunk<Store[], void, { rejectValue: string }>(
  "store/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyStoresRequest();
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to load your stores"));
    }
  },
);

export const createStore = createAsyncThunk<Store, StorePayload, { rejectValue: string }>(
  "store/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createStoreRequest(payload);
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to create store"));
    }
  },
);

export const updateStore = createAsyncThunk<
  Store,
  { id: number; payload: Partial<StorePayload> },
  { rejectValue: string }
>("store/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateStoreRequest(id, payload);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to update store"));
  }
});

export const deleteStore = createAsyncThunk<number, number, { rejectValue: string }>(
  "store/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteStoreRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to delete store"));
    }
  },
);

export const toggleStoreStatus = createAsyncThunk<
  { id: number; is_open: boolean },
  number,
  { rejectValue: string }
>("store/toggleStatus", async (id, { rejectWithValue }) => {
  try {
    const result = await toggleStoreStatusRequest(id);
    return { id, is_open: result.is_open };
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to toggle store status"));
  }
});

// =========================
// Admin: All Stores
// =========================

export const fetchAllStores = createAsyncThunk<Store[], void, { rejectValue: string }>(
  "store/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllStoresRequest();
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to load stores"));
    }
  },
);

export const updateStoreApproval = createAsyncThunk<
  Store,
  { id: number; status: Store["status"] },
  { rejectValue: string }
>("store/updateApproval", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await updateStoreApprovalRequest(id, status);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to update store status"));
  }
});
