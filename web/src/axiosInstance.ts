import { toast } from "react-toastify";
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
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

export async function addAuthTokenIfExists(cfg: InternalAxiosRequestConfig) {
  // Read token at request time so we always use the latest auth token
  const token = localStorage.getItem("authToken");
  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  return cfg;
}

export async function responseLoggerInterceptor(response: AxiosResponse) {
  return response;
}

axiosInstance.interceptors.request.use(addAuthTokenIfExists, (error) => {
  console.error("Request Error:", error);
  toast.error("Request error. Please try again.");
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(responseLoggerInterceptor, (error) => {
  console.error("API Error:", error);

  const status = error.response?.status;

  // Network error or no response received
  if (!error.response) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      console.error("No internet connection. Please check your network.");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    } else {
      console.error("Network error. Please try again.");
    }

    return Promise.reject(error);
  }

  // Response was received
  if (status === 401) {
    // Auth issue: notify user and consider redirect/refresh token
    console.error("Unauthorized. Please login again.");
    // TODO: Add logic to redirect to login or refresh token
  }

  if (status === 403) {
    console.error(
      "Access forbidden. You do not have permission to perform this action."
    );
  }

  if (status >= 500) {
    console.error("Server error occurred. Please try again later.");
  }

  return Promise.reject(error);
});

// ---------------------------------------------------------------------------

export const uploadAxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10_000,
});

export default axiosInstance;
