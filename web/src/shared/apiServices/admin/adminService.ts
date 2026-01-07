import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminAdapter } from "./adminAdapter";
import type { CreateNotificationParams, AdminNotification, UpdateNotificationParams } from "./adminTypes";
import { queryKeys } from "../queryKeys";

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
      AdminAdapter.CreateNotification(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.admin.notifications] });
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
  AdminAdapter.EditNotification(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notifications.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// --- Get Notification By ID ---
export function useGetNotificationById(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [queryKeys.admin.notifications, id],
    queryFn: () => AdminAdapter.GetNotificationById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}