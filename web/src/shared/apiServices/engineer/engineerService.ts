import type { basicDetails } from "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/types";
import type { LoginFormData } from "@/pages/engineer/auth/components/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EngineerAdapter } from "./engineerAdapter";

export const ENGINEER_QUERY_KEYS = {
    all: ["engineers"] as const,
    detail: (id: string) => [...ENGINEER_QUERY_KEYS.all, id] as const,
};

export function useEngineerSignup(options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) {
    return useMutation({
        mutationFn: (data: basicDetails) => EngineerAdapter.signup(data),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

export function useEngineerSignin(options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}) {
    return useMutation({
        mutationFn: (data: LoginFormData) => EngineerAdapter.signin(data),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

export function useEngineerGetById(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ENGINEER_QUERY_KEYS.detail(id),
        queryFn: () => EngineerAdapter.getById(id),
        enabled: !!id && (options?.enabled ?? true),
    });
}

export function useEngineerDelete(options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => EngineerAdapter.delete(id),
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ENGINEER_QUERY_KEYS.all });
             options?.onSuccess?.();
        },
        onError: options?.onError,
    });
}
