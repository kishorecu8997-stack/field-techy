import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientAdapter } from "./clientAdapter";
import type {
  ClientData,
  ClientPaginationParams,
  PagedResponse,
  ClientFile,
  ClientFileUploadParams,
  FileUploadResponse,
} from "./clientTypes";
import { queryKeys } from "../queryKeys";

// --- Mutations ---

export function useClientSignup(options?: {
  onSuccess?: (data: ClientData) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClientData) => ClientAdapter.signup(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientUpdate(options?: {
  onSuccess?: (data: ClientData) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientData }) =>
      ClientAdapter.update(id, data),
    onSuccess: (data) => {
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.client.detail(data.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientDelete(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ClientAdapter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

// --- Queries ---

export function useClientGetById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.client.detail(id),
    queryFn: () => ClientAdapter.getById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useGetAllClients(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.client.allClients(),
    queryFn: () => ClientAdapter.getAllClients(),
    enabled: options?.enabled ?? true,
  });
}

export function useClientGetAll(
  params: ClientPaginationParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.client.list(params),
    queryFn: () => ClientAdapter.getAll(params),
    enabled: options?.enabled ?? true,
  });
}

// --- File Operations ---

export function useClientGetFiles(clientId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.client.detail(clientId), 'files'] as const,
    queryFn: () => ClientAdapter.getFiles(clientId),
    enabled: !!clientId && (options?.enabled ?? true),
  });
}

export function useClientFileUpload(options?: {
  onSuccess?: (data: FileUploadResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ClientFileUploadParams) => ClientAdapter.uploadFile(params),
    onSuccess: (data, variables) => {
      // Invalidate the client detail query to refetch updated file references
      queryClient.invalidateQueries({
        queryKey: queryKeys.client.detail(variables.clientId)
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useClientDeleteFile(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => ClientAdapter.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.client.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useClientDownloadFile(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: ({ fileKey, fileName }: { fileKey: string; fileName?: string }) =>
      ClientAdapter.downloadFile(fileKey, fileName),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
