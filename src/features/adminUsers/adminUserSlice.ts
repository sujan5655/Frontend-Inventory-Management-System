import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, setSellerApproval, toggleUserActive } from "./adminUserThunk";
import type { AdminUserState } from "./adminUserTypes";

const initialState: AdminUserState = {
  items: [],
  status: "idle",
  error: null,
};

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load users";
      })

      .addCase(setSellerApproval.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(setSellerApproval.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update approval status";
      })

      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update user status";
      });
  },
});

export const { clearAdminUserError } = adminUserSlice.actions;
export default adminUserSlice.reducer;
