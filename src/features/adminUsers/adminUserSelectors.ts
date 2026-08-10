import type { RootState } from "../../app/store";

export const selectAdminUsers = (state: RootState) => state.adminUsers.items;
export const selectAdminUsersStatus = (state: RootState) => state.adminUsers.status;
export const selectAdminUsersError = (state: RootState) => state.adminUsers.error;
