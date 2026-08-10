import axios from "axios";
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  clearAuthStorage,
} from "./tokenService";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Add access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();

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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/refresh/",
        {
          refresh: refreshToken,
        },
      );

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
