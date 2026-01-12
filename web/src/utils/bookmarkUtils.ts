import type { JobItem } from "@/pages/engineer/home/types";
export type SavedJob = JobItem;
const STORAGE_KEY = "saved_jobs_engineer";
export const BOOKMARK_CHANGE_EVENT = "bookmarkChange";

export const getSavedJobs = (): SavedJob[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const addSavedJob = (job: SavedJob) => {
  const savedJobs = getSavedJobs();
  if (!savedJobs.some((j) => j.id === job.id)) {
    savedJobs.push(job);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs));
    window.dispatchEvent(new Event(BOOKMARK_CHANGE_EVENT));
  }
};

export const removeSavedJob = (jobId: string | number) => {
  const savedJobs = getSavedJobs().filter((j) => j.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs));

  window.dispatchEvent(new Event(BOOKMARK_CHANGE_EVENT));
};

export const isJobSaved = (jobId: string | number): boolean => {
  return getSavedJobs().some((j) => j.id === jobId);
};

export const toggleSavedJob = (job: SavedJob) => {
  if (isJobSaved(job.id)) {
    removeSavedJob(job.id);
  } else {
    addSavedJob(job);
  }

  window.dispatchEvent(new Event(BOOKMARK_CHANGE_EVENT));
};
