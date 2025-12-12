import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

/*
 * axiosInstance
 *
 * Configures and creates an axios instance with the base URL and timeout.
 * The instance is used throughout the application to make API calls.
 *
 */
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10_000,
});

console.log(baseUrl);

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

export default axiosInstance;
