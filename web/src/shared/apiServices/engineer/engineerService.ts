import { queryClient } from "@/main";
import { useEngineerStore } from "@/shared/store/useEngineerStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { queryKeys } from "../queryKeys";
import { EngineerAdapter } from "./engineerAdapter";

import type {
  AssignJobParams,
  EngineerData,
  FileUploadParams,
  FileUploadResponse,
  JobAssignment,
  ProposalJobData,
  ScreenUploadParams,
  ScreenUploadResponse,
  UpdatePasswordParams,
} from "./engineerTypes";

// Create API client for OpenAPI calls

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

export function useEngineerFileUpload(options?: {
  onSuccess?: (data: FileUploadResponse) => void;
  onError?: (error: unknown) => void;
  onProgress?: (progress: {
    loaded: number;
    total?: number;
    percentage?: number;
  }) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: FileUploadParams) =>
      EngineerAdapter.uploadFile(params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.engineer.detail(variables.engineerId),
      });

      useEngineerStore.getState().fetchEngineerProfile(variables.engineerId);

      options?.onSuccess?.(data);
    },

    onError: options?.onError,
  });
}

// --- Queries ---

export function useEngineerGetById(
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.engineer.detail(id),
    queryFn: () => EngineerAdapter.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useEngineerUpdateById(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EngineerData) =>
      EngineerAdapter.updateById(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.engineer.detail(userId),
      });
    },
  });
}

export function useEngineerGetFiles(
  engineerId: string,
  options?: { enabled?: boolean },
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

export function useDownloadEngineerFileStream(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (fileKey: string) =>
      EngineerAdapter.downloadFileStream(fileKey),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

/**
 * Hook to delete an engineer file
 */

export function useEngineerAssignJob(options?: {
  onSuccess?: (data: JobAssignment) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: AssignJobParams) => EngineerAdapter.assignJob(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.engineer.detail(data.engineerId),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useEngineerGetJobs(
  engineerId: string | null | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...queryKeys.engineer.detail(engineerId || ""), "jobs"] as const,
    queryFn: () =>
      engineerId
        ? EngineerAdapter.getJobs(engineerId)
        : Promise.reject("Invalid ID"),
    enabled: !!engineerId && (options?.enabled ?? true),
  });
}

export function useEngineerUpdateJobStatus(options?: {
  onSuccess?: (data: JobAssignment) => void;
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

export function useUpdatePassword(options?: {
  onSuccess?: (data: boolean) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (params: UpdatePasswordParams) =>
      EngineerAdapter.updatePassword(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

// --- OTP Mutations (Legacy Adapter-based) ---

export function useSendEmailOTP(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (email: string) => EngineerAdapter.sendEmailOTP(email),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useSendPhoneOTP(options?: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: unknown) => void;
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
  onError?: (error: unknown) => void;
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
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      EngineerAdapter.verifyPhoneOTP(phoneNumber, otp),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useDeleteEngineerFile(options?: {
  engineerId?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => EngineerAdapter.deleteFile(fileId),
    onSuccess: () => {
      if (options?.engineerId) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.engineer.detail(options.engineerId), "files"],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.engineer.all });
      }
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useSendProposalJob(options?: {
  onSuccess?: (data: JobAssignment) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (data: ProposalJobData) =>
      EngineerAdapter.sendProposalJob(data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useGetProposalJobsById(
  id: string,
  options?: {
    onSuccess?: (data: JobAssignment) => void;
    onError?: (error: unknown) => void;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [...queryKeys.engineer.detail(id), "jobs"] as const,
    queryFn: () => EngineerAdapter.getProposalJobsById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useGetProposalAll(
  id: string,
  options?: {
    onSuccess?: (data: JobAssignment) => void;
    onError?: (error: unknown) => void;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [...queryKeys.engineer.detail(id), "jobs"] as const,
    queryFn: () => EngineerAdapter.getProposalAll(),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useGetEngineerProposals(
  id: string,
  options?: {
    onSuccess?: (data: JobAssignment) => void;
    onError?: (error: unknown) => void;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [...queryKeys.engineer.detail(id), "jobs"] as const,
    queryFn: () => EngineerAdapter.getEngineerProposals(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useUpdateProposalById(options?: {
  onSuccess?: (data: JobAssignment) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProposalJobData }) =>
      EngineerAdapter.updateProposalById(id, data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useDeleteProposalById(options?: {
  onSuccess?: (data: JobAssignment) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (id: string) => EngineerAdapter.deleteProposalById(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

// --------------------------------- Jobs Endpoints ---------------------------------
export function useGetJobsById(
  id: string,
  options?: {
    onSuccess?: (data: JobAssignment) => void;
    onError?: (error: unknown) => void;
    enabled?: boolean;
  },
) {
  const query = useQuery({
    queryKey: [...queryKeys.engineer.detail(id), "jobs"] as const,
    queryFn: () => EngineerAdapter.getJobsById(id),
    enabled: !!id && (options?.enabled ?? true),
  });

  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  useEffect(() => {
    if (query.isSuccess && onSuccessRef.current) {
      onSuccessRef.current(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && onErrorRef.current) {
      onErrorRef.current(query.error);
    }
  }, [query.isError, query.error]);

  return query;
}

export function useGetJobsByEngineerId(
  id: string,
  options?: {
    onSuccess?: (data: JobAssignment) => void;
    onError?: (error: unknown) => void;
    enabled?: boolean;
  },
) {
  const query = useQuery({
    queryKey: [...queryKeys.engineer.detail(id), "jobs"] as const,
    queryFn: () => EngineerAdapter.getJobsByEngineerId(id),
    enabled: !!id && (options?.enabled ?? true),
  });

  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  useEffect(() => {
    if (query.isSuccess && onSuccessRef.current) {
      onSuccessRef.current(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && onErrorRef.current) {
      onErrorRef.current(query.error);
    }
  }, [query.isError, query.error]);

  return query;
}
