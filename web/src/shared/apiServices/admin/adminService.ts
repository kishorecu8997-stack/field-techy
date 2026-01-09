import { useMutation, useQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminAdapter } from "./adminAdapter";
import type { FileDownloadResponse } from "../client/clientTypes";
import type { getAdminByIdResponse } from "./adminTypes";
import type { PagedNotificationsParams } from "./adminTypes";
import { queryKeys } from "../queryKeys";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminAdapter.DeleteNotification(id),
    onSuccess: (data) => {
      // Refresh the list after deletion
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notifications.all });
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
  options?: { enabled?: boolean }
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
    onError: options?.onError,
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
  onSuccess?: (data: getAdminByIdResponse) => void;
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
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["admin-file-stream", fileKey],
    queryFn: () => AdminAdapter.downloadFileStream(fileKey!),
    enabled: !!fileKey && (options?.enabled ?? true),
    staleTime: Infinity,
  });
}
