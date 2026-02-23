import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
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
  type AdminGetPersonalInfoResponse,
  type AdminUpdatePersonalInfoResponse,
  type AdminGetJobsData,
  type AdminGetJobsResponse,
  type AdminGetEngineersForManagementData,
  type AdminGetEngineersForManagementResponses,
  type AdminGetClientsForManagementResponse,
  type AdminCreateServiceCategoryResponse,
  type AdminGetServiceCategoriesData,
  type AdminGetServiceCategoriesResponse,
  type AdminUpdateServiceCategoryResponse,
  type AdminDeleteServiceCategoryResponse,
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
  adminGetEngineersForManagementOptions,
  adminCreateServiceCategoryMutation,
  adminGetServiceCategoriesOptions,
  adminUpdateServiceCategoryMutation,
  adminDeleteServiceCategoryMutation,
} from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
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

export function useAdminCreateServiceCategory(options?: {
  onSuccess?: (data: AdminCreateServiceCategoryResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminCreateServiceCategoryMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["lookup", "serviceCategories", "root"],
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "adminGetServiceCategories",
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminUpdateServiceCategory(options?: {
  onSuccess?: (data: AdminUpdateServiceCategoryResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdateServiceCategoryMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["lookup", "serviceCategories", "root"],
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "adminGetServiceCategories",
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminDeleteServiceCategory(options?: {
  onSuccess?: (data: AdminDeleteServiceCategoryResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminDeleteServiceCategoryMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["lookup", "serviceCategories", "root"],
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (query.queryKey[0] as { _id?: string })._id ===
            "adminGetServiceCategories",
      });
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

export type AdminGetEngineersQuery = NonNullable<
  AdminGetEngineersForManagementData["query"]
>;

export function useAdminManageEngineers(
  query?: AdminGetEngineersQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetEngineersForManagementResponses) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...adminGetEngineersForManagementOptions({
      client: apiClient,
      query,
    }),
    ...options,
  });
}

export type AdminManageClientsResponse = AdminGetClientsForManagementResponse;

export type AdminGetClientsQuery = NonNullable<
  AdminGetClientsForManagementData["query"]
> & {
  search?: string;
};

export function useAdminManageClients(options?: {
  clientType?: ClientType;
  query?: AdminGetClientsQuery;
  onSuccess?: (data: AdminManageClientsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const { clientType, query, ...queryOptions } = options ?? {};

  const queryParams: AdminGetClientsQuery = {
    ...query,
    ...(clientType ? { clientType } : {}),
  };

  return useQuery({
    ...adminGetClientsForManagementOptions({
      client: apiClient,
      query: queryParams,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageClients,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminEngineersByUserIdStatus(options?: {
  onSuccess?: (data: AdminUpdateUserStatusResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdateUserStatusMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminManageEngineers"] });
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

export type AdminGetJobsQuery = NonNullable<AdminGetJobsData["query"]> & {
  search?: string;
};

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

export type AdminGetServiceCategoriesQuery = NonNullable<
  AdminGetServiceCategoriesData["query"]
>;

export function useAdminGetServiceCategories(
  query?: AdminGetServiceCategoriesQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetServiceCategoriesResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...adminGetServiceCategoriesOptions({
      client: apiClient,
      query,
    }),
    ...options,
  });
}
