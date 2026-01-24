import {
    appDownloadProfileFileOptions,
    appGetLookupDataOptions,
    appSendOtpMutation,
    appUploadProfileFileMutation,
    appVerifyOtpMutation,
    type AppGetLookupDataData,
    type AppSendOtpResponse,
    type AppUploadProfileFileResponse,
    type AppVerifyOtpResponse
} from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

/**
 * Shared authentication and utility hooks to reduce code duplication
 */

export function useSendOtp(options?: {
  onSuccess?: (data: AppSendOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appSendOtpMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyOtp(options?: {
  onSuccess?: (data: AppVerifyOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appVerifyOtpMutation({ client: apiClient }),
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

export function useAppDownloadProfileFile(fileId: string, enabled: boolean = true) {
  return useQuery({
    ...appDownloadProfileFileOptions({
      client: apiClient,
      query: { fileId },
      headers: { authorization: "" },
    }),
    enabled: enabled && !!fileId,
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
