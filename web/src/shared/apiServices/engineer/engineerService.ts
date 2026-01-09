import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EngineerAdapter } from "./engineerAdapter";
import type {
  EngineerData,
  // EngineerPaginationParams,
  // PagedResponse,
  FileUploadParams,
  FileUploadResponse,
  // EngineerFile,
  JobAssignment,
  AssignJobParams,
  ScreenUploadParams,
  ScreenUploadResponse,
} from "./engineerTypes";
import { queryKeys } from "../queryKeys";
import { queryClient } from "@/main";

// --- Mutations ---

export function useEngineerSignup(options?: {
  onSuccess?: (data: EngineerData) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EngineerData) => EngineerAdapter.signup(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerDelete(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => EngineerAdapter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useEngineerFileUpload(options?: {
  onSuccess?: (data: FileUploadResponse) => void;
  onError?: (error: unknown) => void;
  onProgress?: (progress: {
    loaded: number;
    total?: number;
    percentage?: number;
  }) => void;
}) {
  return useMutation({
    mutationFn: (params: FileUploadParams) =>
      EngineerAdapter.uploadFile(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useEngineerScreenShotUpload(options?: {
  onSuccess?: (data: ScreenUploadResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (params: ScreenUploadParams) =>
      EngineerAdapter.uploadScreenshot(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

// --- Queries ---

export function useEngineerGetById(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.engineer.detail(id),
    queryFn: () => EngineerAdapter.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useEngineerGetFiles(
  engineerId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.engineer.detail(engineerId), "files"] as const,
    queryFn: () => EngineerAdapter.getFiles(engineerId),
    enabled: !!engineerId && (options?.enabled ?? true),
  });
}

export function useEngineerDownloadFile(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: ({
      fileKey,
      fileName,
    }: {
      fileKey: string;
      fileName?: string;
    }) => EngineerAdapter.downloadFile(fileKey, fileName),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useEngineerAssignJob(options?: {
  onSuccess?: (data: JobAssignment) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: AssignJobParams) => EngineerAdapter.assignJob(params),
    onSuccess: (data) => {
      // Invalidate engineer detail to refetch updated job assignments
      queryClient.invalidateQueries({
        queryKey: queryKeys.engineer.detail(data.engineerId),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetJobs(
  engineerId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.engineer.detail(engineerId), "jobs"] as const,
    queryFn: () => EngineerAdapter.getJobs(engineerId),
    enabled: !!engineerId && (options?.enabled ?? true),
  });
}

export function useEngineerUpdateJobStatus(options?: {
  onSuccess?: (
    data: JobAssignment,
  ) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (args: { id: string; status: string }) =>
      EngineerAdapter.updateJobStatus(args.id, args.status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// --- OTP Mutations ---

export function useSendEmailOTP(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: (email: string) => EngineerAdapter.sendEmailOTP(email),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useSendPhoneOTP(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: (phoneNumber: string) =>
      EngineerAdapter.sendPhoneOTP(phoneNumber),
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
      EngineerAdapter.verifyEmailOTP(email, otp),
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
      EngineerAdapter.verifyPhoneOTP(phoneNumber, otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
