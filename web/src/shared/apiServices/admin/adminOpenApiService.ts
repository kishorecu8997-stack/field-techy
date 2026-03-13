import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
  adminUpdateJobStatus,
  getCmsContent,
  adminGetClientsForManagement,
  adminUpdateUserStatus,
  adminCreateClient,
  adminUpdateClient,
  adminUpdateReport,
  adminDeleteClient,
  adminCreateEngineer,
  adminUpdateEngineer,
  adminDeleteEngineer,
  adminBroadcastNotification,
  getExchangeRates,
  updateExchangeRate,
  getRateCards,
  bulkCreateRateCards,
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
  type AdminGetJobDetailsData,
  type AdminGetJobDetailsResponse,
  type AdminGetJobGraphData,
  type AdminGetJobGraphResponse,
  type AdminGetUserGraphData,
  type AdminGetUserGraphResponse,
  type AdminGetDashboardJobGraphData,
  type AdminGetDashboardJobGraphResponse,
  type GetDashboardStatsResponse,
  type AdminGetSubAdminsData,
  type AdminGetSubAdminsResponse,
  type AdminGetEngineersForManagementData,
  type AdminGetEngineersForManagementResponses,
  type AdminGetEngineerHistoryData,
  type AdminGetEngineerHistoryResponse,
  type AdminGetClientHistoryData,
  type AdminGetClientHistoryResponse,
  type AdminGetClientsForManagementResponse,
  type CreateOrUpdatePageResponses,
  type AddAndUpdateContactSupportResponses,
  type GetCmsPagesResponses,
  type GetCmsContentData,
  type CreateFaqData,
  type CreateFaqResponses,
  type UpdateFaqData,
  type UpdateFaqResponses,
  type DeleteFaqResponses,
  type AdminCreateClientData,
  type AdminCreateClientResponse,
  type AdminUpdateClientData,
  type AdminUpdateClientResponse,
  type AdminGetClientResponse,
  type AdminGetClientsForManagementError,
  type AdminDeleteClientResponse,
  type AdminCreateServiceCategoryResponse,
  type AdminGetServiceCategoriesData,
  type AdminGetServiceCategoriesResponse,
  type AdminUpdateServiceCategoryResponse,
  type AdminDeleteServiceCategoryResponse,
  type AdminCreateEngineerResponse,
  type AdminCreateEngineerData,
  type AdminUpdateEngineerData,
  type AdminUpdateEngineerResponse,
  type AdminDeleteEngineerResponse,
  type AdminCreateSubAdminData,
  type AdminCreateSubAdminResponses,
  type AdminUpdateSubAdminData,
  type AdminUpdateSubAdminResponses,
  type AdminUpdateJobStatusData,
  type AdminUpdateJobStatusResponses,
  type AdminGetJobLogsData,
  type AdminGetJobLogsResponse,
  type AdminGetJobTransactionsData,
  type AdminGetJobTransactionsResponses,
  type GetExchangeRatesData,
  type GetExchangeRatesResponse,
  type UpdateExchangeRateData,
  type UpdateExchangeRateResponse,
  type AdminGetReportsResponse,
  type AdminGetReportsData,
  type AdminUpdateReportResponse,
  type AdminUpdateReportData,
  type AdminGetManageTransactionsData,
  type AdminGetManageTransactionsResponse,
  type AdminGetManageTransactionsError,
  type AdminGetTransactionRequestsData,
  type AdminGetTransactionRequestsResponses,
  type AdminGetWalletOverviewData,
  type AdminGetWalletOverviewResponse,
  type AdminDownloadInvoiceResponse,
  type AdminGetWithdrawalRequestsData,
  type AdminGetWithdrawalRequestsResponses,
  type AdminApprovePaymentResponses,
  type AdminGetEngineersForManagementError,
  adminGetEngineersForManagement,
  type AdminUpdateTransactionRequestStatusResponses,
  type AdminWithdrawalActionResponses,
  adminUpdateTransactionRequestStatus,
  type AdminBroadcastNotificationData,
  type AdminBroadcastNotificationResponses,
  type AdminGetNotificationsResponse,
  type AdminGetNotificationsData,
  adminMarkFileAsUploaded,
  type AdminMarkFileAsUploadedData,
  type AdminMarkFileAsUploadedResponse,
  type BulkCreateRateCardsResponse,
  type BulkCreateRateCardsData,
  adminApprovePayment,
  adminWithdrawalAction,
  type AdminGetEngineerResponse,
} from "@/api";

