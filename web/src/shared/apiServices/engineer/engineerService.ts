import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { EngineerAdapter } from "./engineerAdapter";
import type {
    CompleteRegistrationData,
    LoginFormData,
} from "@/pages/engineer/auth/components/types";

export const ENGINEER_QUERY_KEYS = {
    all: ["engineers"] as const,
    detail: (id: string) => [...ENGINEER_QUERY_KEYS.all, id] as const,
};

export function useEngineerSignup(
    options?: UseMutationOptions<unknown, Error, CompleteRegistrationData>
) {
    return useMutation({
        mutationFn: (data: CompleteRegistrationData) =>
            EngineerAdapter.signup(data),
        ...options,
    });
}

export function useEngineerSignin(
    options?: UseMutationOptions<unknown, Error, LoginFormData>
) {
    return useMutation({
        mutationFn: (data: LoginFormData) => EngineerAdapter.signin(data),
        ...options,
    });
}

export function useEngineerGetById(
    id: string,
    options?: Partial<UseQueryOptions<unknown, Error>>
) {
    return useQuery({
        queryKey: ENGINEER_QUERY_KEYS.detail(id),
        queryFn: () => EngineerAdapter.getById(id),
        enabled: !!id,
        ...options,
    });
}

export function useEngineerDelete(
    options?: UseMutationOptions<void, Error, string>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => EngineerAdapter.delete(id),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ENGINEER_QUERY_KEYS.all });
            options?.onSuccess?.(...args);
        },
    });
}
