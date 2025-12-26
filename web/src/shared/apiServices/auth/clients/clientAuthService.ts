import { useMutation } from "@tanstack/react-query";
import ClientAuthAdapter from "./clientAuthAdapter";

export function useClientSignInMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { phoneOrEmail: string; password: string }) =>
      ClientAuthAdapter.signIn(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useReqEmailVerificationOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (email: string) =>
      ClientAuthAdapter.requestEmailVerificationOtp(email),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyEmailVerificationOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      ClientAuthAdapter.verifyEmailVerificationOtp(data.email, data.otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useReqMobileVerificationOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (mobile: string) =>
      ClientAuthAdapter.requestMobileVerificationOtp(mobile),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyMobileVerificationOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { mobile: string; otp: string }) =>
      ClientAuthAdapter.verifyMobileVerificationOtp(data.mobile, data.otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyPhoneVerificationOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { phone: string; otp: string }) =>
      ClientAuthAdapter.verifyMobileVerificationOtp(data.phone, data.otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useRequestVerificationOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (phoneOrEmail: string) =>
      ClientAuthAdapter.requestVerificationOtp(phoneOrEmail),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyOtpMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { otp: string }) =>
      ClientAuthAdapter.verifyOtp(data.otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
