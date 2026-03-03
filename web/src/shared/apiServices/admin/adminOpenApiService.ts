import {
  adminGetPersonalInfo,
  adminUpdatePersonalInfo,
  getCmsContent,
  adminGetClientsForManagement,
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
  type AdminGetSubAdminsData,
  type AdminGetSubAdminsResponse,
  type AdminGetEngineersForManagementData,
  type AdminGetEngineersForManagementResponses,
  type AdminGetClientsForManagementResponse,
  type CreateOrUpdatePageResponses,
  type AddAndUpdateContactSupportResponses,
  type GetCmsPagesResponses,
  type GetCmsContentData,
  type GetCmsContentResponses,
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
  type AdminUpdateJobStatusData,
  type AdminUpdateJobStatusResponses,
  type AdminGetJobLogsData,
  type AdminGetJobLogsResponse,
  type AdminGetJobTransactionsData,
  type AdminGetJobTransactionsResponses,
  type AdminGetManageTransactionsData,
  type AdminGetManageTransactionsResponse,
  type AdminGetManageTransactionsError,
  type AdminGetTransactionRequestsData,
  type AdminGetTransactionRequestsResponse,
  type AdminGetWalletOverviewData,
  type AdminGetWalletOverviewResponse,
  type AdminDownloadInvoiceResponse,
  type AdminUpdateTransactionRequestStatusResponses,
  type AdminGetEngineersForManagementError,
  adminGetEngineersForManagement,
} from "@/api";
import {
  adminGetPersonalInfoOptions,
  adminUpdatePersonalInfoMutation,
  appChangePasswordMutation,
  appForgotPasswordMutation,
  appGetLookupDataOptions,
  appLoginMutation,
  appResetPasswordMutation,
  adminUpdateUserStatusMutation,
  adminGetJobsOptions,
  adminGetJobDetailsOptions,
  createOrUpdatePageMutation,
  addAndUpdateContactSupportMutation,
  getCmsPagesOptions,
  createFaqMutation,
  updateFaqMutation,
  deleteFaqMutation,
  adminCreateClientMutation,
  adminUpdateClientMutation,
  adminGetClientOptions,
  adminGetEngineerOptions,
  adminCreateServiceCategoryMutation,
  adminGetServiceCategoriesOptions,
  adminUpdateServiceCategoryMutation,
  adminDeleteServiceCategoryMutation,
  adminCreateEngineerMutation,
  adminUpdateEngineerMutation,
  adminDeleteEngineerMutation,
  adminGetJobGraphOptions,
  adminUpdateJobStatusMutation,
  adminGetJobLogsOptions,
  adminGetJobTransactionsOptions,
  adminGetSubAdminsOptions,
  adminGetManageTransactionsOptions,
  adminGetTransactionRequestsOptions,
  adminGetWalletOverviewOptions,
  adminDownloadInvoiceOptions,
  adminUpdateTransactionRequestStatusMutation,
} from "@/api/@tanstack/react-query.gen";
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
    ...options,
  });
}

export type AdminGetEngineersQuery = NonNullable<
  AdminGetEngineersForManagementData["query"]
>;

export type AdminManageEngineersResponse =
  AdminGetEngineersForManagementResponses[200];

