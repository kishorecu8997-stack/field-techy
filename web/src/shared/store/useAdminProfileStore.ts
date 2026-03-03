import { create } from "zustand";
import { useEffect } from "react";
import { useUserSessionStore } from "./useUserSessionStore";
import { getAdminPersonalInfo } from "../apiServices/admin/adminOpenApiService";
import { getDownloadUrl } from "../apiServices/commonOpenApiService";
import { toast } from "react-toastify";

interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | null;
}

interface AdminProfileState {
  adminProfile: AdminProfile | null;
  loading: boolean;
  profileFetched: boolean;
  setAdminProfile: (profile: AdminProfile | null) => void;
  updateAdminProfile: (updates: Partial<AdminProfile>) => void;
  clearAdminProfile: () => void;
  syncProfile: (data: Partial<AdminProfile>) => void;
  fetchAdminProfile: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

export const useAdminProfileStore = create<AdminProfileState>((set, get) => ({
  adminProfile: null,
  loading: false,
  profileFetched: false,
  setAdminProfile: (profile) => set({ adminProfile: profile }),
  updateAdminProfile: (updates) =>
    set((state) => ({
      adminProfile: state.adminProfile
        ? { ...state.adminProfile, ...updates }
        : null,
    })),
  clearAdminProfile: () => {
    set({ adminProfile: null, profileFetched: false });
  },
  syncProfile: (data) => {
    set((state) => ({
      adminProfile: state.adminProfile
        ? { ...state.adminProfile, ...data }
        : (data as AdminProfile),
    }));
  },
  fetchAdminProfile: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const [personalInfo, profilePicData] = await Promise.all([
        getAdminPersonalInfo(),
        getDownloadUrl("profilePicture").catch(() => null),
      ]);

      const profile: AdminProfile = {
        id: "",
        fullName: personalInfo.name || "",
        email: personalInfo.email || "",
        phoneNumber: personalInfo.phoneNumber || "",
        profilePicture: profilePicData?.downloadUrl || null,
      };

      set({
        adminProfile: profile,
        profileFetched: true,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile fetch failed",
      );
    } finally {
      set({ loading: false });
    }
  },
  refetchProfile: async () => {
    await get().fetchAdminProfile();
  },
}));

/**
 * Custom hook to get the admin profile.
 * Automatically triggers a fetch from the API if the profile is missing.
 */
export const useAdminProfile = () => {
  const session = useUserSessionStore((state) => state.session);
  const profile = useAdminProfileStore((state) => state.adminProfile);
  const profileFetched = useAdminProfileStore((state) => state.profileFetched);
  const fetchProfile = useAdminProfileStore((state) => state.fetchAdminProfile);

  useEffect(() => {
    // Read `loading` directly from store state to avoid subscribing to it
    // (subscribing causes 2 extra re-renders per fetch: true → false)
    const { loading } = useAdminProfileStore.getState();
    if (
      session?.accessToken &&
      session?.role?.toUpperCase() === "ADMIN" &&
      !profileFetched &&
      !loading
    ) {
      fetchProfile();
    }
  }, [session?.accessToken, session?.role, profileFetched, fetchProfile]);

  return profile;
};
