

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
} as const;