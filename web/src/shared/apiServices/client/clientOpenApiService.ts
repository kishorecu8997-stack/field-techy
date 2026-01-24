import {
  appChangePassword,
  appDeleteProfileFile,
  appDownloadProfileFile,
  appLogin,
  appMarkProfileFileUploaded,
  appRegisterClient,
  appSendOtp,
  appUploadProfileFile,
  appVerifyOtp,
  clientGetCompanyInfo,
  clientUpdateCompanyInfo,
  type AppChangePasswordData,
  type AppChangePasswordResponse,
  type AppDeleteProfileFileData,
  type AppDeleteProfileFileResponse,
  type AppDownloadProfileFileResponse,
  type AppLoginData,
  type AppLoginResponse,
  type AppMarkProfileFileUploadedData,
  type AppMarkProfileFileUploadedResponse,
  type AppRegisterClientData,
  type AppRegisterClientResponse,
  type AppSendOtpResponse,
  type AppUploadProfileFileData,
  type AppUploadProfileFileResponse,
  type AppVerifyOtpResponse,
  type ClientGetCompanyInfoResponse,
  type ClientUpdateCompanyInfoData,
  type ClientUpdateCompanyInfoResponse
} from "@/api";
import { createClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserSessionStore } from "../../store/useUserSessionStore";
import { queryKeys } from "../queryKeys";

// Create API client for OpenAPI calls
export const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3000",
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

export type LoginBody = NonNullable<AppLoginData["body"]>;
export type RegisterClientBody = NonNullable<AppRegisterClientData["body"]>;

export function useRegisterClient(options?: {
  onSuccess?: (data: AppRegisterClientResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClientInstance = useQueryClient();
  return useMutation({
    mutationFn: async (body: RegisterClientBody) => {
      const response = await appRegisterClient({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppRegisterClientResponse;
    },
    onSuccess: (data) => {
      queryClientInstance.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientLogin(options?: {
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
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

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
        headers: { Authorization: `Bearer ${token || ""}` },
        throwOnError: true,
      });
      return response.data as AppSendOtpResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyOtp(options?: {
  onSuccess?: (data: AppVerifyOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({ type, code, token }: { type: SendOtpType; code: string; token?: string }) => {
      const response = await appVerifyOtp({
        client: apiClient,
        body: { type, code },
        headers: { Authorization: `Bearer ${token || ""}` },
        throwOnError: true,
      });
      return response.data as AppVerifyOtpResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}


export function useClientGetCompanyInfo(token?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.client.companyInfo,
    queryFn: async () => {
      const response = await clientGetCompanyInfo({
        client: apiClient,
        headers: { Authorization: `Bearer ${token || ""}` } as any,
        throwOnError: true,
      });
      return response.data as ClientGetCompanyInfoResponse;
    },
    enabled: enabled && !!token,
  });
}

export type UpdateCompanyInfoBody = NonNullable<
  ClientUpdateCompanyInfoData["body"]
>;

export function useClientUpdateCompanyInfo(options?: {
  onSuccess?: (data: ClientUpdateCompanyInfoResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      body,
      token,
    }: {
      body: UpdateCompanyInfoBody;
      token?: string;
    }) => {
      const response = await clientUpdateCompanyInfo({
        client: apiClient,
        body,
        headers: { Authorization: `Bearer ${token || ""}` } as any,
        throwOnError: true,
      });
      return response.data as ClientUpdateCompanyInfoResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.companyInfo });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for changing password
 */
export type ChangePasswordBody = NonNullable<AppChangePasswordData["body"]>;

export function useClientChangePassword(options?: {
  onSuccess?: (data: AppChangePasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (body: ChangePasswordBody) => {
      const response = await appChangePassword({
        client: apiClient,
        body,
        headers: { Authorization: "" },
        throwOnError: true,
      });
      return response.data as AppChangePasswordResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for initiating profile file upload
 */
export type UploadProfileFileBody = NonNullable<AppUploadProfileFileData["body"]>;

export function useAppUploadProfileFile(options?: {
  onSuccess?: (data: AppUploadProfileFileResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (body: UploadProfileFileBody) => {
      const response = await appUploadProfileFile({
        client: apiClient,
        body,
        headers: { authorization: "" },
        throwOnError: true,
      });
      return response.data as AppUploadProfileFileResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for marking profile file as uploaded
 */
export type MarkProfileFileUploadedBody = NonNullable<AppMarkProfileFileUploadedData["body"]>;

export function useAppMarkProfileFileUploaded(options?: {
  onSuccess?: (data: AppMarkProfileFileUploadedResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: MarkProfileFileUploadedBody) => {
      const response = await appMarkProfileFileUploaded({
        client: apiClient,
        body,
        headers: { authorization: "" },
        throwOnError: true,
      });
      return response.data as AppMarkProfileFileUploadedResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query query hook for getting profile file download URL
 */
export function useAppDownloadProfileFile(fileId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["profileFile", "download", fileId],
    queryFn: async () => {
      const response = await appDownloadProfileFile({
        client: apiClient,
        query: { fileId },
        headers: { authorization: "" },
        throwOnError: true,
      });
      return response.data as AppDownloadProfileFileResponse;
    },
    enabled: enabled && !!fileId,
  });
}

/**
 * TanStack Query mutation hook for deleting profile file
 */
export type DeleteProfileFileBody = NonNullable<AppDeleteProfileFileData["body"]>;

export function useAppDeleteProfileFile(options?: {
  onSuccess?: (data: AppDeleteProfileFileResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: DeleteProfileFileBody) => {
      const response = await appDeleteProfileFile({
        client: apiClient,
        body,
        headers: { authorization: "" },
        throwOnError: true,
      });
      return response.data as AppDeleteProfileFileResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}