import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  fetchCartRequest,
  addToCartRequest,
  updateCartItemRequest,
  removeCartItemRequest,
  clearCartRequest,
} from "./cartAPI";

import type { CartItem, CartResponse } from "./cartTypes";

function extractError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data?.detail === "string") {
      return data.detail;
    }
  }

  return fallback;
}

/*
|--------------------------------------------------------------------------
| Fetch Cart
|--------------------------------------------------------------------------
*/

export const fetchCart = createAsyncThunk<
  CartResponse,
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await fetchCartRequest();
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to load cart"));
  }
});

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

export const addToCart = createAsyncThunk<
  CartItem,
  {
    product: number;
    quantity?: number;
  },
  { rejectValue: string }
>("cart/addToCart", async ({ product, quantity = 1 }, { rejectWithValue }) => {
  try {
    return await addToCartRequest(product, quantity);
  } catch (error) {
    return rejectWithValue(
      extractError(error, "Failed to add product to cart"),
    );
  }
});

/*
|--------------------------------------------------------------------------
| Update Quantity
|--------------------------------------------------------------------------
*/

export const updateCartItem = createAsyncThunk<
  CartItem,
  {
    id: number;
    quantity: number;
  },
  { rejectValue: string }
>("cart/updateCartItem", async ({ id, quantity }, { rejectWithValue }) => {
  try {
    return await updateCartItemRequest(id, quantity);
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to update cart item"));
  }
});

/*
|--------------------------------------------------------------------------
| Remove Cart Item
|--------------------------------------------------------------------------
*/

export const removeCartItem = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cart/removeCartItem", async (id, { rejectWithValue }) => {
  try {
    await removeCartItemRequest(id);
    return id;
  } catch (error) {
    return rejectWithValue(extractError(error, "Failed to remove cart item"));
  }
});

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartRequest();
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to clear cart"));
    }
  },
);
