import type { AuthUser, LoginResponse } from "../features/auth/authTypes";

const ACCESS_TOKEN_KEY = "grocery_access_token";
const REFRESH_TOKEN_KEY = "grocery_refresh_token";
const USER_KEY = "grocery_auth_user";

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function persistAuthStorage(payload: LoginResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function setStoredAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
