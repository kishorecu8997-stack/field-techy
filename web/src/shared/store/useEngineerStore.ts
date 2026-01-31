import { create } from "zustand";
import { useEffect } from "react";
import type { EngineerData } from "../apiServices/engineer/engineerTypes";
import { useUserSessionStore } from "./useUserSessionStore";
import {
  getEducation,
  getExperience,
  getPersonalInfo,
  getSkillsAndTools,
  getWorkPreference,
} from "../apiServices/engineer/engineerOpenApiService";
import { getDownloadUrl } from "../apiServices/commonOpenApiService";

interface EngineerStore {
  engineerProfile: EngineerData | null;
  profileImageUrl: string | null;
  loading: boolean;
  profileFetched: boolean;
  setEngineerProfile: (profile: EngineerData | null) => void;
  clearEngineerProfile: () => void;
  fetchEngineerProfile: (id: string) => Promise<void>;
  refetchProfile: () => Promise<void>;
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
  profileFetched: false,
  setEngineerProfile: (profile) => set({ engineerProfile: profile }),
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
  clearEngineerProfile: () => {
    const currentUrl = get().profileImageUrl;
    if (currentUrl && currentUrl.startsWith("blob:"))
      URL.revokeObjectURL(currentUrl);
    set({
      engineerProfile: null,
      profileImageUrl: null,
      profileFetched: false,
    });
  },
  syncProfile: (data) => {
    set((state) => ({
      engineerProfile: state.engineerProfile
        ? { ...state.engineerProfile, ...data }
        : (data as EngineerData),
    }));
  },
  refetchProfile: async () => {
    const id = get().engineerProfile?.id;
    if (id) await get().fetchEngineerProfile(id);
  },
  fetchEngineerProfile: async (id: string) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      // Fetch ALL profile related data in parallel
      const [
        personalInfo,
        educationList,
        experienceList,
        skillsTools,
        workPref,
        profilePicData,
      ] = await Promise.all([
        getPersonalInfo(),
        getEducation(),
        getExperience(),
        getSkillsAndTools(),
        getWorkPreference(),
        getDownloadUrl("profilePicture").catch(() => null),
      ]);

      const profile: EngineerData = {
        id, // Maintain ID from session/argument
        fullName: personalInfo.name,
        email: personalInfo.email,
        phoneNumber: personalInfo.mobileno,
        address: personalInfo.address,
        serviceCategory: workPref.serviceCategoryId,
        rate: workPref.hourlyRate,
        portfolioLink: workPref.portfolioLink,
        jobSkills: skillsTools.skills.map((s: { name: string }) => s.name),
        tools: skillsTools.tools.map((t: { name: string }) => t.name),
        preferredWorkType: workPref.employmentTypeId?.toString(),
        educations: educationList.map((edu) => ({
          id: edu.id.toString(),
          educationLevel: edu.level.toString(),
          course: edu.course,
          university: edu.university,
          majorSubject: edu.majorSubject,
          passingYear: edu.passingYear,
        })),
        experiences: experienceList.map((exp) => ({
          id: exp.id.toString(),
          designation: exp.designation || "",
          employer: exp.employer || "",
          employmentType: exp.employmentTypeId?.toString() || "",
          workLocationType: exp.workLocationId?.toString() || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          isCurrent: !exp.endDate,
        })),
      };

      set({
        engineerProfile: profile,
        profileFetched: true,
        profileImageUrl: profilePicData?.downloadUrl || null,
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
    if (
      userId &&
      session?.role?.toUpperCase() === "ENGINEER" &&
      !profileFetched &&
      !loading
    ) {
      fetchProfile(userId);
    }
  }, [session?.userId, session?.role, profileFetched, loading, fetchProfile]);

  return profile;
};
