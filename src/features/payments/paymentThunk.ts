import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { initiateEsewaPaymentRequest } from "./paymentAPI";

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

export const initiateEsewaPayment = createAsyncThunk<
  Awaited<ReturnType<typeof initiateEsewaPaymentRequest>>,
  number,
  {
    rejectValue: string;
  }
>(
  "payments/initiateEsewaPayment",

  async (orderId, { rejectWithValue }) => {
    try {
      return await initiateEsewaPaymentRequest(orderId);
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Failed to initiate eSewa payment"),
      );
    }
  },
);
