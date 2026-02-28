import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminCountryState {
  regionId: string | null;
  regionName: string | null;
  setRegion: (id: string | null, name: string | null) => void;
  clearRegion: () => void;
}

export const useAdminCountryStore = create<AdminCountryState>()(
  persist(
    (set) => ({
      regionId: null,
      regionName: null,
      setRegion: (id, name) => set({ regionId: id, regionName: name }),
      clearRegion: () => set({ regionId: null, regionName: null }),
    }),
    {
      name: "admin-country-storage",
    },
  ),
);
