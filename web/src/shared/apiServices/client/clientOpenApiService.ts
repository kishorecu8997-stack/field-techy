import {
  clientGetCompanyInfo,
  clientGetRateCard,
  type AppChangePasswordResponse,
  type AppDeleteProfileFileResponse,
  type AppLoginResponse,
  type AppMarkProfileFileUploadedResponse,
  type AppRegisterClientResponse,
  type AppUploadProfileFileResponse,
  type ClientCalculateJobPriceData,
  type ClientGetCompanyInfoResponse,
  type ClientGetRateCardData,
  type ClientGetRateCardResponse,
  type ClientInviteEngineerResponse,
  type ClientMarksJobFileUploadedResponses,
  type ClientPostJobResponse,
  type ClientUpdateCompanyInfoResponse
} from "@/api";
import {
  appChangePasswordMutation,
  appDeleteProfileFileMutation,
  appLoginMutation,
  appMarkProfileFileUploadedMutation,
  appRegisterClientMutation,
  appUploadProfileFileMutation,
  clientActionOnAssignmentMutation,
  clientActionOnBreakMutation,
  clientActionOnWorkLogMutation,
  clientCalculateJobPriceOptions,
  clientCancelJobMutation,
  clientGetAssignmentDetailsOptions,
  clientGetCompanyInfoOptions,
  clientGetJobByIdOptions,
  clientGetJobsOptions,
  clientGetJobsQueryKey,
  clientInviteEngineerMutation,
  clientMarksJobFileUploadedMutation,
  clientPostJobMutation,
  clientUpdateCompanyInfoMutation,
  getJobLogsOptions,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { queryKeys } from "../queryKeys";

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
    data: ClientMarksJobFileUploadedResponses[keyof ClientMarksJobFileUploadedResponses],
  ) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientMarksJobFileUploadedMutation({ client: apiClient }),
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

export function useClientGetJobById(jobId: number, enabled: boolean = true) {
  return useQuery({
    ...clientGetJobByIdOptions({
      client: apiClient,
      path: { jobId },
    }),
    enabled: enabled && !!jobId,
  });
}

export function useClientInviteEngineer(options?: {
  onSuccess?: (data: ClientInviteEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientInviteEngineerMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientGetAssignmentDetails(
  // query params were removed as the generated type ClientGetAssignmentDetailsData defines query?: never
  enabled: boolean = true,
) {
  return useQuery({
    ...clientGetAssignmentDetailsOptions({
      client: apiClient,
    }),
    enabled: enabled,
  });
}

export function useClientActionOnAssignment(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientActionOnAssignmentMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientCancelJob(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientCancelJobMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientCalculateJobPrice(
  query: ClientCalculateJobPriceData["query"],
  enabled: boolean = false,
) {
  return useQuery({
    ...clientCalculateJobPriceOptions({
      client: apiClient,
      query,
    }),
    enabled: enabled,
  });
}

export function useClientActionOnWorkLog(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientActionOnWorkLogMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientActionOnBreak(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...clientActionOnBreakMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

import type { ClientFile } from "./clientTypes";

// TODO: Hook needs proper investigation of API endpoint
export function useClientFiles(_clientId: string | number) {
  // Use correct API endpoint if available, for now return empty list
  return {
    data: [] as ClientFile[],
    isLoading: false,
    refetch: () => {},
  };
}

export function useGetJobLogs(jobId: number, enabled: boolean = true) {
  return useQuery({
    ...getJobLogsOptions({
      client: apiClient,
      path: { jobId },
    }),
    enabled: enabled && !!jobId,
  });
}

// TODO: Replace with actual lookup when available
export function useVatOptions() {
  return {
    data: [
      { label: "VAT", value: "VAT" },
      { label: "GST", value: "GST" },
    ],
    isLoading: false,
  };
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
