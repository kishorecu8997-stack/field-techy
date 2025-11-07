

/**
 * Application route URLs.
 *
 * Centralized object for all routes used in the app.
 *
 * ✅ Best Practices:
 * - Use absolute paths for linking
 * - Use relative paths only for route definitions
 * - Group related routes under common base
 * - Use consistent naming
 */
export const BASE = {
  CLIENT: "/client",
  CLIENT_AUTH: "/client/auth",
  ENGINEER: "/engineer",
  AUTH: "/engineer/auth", 
} as const;

export const urls = {
  engineer: {
    base: BASE.ENGINEER,
    privacy_policy: `${BASE.ENGINEER}/policy`,

    home: {
      my_jobs: "my-jobs",
      search_result: "search-result",
      faq: "faq",
      terms_and_conditions: "terms-and-conditions",
      privacy_policy: "privacy-policy",
      about_app: "about-app",
    },
    auth: {
      login: "login",
      signup: "signup",
      profile_setup: "profile-setup",
      forget_password: "forget-password",
      reset_password: "reset-password",
      set_password: "set-password",
      background_verification: "background-verification",
    },
  },
  client: {
    base: BASE.CLIENT,
    privacy_policy: `${BASE.CLIENT}/policy`,

    home: {
      dashboard: "dashboard",
      my_jobs: "my-jobs",
      explore_engineers: "explore-engineers",
      manage_proposal: "manage-proposals",
      post_JobPage: "post-job",
      search_result: "search-result",
      faq: "faq",
      terms_and_conditions: "terms-and-conditions",
      privacy_policy: "privacy-policy",
      messages:"messages",
    },
    auth: {
      login: "login",
      signup: "signup",
      profile_setup: "profile-setup",
      forget_password: "forget-password",
      reset_password: "reset-password",
      set_password: "set-password",
      background_verification: "background-verification",
    },
  },
} as const;

// ✅ Helper for absolute paths (for navigation/linking)
export const absoluteUrls = {
  engineer: {
    auth: {
      login: `${BASE.AUTH}/login`,
      signup: `${BASE.AUTH}/signup`,
      profile_setup: `${BASE.AUTH}/profile-setup`,
      forget_password: `${BASE.AUTH}/forget-password`,
      reset_password: `${BASE.AUTH}/reset-password`,
      set_password: `${BASE.AUTH}/set-password`,
      background_verification: `${BASE.AUTH}/background-verification`,
      privacy_policy: `${BASE.AUTH}/policy`,
      about_app: `${BASE.AUTH}/about-app`,
    },
    home: {
      my_jobs: `${BASE.ENGINEER}/my-jobs`,
      search_result: `${BASE.ENGINEER}/search-result`,
      faq: `${BASE.ENGINEER}/faq`,
      terms_and_conditions: `${BASE.ENGINEER}/terms-and-conditions`,
      privacy_policy: `${BASE.ENGINEER}/privacy-policy`,
      about_app: `${BASE.ENGINEER}/about-app`,
    },
  },
  client: {
    auth: {
      login: `${BASE.CLIENT_AUTH}/login`,
      signup: `${BASE.CLIENT_AUTH}/signup`,
      profile_setup: `${BASE.CLIENT_AUTH}/profile-setup`,
      forget_password: `${BASE.CLIENT_AUTH}/forget-password`,
      reset_password: `${BASE.CLIENT_AUTH}/reset-password`,
      set_password: `${BASE.CLIENT_AUTH}/set-password`,
      background_verification: `${BASE.CLIENT_AUTH}/background-verification`,
      privacy_policy: `${BASE.CLIENT_AUTH}/policy`,
    },
    home: {
      dashboard: `${BASE.CLIENT}/dashboard`,
      my_jobs: `${BASE.CLIENT}/my-jobs`,
      explore_engineers: `${BASE.CLIENT}/explore-engineers`,
      manage_proposal: `${BASE.CLIENT}/manage-proposals`,
      post_JobPage: `${BASE.CLIENT}/post-job`,
      search_result: `${BASE.CLIENT}/search-result`,
      faq: `${BASE.CLIENT}/faq`,
      terms_and_conditions: `${BASE.CLIENT}/terms-and-conditions`,
      privacy_policy: `${BASE.CLIENT}/privacy-policy`,
    },
  },
} as const;
