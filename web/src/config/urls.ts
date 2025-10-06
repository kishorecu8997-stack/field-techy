// config/urls.ts
/**
 * Application route URLs.
 *
 * Centralized object for all routes used in the app.
 *
 * ⚠️ For nested routes under `/home`, use RELATIVE paths (no leading slash).
 */
export const urls = {
  login: "/",
  home: {
    root: "/home",
    my_jobs: "/my-jobs",
    my_job_details: "/my-job-details",
  },
};
