import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboard } from "./dashboardThunk";
import type { DashboardState } from "./dashboardTypes";

const initialState: DashboardState = {
  admin: null,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load dashboard stats";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
