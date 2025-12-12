import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ClientProfileAdapter,
    type ClientProfileData,
    type ClientProfilePaginationParams,
} from "./clientProfileAdapter";

import { queryKeys } from "@/shared/apiServices/queryKeys";

// --- Mutations ---

export function useClientProfileCreate(options?: {
    onSuccess?: (data: ClientProfileData) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ClientProfileData) => ClientProfileAdapter.create(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.clientProfile.all });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

export function useClientProfileUpdate(options?: {
    onSuccess?: (data: ClientProfileData) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ClientProfileData }) =>
            ClientProfileAdapter.update(id, data),
        onSuccess: (data) => {
            if (data.id) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.clientProfile.detail(data.id),
                });
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.clientProfile.all });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

export function useClientProfileDelete(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => ClientProfileAdapter.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.clientProfile.all });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
}

// --- Queries ---

export function useClientProfileGetById(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: queryKeys.clientProfile.detail(id),
        queryFn: () => ClientProfileAdapter.getById(id),
        enabled: !!id && (options?.enabled ?? true),
    });
}

export function useClientProfileGetAll(
    params: ClientProfilePaginationParams = {},
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: queryKeys.clientProfile.list(params),
        queryFn: () => ClientProfileAdapter.getAll(params),
        enabled: options?.enabled ?? true,
    });
}