export function useAdminManageEngineers(
  query?: AdminGetEngineersQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminManageEngineersResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetEngineersQuery = {
    ...query,
    regionId:
      query?.regionId ??
      (selectedRegionId ? Number(selectedRegionId) : undefined),
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
  query?: AdminGetClientsQuery;
  onSuccess?: (data: AdminManageClientsResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const { clientType, query, ...queryOptions } = options ?? {};

  const queryParams: AdminGetClientsQuery = {
    ...query,
    ...(clientType ? { clientType } : {}),
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

export type AdminUpdateJobStatusBody = NonNullable<
  AdminUpdateJobStatusData["body"]
>;

export type AdminUpdateJobStatusSuccess = AdminUpdateJobStatusResponses[200];

export function useAdminUpdateJobStatus(options?: {
  onSuccess?: (data: AdminUpdateJobStatusSuccess) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    ...adminUpdateJobStatusMutation({ client: apiClient }),
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
    onSuccess?: (data: GetCmsContentResponses[200]) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    queryKey: ["cms-content", key],
    queryFn: async () => {
      const response = await getCmsContent({
        client: apiClient,
        query: { key },
      });
      return response.data;
    },
    staleTime: 10 * 1000,
    gcTime: 30 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: false,
    ...options,
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

export type AdminGetJobDetailsQuery = NonNullable<
  AdminGetJobDetailsData["query"]
>;

export function useAdminGetJobDetails(
  query?: AdminGetJobDetailsQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobDetailsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const isValidJobId = query?.jobId && Number.isFinite(query.jobId);
  return useQuery({
    ...adminGetJobDetailsOptions({
      client: apiClient,
      query: isValidJobId ? query : { jobId: 0 },
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
  return useMutation({
    ...adminCreateClientMutation({ client: apiClient }),
    onSuccess: (data: AdminAddClientResponse) => {
      queryClient.invalidateQueries({
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
  return useMutation({
    ...adminUpdateClientMutation({ client: apiClient }),
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
  return useQuery({
    ...adminGetClientOptions({
      client: apiClient,
      path: { userId: Number(userId) },
    }),
    ...options,
  });
}

export function useAdminGetEngineerById(userId: number, enabled = true) {
  const isValidId = Number.isFinite(userId);
  return useQuery({
    ...adminGetEngineerOptions({
      client: apiClient,
      path: { userId: isValidId ? userId : 0 },
    }),
    enabled: enabled && isValidId,
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

export type AdminGetJobLogsQuery = NonNullable<AdminGetJobLogsData["query"]>;

export function useAdminGetJobLogs(
  query?: AdminGetJobLogsQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobLogsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const isValidJobId = query?.jobId && Number.isFinite(query.jobId);
  return useQuery({
    ...adminGetJobLogsOptions({
      client: apiClient,
      query: isValidJobId ? query : { jobId: 0 },
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
  query?: AdminGetPaymentTransactionsQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: PaymentTransactionsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  return useQuery({
    ...adminGetJobTransactionsOptions({
      client: apiClient,
      query: query ?? { jobId: 0 },
    }),
    ...options,
  });
}

// ─── Job Graph ────────────────────────────────────────────────────────────────

export type AdminGetJobGraphQuery = NonNullable<AdminGetJobGraphData["query"]>;

export function useAdminGetJobGraph(
  query: AdminGetJobGraphQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetJobGraphResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetJobGraphQuery = {
    ...query,
    regionId:
      query?.regionId ??
      (selectedRegionId ? Number(selectedRegionId) : undefined),
  };

  return useQuery({
    ...adminGetJobGraphOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// ─── Sub Admins ───────────────────────────────────────────────────────────────

export type AdminGetSubAdminsQuery = NonNullable<
  AdminGetSubAdminsData["query"]
>;

export function useAdminGetSubAdmins(
  query?: AdminGetSubAdminsQuery,
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
      (selectedRegionId ? Number(selectedRegionId) : undefined),
  };

  return useQuery({
    ...adminGetSubAdminsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// ─── Manage Transactions ─────────────────────────────────────────────────────

export type AdminGetManageTransactionsQuery = NonNullable<
  AdminGetManageTransactionsData["query"]
>;

export function useAdminGetManageTransactions(
  query?: AdminGetManageTransactionsQuery,
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
      (selectedRegionId ? Number(selectedRegionId) : undefined),
  };

  return useQuery({
    ...adminGetManageTransactionsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// ─── Transaction Requests ─────────────────────────────────────────────────────

export type AdminGetTransactionRequestsQuery = NonNullable<
  AdminGetTransactionRequestsData["query"]
>;
export function useAdminGetTransactionRequests(
  query?: AdminGetTransactionRequestsQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetTransactionRequestsResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetTransactionRequestsQuery = {
    ...query,
    regionId:
      query?.regionId ??
      (selectedRegionId ? Number(selectedRegionId) : undefined),
  };

  return useQuery({
    ...adminGetTransactionRequestsOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// ─── Wallet Overview ──────────────────────────────────────────────────────────

export type AdminGetWalletOverviewQuery = NonNullable<
  AdminGetWalletOverviewData["query"]
>;

export function useAdminGetWalletOverview(
  query: AdminGetWalletOverviewQuery,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: AdminGetWalletOverviewResponse) => void;
    onError?: (error: unknown) => void;
  },
) {
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  const mergedQuery: AdminGetWalletOverviewQuery = {
    ...query,
    regionId:
      query?.regionId ??
      (selectedRegionId ? Number(selectedRegionId) : undefined),
  };

  return useQuery({
    ...adminGetWalletOverviewOptions({
      client: apiClient,
      query: mergedQuery,
    }),
    ...options,
  });
}

// ─── Download Invoice ─────────────────────────────────────────────────────────

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
        regionId: selectedRegionId ? Number(selectedRegionId) : undefined,
      },
    }),
    enabled: isValidId ? (options?.enabled ?? true) : false,
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
    ...adminCreateEngineerMutation({
      client: apiClient,
      query: {
        regionId: selectedRegionId ? Number(selectedRegionId) : undefined,
      },
    }),
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

export type AdminUpdateEngineerBody = AdminUpdateEngineerData["body"];

export function useAdminUpdateEngineer(options?: {
  onSuccess?: (data: AdminUpdateEngineerResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const selectedRegionId = useAdminCountryStore((state) => state.regionId);

  return useMutation({
    ...adminUpdateEngineerMutation({
      client: apiClient,
      query: {
        regionId: selectedRegionId ? Number(selectedRegionId) : undefined,
      },
    }),
    onSuccess: (data: AdminUpdateEngineerResponse) => {
      queryClient.resetQueries({
        queryKey: queryKeys.admin.manageEngineers,
        exact: false,
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
    ...adminDeleteEngineerMutation({
      client: apiClient,
      query: {
        regionId: selectedRegionId ? Number(selectedRegionId) : undefined,
      },
    }),
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
    ...adminUpdateTransactionRequestStatusMutation({
      client: apiClient,
    }),

    mutationFn: (variables, context) => {
      return adminUpdateTransactionRequestStatusMutation({
        client: apiClient,
      }).mutationFn!(
        {
          ...variables,
          query: {
            ...(variables.query ?? {}),
            regionId: selectedRegionId ? Number(selectedRegionId) : undefined,
          },
        },
        context,
      );
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
