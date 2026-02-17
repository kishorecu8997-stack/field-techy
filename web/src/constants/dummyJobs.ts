/**
 * Centralized dummy job identifiers
 * Single source of truth for all dummy job checks across the application
 */

import personImage from "@/assets/dummy/person.jpg";

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
  jobId: number | string | undefined,
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

/**
 * Dummy client feedback data for the Network Engineer job
 */
export const DUMMY_CLIENT_FEEDBACK = {
  clientName: "Kraft and Co",
  clientImage: personImage,
  rating: 4,
  review: "A software demonstration video is a guided tour of your product in action. Instead of telling people what your software does and A software demonstration video is a guided tour of your product in action. Instead of telling people what your software does",
} as const;

/**
 * Dummy engineer feedback data for the Network Engineer job (client view)
 */
export const DUMMY_ENGINEER_FEEDBACK_LIST = [
  {
    id: "engineer-1",
    engineerName: "Alex Kumar",
    engineerImage: personImage,
    rating: 4,
    review: "Great experience working with the client. The project requirements were clear and communication was excellent throughout. Looking forward to future collaborations on similar network infrastructure projects.",
  },
  {
    id: "engineer-2",
    engineerName: "Sarah Johnson",
    engineerImage: personImage,
    rating: 4,
    review: "Professional and organized client. The work environment was supportive and all necessary resources were provided on time. The project was completed smoothly with proper guidance and feedback.",
  },
  {
    id: "engineer-3",
    engineerName: "Michael Chen",
    engineerImage: personImage,
    rating: 4,
    review: "Excellent client to work with. Clear expectations, timely payments, and good understanding of technical requirements. Would definitely recommend working with this client for network engineering projects.",
  },
] as const;
