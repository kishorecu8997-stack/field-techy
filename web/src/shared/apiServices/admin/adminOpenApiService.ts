import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
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
  type GetAdminManageClientsData,
  type PutAdminUsersByUserIdStatusData,
  type PutAdminUsersByUserIdStatusResponses,
  type PutAdminUsersByUserIdStatusErrors,
  type AdminGetPersonalInfoResponse,
  type AdminUpdatePersonalInfoResponse,
} from "@/api";
import {
  adminGetPersonalInfoOptions,
  adminUpdatePersonalInfoMutation,
  appChangePasswordMutation,
  appForgotPasswordMutation,
  appGetLookupDataOptions,
  appLoginMutation,
  appResetPasswordMutation,
  getAdminManageClientsOptions,
  putAdminUsersByUserIdStatusMutation,
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
    data: PutAdminUsersByUserIdStatusResponses[200],
    variables: {
      userId: number;
      profileStatus: EngineerStatusType;
    },
  ) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<
    PutAdminUsersByUserIdStatusResponses[200],
    PutAdminUsersByUserIdStatusErrors | unknown,
    { userId: number; profileStatus: EngineerStatusType;}
  >({
    mutationFn: async ({ userId, profileStatus }) => {
      const response = await putAdminUsersByUserIdStatus({
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

  return response.data as PagedEngineersResponse<T>;
}

export type AdminManageClientsResponse = NonNullable<
  GetAdminManageClientsData["body"]
>;

export function useAdminManageClients(options?: {
  clientType: ClientType;
  onSuccess?: (data: AdminManageClientsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const { clientType, ...queryOptions } = options ?? {};

  return useQuery({
    ...getAdminManageClientsOptions({
      client: apiClient,
      query: {
        clientType,
      },
    }),
    ...queryOptions,
  });
}

export type AdminClientsByUserIdStatusBody = NonNullable<
  PutAdminUsersByUserIdStatusData["body"]
>;

export type AdminClientsByUserIdStatusResponse = NonNullable<
  PutAdminUsersByUserIdStatusResponses[200]
>;

export function useAdminClientsByUserIdStatus(options?: {
  onSuccess?: (data: AdminClientsByUserIdStatusResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...putAdminUsersByUserIdStatusMutation({ client: apiClient }),
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
