import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClientAdapter,
  type ClientData,
  type ClientPaginationParams,
} from "./clientAdapter";

export const CLIENT_QUERY_KEYS = {
  all: ["clients"] as const,
  detail: (id: string) => [...CLIENT_QUERY_KEYS.all, id] as const,
  list: (params: ClientPaginationParams) =>
    [...CLIENT_QUERY_KEYS.all, "list", params] as const,
};

// --- Mutations ---


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
  onError?: (error: unknown) => void;
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
