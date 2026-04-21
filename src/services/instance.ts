import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Use VITE_API_URL when set (local dev), otherwise fall back to the Vite proxy
export const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) || "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: { response: AxiosResponse; config: AxiosRequestConfig }) => {
    return Promise.reject(error);
  },
);
