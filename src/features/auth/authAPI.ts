import axiosInstance from "../../services/axios";
import type { LoginCredentials, LoginResponse } from "./authTypes";

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login/", credentials);
  return data;
}
