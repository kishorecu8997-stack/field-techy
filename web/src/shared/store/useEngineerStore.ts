import { create } from "zustand";
import { useEffect } from "react";
import type {
  EngineerData,
} from "../apiServices/engineer/engineerTypes";
import { useUserSessionStore } from "./useUserSessionStore";
import { getEducation, getPersonalInfo } from "../apiServices/engineer/engineerOpenApiService";
import { getDownloadUrl } from "../apiServices/commonOpenApiService";

interface EngineerStore {
  engineerProfile: EngineerData | null;
  profileImageUrl: string | null;
  loading: boolean;
  profileFetched: boolean; // Add this flag
  setEngineerProfile: (profile: EngineerData | null) => void;
  clearEngineerProfile: () => void;
  fetchEngineerProfile: (id: string) => Promise<void>;
  syncProfile: (data: Partial<EngineerData>) => void;
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
  profileFetched: false, // Initialize to false
  setEngineerProfile: (profile) => set({ engineerProfile: profile }),
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
  clearEngineerProfile: () => {
    const currentUrl = get().profileImageUrl;
    if (currentUrl && currentUrl.startsWith('blob:')) URL.revokeObjectURL(currentUrl);
    set({ engineerProfile: null, profileImageUrl: null, profileFetched: false });
  },
  syncProfile: (data) => {
    set((state) => ({
      engineerProfile: state.engineerProfile 
        ? { ...state.engineerProfile, ...data } 
        : (data as EngineerData)
    }));
  },
  fetchEngineerProfile: async (id: string) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      // Call new API services from engineerOpenApiService
      const [personalInfo, educationList, profilePicData] = await Promise.all([
        getPersonalInfo(),
        getEducation(),
        getDownloadUrl("profilePicture").catch(() => null),
      ]);

      const profile: EngineerData = {
        id, // Maintain ID from session/argument
        fullName: personalInfo.name,
        email: personalInfo.email,
        phoneNumber: personalInfo.mobileno,
        address: personalInfo.address,
        educations: educationList.map(edu => ({
          id: edu.id.toString(),
          educationLevel: edu.level.toString(),
          course: edu.course,
          university: edu.university,
          majorSubject: edu.majorSubject,
          passingYear: edu.passingYear
        }))
      };

      set({ 
        engineerProfile: profile, 
        profileFetched: true,
        profileImageUrl: profilePicData?.downloadUrl || null
      });
     
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
  const profileFetched = useEngineerStore((state) => state.profileFetched);
  const loading = useEngineerStore((state) => state.loading);
  const fetchProfile = useEngineerStore((state) => state.fetchEngineerProfile);

  useEffect(() => {
    const userId = session?.userId;
    if (userId && !profileFetched && !loading) {
      fetchProfile(userId);
    }
  }, [session?.userId, profileFetched, loading, fetchProfile]);

  return profile;
};
