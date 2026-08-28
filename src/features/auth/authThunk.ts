import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { loginRequest } from "./authAPI";

import type { LoginCredentials, LoginResponse } from "./authTypes";
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
