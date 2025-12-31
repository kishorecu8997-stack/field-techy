import type { ProfileSection } from "@/pages/engineer/user_profile/profile_completion/profileCompletionData";

/**
 * Calculates overall profile completion percentage
 */
export const getProfileCompletion = (
  profileData: ProfileSection[]
): number => {
  const totalFields = profileData.flatMap((section) => section.fields).length;

  if (totalFields === 0) return 0;

  const completedFields = profileData
    .flatMap((section) => section.fields)
    .filter((field) => field.status === "complete").length;

  return Math.round((completedFields / totalFields) * 100);
};