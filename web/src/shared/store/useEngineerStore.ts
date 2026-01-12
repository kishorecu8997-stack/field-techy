import { create } from "zustand";
import { useEffect } from "react";
import type {
  EngineerData,
  EngineerFile,
} from "../apiServices/engineer/engineerTypes";
import { EngineerAdapter } from "../apiServices/engineer/engineerAdapter";
import { useUserSessionStore } from "./useUserSessionStore";

interface EngineerStore {
  engineerProfile: EngineerData | null;
  profileImageUrl: string | null;
  loading: boolean;
  setEngineerProfile: (profile: EngineerData | null) => void;
  clearEngineerProfile: () => void;
  fetchEngineerProfile: (id: string) => Promise<void>;
  setProfileImageUrl: (url: string | null) => void;
}

/**
 * Store for managing engineer-specific profile data.
 * This store is NOT persisted to localStorage for security/privacy.
 * Data is re-fetched from the API on page refresh via useEngineerProfile hook.
 */
export const useEngineerStore = create<EngineerStore>((set, get) => ({
  engineerProfile: null,
  profileImageUrl: null,
  loading: false,
  setEngineerProfile: (profile) => set({ engineerProfile: profile }),
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
  clearEngineerProfile: () => {
    const currentUrl = get().profileImageUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    set({ engineerProfile: null, profileImageUrl: null });
  },
  fetchEngineerProfile: async (id: string) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const [profile, files] = await Promise.all([
        EngineerAdapter.getById(id),
        EngineerAdapter.getFiles(id),
      ]);

      set({ engineerProfile: profile });

      const profilePic = files.find(
        (f: EngineerFile) => f.fileType === "PICTURE",
      );

      if (profilePic) {
        try {
          const { blob } = await EngineerAdapter.downloadFileStream(
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
        set({ profileImageUrl: null });
      }
    } catch (error) {
      console.error("Failed to fetch engineer profile:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

/**
 * Custom hook to get the engineer profile.
 * Automatically triggers a fetch from the API if the profile is missing or incomplete
 * but we have a valid session ID.
 */
export const useEngineerProfile = () => {
  const session = useUserSessionStore((state) => state.session);
  const profile = useEngineerStore((state) => state.engineerProfile);
  const fetchProfile = useEngineerStore((state) => state.fetchEngineerProfile);

  useEffect(() => {
    const userId = session?.userId;
    if (userId) {
      // Fetch if no profile exists, or if the profile only has an ID (persisted state)
      // We use !profile.fullName as a check for "full data"
      if (!profile || (profile.id === userId && !profile.fullName)) {
        fetchProfile(userId);
      }
    }
  }, [session?.userId, profile?.id, profile?.fullName, fetchProfile]);

  return profile;
};
