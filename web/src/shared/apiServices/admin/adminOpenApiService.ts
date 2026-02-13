import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
  adminGetEngineersForManagement as getAdminManageEngineers,
  adminUpdateUserStatus,
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
  type AdminGetClientsForManagementData,
  type AdminUpdateUserStatusData,
  type AdminUpdateUserStatusResponses,
  type AdminUpdateUserStatusErrors,
  type AdminGetPersonalInfoResponse,
  type AdminUpdatePersonalInfoResponse,
  type AdminGetJobsData,
  type AdminGetJobsResponse,
} from "@/api";
import {
  adminGetPersonalInfoOptions,
  adminUpdatePersonalInfoMutation,
  appChangePasswordMutation,
  appForgotPasswordMutation,
  appGetLookupDataOptions,
  appLoginMutation,
  appResetPasswordMutation,
  adminGetClientsForManagementOptions,
  adminUpdateUserStatusMutation,
  adminGetJobsOptions,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import type { EngineerStatusType } from "@/pages/admin/engineer/types";
import { apiClient } from "../apiClient";

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

export type LoginBody = NonNullable<AppLoginData["body"]>;

export function useAdminLogin(options?: {
  onSuccess?: (data: AppLoginResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...appLoginMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetAdminPersonalInfo() {
  return useQuery({
    ...adminGetPersonalInfoOptions({ client: apiClient }),
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
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdatePersonalInfoMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type ChangePasswordBody = NonNullable<AppChangePasswordData["body"]>;

export function useAppChangePassword(options?: {
  onSuccess?: (data: AppChangePasswordResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    ...appChangePasswordMutation({ client: apiClient }),
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
    ...appForgotPasswordMutation({ client: apiClient }),
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
    ...appResetPasswordMutation({ client: apiClient }),
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
    ...appGetLookupDataOptions({
      client: apiClient,
      query: { table },
    }),
    ...options,
  });
}

export function useUpdateEngineerProfileStatus(options?: {
  onSuccess?: (
    data: AdminUpdateUserStatusResponses[200],
    variables: {
      userId: number;
      profileStatus: EngineerStatusType;
    },
  ) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<
    AdminUpdateUserStatusResponses[200],
    AdminUpdateUserStatusErrors | unknown,
    { userId: number; profileStatus: EngineerStatusType }
  >({
    mutationFn: async ({ userId, profileStatus }) => {
      const response = await adminUpdateUserStatus({
        client: apiClient,
        path: { userId },
        body: { profileStatus },
        throwOnError: true,
      });

      return response.data;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export type ProfileStatusType = EngineerStatusType;
export type UserStatusType = "active" | "inactive" | "suspended" | "blocked";
export interface PagedEngineersResponse<T = unknown> {
  data: T[];
  total: number;
}

export async function fetchAdminManageEngineersPaged<T = unknown>({
  page,
  limit,
  status,
  profileStatus,
}: {
  page: number;
  limit: number;
  status?: UserStatusType;
  profileStatus?: ProfileStatusType;
}): Promise<PagedEngineersResponse<T>> {
  const response = await getAdminManageEngineers({
    client: apiClient,
    query: { page, limit, status, profileStatus },
    throwOnError: true,
  });

  return response.data as unknown as PagedEngineersResponse<T>;
}

export type AdminManageClientsResponse = NonNullable<
  AdminGetClientsForManagementData["body"]
>;

export function useAdminManageClients(options?: {
  clientType: ClientType;
  onSuccess?: (data: AdminManageClientsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const { clientType, ...queryOptions } = options ?? {};

  return useQuery({
    ...adminGetClientsForManagementOptions({
      client: apiClient,
      query: {
        clientType,
      },
    }),
    ...queryOptions,
  });
}

export type AdminClientsByUserIdStatusBody = NonNullable<
  AdminUpdateUserStatusData["body"]
>;

export type AdminClientsByUserIdStatusResponse = NonNullable<
  AdminUpdateUserStatusResponses[200]
>;

export function useAdminClientsByUserIdStatus(options?: {
  onSuccess?: (data: AdminClientsByUserIdStatusResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdateUserStatusMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminManageClients"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Raw API functions for use outside of hooks (e.g. in Zustand stores)
 */
export async function getAdminPersonalInfo() {
  const response = await adminGetPersonalInfo({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as AdminGetPersonalInfoResponse;
}

export async function updateAdminPersonalInfo(body: AdminPersonalInfoBody) {
  const response = await adminUpdatePersonalInfo({
    client: apiClient,
    body,
    throwOnError: true,
  });
  return response.data as AdminUpdatePersonalInfoResponse;
}

export type { AdminGetJobsResponse };

export type AdminGetJobsQuery = NonNullable<AdminGetJobsData["query"]>;

export function useAdminGetJobs(
  query?: AdminGetJobsQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...adminGetJobsOptions({
      client: apiClient,
      query,
    }),
    ...options,
  });
}
