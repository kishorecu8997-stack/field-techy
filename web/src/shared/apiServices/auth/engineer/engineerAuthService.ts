import { useMutation } from "@tanstack/react-query";
import EngineerAuthAdapter from "./engineerAuthAdapter";

export function useEngineerSignInMutation(options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: { phoneOrEmail: string; password: string }) =>
      EngineerAuthAdapter.signIn(data),
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
      EngineerAuthAdapter.requestEmailVerificationOtp(email),
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
      EngineerAuthAdapter.verifyEmailVerificationOtp(data.email, data.otp),
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
      EngineerAuthAdapter.requestMobileVerificationOtp(mobile),
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
      EngineerAuthAdapter.verifyMobileVerificationOtp(data.mobile, data.otp),
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
      EngineerAuthAdapter.requestVerificationOtp(phoneOrEmail),
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
      EngineerAuthAdapter.verifyOtp(data.otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
