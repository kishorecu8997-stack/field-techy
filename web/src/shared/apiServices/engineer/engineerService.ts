import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EngineerAdapter } from "./engineerAdapter";
import type {
    EngineerData,
    EngineerPaginationParams,
    PagedResponse,
    FileUploadParams,
    FileUploadResponse,
    EngineerFile,
} from "./engineerTypes";
import { queryKeys } from "../queryKeys";

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
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: FileUploadParams) => EngineerAdapter.uploadFile(params),
        onSuccess: (data, variables) => {
            // Invalidate the engineer detail query to refetch updated file references
            queryClient.invalidateQueries({
                queryKey: queryKeys.engineer.detail(variables.engineerId)
            });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

// --- Queries ---

export function useEngineerGetById(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: queryKeys.engineer.detail(id),
        queryFn: () => EngineerAdapter.getById(id),
        enabled: !!id && (options?.enabled ?? true),
    });
}

export function useEngineerGetFiles(engineerId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...queryKeys.engineer.detail(engineerId), 'files'] as const,
        queryFn: () => EngineerAdapter.getFiles(engineerId),
        enabled: !!engineerId && (options?.enabled ?? true),
    });
}

export function useEngineerDownloadFile(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    return useMutation({
        mutationFn: ({ fileKey, fileName }: { fileKey: string; fileName?: string }) =>
            EngineerAdapter.downloadFile(fileKey, fileName),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

