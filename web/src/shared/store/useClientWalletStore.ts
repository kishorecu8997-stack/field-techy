import { create } from "zustand";
import { useEffect } from "react";
import { getClientBalance } from "@/api";
import { apiClient } from "@/shared/apiServices/apiClient";
import { useUserSessionStore } from "./useUserSessionStore";
import type { GetClientBalanceResponse } from "@/api";

interface ClientWalletStore {
    balanceArr: GetClientBalanceResponse | null;
    loading: boolean;
    fetched: boolean;
    fetchBalance: () => Promise<void>;
    clearBalance: () => void;
}

export const useClientWalletStore = create<ClientWalletStore>((set, get) => ({
    balanceArr: null,
    loading: false,
    fetched: false,
    fetchBalance: async () => {
        if (get().loading) return;
        set({ loading: true });
        try {
            const response = await getClientBalance({
                client: apiClient,
                throwOnError: true,
            });
            set({ balanceArr: response.data ?? null, fetched: true });
        } catch (error) {
            console.error("Failed to fetch client balance:", error);
        } finally {
            set({ loading: false });
        }
    },
    clearBalance: () => set({ balanceArr: null, fetched: false }),
}));

/**
 * Custom hook to get the client balance.
 * Automatically triggers a fetch from the API if the balance is missing
 * but we have a valid session ID.
 */
export const useClientBalanceStoreSync = (enabled: boolean = true) => {
    const session = useUserSessionStore((state) => state.session);
    const balanceArr = useClientWalletStore((state) => state.balanceArr);
    const fetched = useClientWalletStore((state) => state.fetched);
    const loading = useClientWalletStore((state) => state.loading);
    const fetchBalance = useClientWalletStore((state) => state.fetchBalance);

    useEffect(() => {
        const role = session?.role;
        if (enabled && (role === "CLIENT" || role === "client")) {
            if (!fetched && !loading) {
                fetchBalance();
            }
        }
    }, [session?.role, fetched, loading, fetchBalance, enabled]);

    // Support typical react query destructuring `{ data, isLoading, refetch }`
    return {
        data: balanceArr,
        isLoading: loading,
        refetch: fetchBalance,
    };
};
