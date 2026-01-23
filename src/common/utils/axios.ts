import axios, { InternalAxiosRequestConfig } from "axios";
import { logoutUser, refresh_token } from "@/services/authService";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/common/utils/tokenStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // importante si usas cookies o refresh token
});

// --- 🔹 Interceptor de REQUEST: añade el token a todas las peticiones ---
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    // 🔹 Si el token es tipo objeto JSON, lo arreglamos
    if (token && token !== "[object Object]") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// --- Variables de control para refresco de token ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 🔹 Interceptor de RESPONSE: maneja expiración del token y reintento ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = originalRequest.url?.includes("/auth/refresh") ?? false;

    // Si el token expiró (401) y no estamos ya refrescando
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refresh_token(); // 🔄 pide nuevo token
        if (newToken) {
          setAccessToken(newToken);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        return axiosInstance(originalRequest); // reintenta petición original
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutUser();
        clearAccessToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
