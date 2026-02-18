import {
  type AppGetLookupDataData,
  type AppSendOtpResponse,
  type AppUploadProfileFileResponse,
  type AppVerifyOtpResponse,
  type AppForgotPasswordResponse,
  type AppForgotPasswordError,
  type AppResetPasswordResponse,
  type AppResetPasswordError,
  type AppDownloadProfileFileData,
  type AppMarkProfileFileUploadedResponse,
  type AppMarkProfileFileUploadedError,
} from "@/api";
import {
  appDownloadProfileFileOptions,
  appGetLookupDataOptions,
  appSendOtpMutation,
  appUploadProfileFileMutation,
  appVerifyOtpMutation,
  appForgotPasswordMutation,
  appResetPasswordMutation,
  appMarkProfileFileUploadedMutation,
} from "@/api/@tanstack/react-query.gen";
import { appDownloadProfileFile as appDownloadProfileFileSdk } from "@/api/sdk.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export type ProfileFileType = AppDownloadProfileFileData["query"]["fileType"];

/**
 * Get download URL for a profile file.
 * Note: Empty authorization header is required by type definition,
 * but gets overridden by apiClient interceptor with actual JWT token.
 */
export async function getDownloadUrl(fileType: ProfileFileType) {
  const { data } = await appDownloadProfileFileSdk({
    client: apiClient,
    query: { fileType },
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
      headers: { authorization: "" },
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
      headers: { authorization: "" },
    }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * React Query hook to initiate a profile file upload.
 * Extended to support WORK_SCREEN_SHOT by wrapping the generated mutation.
 */
export function useAppUploadProfileFile(options?: {
  onSuccess?: (data: AppUploadProfileFileResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const mutation = useMutation({
    ...appUploadProfileFileMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  // Override mutateAsync to accept our extended ProfileFileType
  const mutateAsync = async (params: {
    body: {
      fileType: ProfileFileType;
      filename: string;
      size: number;
      mimeType: string;
    };
    headers: { authorization: string };
  }) => {
    return mutation.mutateAsync(params as any);
  };

  return {
    ...mutation,
    mutateAsync,
  };
}

/**
 * React Query hook to download a profile file.
 * Note: Empty authorization header is required by type definition,
 * but gets overridden by apiClient interceptor with actual JWT token.
 */
export function useAppDownloadProfileFile(
  fileType: ProfileFileType | null | undefined,
  enabled: boolean = true,
) {
  return useQuery({
    ...appDownloadProfileFileOptions({
      client: apiClient,
      // Use a valid member of ProfileFileType as a fallback when disabled
      // to satisfy the type system without using 'any'
      query: {
        fileType: (fileType || "profilePicture") as ProfileFileType,
      },
      headers: { authorization: "" },
    }),
    enabled: enabled && !!fileType,
    staleTime: 0,
  });
}

export function useLookupData(
  table: AppGetLookupDataData["query"]["table"],
  parentId?: string,
  enabled: boolean = true,
) {
  return useQuery({
    ...appGetLookupDataOptions({
      client: apiClient,
      query: { table, parentId },
    }),
    enabled:
      enabled && ((table !== "states" && table !== "cities") || !!parentId),
    staleTime: 1000 * 60 * 60,
  });
}

export function useForgotPassword(options?: {
  onSuccess?: (data: AppForgotPasswordResponse) => void;
  onError?: (error: AppForgotPasswordError) => void;
}) {
  return useMutation({
    ...appForgotPasswordMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useResetPassword(options?: {
  onSuccess?: (data: AppResetPasswordResponse) => void;
  onError?: (error: AppResetPasswordError) => void;
}) {
  return useMutation({
    ...appResetPasswordMutation({ client: apiClient }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAppMarkProfileFileUploaded(options?: {
  onSuccess?: (data: AppMarkProfileFileUploadedResponse) => void;
  onError?: (error: AppMarkProfileFileUploadedError) => void;
}) {
  return useMutation({
    ...appMarkProfileFileUploadedMutation({
      client: apiClient,
      headers: { authorization: "" },
    }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
