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
  type AppChangePasswordResponse,
  type AppDeleteProfileFileResponse,
  type AppLoginResponse,
  type AppMarkProfileFileUploadedResponse,
  type AppRegisterEngineerResponse,
  type EngineerAddEducationResponse,
  type EngineerAddExperienceResponse,
  type EngineerDeleteEducationResponse,
  type EngineerDeleteExperienceResponse,
  type EngineerGetPersonalInfoResponse,
  type EngineerUpdateEducationResponse,
  type EngineerUpdateExperienceResponse,
  type EngineerUpdatePersonalInfoResponse,
  type EngineerUpdateSkillsAndToolsResponse,
  type EngineerUpdateWorkPreferenceResponse
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEngineerStore } from "../../store/useEngineerStore";
import { queryKeys } from "../queryKeys";
import { apiClient } from "../apiClient";

// RE-EXPORT shared hooks for convenience
export * from "../commonOpenApiService";

/**
 * Engineer-specific API services
 */

export function useRegisterEngineer(options?: {
  onSuccess?: (data: AppRegisterEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClientInstance = useQueryClient();
  return useMutation({
    ...appRegisterEngineerMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClientInstance.invalidateQueries({ queryKey: queryKeys.engineer.all });
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
  const syncProfile = useEngineerStore((state) => state.syncProfile);
  return useQuery({
    ...engineerGetPersonalInfoOptions({ client: apiClient }),
    select: (data: EngineerGetPersonalInfoResponse) => {
      syncProfile({
        fullName: data.name,
        email: data.email,
        phoneNumber: data.mobileno,
        address: data.address,
      });
      return data;
    },
    refetchOnMount: true,
    staleTime: 0,
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      syncProfile({
        fullName: variables.body?.name || '',
        email: variables.body?.email || '',
        phoneNumber: variables.body?.mobileno || '',
        address: variables.body?.address || '',
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetEducation() {
  return useQuery({
    ...engineerGetEducationOptions({ client: apiClient }),
    refetchOnMount: true,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "education"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "education"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "education"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetExperience() {
  return useQuery({
    ...engineerGetExperienceOptions({ client: apiClient }),
    refetchOnMount: true,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "experience"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "experience"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "experience"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetSkillsAndTools() {
  return useQuery({
    ...engineerGetSkillsAndToolsOptions({ client: apiClient }),
    refetchOnMount: true,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "skills-tools"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetWorkPreference() {
  return useQuery({
    ...engineerGetWorkPreferenceOptions({ client: apiClient }),
    refetchOnMount: true,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "work-preference"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
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
    ...appChangePasswordMutation({ client: apiClient }),
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
    ...appMarkProfileFileUploadedMutation({ client: apiClient }),
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
    ...appDeleteProfileFileMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
