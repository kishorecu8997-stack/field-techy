import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { config } from "@/shared/config/configService";

/*
 * axiosInstance
 *
 * Configures and creates an axios instance with the base URL and timeout.
 * The instance is used throughout the application to make API calls.
 *
 */
const axiosInstance = axios.create({
	baseURL: config.apiUrl,
	timeout: 60_000,
});


const token = localStorage.getItem("authToken");
export async function addAuthTokenIfExists(cfg: InternalAxiosRequestConfig) {
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
}

export async function responseLoggerInterceptor(response: AxiosResponse) {
  return response;
}

axiosInstance.interceptors.request.use(addAuthTokenIfExists);
axiosInstance.interceptors.response.use(responseLoggerInterceptor);


// ---------------------------------------------------------------------------

export const uploadAxiosInstance = axios.create({
	baseURL: config.apiUrl,
	timeout: 10_000,
});

export default axiosInstance;
