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
 *
 * this should be use to app routes definitions etc.
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
      dashboard: "dashboard",
      my_jobs: "my-jobs",
      search_result: "search-result",
      faq: "faq",
      terms_and_conditions: "terms-and-conditions",
      privacy_policy: "privacy-policy",
      about_app: "about-app",
      explore_jobs: "explore-jobs",
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
    },
    auth: {
      login: "login",
      signup: "signup",
      account_type: "account-type",
      profile_setup: "profile-setup",
      forget_password: "forget-password",
      reset_password: "reset-password",
      set_password: "set-password",
      background_verification: "background-verification",
    },
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
      dashbaord: "dashboard",
      manage_engineer: "users",
      manage_engineer_add: "users/add",
      manage_engineer_edit: "users/edit",
      manage_engineer_view: "users/view",
      manage_client: "client",
      manage_jobs: "jobs",
      manage_categories: "categories",
      manage_categories_add: "categories/add",
      manage_categories_edit: "categories/edit",
      manage_rate_card: "rate-card",
      edit_role: "edit-role",
      manage_notification_add: "notifications/add",
      manage_payment: "revenue",
      manage_transactions: "transaction",
      wallet_overview: "wallet-overview",
      wallet_transaction_requests: "wallet-requests",
      manage_notification: "notifications",
      manage_sub_admin: "sub-admins",
      manage_sub_admin_add: "sub-admins/add",
      manage_sub_admin_edit: "sub-admins/edit",
      manage_cms: "cms",
      settings: "settings",
      profile: "profile",
      received_notification: "received-notification",
      roleList: "roles",
      edit_rate_card: "rate-card/edit",
      view_rate_card: "rate-card/view",
      add_rate_card: "rate-card/add",
      jobOffer: "job-offer",
    },
  },
} as const;

// ✅ Helper for absolute paths (for navigation/linking) it should be use to button links, anchor hrefs, router navigation, etc.
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
      dashboard: `${BASE.ENGINEER}/dashboard`,
      my_jobs: `${BASE.ENGINEER}/my-jobs`,
      search_result: `${BASE.ENGINEER}/search-result`,
      faq: `${BASE.ENGINEER}/faq`,
      terms_and_conditions: `${BASE.ENGINEER}/terms-and-conditions`,
      privacy_policy: `${BASE.ENGINEER}/privacy-policy`,
      about_app: `${BASE.ENGINEER}/about-app`,
      explore_jobs: `${BASE.ENGINEER}/explore-jobs`,
    },
  },
  client: {
    auth: {
      login: `${BASE.CLIENT_AUTH}/login`,
      signup: `${BASE.CLIENT_AUTH}/signup`,
      profile_setup: `${BASE.CLIENT_AUTH}/profile-setup`,
      account_type: `${BASE.CLIENT_AUTH}/account-type`,
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
      manage_engineer_add: `${BASE.ADMIN}/users/add`,
      manage_engineer_edit: `${BASE.ADMIN}/users/edit`,
      manage_engineer_view: `${BASE.ADMIN}/users/view`,
      manage_client: `${BASE.ADMIN}/client`,
      manage_jobs: `${BASE.ADMIN}/jobs`,
      manage_categories: `${BASE.ADMIN}/categories`,
      manage_categories_add: `${BASE.ADMIN}/categories/add`,
      manage_categories_edit: `${BASE.ADMIN}/categories/edit`,
      manage_rate_card: `${BASE.ADMIN}/rate-card`,
      manage_payment: `${BASE.ADMIN}/revenue`,
      manage_transactions: `${BASE.ADMIN}/transaction`,
      wallet_overview: `${BASE.ADMIN}/wallet-overview`,
      wallet_transaction_requests: `${BASE.ADMIN}/wallet-requests`,
      manage_notification: `${BASE.ADMIN}/notifications`,
      manage_notification_add: `${BASE.ADMIN}/notifications/add`,
      manage_sub_admin: `${BASE.ADMIN}/sub-admins`,
      manage_sub_admin_add: `${BASE.ADMIN}/sub-admins/add`,
      manage_sub_admin_edit: `${BASE.ADMIN}/sub-admins/edit`,
      manage_cms: `${BASE.ADMIN}/cms`,
      settings: `${BASE.ADMIN}/settings`,
      profile: `${BASE.ADMIN}/profile`,
      received_notification: `${BASE.ADMIN}/received-notification`,
      edit_role: `${BASE.ADMIN}/edit-role`,
      roleList: `${BASE.ADMIN}/roles`,
      edit_rate_card: `${BASE.ADMIN}/rate-card/edit`,
      view_rate_card: `${BASE.ADMIN}/rate-card/view`,
      add_rate_card: `${BASE.ADMIN}/rate-card/add`,
      jobOffer: `${BASE.ADMIN}/job-offer`,
    },
  },
} as const;
