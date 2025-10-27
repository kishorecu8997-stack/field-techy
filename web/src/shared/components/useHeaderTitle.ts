import { useMemo } from 'react';

const titleMap: Record<string, string> = {
  myAccount: 'My Account',
  profile: 'My Profile',
  personalInfo: 'Personal Information',
  education: 'Education',
  addEducation: 'Add Education',
  editEducation: 'Edit Education',
  skillsAndTools: 'Skills and Tools',
  addSkills: 'Add Skills',
  editSkills: 'Edit Skills',
  addTools: 'Add Tools',
  editTools: 'Edit Tools',
  experiences: 'Experiences',
  addExperiences: 'Add Experiences',
  editExperiences: 'Edit Experiences',
  workPreference: 'Work Preference',
  documents: 'Documents',
  editDocument: 'Edit Document',
  settings: 'Settings',
  jobs: 'My Jobs',
  earning: 'My Earning',
  saved: 'Saved Jobs',
};

/**
 * A hook to get the header title for the current drawer section.
 * @param key - The key of the current section.
 * @returns The title for the header.
 */
export const useHeaderTitle = (key: string): string => {
  const title = useMemo(() => titleMap[key.split('-')[0]] || 'My Account', [key]);
  return title;
};