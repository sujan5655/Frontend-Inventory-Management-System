import axiosInstance from "../../services/axios";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "./authTypes";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/login/",
    credentials,
  );
  return data;
}

// Register
export async function registerRequest(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const { data } = await axiosInstance.post<RegisterResponse>(
    "/auth/register/",
    credentials,
  );
  return data;
}
