import { type ClientProfilePaginationParams } from "./profiles/client/clientProfileAdapter";
import { type ClientPaginationParams } from "./client/clientTypes";

export const queryKeys = {
  client: {
    all: ["clients"] as const,
    detail: (id: string) => [...queryKeys.client.all, id] as const,
    allClients: () => [...queryKeys.client.all, "all-clients"] as const,
    list: (params: ClientPaginationParams) =>
      [...queryKeys.client.all, "list", params] as const,
  },
  engineer: {
    byId: (id: string) => `engineer-user-${id}`,
    all: ["engineers"] as const,
    detail: (id: string) => [...queryKeys.engineer.all, id] as const,
  },
  auth: {},
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
    admin: {
    notifications: {
      all: ["admin", "notifications"] as const,
      detail: (id: string) => ["admin", "notifications", id] as const,
    },
  },
} as const;