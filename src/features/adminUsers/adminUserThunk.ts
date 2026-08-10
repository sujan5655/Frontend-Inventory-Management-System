import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  fetchUsersRequest,
  setSellerApprovalRequest,
  toggleUserActiveRequest,
} from "./adminUserAPI";
import type { AdminUser } from "./adminUserTypes";

function extractError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data?.detail === "string") return data.detail;
  }
  return fallback;
}

export const fetchUsers = createAsyncThunk<AdminUser[], void, { rejectValue: string }>(
  "adminUsers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUsersRequest();
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to load users"));
    }
  },
);

export const setSellerApproval = createAsyncThunk<
  AdminUser,
  { id: number; action: "APPROVE" | "REJECT" },
  { rejectValue: string }
>("adminUsers/setApproval", async ({ id, action }, { rejectWithValue }) => {
  try {
    return await setSellerApprovalRequest(id, action);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to update approval status"));
  }
});

export const toggleUserActive = createAsyncThunk<
  AdminUser,
  number,
  { rejectValue: string }
>("adminUsers/toggleActive", async (id, { rejectWithValue }) => {
  try {
    return await toggleUserActiveRequest(id);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to update user status"));
  }
});
