import {
  type AppGetLookupDataData,
  type AppSendOtpResponse,
  type AppUploadProfileFileResponse,
  type AppVerifyOtpResponse,
  type AppForgotPasswordResponse,
  type AppResetPasswordResponse
} from "@/api";
import {
  appDownloadProfileFileOptions,
  appGetLookupDataOptions,
  appSendOtpMutation,
  appUploadProfileFileMutation,
  appVerifyOtpMutation,
  appForgotPasswordMutation,
  appResetPasswordMutation
} from "@/api/@tanstack/react-query.gen";
import { appDownloadProfileFile as appDownloadProfileFileSdk } from "@/api/sdk.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export async function getDownloadUrl(fileType: string) {
  const { data } = await appDownloadProfileFileSdk({
    client: apiClient,
    query: { fileType: fileType as any },
    headers: { authorization: "" },
  });
  return data;
}

/**
 * Shared authentication and utility hooks to reduce code duplication
 */

export function useSendOtp(options?: {
  onSuccess?: (data: AppSendOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appSendOtpMutation({
      client: apiClient,
      headers: { Authorization: "" },
    }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyOtp(options?: {
  onSuccess?: (data: AppVerifyOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appVerifyOtpMutation({
      client: apiClient,
      headers: { Authorization: "" },
    }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAppUploadProfileFile(options?: {
  onSuccess?: (data: AppUploadProfileFileResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appUploadProfileFileMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAppDownloadProfileFile(fileType: string | null | undefined, enabled: boolean = true) {
  return useQuery({
    ...appDownloadProfileFileOptions({
      client: apiClient,
      query: { fileType: fileType as any },
      headers: { authorization: "" },
    }),
    enabled: enabled && !!fileType,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLookupData(table: AppGetLookupDataData["query"]["table"], parentId?: string) {
  return useQuery({
    ...appGetLookupDataOptions({
      client: apiClient,
      query: { table, parentId },
    }),
    staleTime: 1000 * 60 * 60,
  });
}

export function useForgotPassword(options?: {
  onSuccess?: (data: AppForgotPasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appForgotPasswordMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useResetPassword(options?: {
  onSuccess?: (data: AppResetPasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appResetPasswordMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
