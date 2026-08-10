import type { RootState } from "../../app/store";

export const selectAdminDashboard = (state: RootState) => state.dashboard.admin;
export const selectDashboardStatus = (state: RootState) => state.dashboard.status;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
