import {
  type AppChangePasswordResponse,
  type AppDeleteProfileFileResponse,
  type AppLoginResponse,
  type AppMarkProfileFileUploadedResponse,
  type AppRegisterClientResponse,
  type ClientGetRateCardResponse,
  type ClientMarkJobFileUploadedResponses,
  type ClientPostJobResponse,
  type ClientUpdateCompanyInfoResponse,
  clientGetCompanyInfo,
  type ClientGetCompanyInfoResponse,
  type AppUploadProfileFileResponse,
  clientGetRateCard,
  type ClientGetRateCardData,
} from "@/api";
import {
  appChangePasswordMutation,
  appDeleteProfileFileMutation,
  appLoginMutation,
  appMarkProfileFileUploadedMutation,
  appRegisterClientMutation,
  clientGetCompanyInfoOptions,
  clientGetJobsOptions,
  clientMarkJobFileUploadedMutation,
  clientPostJobMutation,
  clientUpdateCompanyInfoMutation,
  clientGetJobsQueryKey,
  appUploadProfileFileMutation,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { queryKeys } from "../queryKeys";
import { useUploadClientFile } from "./clientService";

export { useUploadClientFile };

// RE-EXPORT shared hooks for convenience
export * from "../commonOpenApiService";

/**
 * Client-specific API services
 */

export function useRegisterClient(options?: {
  onSuccess?: (data: AppRegisterClientResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appRegisterClientMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
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
    ...appLoginMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientGetCompanyInfo(enabled: boolean = true) {
  return useQuery({
    ...clientGetCompanyInfoOptions({
      client: apiClient,
      headers: { Authorization: "" },
    }),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClientUpdateCompanyInfo(options?: {
  onSuccess?: (data: ClientUpdateCompanyInfoResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientUpdateCompanyInfoMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.companyInfo });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientChangePassword(options?: {
  onSuccess?: (data: AppChangePasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appChangePasswordMutation({
      client: apiClient,
      headers: { Authorization: "" },
    }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAppMarkProfileFileUploaded(options?: {
  onSuccess?: (data: AppMarkProfileFileUploadedResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appMarkProfileFileUploadedMutation({
      client: apiClient,
      headers: { authorization: "" },
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
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

export function useAppDeleteProfileFile(options?: {
  onSuccess?: (data: AppDeleteProfileFileResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appDeleteProfileFileMutation({
      client: apiClient,
      headers: { authorization: "" },
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientPostJob(options?: {
  onSuccess?: (data: ClientPostJobResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientPostJobMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      queryClient.invalidateQueries({
        queryKey: clientGetJobsQueryKey({ client: apiClient }),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// ... existing code ...
export function useClientGetJobs(enabled: boolean = true) {
  return useQuery({
    ...clientGetJobsOptions({
      client: apiClient,
    }),
    enabled: enabled,
    staleTime: 0,
  });
}

export function useClientGetRateCard(options?: {
  onSuccess?: (data: ClientGetRateCardResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<
    ClientGetRateCardResponse,
    unknown,
    Omit<ClientGetRateCardData, "url">
  >({
    mutationFn: async (args: Omit<ClientGetRateCardData, "url">) => {
      const { data } = await clientGetRateCard({
        client: apiClient,
        ...args,
      });
      return data!;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useClientMarkJobFileUploaded(options?: {
  onSuccess?: (
    data: ClientMarkJobFileUploadedResponses[keyof ClientMarkJobFileUploadedResponses],
  ) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientMarkJobFileUploadedMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      queryClient.invalidateQueries({
        queryKey: clientGetJobsQueryKey({ client: apiClient }),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Raw API functions for use outside of hooks (e.g. in Zustand stores)
 */
export async function getClientCompanyInfo() {
  const response = await clientGetCompanyInfo({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as ClientGetCompanyInfoResponse;
}
