import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    EngineerFileAdapter,
    type EngineerFile,
    type EngineerFileDocumentType,
} from "./engineerFileAdapter";

import { queryKeys } from "@/shared/apiServices/queryKeys";

// --- Mutations ---

export function useEngineerFileUpload(options?: {
    onSuccess?: (data: EngineerFile) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            engineerId,
            documentType,
            file,
        }: {
            engineerId: string;
            documentType: EngineerFileDocumentType;
            file: File;
        }) => EngineerFileAdapter.upload(engineerId, documentType, file),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.engineerFile.byEngineer(variables.engineerId),
            });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

// --- Queries ---

export function useEngineerFilesGet(
    engineerId: string,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: queryKeys.engineerFile.byEngineer(engineerId),
        queryFn: () => EngineerFileAdapter.getFilesByEngineerId(engineerId),
        enabled: !!engineerId && (options?.enabled ?? true),
    });
}
