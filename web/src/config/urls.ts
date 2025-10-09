// config/urls.ts
/**
 * Application route URLs.
 *
 * Centralized object for all routes used in the app.
 *
 * ⚠️ For nested routes under `/home`, use RELATIVE paths (no leading slash).
 */
export const urls = {
  root: "/",
  login: "/engineer/login",
  privacy_policy: "/engineer/policy",
  home: {
    my_jobs: "/engineer/my-jobs",
    search_result: "/engineer/search-result",
    privacy_policy: "/engineer/privacy-policy",
    faq: "/engineer/faq",
    terms_and_conditions: "/engineer/terms-and-conditions",
  },
};
