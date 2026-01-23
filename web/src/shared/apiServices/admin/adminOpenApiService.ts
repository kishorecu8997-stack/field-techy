import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
  appChangePassword,
  appLogin,
  type AdminUpdatePersonalInfoData,
  type AdminUpdatePersonalInfoResponses,
  type AppChangePasswordData,
  type AppChangePasswordResponse,
  type AppLoginData,
  type AppLoginResponse,
} from "@/api";
import { createClient } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3001",
});

export type LoginBody = NonNullable<AppLoginData["body"]>;

export function useAdminLogin(options?: {
  onSuccess?: (data: AppLoginResponse) => void;
  onError?: (error: unknown) => void;
}) {
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
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetAdminPersonalInfo(token: string) {
  return useQuery({
    queryKey: ["adminPersonalInfo", token],
    queryFn: async () => {
      const response = await adminGetPersonalInfo({
        client: apiClient,
        throwOnError: true,
        headers: { authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });
}

export type AdminPersonalInfoBody = NonNullable<
  AdminUpdatePersonalInfoData["body"]
>;

export function useAdminUpdatePersonalInfo(options?: {
  onSuccess?: (data: AdminUpdatePersonalInfoResponses) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({
      body,
      token,
    }: {
      body: AdminPersonalInfoBody;
      token: string;
    }) => {
      const response = await adminUpdatePersonalInfo({
        client: apiClient,
        body,
        throwOnError: true,
        headers: { authorization: `Bearer ${token}` },
      });
      return response.data as any; // Need to fix AdminUpdatePersonalInfoData;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export type ChangePasswordBody = NonNullable<AppChangePasswordData["body"]>;

export function useAppChangePassword(options?: {
  onSuccess?: (data: AppChangePasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({
      body,
      token,
    }: {
      body: ChangePasswordBody;
      token: string;
    }) => {
      const response = await appChangePassword({
        client: apiClient,
        body,
        throwOnError: true,
        headers: { authorization: `Bearer ${token}` },
      });
      return response.data as AppChangePasswordResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}