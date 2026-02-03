import { create } from "zustand";
import { useEffect } from "react";
import type { ClientData } from "../apiServices/client/clientTypes";
import { useUserSessionStore } from "./useUserSessionStore";
import { getDownloadUrl } from "../apiServices/commonOpenApiService";

interface ClientStore {
  clientProfile: ClientData | null;
  profileImageUrl: string | null;
  loading: boolean;
  profileFetched: boolean; // Add this
  setClientProfile: (profile: ClientData | null) => void;
  clearClientProfile: () => void;
  fetchClientProfile: () => Promise<void>;
  setProfileImageUrl: (url: string | null) => void;
}

/**
 * Store for managing client-specific profile data.
 * This store is NOT persisted to localStorage for security/privacy.
 * Data is re-fetched from the API on page refresh via useClientProfile hook.
 */
export const useClientStore = create<ClientStore>((set, get) => ({
  clientProfile: null,
  profileImageUrl: null,
  loading: false,
  profileFetched: false,
  setClientProfile: (profile) => set({ clientProfile: profile }),
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
  clearClientProfile: () => {
    const currentUrl = get().profileImageUrl;
    if (currentUrl && currentUrl.startsWith("blob:"))
      URL.revokeObjectURL(currentUrl);
    set({ clientProfile: null, profileImageUrl: null, profileFetched: false });
  },
  fetchClientProfile: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      // Fetch profile and files in parallel
      const profilePicData = await getDownloadUrl("profilePicture").catch(
        () => null,
      );

      set({
        profileFetched: true,
        profileImageUrl: profilePicData?.downloadUrl || null,
      });
    } catch (error) {
      console.error("Failed to fetch client profile:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

/**
 * Custom hook to get the client profile.
 * Automatically triggers a fetch from the API if the profile is missing
 * but we have a valid session ID.
 */
export const useClientProfile = () => {
  const session = useUserSessionStore((state) => state.session);
  const profile = useClientStore((state) => state.clientProfile);
  const profileFetched = useClientStore((state) => state.profileFetched);
  const loading = useClientStore((state) => state.loading);
  const fetchProfile = useClientStore((state) => state.fetchClientProfile);

  useEffect(() => {
    const userId = session?.userId;
    // Verify user role is CLIENT to avoid incorrect fetches
    if (userId && session?.role === "CLIENT") {
      if (!profileFetched && !loading) {
        fetchProfile();
      }
    }
  }, [session?.userId, session?.role, profileFetched, loading, fetchProfile]);

  return profile;
};
