import {
  clientGetCompanyInfo,
  clientGetRateCard,
  clientPostJob,
  clientCancelJob,
  clientInviteEngineer,
  clientActionOnAssignment,
  clientActionOnWorkLog,
  clientActionOnBreak,
  clientMarksJobFileUploaded,
  getJobLogs,
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
  type ClientPostJobData,
  type ClientPostJobResponse,
  type ClientUpdateCompanyInfoResponse,
  type GetClientBalanceResponse,
  type GetClientBalanceError,
  type GetClientTransactionsData,
  type GetClientTransactionsResponse,
  type GetClientTransactionsError,
  getClientTransactions,
  getClientBalance,
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
  clientGetJobsOptions,
  clientGetJobsQueryKey,
  clientInviteEngineerMutation,
  clientMarksJobFileUploadedMutation,
  clientUpdateCompanyInfoMutation,
  getJobLogsOptions,
  clientGetMyDocumentsOptions,
  clientGetDashboardOptions,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { queryKeys } from "../queryKeys";
import { type ClientGetAssignmentDetailsData } from "@/api";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

// RE-EXPORT shared hooks for convenience
export * from "../commonOpenApiService";

/**
 * Returns the regionId stored in the current client session (decoded from JWT at login).
 * Returns undefined if not available (e.g. not logged in yet or old session pre-dating this feature).
 */
export function useClientRegionId(): number | undefined {
  return useUserSessionStore((s) => s.session?.regionId);
}

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
    }),
    queryKey: queryKeys.client.companyInfo as any,
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClientGetMyDocuments() {
  return useQuery({
    ...clientGetMyDocumentsOptions({ client: apiClient }),
    staleTime: 0,
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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.client.companyInfo,
      });
      void queryClient.invalidateQueries({
        queryKey: [{ _id: "clientGetCompanyInfo" }],
      });
      // Invalidate everything else related to clients
      void queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
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
  const regionId = useClientRegionId();
  return useMutation<ClientPostJobResponse, unknown, Omit<ClientPostJobData, "url">>(
    {
      mutationFn: async (fnOptions) => {
        // Deep-merge regionId into the body; cast to required type since callers must provide required fields
        const body = (
          regionId !== undefined
            ? { ...fnOptions?.body, regionId }
            : fnOptions?.body
        ) as ClientPostJobData["body"];
        const { data } = await clientPostJob({
          client: apiClient,
          ...fnOptions,
          body,
          throwOnError: true,
        });
        return data!;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
        queryClient.invalidateQueries({
          queryKey: clientGetJobsQueryKey({ client: apiClient }),
        });
        options?.onSuccess?.(data);
      },
      onError: options?.onError,
    },
  );
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
  const regionId = useClientRegionId();
  return useMutation({
    ...clientMarksJobFileUploadedMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      const body = (
        regionId !== undefined
          ? { ...fnOptions?.body, regionId }
          : fnOptions?.body
      ) as typeof fnOptions["body"];
      const { data } = await clientMarksJobFileUploaded({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data;
    },
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

export function useClientInviteEngineer(options?: {
  onSuccess?: (data: ClientInviteEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const regionId = useClientRegionId();
  return useMutation({
    ...clientInviteEngineerMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      // Deep-merge regionId; cast to satisfy required body shape since callers provide required fields
      const body = (
        regionId !== undefined
          ? { ...fnOptions?.body, regionId }
          : fnOptions?.body
      ) as typeof fnOptions["body"];
      const { data } = await clientInviteEngineer({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data as ClientInviteEngineerResponse);
    },
    onError: options?.onError,
  });
}

// ...

export function useClientGetAssignmentDetails(
  query: ClientGetAssignmentDetailsData["query"] = {},
  enabled: boolean = true,
) {
  const regionId = useClientRegionId();
  // Merge regionId into query params; caller-provided regionId takes precedence if explicitly set
  const mergedQuery: ClientGetAssignmentDetailsData["query"] = {
    ...(regionId !== undefined && !query.regionId ? { regionId } : {}),
    ...query,
  };
  return useQuery({
    ...clientGetAssignmentDetailsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    enabled: enabled,
  });
}

export function useClientActionOnAssignment(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const regionId = useClientRegionId();
  return useMutation({
    ...clientActionOnAssignmentMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      const body = (
        regionId !== undefined
          ? { ...fnOptions?.body, regionId }
          : fnOptions?.body
      ) as typeof fnOptions["body"];
      const { data } = await clientActionOnAssignment({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data;
    },
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
  const regionId = useClientRegionId();
  return useMutation({
    ...clientCancelJobMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      // Deep-merge regionId; cast to satisfy required body shape since callers provide required fields
      const body = (
        regionId !== undefined
          ? { ...fnOptions?.body, regionId }
          : fnOptions?.body
      ) as typeof fnOptions["body"];
      const { data } = await clientCancelJob({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data;
    },
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
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  const regionId = useClientRegionId();
  return useMutation({
    ...clientActionOnWorkLogMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      const body = (
        regionId !== undefined
          ? { ...fnOptions?.body, regionId }
          : fnOptions?.body
      ) as typeof fnOptions["body"];
      const { data } = await clientActionOnWorkLog({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: (data) => {
      const exactQueryKey = [
        { _id: "getJobLogs", path: { assignmentId: options?.assignmentId } },
      ];
      queryClient.invalidateQueries({ queryKey: exactQueryKey });
      queryClient.invalidateQueries({ queryKey: [{ _id: "getJobLogs" }] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientActionOnBreak(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  const regionId = useClientRegionId();
  return useMutation({
    ...clientActionOnBreakMutation({ client: apiClient }),
    mutationFn: async (fnOptions) => {
      const body = (
        regionId !== undefined
          ? { ...fnOptions?.body, regionId }
          : fnOptions?.body
      ) as typeof fnOptions["body"];
      const { data } = await clientActionOnBreak({
        client: apiClient,
        ...fnOptions,
        body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: (data) => {
      const exactQueryKey = [
        { _id: "getJobLogs", path: { assignmentId: options?.assignmentId } },
      ];
      queryClient.invalidateQueries({ queryKey: exactQueryKey });
      queryClient.invalidateQueries({ queryKey: [{ _id: "getJobLogs" }] });
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
    refetch: () => { },
  };
}

export function useGetJobLogs(assignmentId: number, enabled: boolean = true) {
  const regionId = useClientRegionId();
  return useQuery({
    ...getJobLogsOptions({
      client: apiClient,
      path: { assignmentId },
      query: regionId !== undefined ? { regionId } : undefined,
    }),
    enabled: enabled && !!assignmentId,
    retry: 1,
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

export function useClientBalance(enabled: boolean = true) {
  return useQuery<GetClientBalanceResponse, GetClientBalanceError>({
    queryKey: [...queryKeys.client.all, "balance"],
    queryFn: async () => {
      const response = await getClientBalance({ client: apiClient });
      if (response.data) {
        return response.data;
      }
      throw response.error ?? { error: "Unknown error" };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useClientTransactions(
  params: GetClientTransactionsData["query"] = {},
  enabled = true,
) {
  return useQuery<GetClientTransactionsResponse, GetClientTransactionsError>({
    queryKey: [...queryKeys.client.all, "transactions", params],
    queryFn: async () => {
      const res = await getClientTransactions({
        client: apiClient,
        query: params,
      });
      if (res.data) return res.data;
      throw res.error ?? { error: "Unknown error" };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useClientJobOverviewDashboard(enabled: boolean = true) {
  return useQuery({
    ...clientGetDashboardOptions({
      client: apiClient,
    }),
    enabled: enabled,
  });
}
