import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClientAdapter,

} from "./clientAdapter";
import type { LoginFormData } from "@/pages/engineer/auth/components/types";
import type { ClientData, ClientFileUploadParams, ClientPaginationParams, FileUploadResponse } from "./clientTypes";

export const CLIENT_QUERY_KEYS = {
  all: ["clients"] as const,
  detail: (id: string) => [...CLIENT_QUERY_KEYS.all, id] as const,
  list: (params: ClientPaginationParams) =>
    [...CLIENT_QUERY_KEYS.all, "list", params] as const,
};

// --- Mutations ---

export function useClientSignup(options?: {
  onSuccess?: (data: ClientData) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: (data: ClientData) => ClientAdapter.signup(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useClientSignin(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: (data: LoginFormData) => ClientAdapter.signin(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useClientUpdate(options?: {
  onSuccess?: (data: ClientData) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientData }) =>
      ClientAdapter.update(id, data),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: CLIENT_QUERY_KEYS.detail(data.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientDelete(options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ClientAdapter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENT_QUERY_KEYS.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

// --- Queries ---

export function useClientGetById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CLIENT_QUERY_KEYS.detail(id),
    queryFn: () => ClientAdapter.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useClientGetAll(
  params: ClientPaginationParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: CLIENT_QUERY_KEYS.list(params),
    queryFn: () => ClientAdapter.getAll(params),
    enabled: options?.enabled ?? true,
  });
}

// --- OTP Mutations ---

export function useSendEmailOTP(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: (email: string) => ClientAdapter.sendEmailOTP(email),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useSendPhoneOTP(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: (phoneNumber: string) => ClientAdapter.sendPhoneOTP(phoneNumber),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyEmailOTP(options?: {
  onSuccess?: (data: { message: string; verified: boolean }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      ClientAdapter.verifyEmailOTP(email, otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useVerifyPhoneOTP(options?: {
  onSuccess?: (data: { message: string; verified: boolean }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      ClientAdapter.verifyPhoneOTP(phoneNumber, otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

// --- Dropdown Data Queries ---

/**
 * Hook to fetch states list
 */
export function useStates(countryId?: string) {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: () => ClientAdapter.getStates(countryId),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch cities list for a state
 */
export function useCities(stateId?: string) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => ClientAdapter.getCities(stateId!),
    enabled: !!stateId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch industries list
 */
export function useIndustries() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: () => ClientAdapter.getIndustries(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch VAT options
 */
export function useVatOptions() {
  return useQuery({
    queryKey: ['vat-options'],
    queryFn: () => ClientAdapter.getVatOptions(),
    staleTime: 10 * 60 * 1000,
  });
}

// --- File Upload Hook ---

/**
 * Hook to upload a file for a client with progress tracking
 */
export function useUploadClientFile(options?: {
  onSuccess?: (data: FileUploadResponse) => void;
  onError?: (error: unknown) => void;
  onProgress?: (progress: { loaded: number; total?: number; percentage?: number }) => void;
}) {
  return useMutation({
    mutationFn: (params: ClientFileUploadParams) => ClientAdapter.uploadFile(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * Hook to get all files for a client
 */
export function useClientFiles(clientId?: string) {
  return useQuery({
    queryKey: ['client-files', clientId],
    queryFn: () => ClientAdapter.getFiles(clientId!),
    enabled: !!clientId,
  });
}
