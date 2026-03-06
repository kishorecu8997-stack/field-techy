import { create } from "zustand";
import { getClientBalance } from "@/api";
import { apiClient } from "@/shared/apiServices/apiClient";
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
