import { createSlice } from "@reduxjs/toolkit";
import type { OrderState } from "./orderTypes";

import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  fetchMyOrders,
  fetchOrderDetail,
  createOrder,
  cancelOrder,
} from "./orderThunk";
const initialState: OrderState = {
  // Buyer
  myOrders: [],
  selectedOrder: null,

  myStatus: "idle",
  detailStatus: "idle",

  myError: null,
  detailError: null,

  // Admin
  adminItems: [],
  adminStatus: "idle",
  adminError: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,

  reducers: {
    clearAdminOrderError(state) {
      state.adminError = null;
    },

    clearMyOrderError(state) {
      state.myError = null;
    },

    clearOrderDetail(state) {
      state.selectedOrder = null;
      state.detailError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // Buyer Orders
      // =========================

      .addCase(fetchMyOrders.pending, (state) => {
        state.myStatus = "loading";
        state.myError = null;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myStatus = "succeeded";
        state.myOrders = action.payload;
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myStatus = "failed";
        state.myError = action.payload ?? "Failed to load orders";
      })

      // =========================
      // Order Detail
      // =========================

      .addCase(fetchOrderDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })

      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedOrder = action.payload;
      })

      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload ?? "Failed to load order detail";
      })

      // =========================
      // Create Order
      // =========================

      .addCase(createOrder.fulfilled, (state, action) => {
        state.myOrders.unshift(action.payload);
      })

      // =========================
      // Cancel Order
      // =========================

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.myOrders.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index !== -1) {
          state.myOrders[index] = action.payload;
        }
      })

      // =========================
      // Admin Orders
      // =========================

      .addCase(fetchAdminOrders.pending, (state) => {
        state.adminStatus = "loading";
        state.adminError = null;
      })

      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminStatus = "succeeded";
        state.adminItems = action.payload;
      })

      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.adminStatus = "failed";
        state.adminError = action.payload ?? "Failed to load admin orders";
      })

      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        const index = state.adminItems.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index !== -1) {
          state.adminItems[index] = action.payload;
        }
      });
  },
});

export const { clearAdminOrderError, clearMyOrderError, clearOrderDetail } =
  orderSlice.actions;

export default orderSlice.reducer;
