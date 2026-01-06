import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminAdapter } from "./adminAdapter";
import type { PagedNotificationsParams } from "./adminTypes";
import { queryKeys } from "../queryKeys";

// --- Get All Notifications ---
export function useGetAllNotifications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [queryKeys.admin.notifications],
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
      queryClient.invalidateQueries({ queryKey: [queryKeys.admin.notifications] });
      options?.onSuccess?.(data);
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
    queryKey: [queryKeys.admin.notifications, params.page, params.size],
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
