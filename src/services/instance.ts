import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export const baseURL = "/api";

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
