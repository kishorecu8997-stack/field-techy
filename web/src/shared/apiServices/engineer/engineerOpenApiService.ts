import {
  engineerMarkProposalFileUploaded,
  getEngineerBalance,
  getEngineerTransactions,
  markWorkLogFileUploaded,
  type AppChangePasswordResponse,
  type AppDeleteProfileFileResponse,
  type AppLoginResponse,
  type AppMarkProfileFileUploadedResponse,
  type AppRegisterEngineerResponse,
  type ConnectStripeAccountError,
  type ConnectStripeAccountResponse,
  type EngineerAddEducationResponse,
  type EngineerAddExperienceResponse,
  type EngineerAddWorkLogResponse,
  type EngineerApplyJobResponse,
  type EngineerDeleteEducationResponse,
  type EngineerDeleteExperienceResponse,
  type EngineerGetMyJobsData,
  type EngineerGetSavedJobsData,
  type EngineerMarkProposalFileUploadedData,
  type EngineerRequestBreakResponse,
  type EngineerRequestStartResponse,
  type EngineerSearchJobsData,
  type EngineerSubmitRevisionResponse,
  type EngineerSubmitSignOffResponse,
  type EngineerToggleSaveJobResponse,
  type EngineerUpdateEducationResponse,
  type EngineerUpdateExperienceResponse,
  type EngineerUpdatePersonalInfoResponse,
  type EngineerUpdateSkillsAndToolsResponse,
  type EngineerUpdateWorkPreferenceResponse,
  type GetEngineerBalanceError,
  type GetEngineerBalanceResponse,
  type GetEngineerTransactionsData,
  type GetEngineerTransactionsError,
  type GetEngineerTransactionsResponse,
  type GetOnboardingLinkError,
  type GetOnboardingLinkResponse,
  type GetUserReportsData,
  type GetUserReportsResponses,
  type MarkWorkLogFileUploadedData,
  type MarkWorkLogFileUploadedResponse,
  type Options,
} from "@/api";
import {
  appChangePasswordMutation,
  appDeleteProfileFileMutation,
  appLoginMutation,
  appMarkProfileFileUploadedMutation,
  appRegisterEngineerMutation,
  connectStripeAccountMutation,
  engineerAddEducationMutation,
  engineerAddExperienceMutation,
  engineerAddWorkLogMutation,
  engineerApplyJobMutation,
  engineerDeleteEducationMutation,
  engineerDeleteExperienceMutation,
  engineerGetEducationOptions,
  engineerGetExperienceOptions,
  engineerGetMyDocumentsOptions,
  engineerGetMyJobsOptions,
  engineerGetPersonalInfoOptions,
  engineerGetProfileCompletionOptions,
  engineerGetSavedJobsOptions,
  engineerGetSkillsAndToolsOptions,
  engineerGetWorkPreferenceOptions,
  engineerMarkProposalFileUploadedMutation,
  engineerRequestBreakMutation,
  engineerRequestStartMutation,
  engineerSearchJobsOptions,
  engineerSubmitRevisionMutation,
  engineerSubmitSignOffMutation,
  engineerToggleSaveJobMutation,
  engineerUpdateEducationMutation,
  engineerUpdateExperienceMutation,
  engineerUpdatePersonalInfoMutation,
  engineerUpdateSkillsAndToolsMutation,
  engineerUpdateWorkPreferenceMutation,
  getEngineerEarningsOptions,
  getJobLogsOptions,
  getOnboardingLinkMutation,
  getUserReportsOptions,
  markWorkLogFileUploadedMutation,
  submitReportMutation,
} from "@/api/@tanstack/react-query.gen";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEngineerStore } from "../../store/useEngineerStore";
import { apiClient } from "../apiClient";
import { queryKeys } from "../queryKeys";
import { refetchProfileCompletion } from "./engineerProfileBarCompletionHelper";
import { type EngineerData } from "./engineerTypes";

/**
 * Re-export shared hooks for convenience (avoiding naming conflicts)
 */
export {
  getDownloadUrl,
  useAppDownloadProfileFile,
  useAppSendLoginOtp,
  useAppUploadProfileFile,
  useAppVerifyLoginOtp,
  useForgotPassword,
  useLookupData,
  useResetPassword,
  useSendOtp,
  useVerifyOtp,
} from "../commonOpenApiService";

