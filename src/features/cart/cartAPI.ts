import axiosInstance from "../../services/axios";
import type { CartItem, CartResponse } from "./cartTypes";

export async function fetchCartRequest(): Promise<CartResponse> {
  const { data } = await axiosInstance.get<CartResponse>("/cart/");
  return data;
}

export async function addToCartRequest(
  product: number,
  quantity: number = 1,
): Promise<CartItem> {
  const { data } = await axiosInstance.post<CartItem>("/cart/add/", {
    product,
    quantity,
  });

  return data;
}

export async function updateCartItemRequest(
  id: number,
  quantity: number,
): Promise<CartItem> {
  const { data } = await axiosInstance.put<CartItem>(`/cart/items/${id}/`, {
    quantity,
  });

  return data;
}

export async function removeCartItemRequest(id: number): Promise<void> {
  await axiosInstance.delete(`/cart/items/${id}/delete/`);
}

export async function clearCartRequest(): Promise<void> {
  await axiosInstance.delete("/cart/clear/");
}
