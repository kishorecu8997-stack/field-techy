import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  appLogin, 
  appRegisterEngineer, 
  appSendOtp, 
  appVerifyOtp, 
  engineerGetPersonalInfo,
  engineerGetEducation,
  engineerUpdatePersonalInfo,
  type AppLoginData, 
  type AppLoginResponse, 
  type AppRegisterEngineerData, 
  type AppRegisterEngineerResponse, 
  type AppSendOtpResponse, 
  type AppVerifyOtpResponse,
  type EngineerGetPersonalInfoResponse,
  type EngineerUpdatePersonalInfoData,
  type EngineerUpdatePersonalInfoResponse
} from "@/api";
import { createClient } from "@/api/client";
import { queryKeys } from "../queryKeys";
import { useEngineerStore } from "../../store/useEngineerStore";
import { useUserSessionStore } from "../../store/useUserSessionStore";

// Create API client for OpenAPI calls
export const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3000",
});

// Configure client to use auth interceptor
apiClient.interceptors.request.use((request) => {
  const session = useUserSessionStore.getState().session;
  if (session?.accessToken) {
    request.headers.set("Authorization", `Bearer ${session.accessToken}`);
  }
  return request;
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

/**
 * TanStack Query query hook for fetching engineer personal info
 */
export function useEngineerGetPersonalInfo() {
  const syncProfile = useEngineerStore((state) => state.syncProfile);
  return useQuery({
    queryKey: [...queryKeys.engineer.all, "personal-info"],
    queryFn: async () => {
      const response = await engineerGetPersonalInfo({
        client: apiClient,
        throwOnError: true,
      });
      const data = response.data as EngineerGetPersonalInfoResponse;
      // Sync with Zustand store
      syncProfile({
        fullName: data.name,
        email: data.email,
        phoneNumber: data.mobileno,
        address: data.address,
      });
      return data;
    },
  });
}

/**
 * TanStack Query mutation hook for updating engineer personal info
 */
export type UpdatePersonalInfoBody = NonNullable<EngineerUpdatePersonalInfoData["body"]>;

export function useEngineerUpdatePersonalInfo(options?: {
  onSuccess?: (data: EngineerUpdatePersonalInfoResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const syncProfile = useEngineerStore((state) => state.syncProfile);

  return useMutation({
    mutationFn: async (body: UpdatePersonalInfoBody) => {
      const response = await engineerUpdatePersonalInfo({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as EngineerUpdatePersonalInfoResponse;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      
      // Update local store immediately with the variables sent (optimistic-like) or wait for re-fetch
      // Here we sync the variables to the store
      syncProfile({
        fullName: variables.name,
        email: variables.email,
        phoneNumber: variables.mobileno,
        address: variables.address,
      });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Raw API functions for use outside of hooks (e.g. in Zustand stores)
 */
export async function getPersonalInfo() {
  const response = await engineerGetPersonalInfo({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetPersonalInfoResponse;
}

export async function getEducation() {
  const response = await engineerGetEducation({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as Array<{
    id: number;
    engineerId: number;
    level: number;
    course: string;
    university: string;
    majorSubject: string;
    passingYear: number;
  }>;
}
