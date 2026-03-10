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
  type CreateRateAndReviewAssignmentResponse,
  type AppCheckExistenceData,
  createRateAndReviewAssignment,
  type AppSendLoginOtpResponse,
  type AppVerifyLoginOtpResponse,
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
  createRateAndReviewAssignmentMutation,
  getUserRatingAndReviewsOptions,
  getUserRatingAndReviewsQueryKey,
  appCheckExistenceOptions,
  appResolveSignupRegionOptions,
  appSendLoginOtpMutation,
  appVerifyLoginOtpMutation,
} from "@/api/@tanstack/react-query.gen";
import {
  appDownloadProfileFile as appDownloadProfileFileSdk,
  appCheckExistence,
} from "@/api/sdk.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

export type ProfileFileType = AppDownloadProfileFileData["query"]["fileType"];

interface UseCheckUserExistenceParams {
  email?: string;
  phone?: string;
  enabled?: boolean;
}

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

export function useAppSendLoginOtp(options?: {
  onSuccess?: (data: AppSendLoginOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appSendLoginOtpMutation({
      client: apiClient,
      headers: { authorization: "" },
    }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAppVerifyLoginOtp(options?: {
  onSuccess?: (data: AppVerifyLoginOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appVerifyLoginOtpMutation({
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
    return mutation.mutateAsync(params);
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

export function useCreateRateAndReviewAssignment(options?: {
  onSuccess?: (data: CreateRateAndReviewAssignmentResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...createRateAndReviewAssignmentMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      const body = fnOptions?.body as (typeof fnOptions)["body"];
      const { data } = await createRateAndReviewAssignment({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: getUserRatingAndReviewsQueryKey({ client: apiClient }),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetUserRatingAndReviews(
  enabled: boolean = true,
  assignmentId?: number,
) {
  return useQuery({
    ...getUserRatingAndReviewsOptions({ client: apiClient }),
    enabled,
    refetchOnMount: true,
    select: assignmentId
      ? (data) =>
        Array.isArray(data)
          ? data.filter((r) => r.jobAssignmentId === assignmentId)
          : data
      : undefined,
  });
}

export function useCheckUserExistence({
  email,
  phone,
  enabled = true,
}: UseCheckUserExistenceParams) {
  const hasValue = Boolean(email || phone);

  return useQuery({
    ...appCheckExistenceOptions({
      client: apiClient,
      query: {
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      } satisfies AppCheckExistenceData["query"],
    }),

    enabled: enabled && hasValue,
    staleTime: 0,
    retry: false,
  });
}
export function useAppResolveSignupRegion(enabled: boolean = true) {
  return useQuery({
    ...appResolveSignupRegionOptions({ client: apiClient }),
    enabled,
  });
}

export function useCheckUserExistenceMutation() {
  return useMutation({
    mutationFn: async (params: { email?: string; phone?: string }) => {
      const { data } = await appCheckExistence({
        client: apiClient,
        query: params,
      });
      return data;
    },
  });
}
