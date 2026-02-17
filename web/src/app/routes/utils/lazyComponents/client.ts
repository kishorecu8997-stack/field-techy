import React from "react";

/**
 * Client-related lazy-loaded components
 * All components specific to client role
 */

// Client Auth Components
export const ClientSignInPage = React.lazy(
  () => import("@/pages/client/auth/components/signin_pages/SignInPage"),
);
export const ClientSignUpPage = React.lazy(
  () => import("@/pages/client/auth/components/signup_pages/SignUpPage"),
);
export const ClientForgetPassword = React.lazy(
  () => import("@/pages/client/auth/components/ForgetPassword"),
);
export const ClientResetPassword = React.lazy(
  () => import("@/pages/client/auth/components/ResetPassword"),
);
export const ClientAccountType = React.lazy(
  () => import("@/pages/client/auth/components/AccountType"),
);
export const ClientSetPassword = React.lazy(
  () => import("@/pages/client/auth/components/profile_setup/SetPassword"),
);
export const ClientProfileSetup = React.lazy(
  () =>
    import("@/pages/client/auth/components/profile_setup/updated_profile_setup/BasicDetails"),
);
export const ClientDocuments = React.lazy(
  () =>
    import("@/pages/client/auth/components/profile_setup/updated_profile_setup/BasicDocuments"),
);
export const ClientContactVerification = React.lazy(
  () =>
    import("@/pages/client/auth/components/profile_setup/updated_profile_setup/ContactVerification"),
);

// Client Home Components
export const ClientMyJobsPage = React.lazy(
  () => import("@/pages/client/my_job_client"),
);
export const ClientMyProjectsPage = React.lazy(
  () => import("@/pages/client/my_projects/project"),
);
export const ClientProjectDetailsPage = React.lazy(
  () => import("@/pages/client/my_projects/projectDetail"),
);
export const ClientCreateProjectPage = React.lazy(
  () => import("@/pages/client/my_projects/createProject"),
);
export const ClientDashboard = React.lazy(
  () => import("@/pages/client/dashboard/Dashboard"),
);
export const ClientManageProposal = React.lazy(
  () => import("@/pages/client/manage_proposal"),
);
export const ClientManageProposalDetails = React.lazy(
  () => import("@/pages/client/manage_proposal/ManageExploreEngineer"),
);
export const ClientJobDetails = React.lazy(
  () => import("@/pages/client/manage_proposal/ClientJobDetails"),
);
export const ClientPostJobPage = React.lazy(
  () => import("@/pages/client/post_job/MultiStepPostJob"),
);
export const ClientSearchResult = React.lazy(
  () => import("@/pages/client/search_result"),
);
export const ClientExploreEngineers = React.lazy(
  () => import("@/pages/client/explore_engineer"),
);
export const ClientExploreEngDetails = React.lazy(
  () =>
    import("@/pages/client/explore_engineer/components/profile/EngineerProfile"),
);
export const ClientJobInvite = React.lazy(
  () =>
    import("@/pages/client/explore_engineer/components/invite_job/InviteJob"),
);
export const ClientSelectEngineer = React.lazy(
  () => import("@/pages/client/manage_proposal/SelectEngineer"),
);
export const ClientInviteEngineers = React.lazy(
  () =>
    import("@/pages/client/my_job_client/components/ClientInviteJob/EngineerInviteListPage"),
);
export const PostAJobPage = React.lazy(
  () => import("@/pages/client/post_job/PostAJobComponent/PostJobPage"),
);
export const ClientSearchAnalyticsPage = React.lazy(
  () => import("@/pages/client/search_analytics/ClientSearchAnalyticsPage"),
);
export const ClientNotificationPage = React.lazy(
  () => import("@/pages/client/notification/NotificationPage"),
);

// Client Policy Pages
export const ClientFAQ = React.lazy(
  () => import("@/pages/client/privacy_policy/FAQ"),
);
export const ClientTermsAndConditions = React.lazy(
  () => import("@/pages/client/privacy_policy/TermsAndConditions"),
);
export const ClientPrivacyPolicy = React.lazy(
  () => import("@/pages/client/privacy_policy/PolicyPage"),
);