export type { AdminGetClientHistoryResponse, AdminGetClientHistoryData };
import {
  adminGetPersonalInfoOptions,
  appChangePasswordMutation,
  appForgotPasswordMutation,
  appGetLookupDataOptions,
  appLoginMutation,
  appResetPasswordMutation,
  adminGetJobsOptions,
  adminGetJobDetailsOptions,
  createOrUpdatePageMutation,
  addAndUpdateContactSupportMutation,
  getCmsPagesOptions,
  createFaqMutation,
  updateFaqMutation,
  deleteFaqMutation,
  adminGetClientOptions,
  adminGetEngineerOptions,
  adminGetEngineerHistoryOptions,
  adminGetClientHistoryOptions,
  adminCreateServiceCategoryMutation,
  adminGetServiceCategoriesOptions,
  adminUpdateServiceCategoryMutation,
  adminDeleteServiceCategoryMutation,
  adminCreateSubAdminMutation,
  adminUpdateSubAdminMutation,
  adminGetJobGraphOptions,
  adminGetUserGraphOptions,
  adminGetDashboardJobGraphOptions,
  getDashboardStatsOptions,
  adminGetJobLogsOptions,
  adminGetJobTransactionsOptions,
  adminGetReportsOptions,
  adminGetSubAdminsOptions,
  adminGetSubAdminsQueryKey,
  adminGetManageTransactionsOptions,
  adminGetTransactionRequestsOptions,
  adminGetWithdrawalRequestsOptions,
  adminGetWalletOverviewOptions,
  adminGetNotificationsQueryKey,
  adminGetNotificationsOptions,
  adminDownloadInvoiceOptions,
  adminGetSkillsOptions,
  adminCreateSkillMutation,
  adminUpdateSkillMutation,
  adminGetToolsOptions,
  adminCreateToolMutation,
  adminUpdateToolMutation,
} from "@/api/@tanstack/react-query.gen";


import {
  type AdminGetSkillsData,
  type AdminGetSkillsResponse,
  type AdminCreateSkillData,
  type AdminCreateSkillResponse,
  type AdminUpdateSkillData,
  type AdminUpdateSkillResponse,
  type AdminGetToolsData,
  type AdminGetToolsResponse,
  type AdminCreateToolData,
  type AdminCreateToolResponse,
  type AdminUpdateToolData,
  type AdminUpdateToolResponse,
} from "@/api/types.gen";


