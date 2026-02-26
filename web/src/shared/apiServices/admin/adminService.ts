import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminAdapter } from "./adminAdapter";
import type {
  CreateNotificationParams,
  AdminNotification,
  UpdateNotificationParams,
  PagedNotificationsParams,
  AdminByIdResponse,
  RateCardsResponse,
  RateCardParams,
  CreateRateCardParams,
  CreateRateCardResponse,
  UpdateRateCardParams,
  UpdateRateCardResponse,
  DeleteRateCardResponse,
} from "./adminTypes";
import { queryKeys } from "../queryKeys";
import type { FileDownloadResponse } from "../client/clientTypes";
import { queryClient } from "@/main";

// --- Get All Notifications ---
export function useGetAllNotifications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.all,
    queryFn: () => AdminAdapter.GetAllNotifications(),
    enabled: options?.enabled ?? true,
  });
}

// --- Delete Notification ---
export function useDeleteNotification(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (id: string) => AdminAdapter.DeleteNotification(id),
    onSuccess: (data) => {
      // Refresh the list after deletion
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.notifications.all,
      });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

export function useAdminSignInMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { phoneOrEmail: string; password: string }) =>
      AdminAdapter.signIn(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAdminForgotPasswordOtpRequestMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (phoneOrEmail: string) =>
      AdminAdapter.forgotPasswordOtpRequest(phoneOrEmail),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useGetPagedNotifications(
  params: PagedNotificationsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      queryKeys.admin.notifications,
      params.page,
      params.size,
      params.sortBy,
      params.direction,
    ],
    queryFn: () => AdminAdapter.GetPagedNotifications(params),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useUserPasswordResetByOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: {
      otp: string;
      phoneOrEmail: string;
      password: string;
    }) => AdminAdapter.resetPasswordByOtp(data),
    onSuccess: options?.onSuccess,
  });
}

// --- Create Notification ---
export function useCreateNotification(options?: {
  onSuccess?: (data: AdminNotification) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationParams) =>
      AdminAdapter.createNotification(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.notifications.all,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
// --- Edit Notification ---
export function useEditNotification(options?: {
  onSuccess?: (data: AdminNotification) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNotificationParams) =>
      AdminAdapter.editNotification(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.notifications.all,
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// --- Get Notification By ID ---
export function useGetNotificationById(
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.detail(id),
    queryFn: () => AdminAdapter.getNotificationById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}
export function useAdminUpdateProfileMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: {
      id: string;
      fullName: string;
      email: string;
      profilePicture: string;
      phoneNumber: string;
    }) => AdminAdapter.updateAdminProfile(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useAdminUploadFileMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (params: any) => AdminAdapter.uploadFile(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/** Hook to change admin password */
export function useAdminChangePasswordMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: {
      oldPassword: string;
      newPassword: string;
      phoneOrEmail: string;
    }) => AdminAdapter.changePassword(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * Hook to download a file stream with metadata
 * Returns a mutation that can be called with a fileKey
 */
export function useDownloadAdminFileStream(options?: {
  onSuccess?: (data: FileDownloadResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (fileKey: string) => AdminAdapter.downloadFileStream(fileKey),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/** Hook to get admin by ID */
export function useAdminGetById(options?: {
  onSuccess?: (data: AdminByIdResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (id: string) => AdminAdapter.getAdminById(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * Hook to download a file stream as a query for Admin
 */
export function useAdminFileStream(
  fileKey?: string | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["admin-file-stream", fileKey],
    queryFn: () => AdminAdapter.downloadFileStream(fileKey!),
    enabled: !!fileKey && (options?.enabled ?? true),
    staleTime: Infinity,
  });
}

/** Hook to get all rate cards */
export function useGetRateCards(
  params?: RateCardParams,
  options?: { enabled?: boolean },
) {
  return useQuery<RateCardsResponse>({
    queryKey: ["admin-rate-cards", params],
    queryFn: () => AdminAdapter.getRateCards(params),
    enabled: options?.enabled ?? true,
  });
}

/** Hook to create a rate card */
export function useCreateRateCard(options?: {
  onSuccess?: (data: CreateRateCardResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRateCardParams) => AdminAdapter.createRateCard(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-rate-cards"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

/** Hook to update a rate card */
export function useUpdateRateCard(options?: {
  onSuccess?: (data: UpdateRateCardResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRateCardParams }) =>
      AdminAdapter.updateRateCard(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-rate-cards"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

/** Hook to delete a rate card */
export function useDeleteRateCard(options?: {
  onSuccess?: (data: DeleteRateCardResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AdminAdapter.deleteRateCard(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-rate-cards"] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
