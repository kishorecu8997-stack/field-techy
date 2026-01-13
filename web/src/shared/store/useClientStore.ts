import { create } from "zustand";
import { useEffect } from "react";
import type { ClientData, ClientFile } from "../apiServices/client/clientTypes";
import { ClientAdapter } from "../apiServices/client/clientAdapter";
import { useUserSessionStore } from "./useUserSessionStore";

interface ClientStore {
  clientProfile: ClientData | null;
  profileImageUrl: string | null;
  loading: boolean;
  setClientProfile: (profile: ClientData | null) => void;
  clearClientProfile: () => void;
  fetchClientProfile: (id: string) => Promise<void>;
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
  setClientProfile: (profile) => set({ clientProfile: profile }),
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
  clearClientProfile: () => {
    const currentUrl = get().profileImageUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    set({ clientProfile: null, profileImageUrl: null });
  },
  fetchClientProfile: async (id: string) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      // Fetch profile and files in parallel
      const [profile, files] = await Promise.all([
        ClientAdapter.getById(id),
        ClientAdapter.getFiles(id),
      ]);

      set({ clientProfile: profile });

      // Find profile picture
      const profilePic = files.find(
        (f: ClientFile) => f.fileType === "PROFILE_PICTURE",
      );

      if (profilePic) {
        try {
          const { blob } = await ClientAdapter.downloadFileStream(
            profilePic.fileKey,
          );
          const oldUrl = get().profileImageUrl;
          if (oldUrl) URL.revokeObjectURL(oldUrl);

          const url = URL.createObjectURL(blob);
          set({ profileImageUrl: url });
        } catch (err) {
          console.error("Failed to download profile picture", err);
        }
      } else {
        const oldUrl = get().profileImageUrl;
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        set({ profileImageUrl: null });
      }
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
  const fetchProfile = useClientStore((state) => state.fetchClientProfile);

  useEffect(() => {
    const userId = session?.userId;
    // Verify user role is CLIENT to avoid incorrect fetches
    if (userId && session?.role === "CLIENT") {
      if (!profile || (profile.id === userId && !profile.contactPersonName)) {
        fetchProfile(userId);
      }
    }
  }, [session?.userId, session?.role, profile, fetchProfile]);

  return profile;
};
