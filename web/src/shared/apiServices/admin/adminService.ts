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
      password: string;
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
    mutationFn: (params: any) => AdminAdapter.uploadFile(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}