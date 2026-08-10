import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { loginRequest } from "./authAPI";

import type { LoginCredentials, LoginResponse } from "./authTypes";

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/login",

  async (credentials, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await loginRequest(credentials);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || "Invalid email or password",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);
