import axios from "axios";
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  clearAuthStorage,
} from "./tokenService";
const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    console.log("REQUEST:", config.url);
    console.log("ACCESS TOKEN:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Refresh access token if it expires
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest: any = error.config;

    // If not 401, return error
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;

      setStoredAccessToken(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (err) {
      clearAuthStorage();

      window.location.href = "/login";

      return Promise.reject(err);
    }
  },
);

export default axiosInstance;
