import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { loginRequest, registerRequest } from "./authAPI";

import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "./authTypes";
import { persistAuthStorage } from "../../services/tokenService";
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response: LoginResponse = await loginRequest(credentials);

    console.log("LOGIN RESPONSE:", response);

    console.log("BEFORE STORAGE");

    persistAuthStorage(response);

    console.log("AFTER STORAGE");

    return response;
  } catch (error) {
    console.error("LOGIN THUNK ERROR:", error);

    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.detail || "Invalid email or password",
      );
    }

    return rejectWithValue("Something went wrong");
  }
});

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await registerRequest(credentials);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      // Django/DRF validation errors
      if (data && typeof data === "object") {
        const firstError = Object.values(data)[0];

        if (Array.isArray(firstError)) {
          return rejectWithValue(String(firstError[0]));
        }

        if (typeof firstError === "string") {
          return rejectWithValue(firstError);
        }
      }
      return rejectWithValue(data?.detail || "Registration failed");
    }

    return rejectWithValue("Something went wrong");
  }
});
