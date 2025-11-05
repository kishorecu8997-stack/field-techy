import { client } from "@/dummy_data/jobDetails";

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
  ADMIN: "/admin",
  ADMIN_AUTH: "/admin/auth",
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
  },

  //Admin urls
  admin: {
    auth: {
      login: "login",
      forget_password: "forget-password",
      reset_password: "reset-password",
      otp: "otp",
    },
    home: {
      dashbaord: `${BASE.ADMIN}/dashboard`,
      manage_engineer: `${BASE.ADMIN}/users`,
      manage_client: `${BASE.ADMIN}/client`,
      manage_jobs: `${BASE.ADMIN}/jobs`,
      manage_categories: `${BASE.ADMIN}/categories`,
      manage_rate_card: `${BASE.ADMIN}/rate-card`,
      manage_payment: `${BASE.ADMIN}/revenue`,
      manage_transactions: `${BASE.ADMIN}/transaction`,
      wallet_overview: `${BASE.ADMIN}/wallet-overview`,
      wallet_transaction_requests: `${BASE.ADMIN}/wallet-requests`,
      manage_notification: `${BASE.ADMIN}/notifications`,
      manage_sub_admin: `${BASE.ADMIN}/sub-admins`,
      manage_cms: `${BASE.ADMIN}/cms`,
      settings: `${BASE.ADMIN}/settings`,
      profile: `${BASE.ADMIN}/profile`,
      received_notification: `${BASE.ADMIN}/receoved-notification`,
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
    },
    home: {
      my_jobs: `${BASE.ENGINEER}/my-jobs`,
      search_result: `${BASE.ENGINEER}/search-result`,
      faq: `${BASE.ENGINEER}/faq`,
      terms_and_conditions: `${BASE.ENGINEER}/terms-and-conditions`,
      privacy_policy: `${BASE.ENGINEER}/privacy-policy`,
    },
  },

  //Admin absolute URLs
  admin: {
    auth: {
      login: `${BASE.ADMIN_AUTH}/login`,
      forget_password: `${BASE.ADMIN_AUTH}/forget-password`,
      reset_password: `${BASE.ADMIN_AUTH}/reset-password`,
      otp: `${BASE.ADMIN_AUTH}/otp`,
    },
    home: {
      dashbaord: `${BASE.ADMIN}/dashboard`,
      manage_engineer: `${BASE.ADMIN}/users`,
      manage_client: `${BASE.ADMIN}/client`,
      manage_jobs: `${BASE.ADMIN}/jobs`,
      manage_categories: `${BASE.ADMIN}/categories`,
      manage_rate_card: `${BASE.ADMIN}/rate-card`,
      manage_payment: `${BASE.ADMIN}/revenue`,
      manage_transactions: `${BASE.ADMIN}/transaction`,
      wallet_overview: `${BASE.ADMIN}/wallet-overview`,
      wallet_transaction_requests: `${BASE.ADMIN}/wallet-requests`,
      manage_notification: `${BASE.ADMIN}/notifications`,
      manage_sub_admin: `${BASE.ADMIN}/sub-admins`,
      manage_cms: `${BASE.ADMIN}/cms`,
      settings: `${BASE.ADMIN}/settings`,
      profile: `${BASE.ADMIN}/profile`,
      received_notification: `${BASE.ADMIN}/receoved-notification`,
    },
  },
} as const;
