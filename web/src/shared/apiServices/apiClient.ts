  import { createClient } from "@/api/client";
  import { useUserSessionStore } from "../store/useUserSessionStore";

  /**
   * Shared API client for all OpenAPI services.
   * Centrally configured with base URL and auth interceptors.
   */
  export const apiClient = createClient({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  // Configure client to use auth interceptor
  apiClient.interceptors.request.use((request) => {
    const session = useUserSessionStore.getState().session;
    const token = session?.accessToken || localStorage.getItem("auth_token");

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  });