/**
 * Engineer-specific API services
 */

export function useRegisterEngineer(options?: {
  onSuccess?: (data: AppRegisterEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appRegisterEngineerMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerLogin(options?: {
  onSuccess?: (data: AppLoginResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appLoginMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetPersonalInfo() {
  return useQuery({
    ...engineerGetPersonalInfoOptions({ client: apiClient }),
    staleTime: 0, // Ensure fresh data on every mount/invalidation for edit pages
  });
}

export function useEngineerUpdatePersonalInfo(options?: {
  onSuccess?: (data: EngineerUpdatePersonalInfoResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const syncProfile = useEngineerStore((state) => state.syncProfile);

  return useMutation({
    ...engineerUpdatePersonalInfoMutation({ client: apiClient }),
    onSuccess: async (data, variables) => {
      // Use refetchQueries and await it to ensure data is fresh before proceeding
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetPersonalInfo",
      });

      const updateData: Partial<EngineerData> = {};
      if (variables.body?.name !== undefined)
        updateData.fullName = variables.body.name;
      if (variables.body?.email !== undefined)
        updateData.email = variables.body.email;
      if (variables.body?.mobileno !== undefined)
        updateData.phoneNumber = variables.body.mobileno;
      if (variables.body?.address !== undefined)
        updateData.address = variables.body.address;

      syncProfile(updateData);
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetEducation() {
  return useQuery({
    ...engineerGetEducationOptions({ client: apiClient }),
    staleTime: 0,
  });
}

export function useEngineerAddEducation(options?: {
  onSuccess?: (data: EngineerAddEducationResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerAddEducationMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetEducation",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetProfileCompletion() {
  return useQuery({
    ...engineerGetProfileCompletionOptions({ client: apiClient }),
    staleTime: 0,
  });
}

export function useEngineerGetMyDocuments() {
  return useQuery({
    ...engineerGetMyDocumentsOptions({ client: apiClient }),
    staleTime: 0,
  });
}

export function useEngineerDeleteEducation(options?: {
  onSuccess?: (data: EngineerDeleteEducationResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerDeleteEducationMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetEducation",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerUpdateEducation(options?: {
  onSuccess?: (data: EngineerUpdateEducationResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerUpdateEducationMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetEducation",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetExperience() {
  return useQuery({
    ...engineerGetExperienceOptions({ client: apiClient }),
    staleTime: 0,
  });
}

export function useEngineerAddExperience(options?: {
  onSuccess?: (data: EngineerAddExperienceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerAddExperienceMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetExperience",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerDeleteExperience(options?: {
  onSuccess?: (data: EngineerDeleteExperienceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerDeleteExperienceMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetExperience",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerUpdateExperience(options?: {
  onSuccess?: (data: EngineerUpdateExperienceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerUpdateExperienceMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetExperience",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetSkillsAndTools() {
  return useQuery({
    ...engineerGetSkillsAndToolsOptions({ client: apiClient }),
    staleTime: 0,
  });
}

export function useEngineerUpdateSkillsAndTools(options?: {
  onSuccess?: (data: EngineerUpdateSkillsAndToolsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerUpdateSkillsAndToolsMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetSkillsAndTools",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetWorkPreference() {
  return useQuery({
    ...engineerGetWorkPreferenceOptions({ client: apiClient }),
    staleTime: 0,
  });
}

export function useEngineerUpdateWorkPreference(options?: {
  onSuccess?: (data: EngineerUpdateWorkPreferenceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerUpdateWorkPreferenceMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "engineerGetWorkPreference",
      });
      await refetchProfileCompletion(queryClient);
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerChangePassword(options?: {
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

export function useEngineerGetJobs({
  jobStatus,
  jobType,
  options,
}: {
  jobStatus?: NonNullable<EngineerGetMyJobsData["query"]>["assignmentStatus"];
  jobType?: NonNullable<EngineerGetMyJobsData["query"]>["jobType"];
  options?: { enabled?: boolean };
}) {
  const regionId = useUserSessionStore.getState().session?.regionId;
  return useQuery({
    ...engineerGetMyJobsOptions({
      client: apiClient,
      query: { assignmentStatus: jobStatus, jobType, regionId },
    }),
    enabled: options?.enabled ?? true,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
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
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerSearchJobs(
  query: NonNullable<EngineerSearchJobsData["query"]>,
  enabled: boolean = true,
) {
  const sessionRegionId = useUserSessionStore((s) => s.session?.regionId);
  return useQuery({
    ...engineerSearchJobsOptions({
      client: apiClient,
      query: { ...query, regionId: sessionRegionId },
    }),
    enabled: enabled,
    refetchOnMount:"always"
  });
}

export function useEngineerApplyJob(options?: {
  onSuccess?: (data: EngineerApplyJobResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerApplyJobMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerMarkProposalFileUploaded(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const base = engineerMarkProposalFileUploadedMutation({ client: apiClient });

  return useMutation({
    ...base,
    mutationFn: async (
      fnOptions: Options<EngineerMarkProposalFileUploadedData>,
    ) => {
      const regionId = useUserSessionStore.getState().session?.regionId;

      const body = {
        ...(fnOptions.body ?? {}),
        regionId,
      } as EngineerMarkProposalFileUploadedData["body"];

      if (!body || typeof body.jobId !== "number") {
        throw new Error("engineerMarkProposalFileUploaded requires body.jobId");
      }

      const mergedOptions: Options<EngineerMarkProposalFileUploadedData> = {
        ...fnOptions,
        body,
      };

      const { data } = await engineerMarkProposalFileUploaded({
        client: apiClient,
        ...mergedOptions,
        throwOnError: true,
      });
      if (!data)
        throw new Error(
          "No data returned from engineerMarkProposalFileUploaded",
        );
      return data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useEngineerRequestStart(options?: {
  onSuccess?: (data: EngineerRequestStartResponse) => void;
  onError?: (error: unknown) => void;
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerRequestStartMutation({ client: apiClient }),
    onSuccess: (data) => {
      // Invalidate job logs query when start request is submitted
      if (options?.assignmentId) {
        queryClient.invalidateQueries({
          queryKey: ["getJobLogs"],
          exact: false,
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerSubmitSignOff(options?: {
  onSuccess?: (data: EngineerSubmitSignOffResponse) => void;
  onError?: (error: unknown) => void;
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerSubmitSignOffMutation({ client: apiClient }),
    onSuccess: (data) => {
      // Invalidate job logs query when sign-off is submitted
      if (options?.assignmentId) {
        queryClient.invalidateQueries({
          queryKey: ["getJobLogs"],
          exact: false,
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerAddWorkLog(options?: {
  onSuccess?: (data: EngineerAddWorkLogResponse) => void;
  onError?: (error: unknown) => void;
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerAddWorkLogMutation({ client: apiClient }),
    onSuccess: (data) => {
      // Invalidate job logs query when work log is added
      if (options?.assignmentId) {
        queryClient.invalidateQueries({
          queryKey: ["getJobLogs"],
          exact: false,
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerSubmitRevision(options?: {
  onSuccess?: (data: EngineerSubmitRevisionResponse) => void;
  onError?: (error: unknown) => void;
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerSubmitRevisionMutation({ client: apiClient }),
    onSuccess: (data) => {
      // Invalidate job logs query when revision is submitted
      if (options?.assignmentId) {
        queryClient.invalidateQueries({
          queryKey: ["getJobLogs"],
          exact: false,
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
/**
 * Hook to mark worklog related files as uploaded
 * Used for worklog, revision, client_revision, and signoff attachments
 */
export function useMarkWorkLogFileUploaded(options?: {
  onSuccess?: (data: MarkWorkLogFileUploadedResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const base = markWorkLogFileUploadedMutation({ client: apiClient });

  return useMutation({
    ...base,
    mutationFn: async (fnOptions: Options<MarkWorkLogFileUploadedData>) => {
      const regionId = useUserSessionStore.getState().session?.regionId;
      const body = {
        ...(fnOptions.body ?? {}),
        regionId,
      } as MarkWorkLogFileUploadedData["body"];

      if (!body || typeof body.assignmentId !== "number") {
        throw new Error("markWorkLogFileUploaded requires body.assignmentId");
      }

      const mergedOptions: Options<MarkWorkLogFileUploadedData> = {
        ...fnOptions,
        body,
      };

      const { data } = await markWorkLogFileUploaded({
        client: apiClient,
        ...mergedOptions,
        throwOnError: true,
      });
      if (!data)
        throw new Error("No data returned from markWorkLogFileUploaded");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getJobLogs"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerRequestBreak(options?: {
  onSuccess?: (data: EngineerRequestBreakResponse) => void;
  onError?: (error: unknown) => void;
  assignmentId?: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerRequestBreakMutation({ client: apiClient }),
    onSuccess: (data) => {
      // Invalidate job logs query when break request is submitted
      if (options?.assignmentId) {
        // Use partial matching to invalidate job logs queries
        queryClient.invalidateQueries({
          queryKey: ["engineer", "jobLogs", options.assignmentId],
        });
        // Also invalidate any other job logs queries with the same assignmentId
        queryClient.invalidateQueries({
          queryKey: ["getJobLogs"],
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetJobLogs(assignmentId: number, enabled: boolean = true) {
  return useQuery({
    ...getJobLogsOptions({
      client: apiClient,
      path: { assignmentId },
      query: {
        regionId: useUserSessionStore.getState().session?.regionId,
      },
    }),
    enabled: enabled && !!assignmentId,
  });
}

export function useStoreEngineerSaveJobs(options?: {
  onSuccess?: (data: EngineerToggleSaveJobResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...engineerToggleSaveJobMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetEngineerSavedJobs(
  query: EngineerGetSavedJobsData["query"] = {},
  enabled: boolean = true,
) {
  return useQuery({
    ...engineerGetSavedJobsOptions({
      client: apiClient,
      query: {
        ...query,
        regionId: useUserSessionStore.getState().session?.regionId,
      },
    }),
    enabled: enabled,
  });
}

export function useSaveReportEngineer(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...submitReportMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type ReportIssue = GetUserReportsResponses[200]["data"][number];
export function useGetReportEngineer(
  query: GetUserReportsData["query"] = {},
  enabled: boolean = true,
) {
  return useQuery({
    ...getUserReportsOptions({
      client: apiClient,
      query: {
        ...query,
        regionId: useUserSessionStore.getState().session?.regionId,
      },
    }),
    enabled: enabled,
  });
}

export function useEngineerBalance(enabled: boolean = true) {
  return useQuery<GetEngineerBalanceResponse, GetEngineerBalanceError>({
    queryKey: [...queryKeys.engineer.all, "balance"],
    queryFn: async () => {
      const response = await getEngineerBalance({ client: apiClient });
      if (response.data) {
        return response.data;
      }
      throw response.error ?? { error: "Unknown error" };
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useEngineerTransactions(
  params: GetEngineerTransactionsData["query"] = {},
  enabled = true,
) {
  const paramsKey = params ? JSON.stringify(params) : "";
  return useQuery<
    GetEngineerTransactionsResponse,
    GetEngineerTransactionsError
  >({
    queryKey: [...queryKeys.engineer.all, "transactions", paramsKey],
    queryFn: async () => {
      const res = await getEngineerTransactions({
        client: apiClient,
        query: params,
      });
      if (res.data) return res.data;
      throw res.error ?? { error: "Unknown error" };
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetch engineer's jobs with proposal status
 * Returns jobs that the engineer has applied to or been assigned to
 */
export function useEngineerGetMyJobs(enabled: boolean = true) {
  return useQuery({
    ...engineerGetMyJobsOptions({
      client: apiClient,
      query: {
        regionId: useUserSessionStore.getState().session?.regionId,
      },
    }),
    enabled,
  });
}

export function useEngineerEarnings(enabled: boolean = true) {
  return useQuery({
    ...getEngineerEarningsOptions({
      client: apiClient,
    }),
    enabled,
  });
}

/**
 * Connect Stripe Account for bank details integration
 * Called when engineer clicks "Add Bank" to initiate Stripe account connection
 */
export function useConnectStripeAccount(options?: {
  onSuccess?: (data: ConnectStripeAccountResponse) => void;
  onError?: (error: ConnectStripeAccountError | unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...connectStripeAccountMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Request Stripe onboarding link after account connection.
 * Called immediately after connectStripeAccount succeeds.
 */
export function useGetOnboardingLink(options?: {
  onSuccess?: (data: GetOnboardingLinkResponse) => void;
  onError?: (error: GetOnboardingLinkError | unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...getOnboardingLinkMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Raw API functions for use outside of hooks have been moved to engineerRawApi.ts
 * to avoid circular dependencies with stores.
 */
