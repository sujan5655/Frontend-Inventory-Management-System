import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  fetchMyOrdersRequest,
  fetchOrderDetailRequest,
  createOrderRequest,
  cancelOrderRequest,
  fetchAdminOrdersRequest,
  updateAdminOrderStatusRequest,
} from "./orderAPI";

import type { Order, OrderStatus } from "./orderTypes";

/* =========================
   ERROR HANDLER
========================= */

function extractError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }
  }

  return fallback;
}

/* =========================
   BUYER - FETCH ORDERS
========================= */

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    return await fetchMyOrdersRequest();
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to load orders"));
  }
});

/* =========================
   BUYER - ORDER DETAIL
========================= */

export const fetchOrderDetail = createAsyncThunk<
  Order,
  number,
  { rejectValue: string }
>("orders/fetchOrderDetail", async (id, { rejectWithValue }) => {
  try {
    return await fetchOrderDetailRequest(id);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to load order"));
  }
});

/* =========================
   BUYER - CREATE ORDER
========================= */

export const createOrder = createAsyncThunk<
  Order,
  {
    delivery_address: string;
    phone: string;
    city: string;
  },
  { rejectValue: string }
>("orders/createOrder", async (payload, { rejectWithValue }) => {
  try {
    return await createOrderRequest(payload);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to create order"));
  }
});

/* =========================
   BUYER - CANCEL ORDER
========================= */

export const cancelOrder = createAsyncThunk<
  { id: number; message: string },
  number,
  { rejectValue: string }
>("orders/cancelOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await cancelOrderRequest(id);

    return {
      id,
      message: response.message,
    };
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to cancel order"));
  }
});

/* =========================
   ADMIN - FETCH ORDERS
========================= */

export const fetchAdminOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchAdmin", async (_, { rejectWithValue }) => {
  try {
    return await fetchAdminOrdersRequest();
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to load admin orders"));
  }
});

/* =========================
   ADMIN - UPDATE STATUS
========================= */

export const updateAdminOrderStatus = createAsyncThunk<
  Order,
  {
    id: number;
    status: OrderStatus;
  },
  { rejectValue: string }
>("orders/updateAdminStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await updateAdminOrderStatusRequest(id, status);
  } catch (error) {
    return rejectWithValue(
      extractError(error, "Failed to update order status"),
    );
  }
});
