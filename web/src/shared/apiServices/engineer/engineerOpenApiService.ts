import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  appLogin, 
  appRegisterEngineer, 
  appSendOtp, 
  appVerifyOtp,
  appChangePassword,
  engineerGetPersonalInfo,
  engineerGetEducation,
  engineerAddEducation,
  engineerDeleteEducation,
  engineerUpdateEducation,
  engineerUpdatePersonalInfo,
  engineerGetExperience,
  engineerAddExperience,
  engineerDeleteExperience,
  engineerUpdateExperience,
  engineerGetSkillsAndTools,
  engineerUpdateSkillsAndTools,
  engineerGetWorkPreference,
  engineerUpdateWorkPreference,
  appGetLookupData,
  type AppLoginData, 
  type AppLoginResponse, 
  type AppRegisterEngineerData, 
  type AppRegisterEngineerResponse, 
  type AppSendOtpResponse, 
  type AppVerifyOtpResponse,
  type AppChangePasswordData,
  type AppChangePasswordResponse,
  type EngineerGetPersonalInfoResponse,
  type EngineerUpdatePersonalInfoData,
  type EngineerUpdatePersonalInfoResponse,
  type EngineerGetEducationResponse,
  type EngineerAddEducationData,
  type EngineerAddEducationResponse,
  type EngineerDeleteEducationResponse,
  type EngineerUpdateEducationData,
  type EngineerUpdateEducationResponse,
  type EngineerGetExperienceResponse,
  type EngineerAddExperienceData,
  type EngineerAddExperienceResponse,
  type EngineerDeleteExperienceResponse,
  type EngineerUpdateExperienceData,
  type EngineerUpdateExperienceResponse,
  type EngineerGetSkillsAndToolsResponse,
  type EngineerUpdateSkillsAndToolsData,
  type EngineerUpdateSkillsAndToolsResponse,
  type EngineerGetWorkPreferenceResponse,
  type EngineerUpdateWorkPreferenceData,
  type EngineerUpdateWorkPreferenceResponse,
  type AppGetLookupDataResponse,
  type AppGetLookupDataData
} from "@/api";
import { createClient } from "@/api/client";
import { queryKeys } from "../queryKeys";
import { useEngineerStore } from "../../store/useEngineerStore";
import { useUserSessionStore } from "../../store/useUserSessionStore";

// Create API client for OpenAPI calls
export const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3000",
});

// Configure client to use auth interceptor
apiClient.interceptors.request.use((request) => {
  const session = useUserSessionStore.getState().session;
  const token = session?.accessToken || localStorage.getItem("auth_token");
  
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  return request;
});

/**
 * TanStack Query mutation hook using OpenAPI generated appRegisterEngineer
 * This wraps the auto-generated SDK function with React Query for caching and state management
 */
export type RegisterEngineerBody = NonNullable<AppRegisterEngineerData["body"]>;

