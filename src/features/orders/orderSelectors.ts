import type { RootState } from "../../app/store";

// ============================
// Buyer Orders
// ============================

export const selectMyOrders = (state: RootState) => state.orders.myOrders;

export const selectMyOrdersStatus = (state: RootState) => state.orders.myStatus;

export const selectMyOrdersError = (state: RootState) => state.orders.myError;

// ============================
// Single Order Detail
// ============================

export const selectSelectedOrder = (state: RootState) =>
  state.orders.selectedOrder;

export const selectOrderDetailStatus = (state: RootState) =>
  state.orders.detailStatus;

export const selectOrderDetailError = (state: RootState) =>
  state.orders.detailError;

// ============================
// Admin Orders
// ============================

export const selectAdminOrders = (state: RootState) => state.orders.adminItems;

export const selectAdminOrdersStatus = (state: RootState) =>
  state.orders.adminStatus;

export const selectAdminOrdersError = (state: RootState) =>
  state.orders.adminError;
