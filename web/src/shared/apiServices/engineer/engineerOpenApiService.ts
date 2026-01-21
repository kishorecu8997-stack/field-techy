import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  appLogin, 
  appRegisterEngineer, 
  appSendOtp, 
  appVerifyOtp, 
  type AppLoginData, 
  type AppLoginResponse, 
  type AppRegisterEngineerData, 
  type AppRegisterEngineerResponse, 
  type AppSendOtpResponse, 
  type AppVerifyOtpResponse 
} from "@/api";
import { createClient } from "@/api/client";
import { queryKeys } from "../queryKeys";

// Create API client for OpenAPI calls
const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3000",
});

/**
 * TanStack Query mutation hook using OpenAPI generated appRegisterEngineer
 * This wraps the auto-generated SDK function with React Query for caching and state management
 */
export type RegisterEngineerBody = NonNullable<AppRegisterEngineerData["body"]>;

export function useRegisterEngineer(options?: {
  onSuccess?: (data: AppRegisterEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClientInstance = useQueryClient();
  return useMutation({
    mutationFn: async (body: RegisterEngineerBody) => {
      const response = await appRegisterEngineer({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppRegisterEngineerResponse;
    },
    onSuccess: (data) => {
      queryClientInstance.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type LoginBody = NonNullable<AppLoginData["body"]>;

export function useEngineerLogin(options?: {
  onSuccess?: (data: AppLoginResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: LoginBody) => {
      const response = await appLogin({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppLoginResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook using OpenAPI generated appSendOtp
 * This wraps the auto-generated SDK function with React Query for state management
 * Requires JWT authorization token from registration response
 */
export type SendOtpType = 'email' | 'phone';

export function useSendOtp(options?: {
  onSuccess?: (data: AppSendOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({ type, token }: { type: SendOtpType; token?: string }) => {
      const response = await appSendOtp({
        client: apiClient,
        body: { type },
        headers: { authorization: `Bearer ${token || ""}` },
        throwOnError: true,
      });
      return response.data as AppSendOtpResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook using OpenAPI generated appVerifyOtp
 * This wraps the auto-generated SDK function with React Query for state management
 * Requires JWT authorization token from registration response
 */
export function useVerifyOtp(options?: {
  onSuccess?: (data: AppVerifyOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({ type, code, token }: { type: SendOtpType; code: string; token?: string }) => {
      const response = await appVerifyOtp({
        client: apiClient,
        body: { type, code },
        headers: { authorization: `Bearer ${token || ""}` },
        throwOnError: true,
      });
      return response.data as AppVerifyOtpResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
