import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EngineerData } from "../apiServices/engineer/engineerTypes";

interface EngineerStore {
  engineerProfile: EngineerData | null;
  setEngineerProfile: (profile: EngineerData | null) => void;
  clearEngineerProfile: () => void;
}

/**
 * Store for managing engineer-specific profile data.
 * Persists the profile information in storage.
 */
export const useEngineerStore = create<EngineerStore>()(
  persist(
    (set) => ({
      engineerProfile: null,
      setEngineerProfile: (profile) => set({ engineerProfile: profile }),
      clearEngineerProfile: () => set({ engineerProfile: null }),
    }),
    {
      name: "engineer-profile-storage",
    }
  )
);
