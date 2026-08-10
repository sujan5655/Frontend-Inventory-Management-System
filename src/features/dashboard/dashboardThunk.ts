import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { fetchAdminDashboardRequest } from "./dashboardAPI";
import type { AdminDashboardStats } from "./dashboardTypes";

function extractError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data?.detail === "string") return data.detail;
  }
  return fallback;
}

export const fetchAdminDashboard = createAsyncThunk<
  AdminDashboardStats,
  void,
  { rejectValue: string }
>("dashboard/fetchAdmin", async (_, { rejectWithValue }) => {
  try {
    return await fetchAdminDashboardRequest();
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to load dashboard stats"));
  }
});
