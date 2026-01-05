import { useMutation } from "@tanstack/react-query";
import { AdminAdapter } from "./adminAdapter";

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

export function useUserPassworResetByOtpMutation(options?: {
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
