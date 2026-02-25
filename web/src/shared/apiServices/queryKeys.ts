import { type ClientPaginationParams } from "./client/clientTypes";

export const queryKeys = {
  client: {
    all: ["clients"] as const,
    detail: (id: string | number) =>
      [...queryKeys.client.all, String(id)] as const,
    allClients: () => [...queryKeys.client.all, "all-clients"] as const,
    list: (params: ClientPaginationParams) =>
      [...queryKeys.client.all, "list", params] as const,
    companyInfo: ["client", "companyInfo"] as const,
  },
  engineer: {
    byId: (id: string | number) =>
      [...queryKeys.engineer.all, String(id)] as const,
    all: ["engineers"] as const,
    detail: (id: string | number) =>
      [...queryKeys.engineer.all, String(id)] as const,
  },
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },
  clientProfile: {
    all: ["clientProfiles"] as const,
    detail: (id: string | number) =>
      [...queryKeys.clientProfile.all, String(id)] as const,
    list: (params: ClientPaginationParams) =>
      [...queryKeys.clientProfile.all, "list", params] as const,
  },
  engineerFile: {
    all: ["engineerFiles"] as const,
    byEngineer: (engineerId: string | number) =>
      [...queryKeys.engineerFile.all, String(engineerId)] as const,
  },
  admin: {
    all: ["admin"] as const,
    manageClients: ["adminManageClients"] as const,
    notifications: {
      all: ["admin", "notifications"] as const,
      detail: (id: string | number) =>
        ["admin", "notifications", String(id)] as const,
    },
    paymentTransactions: {
      all: ["admin", "paymentTransactions"] as const,
      detail: (id: string | number) =>
        ["admin", "paymentTransactions", String(id)] as const,
    },
  },
} as const;