import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { apiClient } from "../apiClient";
import { useAdminCountryStore } from "../../store/useAdminCountryStore";

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
  BusinessTypes: "businessTypes",
  Regions: "regions",
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
    mutationFn: async (variables: { body: AdminPersonalInfoBody }) => {
      const { data } = await adminUpdatePersonalInfo({
        client: apiClient,
        body: variables.body,
        throwOnError: true,
      });
      return data as AdminUpdatePersonalInfoSuccess;
    },
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
  parentId?: string | number,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AppGetLookupDataResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...appGetLookupDataOptions({
      client: apiClient,
      query: {
        table,
        ...(parentId && { parentId: String(parentId) }),
      },
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes â€” lookup data rarely changes
    gcTime: 30 * 60 * 1000, // keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

export type AdminGetEngineersQuery = NonNullable<
  AdminGetEngineersForManagementData["query"]
>;

export type AdminManageEngineersResponse =
  AdminGetEngineersForManagementResponses[200];

export function useAdminManageEngineers(
  query?: Partial<AdminGetEngineersQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminManageEngineersResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetEngineersQuery = {
    ...query,
    regionId: (query?.regionId ?? Number(selectedRegionId)) || 0,
  };

  return useQuery<
    AdminManageEngineersResponse,
    AdminGetEngineersForManagementError
  >({
    queryKey: [...queryKeys.admin.manageEngineers, mergedQuery],
    queryFn: async ({ signal }) => {
      const { data } = await adminGetEngineersForManagement({
        client: apiClient,
        query: mergedQuery,
        signal,
        throwOnError: true,
      });
      return data as AdminManageEngineersResponse;
    },
    refetchOnMount: true,
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
  query?: Partial<AdminGetClientsQuery>;
  onSuccess?: (data: AdminManageClientsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const { clientType, query, ...queryOptions } = options ?? {};
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const queryParams: AdminGetClientsQuery = {
    ...query,
    ...(clientType ? { clientType } : {}),
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery<
    AdminManageClientsResponse,
    AdminGetClientsForManagementError,
    AdminManageClientsResponse,
    QueryKey
  >({
    queryKey: [...queryKeys.admin.manageClients, queryParams],
    queryFn: async ({ signal }) => {
      const { data } = await adminGetClientsForManagement({
        client: apiClient,
        query: queryParams,
        signal,
        throwOnError: true,
      });
      return data as AdminManageClientsResponse;
    },
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
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      body: AdminClientsByUserIdStatusBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminUpdateUserStatus({
        client: apiClient,
        path: variables.path,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminClientsByUserIdStatusResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageClients,
        exact: false,
        refetchType: "all",
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
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      body: AdminClientsByUserIdStatusBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminUpdateUserStatus({
        client: apiClient,
        path: variables.path,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminUpdateUserStatusResponses[200];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageEngineers,
        exact: false,
        refetchType: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminCreateSubAdminBody = NonNullable<
  AdminCreateSubAdminData["body"]
>;
export type AdminUpdateSubAdminBody = NonNullable<
  AdminUpdateSubAdminData["body"]
>;

export function useAdminCreateSubAdmin(options?: {
  onSuccess?: (data: AdminCreateSubAdminResponses[201]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    ...adminCreateSubAdminMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: adminGetSubAdminsQueryKey({
          client: apiClient,
          query: {
            regionId: Number(selectedRegionId),
          },
        }),
      });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminUpdateSubAdmin(options?: {
  onSuccess?: (data: AdminUpdateSubAdminResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    ...adminUpdateSubAdminMutation({ client: apiClient }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: adminGetSubAdminsQueryKey({
          client: apiClient,
          query: {
            regionId: Number(selectedRegionId),
          },
        }),
      });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminUpdateJobStatusBody = NonNullable<
  AdminUpdateJobStatusData["body"]
>;

export type AdminUpdateJobStatusSuccess = AdminUpdateJobStatusResponses[200];

export function useAdminUpdateJobStatus(options?: {
  onSuccess?: (data: AdminUpdateJobStatusSuccess) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (fnOptions: {
      query: { jobId: number };
      body?: AdminUpdateJobStatusBody;
    }) => {
      const { data } = await adminUpdateJobStatus({
        client: apiClient,
        query: {
          ...fnOptions.query,
          regionId: Number(selectedRegionId),
        },
        body: fnOptions.body,
        throwOnError: true,
      });
      return data as AdminUpdateJobStatusSuccess;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] &&
          typeof query.queryKey[0] === "object" &&
          (() => {
            const key = query.queryKey[0] as { _id?: string };
            return (
              key._id === "adminGetJobs" ||
              key._id === "adminGetJobDetails" ||
              key._id === "adminGetJobLogs"
            );
          })(),
      });
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

export type { AdminGetJobDetailsResponse };
export function useCreateOrUpdateCMSPage(options?: {
  onSuccess?: (data: CreateOrUpdatePageResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...createOrUpdatePageMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAddAndUpdateContactSupport(options?: {
  onSuccess?: (data: AddAndUpdateContactSupportResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...addAndUpdateContactSupportMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetCmsPages(options?: {
  enabled?: boolean;
  onSuccess?: (data: GetCmsPagesResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  return useQuery({
    ...getCmsPagesOptions({ client: apiClient }),
    ...options,
  });
}

export function useGetCmsContent(
  key: GetCmsContentData["query"]["key"],
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false | (() => number | false);
    staleTime?: number;
    refetchOnWindowFocus?: boolean | "always";
  },
) {
  return useQuery({
    queryKey: ["cms-content", key],
    queryFn: async () => {
      const response = await getCmsContent({
        client: apiClient,
        query: { key },
        throwOnError: true,
      });
      return response.data ?? null;
    },

    enabled: options?.enabled ?? true,

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchInterval: options?.refetchInterval ?? false,
  });
}
export function useCreateFaq(options?: {
  onSuccess?: (data: CreateFaqResponses[201]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...createFaqMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cms-content", "faq"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateFaq(options?: {
  onSuccess?: (data: UpdateFaqResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateFaqMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cms-content", "faq"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteFaq(options?: {
  onSuccess?: (data: DeleteFaqResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteFaqMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cms-content", "faq"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type CreateFaqBody = NonNullable<CreateFaqData["body"]>;
export type UpdateFaqBody = NonNullable<UpdateFaqData["body"]>;

export type { AdminGetJobsResponse };

export type AdminGetJobsQuery = NonNullable<AdminGetJobsData["query"]> & {
  search?: string;
};

export function useAdminGetJobs(
  query?: Partial<AdminGetJobsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetJobsQuery = {
    ...query,
    regionId: query?.regionId ?? Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetJobsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

export type AdminGetJobDetailsQuery = NonNullable<
  AdminGetJobDetailsData["query"]
>;

export function useAdminGetJobDetails(
  query?: Partial<AdminGetJobDetailsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobDetailsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidJobId = query?.jobId && Number.isFinite(query.jobId);

  const mergedQuery: AdminGetJobDetailsQuery = isValidJobId
    ? {
      ...query,
      regionId: Number(query?.regionId ?? selectedRegionId),
    } as AdminGetJobDetailsQuery
    : { jobId: 0, regionId: Number(selectedRegionId) };

  return useQuery({
    ...adminGetJobDetailsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    enabled: isValidJobId ? options?.enabled : false,
    ...options,
  });
}

export type AdminAddClientResponse = AdminCreateClientResponse;
export type AdminAddClientBody = AdminCreateClientData["body"];

export function useAdminAddClient(options?: {
  onSuccess?: (data: AdminAddClientResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (variables: {
      body: AdminAddClientBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminCreateClient({
        client: apiClient,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminAddClientResponse;
    },
    onSuccess: (data: AdminAddClientResponse) => {
      queryClient.resetQueries({
        queryKey: queryKeys.admin.manageClients,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminUpdateClientBody = AdminUpdateClientData["body"];

export function useAdminUpdateClient(options?: {
  onSuccess?: (data: AdminUpdateClientResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      body: AdminUpdateClientBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminUpdateClient({
        client: apiClient,
        path: variables.path,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminUpdateClientResponse;
    },
    onSuccess: (data: AdminUpdateClientResponse) => {
      queryClient.resetQueries({
        queryKey: queryKeys.admin.manageClients,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminGetClientByUserId(
  userId: string | number,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetClientResponse) => void;
    onError?: (error: unknown) => void;
    refetchOnMount?: boolean | "always";
    staleTime?: number;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidId = Number.isFinite(Number(userId)) && Number(userId) > 0;

  return useQuery({
    ...adminGetClientOptions({
      client: apiClient,
      path: { userId: isValidId ? Number(userId) : 0 },
      query: {
        regionId: Number(selectedRegionId),
      },
    }),
    enabled: isValidId ? options?.enabled : false,
    ...options,
  });
}

export type AdminMarkFileAsUploadedBody = AdminMarkFileAsUploadedData["body"];

export function useAdminMarkFileAsUploaded(options?: {
  onSuccess?: (data: AdminMarkFileAsUploadedResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      body: AdminMarkFileAsUploadedBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminMarkFileAsUploaded({
        client: apiClient,
        path: variables.path,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminMarkFileAsUploadedResponse;
    },
    onSuccess: (data: AdminMarkFileAsUploadedResponse) => {
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminGetEngineerById(
  userId: number,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetEngineerResponse) => void;
    onError?: (error: unknown) => void;
    refetchOnMount?: boolean | "always";
    staleTime?: number;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidId = Number.isFinite(userId) && userId > 0;

  return useQuery({
    ...adminGetEngineerOptions({
      client: apiClient,
      path: { userId: isValidId ? userId : 0 },
      query: {
        regionId: Number(selectedRegionId),
      },
    }),
    enabled: isValidId ? options?.enabled : false,
    ...options,
  });
}

// â”€â”€â”€ Engineer History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetEngineerHistoryQuery = NonNullable<
  AdminGetEngineerHistoryData["query"]
>;

export function useAdminGetEngineerHistory(
  userId: number,
  query?: Partial<AdminGetEngineerHistoryQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetEngineerHistoryResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidId = Number.isFinite(userId) && userId > 0;

  const mergedQuery: AdminGetEngineerHistoryQuery = {
    ...query,
    regionId: Number(query?.regionId ?? selectedRegionId) || 0,
  } as AdminGetEngineerHistoryQuery;

  return useQuery({
    ...adminGetEngineerHistoryOptions({
      client: apiClient,
      path: { userId: isValidId ? userId : 0 },
      query: mergedQuery,
    }),
    enabled: isValidId ? (options?.enabled ?? true) : false,
    ...options,
  });
}

// â”€â”€â”€ Client History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetClientHistoryQuery = NonNullable<
  AdminGetClientHistoryData["query"]
>;

export function useAdminGetClientHistory(
  userId: number,
  query?: Partial<AdminGetClientHistoryQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetClientHistoryResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidId = Number.isFinite(userId) && userId > 0;

  const mergedQuery: AdminGetClientHistoryQuery = {
    ...query,
    regionId: Number(query?.regionId ?? selectedRegionId) || 0,
  } as AdminGetClientHistoryQuery;

  return useQuery({
    ...adminGetClientHistoryOptions({
      client: apiClient,
      path: { userId: isValidId ? userId : 0 },
      query: mergedQuery,
    }),
    enabled: isValidId ? (options?.enabled ?? true) : false,
    ...options,
  });
}
export type AdminGetServiceCategoriesQuery = NonNullable<
  AdminGetServiceCategoriesData["query"]
>;

export function useAdminGetServiceCategories(
  query?: Partial<AdminGetServiceCategoriesQuery>,
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

export function useAdminGetSkills(
  query?: Partial<AdminGetSkillsData["query"]>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetSkillsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...adminGetSkillsOptions({
      client: apiClient,
      query,
    }),
    ...options,
  });
}

export function useAdminCreateSkill(options?: {
  onSuccess?: (data: AdminCreateSkillResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminCreateSkillMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lookup", "skills", "root"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminUpdateSkill(options?: {
  onSuccess?: (data: AdminUpdateSkillResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdateSkillMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lookup", "skills", "root"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminGetTools(
  query?: Partial<AdminGetToolsData["query"]>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetToolsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...adminGetToolsOptions({
      client: apiClient,
      query,
    }),
    ...options,
  });
}

export function useAdminCreateTool(options?: {
  onSuccess?: (data: AdminCreateToolResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminCreateToolMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lookup", "tools", "root"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminUpdateTool(options?: {
  onSuccess?: (data: AdminUpdateToolResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdateToolMutation({ client: apiClient }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lookup", "tools", "root"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminAddSkillBody = AdminCreateSkillData["body"];
export type AdminUpdateSkillBody = AdminUpdateSkillData["body"];
export type AdminAddToolBody = AdminCreateToolData["body"];
export type AdminUpdateToolBody = AdminUpdateToolData["body"];

export type AdminGetJobLogsQuery = NonNullable<AdminGetJobLogsData["query"]>;

export function useAdminGetJobLogs(
  query?: Partial<AdminGetJobLogsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobLogsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidJobId = query?.jobId && Number.isFinite(query.jobId);

  const mergedQuery: AdminGetJobLogsQuery = isValidJobId
    ? {
      ...query,
      regionId: Number(query?.regionId ?? selectedRegionId) || 0,
    } as AdminGetJobLogsQuery
    : ({ jobId: 0, regionId: Number(selectedRegionId) } as AdminGetJobLogsQuery);

  return useQuery({
    ...adminGetJobLogsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    enabled: isValidJobId ? options?.enabled : false,
    ...options,
  });
}

// Payment Transactions API

export type PaymentTransaction =
  AdminGetJobTransactionsResponses[200]["data"][number];

export type PaymentTransactionsResponse = AdminGetJobTransactionsResponses[200];

export type AdminGetPaymentTransactionsQuery = NonNullable<
  AdminGetJobTransactionsData["query"]
>;

export function useAdminGetPaymentTransactions(
  query?: Partial<AdminGetPaymentTransactionsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: PaymentTransactionsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetPaymentTransactionsQuery = {
    ...query,
    jobId: query?.jobId ?? 0,
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetJobTransactionsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

export type AdminGetReportsQuery = NonNullable<AdminGetReportsData["query"]>;

export function useAdminGetReport(
  query?: Partial<AdminGetReportsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetReportsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetReportsQuery = {
    ...query,
    regionId: Number(selectedRegionId),
  };
  return useQuery({
    ...adminGetReportsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ Job Graph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetJobGraphQuery = NonNullable<AdminGetJobGraphData["query"]>;

export function useAdminGetJobGraph(
  query: Partial<AdminGetJobGraphQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobGraphResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetJobGraphQuery = {
    ...query,
    regionId: Number(query?.regionId ?? selectedRegionId) || 0,
  } as AdminGetJobGraphQuery;

  return useQuery({
    ...adminGetJobGraphOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ Dashboard Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useAdminGetDashboardStats(options?: {
  enabled?: boolean;
  onSuccess?: (data: GetDashboardStatsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useQuery({
    ...getDashboardStatsOptions({
      client: apiClient,
      query: {
        regionId: Number(selectedRegionId),
      },
    }),
    ...options,
  });
}

// â”€â”€â”€ Dashboard Job Graph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetDashboardJobGraphQuery = NonNullable<
  AdminGetDashboardJobGraphData["query"]
>;

export function useAdminGetDashboardJobGraph(
  query: Partial<AdminGetDashboardJobGraphQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetDashboardJobGraphResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetDashboardJobGraphQuery = {
    ...query,
    regionId: Number(query?.regionId ?? selectedRegionId) || 0,
  } as AdminGetDashboardJobGraphQuery;

  return useQuery({
    ...adminGetDashboardJobGraphOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ User Graph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetUserGraphQuery = NonNullable<
  AdminGetUserGraphData["query"]
>;

export function useAdminGetUserGraph(
  query: Partial<AdminGetUserGraphQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetUserGraphResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetUserGraphQuery = {
    ...query,
    regionId: Number(query?.regionId ?? selectedRegionId) || 0,
  } as AdminGetUserGraphQuery;

  return useQuery({
    ...adminGetUserGraphOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

export type AdminUpdateReportBody = AdminUpdateReportData["body"];

export function useAdminResolveReport(options?: {
  onSuccess?: (data: AdminUpdateReportResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      body: AdminUpdateReportBody; // This already contains reportId
      query?: { regionId?: number };
    }) => {
      const { data } = await adminUpdateReport({
        client: apiClient,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminUpdateReportResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageClients,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// â”€â”€â”€ Sub Admins â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetSubAdminsQuery = NonNullable<
  AdminGetSubAdminsData["query"]
>;

export function useAdminGetSubAdmins(
  query?: Partial<AdminGetSubAdminsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetSubAdminsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetSubAdminsQuery = {
    ...query,
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetSubAdminsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    ...options,
  });
}

// â”€â”€â”€ Manage Transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetManageTransactionsQuery = NonNullable<
  AdminGetManageTransactionsData["query"]
>;

export function useAdminGetManageTransactions(
  query?: Partial<AdminGetManageTransactionsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetManageTransactionsResponse) => void;
    onError?: (data: AdminGetManageTransactionsError) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetManageTransactionsQuery = {
    ...query,
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetManageTransactionsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ Transaction Requests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetTransactionRequestsQuery = NonNullable<
  AdminGetTransactionRequestsData["query"]
>;

export function useAdminGetTransactionRequests(
  query?: Partial<AdminGetTransactionRequestsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetTransactionRequestsResponses[200]) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetTransactionRequestsQuery = {
    ...query,
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetTransactionRequestsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ Withdrawal Requests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetWithdrawalRequestsQuery = NonNullable<
  AdminGetWithdrawalRequestsData["query"]
>;

export function useAdminGetWithdrawalRequests(
  query?: Partial<AdminGetWithdrawalRequestsQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetWithdrawalRequestsResponses[200]) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetWithdrawalRequestsQuery = {
    ...query,
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetWithdrawalRequestsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ Wallet Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type AdminGetWalletOverviewQuery = NonNullable<
  AdminGetWalletOverviewData["query"]
>;

export function useAdminGetWalletOverview(
  query: Partial<AdminGetWalletOverviewQuery>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetWalletOverviewResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetWalletOverviewQuery = {
    ...query,
    regionId: Number(query?.regionId ?? selectedRegionId) || 0,
  } as AdminGetWalletOverviewQuery;

  return useQuery({
    ...adminGetWalletOverviewOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// â”€â”€â”€ Download Invoice â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useAdminDownloadInvoice(
  invoiceId: number,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminDownloadInvoiceResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  const isValidId = Number.isFinite(invoiceId) && invoiceId > 0;

  return useQuery({
    ...adminDownloadInvoiceOptions({
      client: apiClient,
      path: { id: isValidId ? invoiceId : 0 },
      query: {
        regionId: Number(selectedRegionId),
      },
    }),
    enabled: isValidId ? (options?.enabled ?? true) : false,
    ...options,
  });
}
export function useAdminDeleteClientMutation(options?: {
  onSuccess?: (data: AdminDeleteClientResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);
  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      query?: { regionId?: number };
    }) => {
      const { data } = await adminDeleteClient({
        client: apiClient,
        path: variables.path,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminDeleteClientResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageClients,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminExchangeRatesQuery = NonNullable<
  GetExchangeRatesData["query"]
>;

export function useAdminExchangeRates(
  query?: AdminExchangeRatesQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: GetExchangeRatesResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    queryKey: [...queryKeys.admin.exchangeRates, query],
    queryFn: async ({ signal }) => {
      const { data } = await getExchangeRates({
        client: apiClient,
        query,
        signal,
        throwOnError: true,
      });
      return data as GetExchangeRatesResponse;
    },
    ...options,
  });
}

export type AdminAddEngineerResponse = AdminCreateEngineerResponse;
export type AdminAddEngineerBody = AdminCreateEngineerData["body"];

export function useAdminAddEngineer(options?: {
  onSuccess?: (data: AdminAddEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      body: AdminAddEngineerBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminCreateEngineer({
        client: apiClient,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminAddEngineerResponse;
    },
    onSuccess: (data: AdminAddEngineerResponse) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageEngineers,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type UpdateExchangeRateBody = NonNullable<
  UpdateExchangeRateData["body"]
>;

export function useUpdateExchangeRate(options?: {
  onSuccess?: (data: UpdateExchangeRateResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { currencyId: number; rate: string }) => {
      const { data } = await updateExchangeRate({
        client: apiClient,
        path: { currencyId: params.currencyId },
        body: { rate: params.rate },
        throwOnError: true,
      });
      return data as UpdateExchangeRateResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.exchangeRates,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminUpdateEngineerBody = AdminUpdateEngineerData["body"];

export function useAdminUpdateEngineer(options?: {
  onSuccess?: (data: AdminUpdateEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      body: AdminUpdateEngineerBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminUpdateEngineer({
        client: apiClient,
        path: variables.path,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminUpdateEngineerResponse;
    },
    onSuccess: (data: AdminUpdateEngineerResponse) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageEngineers,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminApprovePayment(options?: {
  onSuccess?: (data: AdminApprovePaymentResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      body: { transactionId: number; action: "approve" | "reject" };
      query?: { regionId?: number };
    }) => {
      const { data } = await adminApprovePayment({
        client: apiClient,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminApprovePaymentResponses[200];
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) => {
          const firstKeyItem = query.queryKey?.[0];
          if (!firstKeyItem || typeof firstKeyItem !== "object") {
            return false;
          }
          return (
            (firstKeyItem as { _id?: string })._id ===
            "adminGetTransactionRequests"
          );
        },
        type: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminWithdrawalAction(options?: {
  onSuccess?: (data: AdminWithdrawalActionResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      body: { transactionId: number; action: "approve" | "reject" };
      query?: { regionId?: number };
    }) => {
      const { data } = await adminWithdrawalAction({
        client: apiClient,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminWithdrawalActionResponses[200];
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        predicate: (query) => {
          const firstKeyItem = query.queryKey?.[0];
          if (!firstKeyItem || typeof firstKeyItem !== "object") {
            return false;
          }
          return (
            (firstKeyItem as { _id?: string })._id ===
            "adminGetWithdrawalRequests"
          );
        },
        type: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminDeleteEngineerMutation(options?: {
  onSuccess?: (data: AdminDeleteEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      path: { userId: number };
      query?: { regionId?: number };
    }) => {
      const { data } = await adminDeleteEngineer({
        client: apiClient,
        path: variables.path,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminDeleteEngineerResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageEngineers,
        exact: false,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useAdminUpdateTransactionRequestStatus(options?: {
  onSuccess?: (data: AdminUpdateTransactionRequestStatusResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      path?: never;
      body: { status: "approved" | "rejected" };
      query: { id: number; regionId?: number };
    }) => {
      const { data } = await adminUpdateTransactionRequestStatus({
        client: apiClient,
        body: variables.body,
        query: {
          id: variables.query.id,
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminUpdateTransactionRequestStatusResponses[200];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.manageTransactions,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}


// Rate Card - Get All
export function useGetRateCards(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    countryId?: number;
    serviceCategoryId?: number;
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["admin", "rateCards", params],
    queryFn: async ({ signal }) => {
      const { data } = await getRateCards({
        client: apiClient,
        query: params,
        signal,
        throwOnError: true,
      });
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAdminCreateRateCard(options?: {
  onSuccess?: (data: BulkCreateRateCardsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      body: BulkCreateRateCardsData["body"];
      query: BulkCreateRateCardsData["query"];
    }) => {
      const { data } = await bulkCreateRateCards({
        client: apiClient,
        body: variables.body,
        query: variables.query,
        throwOnError: true,
      });
      return data as BulkCreateRateCardsResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rateCards"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type AdminBroadcastNotificationBody = NonNullable<
  AdminBroadcastNotificationData["body"]
>;

export function useAdminBroadcastNotification(options?: {
  onSuccess?: (data: AdminBroadcastNotificationResponses[200]) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    mutationFn: async (variables: {
      body: AdminBroadcastNotificationBody;
      query?: { regionId?: number };
    }) => {
      const { data } = await adminBroadcastNotification({
        client: apiClient,
        body: variables.body,
        query: {
          regionId: variables.query?.regionId ?? Number(selectedRegionId),
        },
        throwOnError: true,
      });
      return data as AdminBroadcastNotificationResponses[200];
    },

    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: adminGetNotificationsQueryKey({
          client: apiClient,
          query: {
            regionId: Number(selectedRegionId),
          },
        }),
      });

      options?.onSuccess?.(data);
    },

    onError: options?.onError,
  });
}
export function useAdminGetNotifications(
  query?: Partial<AdminGetNotificationsData["query"]>,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetNotificationsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetNotificationsData["query"] = {
    ...query,
    regionId:
      query?.regionId ??
      Number(selectedRegionId),
  };

  return useQuery({
    ...adminGetNotificationsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: options?.enabled,
  });
}
