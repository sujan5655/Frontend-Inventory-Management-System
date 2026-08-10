import axiosInstance from "../../services/axios";
import type { Order, OrderStatus } from "./orderTypes";

/* =========================================
   BUYER
========================================= */

export async function fetchMyOrdersRequest(): Promise<Order[]> {
  const { data } = await axiosInstance.get<Order[]>("/order/");
  return data;
}

export async function fetchOrderDetailRequest(id: number): Promise<Order> {
  const { data } = await axiosInstance.get<Order>(`/order/${id}/`);

  return data;
}

export async function createOrderRequest(payload: {
  delivery_address: string;
  phone: string;
  city: string;
}): Promise<Order> {
  const { data } = await axiosInstance.post<Order>("/order/create/", payload);

  return data;
}

export async function cancelOrderRequest(
  id: number,
): Promise<{ message: string }> {
  const { data } = await axiosInstance.put<{
    message: string;
  }>(`/order/${id}/cancel/`);

  return data;
}

/* =========================================
   SELLER
========================================= */

export async function fetchSellerOrdersRequest(): Promise<Order[]> {
  const { data } = await axiosInstance.get<Order[]>("/order/seller/");

  return data;
}

export async function updateSellerOrderStatusRequest(
  id: number,
  status: OrderStatus,
): Promise<Order> {
  const { data } = await axiosInstance.put<Order>(
    `/order/seller/${id}/status/`,
    {
      status,
    },
  );

  return data;
}

/* =========================================
   ADMIN
========================================= */

export async function fetchAdminOrdersRequest(): Promise<Order[]> {
  const { data } = await axiosInstance.get<Order[]>("/order/admin/");

  return data;
}

export async function updateAdminOrderStatusRequest(
  id: number,
  status: OrderStatus,
): Promise<Order> {
  const { data } = await axiosInstance.put<Order>(
    `/order/admin/${id}/status/`,
    {
      status,
    },
  );

  return data;
}
