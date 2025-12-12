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
	timeout: 10_000,
});

export async function addAuthTokenIfExists(cfg: InternalAxiosRequestConfig) {
	console.log(`[Interceptor] Method: ${cfg.method} | URL: ${cfg.url}`);
	console.log("[Interceptor] Adding Auth Token to request");
	const token = "Bearer something_secret_token";
	cfg.headers.Authorization = token;
	return cfg;
}

export async function responseLoggerInterceptor(response: AxiosResponse) {
	console.log(
		`[Response Interceptor] Response received from ${response.config.url} with status ${response.status}`,
	);
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