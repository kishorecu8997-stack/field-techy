import React from "react";

/**
 * Engineer-related lazy-loaded components
 * All components specific to engineer role
 */

// Engineer Auth Components
export const EngineerSignInPage = React.lazy(
  () => import("@/pages/engineer/auth/components/signin_pages/SignInPage")
);
export const EngineerSignUpPage = React.lazy(
  () => import("@/pages/engineer/auth/components/signup_pages/SignUpPage")
);
export const EngineerForgetPassword = React.lazy(
  () => import("@/pages/engineer/auth/components/ForgetPassword")
);
export const EngineerResetPassword = React.lazy(
  () => import("@/pages/engineer/auth/components/ResetPassword")
);
export const EngineerBackgroundVerification = React.lazy(
  () =>
    import(
      "@/pages/engineer/auth/components/profile_setup/BackgroundVerification"
    )
);
export const EngineerSetPassword = React.lazy(
  () => import("@/pages/engineer/auth/components/profile_setup/SetPassword")
);
export const EngineerProfileSetup = React.lazy(
  () =>
    import(
      "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/BasicDetails"
    )
);
export const EngineerDocuments = React.lazy(
  () =>
    import(
      "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/BasicDocuments"
    )
);
export const EngineerContactVerification = React.lazy(
  () =>
    import(
      "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/ContactVerification"
    )
);

// Engineer Home Components
export const EngineerHome = React.lazy(() => import("@/pages/engineer/home"));
export const EngineerExploreJobs = React.lazy(
  () => import("@/pages/engineer/home/components/ExploreJobs")
);
export const EngineerExploreSavedJobs = React.lazy(
  () => import("@/pages/engineer/home/components/ExploreSavedJobs")
);
export const EngineerMyJobsPage = React.lazy(
  () => import("@/pages/engineer/my_job")
);
export const EngineerJobDetailsPage = React.lazy(
  () => import("@/pages/engineer/my_job/JobDetailsPage")
);
export const EngineerApplicationHistoryPage = React.lazy(
  () => import("@/pages/engineer/my_job/ApplicationHistoryPage")
);
export const EngineerBreakDetails = React.lazy(
  () =>
    import(
      "@/pages/engineer/my_job/job_details_components/jobHeaderComponents/BreakDetails"
    )
);
export const EngineerOfferPages = React.lazy(
  () => import("@/pages/engineer/my_job/job_details_components/OfferPages")
);
export const EngineerSearchResult = React.lazy(
  () => import("@/pages/engineer/search_result")
);
export const EngineerSearchAnalyticsPage = React.lazy(
  () => import("@/pages/engineer/search_analytics/SearchAnalyticsPage")
);
export const EngineerChatPage = React.lazy(
  () => import("@/pages/engineer/chat")
);
export const EngineerNotificationListPage = React.lazy(
  () =>
    import(
      "@/pages/engineer/account_settings/notification/NotificationListPage"
    )
);

// Engineer Policy Pages
export const EngineerPrivacyPolicy = React.lazy(
  () => import("@/pages/engineer/privacy_policy/PolicyPage")
);
export const EngineerTermsAndConditions = React.lazy(
  () => import("@/pages/engineer/privacy_policy/TermsAndConditions")
);
export const EngineerFAQ = React.lazy(
  () => import("@/pages/engineer/privacy_policy/FAQ")
);
export const EngineerVideoGuidance = React.lazy(
  () => import("@/pages/engineer/privacy_policy/VideoGuide")
);
export const EngineerAboutApp = React.lazy(
  () => import("@/pages/engineer/privacy_policy/AboutApp")
);

