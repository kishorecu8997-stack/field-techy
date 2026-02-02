/**
 * Centralized dummy job identifiers
 * Single source of truth for all dummy job checks across the application
 */

export const DUMMY_JOB_IDS = {
  NETWORK_ENGINEER_ID: 12,
  NETWORK_ENGINEER_STRING: "dummy-j1",
} as const;

/**
 * Check if a job ID (number or string) corresponds to the dummy Network Engineer job
 * @param jobId - The job ID to check (can be number 12 or string "dummy-j1")
 * @returns true if the job is the dummy Network Engineer job
 */
export const isDummyNetworkEngineerJob = (
  jobId: number | string | undefined
): boolean => {
  if (jobId === undefined) return false;
  return (
    Number(jobId) === DUMMY_JOB_IDS.NETWORK_ENGINEER_ID ||
    String(jobId) === DUMMY_JOB_IDS.NETWORK_ENGINEER_STRING
  );
};

/**
 * Check if any job ID corresponds to a dummy job
 * @param jobId - The job ID to check
 * @returns true if the job is any dummy job
 */
export const isDummyJob = (jobId: number | string | undefined): boolean => {
  // Currently only one dummy job, but this can be expanded
  return isDummyNetworkEngineerJob(jobId);
};
