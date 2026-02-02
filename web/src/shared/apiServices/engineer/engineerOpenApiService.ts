import {
  engineerGetEducation,
  engineerGetExperience,
  engineerGetPersonalInfo,
  engineerGetSkillsAndTools,
  engineerGetWorkPreference,
  type AppChangePasswordResponse,
  type AppDeleteProfileFileResponse,
  type AppLoginResponse,
  type AppMarkProfileFileUploadedResponse,
  type AppRegisterEngineerResponse,
  type EngineerAddEducationResponse,
  type EngineerAddExperienceResponse,
  type EngineerDeleteEducationResponse,
  type EngineerDeleteExperienceResponse,
  type EngineerGetEducationResponse,
  type EngineerGetExperienceResponse,
  type EngineerGetPersonalInfoResponse,
  type EngineerGetSkillsAndToolsResponse,
  type EngineerGetWorkPreferenceResponse,
  type EngineerUpdateEducationResponse,
  type EngineerUpdateExperienceResponse,
  type EngineerUpdatePersonalInfoResponse,
  type EngineerUpdateSkillsAndToolsResponse,
  type EngineerUpdateWorkPreferenceResponse,
  type EngineerGetMyJobsData,
} from "@/api";
import {
  appChangePasswordMutation,
  appDeleteProfileFileMutation,
  appLoginMutation,
  appMarkProfileFileUploadedMutation,
  appRegisterEngineerMutation,
  engineerAddEducationMutation,
  engineerAddExperienceMutation,
  engineerDeleteEducationMutation,
  engineerDeleteExperienceMutation,
  engineerGetEducationOptions,
  engineerGetExperienceOptions,
  engineerGetPersonalInfoOptions,
  engineerGetSkillsAndToolsOptions,
  engineerGetWorkPreferenceOptions,
  engineerUpdateEducationMutation,
  engineerUpdateExperienceMutation,
  engineerUpdatePersonalInfoMutation,
  engineerUpdateSkillsAndToolsMutation,
  engineerUpdateWorkPreferenceMutation,
  engineerGetMyJobsOptions,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEngineerStore } from "../../store/useEngineerStore";
import { apiClient } from "../apiClient";
import { queryKeys } from "../queryKeys";
import { type EngineerData } from "./engineerTypes";

// RE-EXPORT shared hooks for convenience
export * from "../commonOpenApiService";

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
      await useEngineerStore.getState().refetchProfile();
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
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

export function useEngineerGetJobs(
  jobStatus?: NonNullable<EngineerGetMyJobsData["query"]>["jobStatus"],
  jobType?: NonNullable<EngineerGetMyJobsData["query"]>["jobType"],
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...engineerGetMyJobsOptions({
      client: apiClient,
      query: { jobStatus, jobType },
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

/**
 * Raw API functions for use outside of hooks (e.g. in Zustand stores)
 */
export async function getPersonalInfo() {
  const response = await engineerGetPersonalInfo({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetPersonalInfoResponse;
}

export async function getEducation() {
  const response = await engineerGetEducation({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetEducationResponse;
}

export async function getExperience() {
  const response = await engineerGetExperience({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetExperienceResponse;
}

export async function getSkillsAndTools() {
  const response = await engineerGetSkillsAndTools({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetSkillsAndToolsResponse;
}

export async function getWorkPreference() {
  const response = await engineerGetWorkPreference({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetWorkPreferenceResponse;
}

