import { create } from "zustand";

interface TokenState {
  token: string | null;
  registeredWithServer: boolean;
  isLoading: boolean;
  error: string | null;
  updateToken: (newToken: string | null) => void;
  setRegistrationStatus: (status: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

/**
 * Zustand store for token management
 */
export const useTokenStore = create<TokenState>((set) => ({
  token: null,
  registeredWithServer: false,
  isLoading: false,
  error: null,
  updateToken: (newToken) => set({ token: newToken, error: null }),
  setRegistrationStatus: (status) => set({ registeredWithServer: status }),
  setErrorMessage: (message) => set({ error: message }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
