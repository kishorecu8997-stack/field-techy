import { type ClientPaginationParams } from "./client/clientTypes";

const clientBaseKey = ["clients"] as const;
const engineerBaseKey = ["engineers"] as const;

export const queryKeys = {
  client: {
    all: clientBaseKey,
    detail: (id: string | number) => [...clientBaseKey, String(id)] as const,
    allClients: () => [...clientBaseKey, "all-clients"] as const,
    list: (params: ClientPaginationParams) =>
      [...clientBaseKey, "list", params] as const,
    companyInfo: [...clientBaseKey, "company-info"] as const,
    balance: [...clientBaseKey, "balance"] as const,
  },
  engineer: {
    byId: (id: string | number) => [...engineerBaseKey, String(id)] as const,
    all: engineerBaseKey,
    detail: (id: string | number) => [...engineerBaseKey, String(id)] as const,
    adminById: (id: number) => ["admin", "engineer", id] as const,
    jobLogs: (assignmentId: number) =>
      ["engineer", "jobLogs", assignmentId] as const,
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
    exchangeRates: ["adminExchangeRates"] as const,
    rateCards: {
      all: ["admin", "rateCards"] as const,
      detail: (id: number) => ["admin", "rateCards", id] as const,
    },
    serviceCategories: {
      all: ["admin", "serviceCategories"] as const,
    },
    manageEngineers: ["adminManageEngineers"] as const,
    adminGetClient: ["adminGetClient"] as const,
    adminGetEngineer: ["adminGetEngineer"] as const,
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
  notifications: {
    all: ["notifications"] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
  },
} as const;
