import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
  appChangePassword,
  appForgotPassword,
  appGetLookupData,
  appLogin,
  appResetPassword,
  putAdminUsersByUserIdStatus,
  getAdminManageEngineers,
  type AdminUpdatePersonalInfoData,
  type AdminUpdatePersonalInfoResponses,
  type AppChangePasswordData,
  type AppChangePasswordResponse,
  type AppForgotPasswordData,
  type AppForgotPasswordResponse,
  type AppGetLookupDataData,
  type AppLoginData,
  type AppLoginResponse,
  type AppResetPasswordData,
  type AppResetPasswordResponse,
  type PutAdminUsersByUserIdStatusResponses,
  type PutAdminUsersByUserIdStatusErrors,
} from "@/api";
import { createClient } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import type { EngineerStatusType } from "@/pages/admin/engineer/types";

export const LookupTable = {
  Countries: "countries",
  Industries: "industries",
  States: "states",
  Cities: "cities",
  EmploymentTypes: "employmentTypes",
  Skills: "skills",
  Tools: "tools",
  ServiceCategories: "serviceCategories",
  WorkLocations: "workLocations",
  EducationLevels: "educationLevels",
  Courses: "courses",
} as const;

export type LookupTable = (typeof LookupTable)[keyof typeof LookupTable];

export type ClientType = "home" | "corporate";

const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL_NEW || "http://localhost:3001",
});

export type LoginBody = NonNullable<AppLoginData["body"]>;

export function useAdminLogin(options?: {
  onSuccess?: (data: AppLoginResponse) => void;
  onError?: (error: unknown) => void;
}) {
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
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetAdminPersonalInfo(token: string) {
  return useQuery({
    queryKey: [queryKeys.admin.all, token],
    queryFn: async () => {
      const response = await adminGetPersonalInfo({
        client: apiClient,
        throwOnError: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });
}

export type AdminPersonalInfoBody = NonNullable<
  AdminUpdatePersonalInfoData["body"]
>;

export type AdminUpdatePersonalInfoSuccess =
  AdminUpdatePersonalInfoResponses[200];

export function useAdminUpdatePersonalInfo(options?: {
  onSuccess?: (data: AdminUpdatePersonalInfoSuccess) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<
    AdminUpdatePersonalInfoSuccess,
    unknown,
    { body: AdminPersonalInfoBody; token: string }
  >({
    mutationFn: async ({ body, token }) => {
      const response = await adminUpdatePersonalInfo({
        client: apiClient,
        body,
        throwOnError: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export type ChangePasswordBody = NonNullable<AppChangePasswordData["body"]>;

export function useAppChangePassword(options?: {
  onSuccess?: (data: AppChangePasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async ({
      body,
      token,
    }: {
      body: ChangePasswordBody;
      token: string;
    }) => {
      const response = await appChangePassword({
        client: apiClient,
        body,
        throwOnError: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as AppChangePasswordResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export type ForgotPasswordBody = NonNullable<AppForgotPasswordData["body"]>;

export function useAppForgotPassword(options?: {
  onSuccess?: (data: AppForgotPasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (body: ForgotPasswordBody) => {
      const response = await appForgotPassword({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppForgotPasswordResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export type ResetPasswordBody = NonNullable<AppResetPasswordData["body"]>;

export function useAppResetPassword(options?: {
  onSuccess?: (data: AppResetPasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (body: ResetPasswordBody) => {
      const response = await appResetPassword({
        client: apiClient,
        body,
        throwOnError: true,
      });
      return response.data as AppResetPasswordResponse;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export type AppGetLookupDataResponse = NonNullable<
  AppGetLookupDataData["body"]
>;

export function useAppGetLookupData(
  table: LookupTable,
  options?: {
    onSuccess?: (data: AppGetLookupDataResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    queryKey: [queryKeys.admin.all, "lookupData", table],
    queryFn: async () => {
      const response = await appGetLookupData({
        client: apiClient,
        throwOnError: true,
        query: { table },
      });
      return response.data;
    },
    ...options,
  });
}

export function useUpdateEngineerProfileStatus(options?: {
  onSuccess?: (
    data: PutAdminUsersByUserIdStatusResponses[200],
    variables: {
      userId: number;
      profileStatus: EngineerStatusType;
      token: string;
    },
  ) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<
    PutAdminUsersByUserIdStatusResponses[200],
    PutAdminUsersByUserIdStatusErrors | unknown,
    { userId: number; profileStatus: EngineerStatusType; token: string }
  >({
    mutationFn: async ({ userId, profileStatus, token }) => {
      const response = await putAdminUsersByUserIdStatus({
        client: apiClient,
        path: { userId },
        body: { profileStatus },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        throwOnError: true,
      });

      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

type ProfileStatusType = "pending" | "approved" | "rejected";
type UserStatusType = "active" | "inactive" | "suspended" | "blocked";

interface UseGetManageEngineersParams {
  token: string;
  page?: number;
  limit?: number;
  status?: UserStatusType;
  profileStatus?: ProfileStatusType;
  enabled?: boolean;
}

export function useGetManageEngineers({
  token,
  page = 1,
  limit = 10,
  status,
  profileStatus,
  enabled = true,
}: UseGetManageEngineersParams) {
  return useQuery({
    queryKey: [
      "admin-manage-engineers",
      { page, limit, status, profileStatus },
    ],
    queryFn: async () => {
      const response = await getAdminManageEngineers({
        client: apiClient,
        query: {
          page,
          limit,
          status,
          profileStatus,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        throwOnError: true,
      });

      return response.data;
    },
    enabled: enabled && !!token,
  });
}