export function useRegisterEngineer(options?: {
  onSuccess?: (data: AppRegisterEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClientInstance = useQueryClient();
  return useMutation({
    mutationFn: async (body: RegisterEngineerBody) => {
      const response = await appRegisterEngineer({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppRegisterEngineerResponse;
    },
    onSuccess: (data) => {
      queryClientInstance.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type LoginBody = NonNullable<AppLoginData["body"]>;

export function useEngineerLogin(options?: {
  onSuccess?: (data: AppLoginResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: LoginBody) => {
      const response = await appLogin({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppLoginResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook using OpenAPI generated appSendOtp
 * This wraps the auto-generated SDK function with React Query for state management
 * Requires JWT authorization token from registration response
 */
export type SendOtpType = 'email' | 'phone';

export function useSendOtp(options?: {
  onSuccess?: (data: AppSendOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({ type, token }: { type: SendOtpType; token?: string }) => {
      const response = await appSendOtp({
        client: apiClient,
        body: { type },
        headers: { Authorization: `Bearer ${token || ""}` },
        throwOnError: true,
      });
      return response.data as AppSendOtpResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook using OpenAPI generated appVerifyOtp
 * This wraps the auto-generated SDK function with React Query for state management
 * Requires JWT authorization token from registration response
 */
export function useVerifyOtp(options?: {
  onSuccess?: (data: AppVerifyOtpResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({ type, code, token }: { type: SendOtpType; code: string; token?: string }) => {
      const response = await appVerifyOtp({
        client: apiClient,
        body: { type, code },
        headers: { Authorization: `Bearer ${token || ""}` },
        throwOnError: true,
      });
      return response.data as AppVerifyOtpResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * TanStack Query query hook for fetching engineer personal info
 */
export function useEngineerGetPersonalInfo() {
  const syncProfile = useEngineerStore((state) => state.syncProfile);
  return useQuery({
    queryKey: [...queryKeys.engineer.all, "personal-info"],
    queryFn: async () => {
      console.log("Fetching engineer personal info...");
      const response = await engineerGetPersonalInfo({
        client: apiClient,
        throwOnError: true,
      });
      const data = response.data as EngineerGetPersonalInfoResponse;
      // Sync with Zustand store
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

/**
 * TanStack Query mutation hook for updating engineer personal info
 */
export type UpdatePersonalInfoBody = NonNullable<EngineerUpdatePersonalInfoData["body"]>;

export function useEngineerUpdatePersonalInfo(options?: {
  onSuccess?: (data: EngineerUpdatePersonalInfoResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const syncProfile = useEngineerStore((state) => state.syncProfile);

  return useMutation({
    mutationFn: async (body: UpdatePersonalInfoBody) => {
      const response = await engineerUpdatePersonalInfo({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as EngineerUpdatePersonalInfoResponse;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      
      // Update local store immediately with the variables sent (optimistic-like) or wait for re-fetch
      // Here we sync the variables to the store
      syncProfile({
        fullName: variables.name,
        email: variables.email,
        phoneNumber: variables.mobileno,
        address: variables.address,
      });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query query hook for fetching engineer education list
 */
export function useEngineerGetEducation() {
  return useQuery({
    queryKey: [...queryKeys.engineer.all, "education"],
    queryFn: async () => {
      console.log("Fetching engineer education...");
      const response = await engineerGetEducation({
        client: apiClient,
        throwOnError: true,
      });
      console.log("Education data received:", response.data);
      return response.data as EngineerGetEducationResponse;
    },
    refetchOnMount: true,
    staleTime: 0,
  });
}

/**
 * TanStack Query mutation hook for adding new education record
 */
export type AddEducationBody = NonNullable<EngineerAddEducationData["body"]>;

export function useEngineerAddEducation(options?: {
  onSuccess?: (data: EngineerAddEducationResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: AddEducationBody) => {
      const response = await engineerAddEducation({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as EngineerAddEducationResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "education"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for deleting education record
 */
export function useEngineerDeleteEducation(options?: {
  onSuccess?: (data: EngineerDeleteEducationResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await engineerDeleteEducation({
        client: apiClient,
        path: { id },
        throwOnError: true,
      });
      return response.data as EngineerDeleteEducationResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "education"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for updating education record
 */
export type UpdateEducationBody = NonNullable<EngineerUpdateEducationData["body"]>;

export function useEngineerUpdateEducation(options?: {
  onSuccess?: (data: EngineerUpdateEducationResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateEducationBody }) => {
      const response = await engineerUpdateEducation({
        client: apiClient,
        path: { id },
        body,
        throwOnError: true,
      });
      return response.data as EngineerUpdateEducationResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "education"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query query hook for fetching engineer work experience list
 */
export function useEngineerGetExperience() {
  return useQuery({
    queryKey: [...queryKeys.engineer.all, "experience"],
    queryFn: async () => {
      const response = await engineerGetExperience({
        client: apiClient,
        throwOnError: true,
      });
      return response.data as EngineerGetExperienceResponse;
    },
    refetchOnMount: true,
    staleTime: 0,
  });
}

/**
 * TanStack Query mutation hook for adding new work experience record
 */
export type AddExperienceBody = NonNullable<EngineerAddExperienceData["body"]>;

export function useEngineerAddExperience(options?: {
  onSuccess?: (data: EngineerAddExperienceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: AddExperienceBody) => {
      const response = await engineerAddExperience({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as EngineerAddExperienceResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "experience"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for deleting work experience record
 */
export function useEngineerDeleteExperience(options?: {
  onSuccess?: (data: EngineerDeleteExperienceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await engineerDeleteExperience({
        client: apiClient,
        path: { id },
        throwOnError: true,
      });
      return response.data as EngineerDeleteExperienceResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "experience"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query mutation hook for updating work experience record
 */
export type UpdateExperienceBody = NonNullable<EngineerUpdateExperienceData["body"]>;

export function useEngineerUpdateExperience(options?: {
  onSuccess?: (data: EngineerUpdateExperienceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateExperienceBody }) => {
      const response = await engineerUpdateExperience({
        client: apiClient,
        path: { id },
        body,
        throwOnError: true,
      });
      return response.data as EngineerUpdateExperienceResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "experience"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query query hook for fetching engineer skills and tools
 */
export function useEngineerGetSkillsAndTools() {
  return useQuery({
    queryKey: [...queryKeys.engineer.all, "skills-tools"],
    queryFn: async () => {
      const response = await engineerGetSkillsAndTools({
        client: apiClient,
        throwOnError: true,
      });
      return response.data as EngineerGetSkillsAndToolsResponse;
    },
    refetchOnMount: true,
    staleTime: 0,
  });
}

/**
 * TanStack Query mutation hook for updating current engineer skills and tools
 */
export type UpdateSkillsAndToolsBody = NonNullable<EngineerUpdateSkillsAndToolsData["body"]>;

export function useEngineerUpdateSkillsAndTools(options?: {
  onSuccess?: (data: EngineerUpdateSkillsAndToolsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateSkillsAndToolsBody) => {
      const response = await engineerUpdateSkillsAndTools({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as EngineerUpdateSkillsAndToolsResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "skills-tools"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * TanStack Query query hook for fetching current engineer work preference
 */
export function useEngineerGetWorkPreference() {
  return useQuery({
    queryKey: [...queryKeys.engineer.all, "work-preference"],
    queryFn: async () => {
      const response = await engineerGetWorkPreference({
        client: apiClient,
        throwOnError: true,
      });
      return response.data as EngineerGetWorkPreferenceResponse;
    },
    refetchOnMount: true,
    staleTime: 0,
  });
}

/**
 * TanStack Query mutation hook for updating engineer work preference
 */
export type UpdateWorkPreferenceBody = NonNullable<EngineerUpdateWorkPreferenceData["body"]>;

export function useEngineerUpdateWorkPreference(options?: {
  onSuccess?: (data: EngineerUpdateWorkPreferenceResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateWorkPreferenceBody) => {
      const response = await engineerUpdateWorkPreference({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as EngineerUpdateWorkPreferenceResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.engineer.all, "work-preference"] });
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

/**
 * TanStack Query hook for fetching lookup data (countries, states, etc.)
 */
export function useLookupData(table: AppGetLookupDataData["query"]["table"], parentId?: string) {
  return useQuery({
    queryKey: ["lookup", table, parentId],
    queryFn: async () => {
      const response = await appGetLookupData({
        client: apiClient,
        query: { table, parentId },
        throwOnError: true,
      });
      return response.data as AppGetLookupDataResponse;
    },
    staleTime: 1000 * 60 * 60, // Keep lookup data fresh for 1 hour
  });
}

/**
 * TanStack Query mutation hook for changing password
 */
export type ChangePasswordBody = NonNullable<AppChangePasswordData["body"]>;

export function useEngineerChangePassword(options?: {
  onSuccess?: (data: AppChangePasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (body: ChangePasswordBody) => {
      const response = await appChangePassword({
        client: apiClient,
        body,
        headers: { Authorization: "" }, // Authorization is handled by apiClient interceptors
        throwOnError: true,
      });
      return response.data as AppChangePasswordResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
