import { type ClientProfilePaginationParams } from "./profiles/client/clientProfileAdapter";

export const queryKeys = {
    client: {
        byId: (id: string) => `client-user-${id}`,
    },
    engineer: {
        byId: (id: string) => `engineer-user-${id}`,
        all: ["engineers"] as const,
        detail: (id: string) => [...queryKeys.engineer.all, id] as const,
    },
    auth: {

    },
    clientProfile: {
        all: ["clientProfiles"] as const,
        detail: (id: string) => [...queryKeys.clientProfile.all, id] as const,
        list: (params: ClientProfilePaginationParams) =>
            [...queryKeys.clientProfile.all, "list", params] as const,
    },
    engineerFile: {
        all: ["engineerFiles"] as const,
        byEngineer: (engineerId: string) =>
            [...queryKeys.engineerFile.all, engineerId] as const,
    },
} as const;