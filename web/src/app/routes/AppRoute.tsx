import { absoluteUrls, BASE, urls } from "@/config/urls";
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { withSuspense } from "./WithSuspense";

const Layout = React.lazy(() => import("@/layout/auth-pannel"));
const SignInPage = React.lazy(
  () => import("@/pages/engineer/auth/components/signin_pages/SignInPage")
);
const SignUpPage = React.lazy(
  () => import("@/pages/engineer/auth/components/signup_pages/SignUpPage")
);
// const ProfileSettingPage = React.lazy(
//   () => import("@/pages/engineer/auth/components/profile_setup/ProfileSettingPage")
// );
const MultiStepRegistrationForm = React.lazy(
  () =>
    import(
      "@/pages/engineer/auth/components/profile_setup/MultiStepRegistrationForm "
    )
);
const ForgetPassword = React.lazy(
  () => import("@/pages/engineer/auth/components/ForgetPassword")
);
const ResetPassword = React.lazy(
  () => import("@/pages/engineer/auth/components/ResetPassword")
);
const BackgroundVerification = React.lazy(
  () =>
    import(
      "@/pages/engineer/auth/components/profile_setup/BackgroundVerification"
    )
);
const SetPassword = React.lazy(
  () => import("@/pages/engineer/auth/components/profile_setup/SetPassword")
);
const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
const NotFound = React.lazy(() => import("@/shared/components/NotFound"));
const MyJobsPage = React.lazy(() => import("@/pages/engineer/my_job"));
const JobDetailsPage = React.lazy(
  () => import("@/pages/engineer/my_job/JobDetailsPage")
);
const SearchResult = React.lazy(() => import("@/pages/engineer/search_result"));
const PrivacyPolicy = React.lazy(
  () => import("@/pages/engineer/privacy_policy/PolicyPage")
);
const TermsAndConditions = React.lazy(
  () => import("@/pages/engineer/privacy_policy/TermsAndConditions")
);
const FAQ = React.lazy(() => import("@/pages/engineer/privacy_policy/FAQ"));

// Client Pages
// const ClientAuthLayout = React.lazy(() => import("@/pages/client/auth"));
const ClientSignInPage = React.lazy(
  () => import("@/pages/client/auth/components/signin_pages/SignInPage")
);
const ClientSignUpPage = React.lazy(
  () => import("@/pages/client/auth/components/signup_pages/SignUpPage")
);
const ClientAccountType = React.lazy(
  () => import("@/pages/client/auth/components/AccountType")
);
const CorporateMultiStepRegistration = React.lazy(
  () =>
    import("@/pages/client/auth/components/profile_setup/ProfileSettingPage")
);
const ClientProfileSettingPage = React.lazy(
  () =>
    import("@/pages/client/auth/components/profile_setup/ProfileSettingPage")
);
const ClientForgetPassword = React.lazy(
  () => import("@/pages/client/auth/components/ForgetPassword")
);
const ClientResetPassword = React.lazy(
  () => import("@/pages/client/auth/components/ResetPassword")
);
const ClientBackgroundVerification = React.lazy(
  () =>
    import(
      "@/pages/client/auth/components/profile_setup/BackgroundVerification"
    )
);
const ClientSetPassword = React.lazy(
  () => import("@/pages/client/auth/components/profile_setup/SetPassword")
);
const ClientMyJobsPage = React.lazy(
  () => import("@/pages/client/my_job_client")
);
const ClientDashboard = React.lazy(
  () => import("@/pages/client/dashboard/Dashboard")
);
const ClientExploreEngineers = React.lazy(
  () => import("@/pages/client/explore_engineer")
);
const ClientManageProposal = React.lazy(
  () => import("@/pages/client/manage_proposal")
);
const ClientPostJobPage = React.lazy(() => import("@/pages/client/post_job"));
const ClientSearchResult = React.lazy(
  () => import("@/pages/client/search_result")
);

/**
 * Configures the application's routing structure using React Router.
 * Defines all public and authenticated routes, including lazy-loaded page components
 * wrapped with Suspense for code-splitting and performance optimization.
 *
 * Routes are grouped under:
 * - Authentication flow (`/auth`)
 * - Engineer dashboard (`/engineer`)
 * - Client dashboard (`/client`)
 * - Standalone public pages (e.g., Privacy Policy)
 * - Catch-all 404 route
 *
 * @module routes
 * @see {@link https://reactrouter.com|React Router Documentation}
 */
export const routes = createBrowserRouter([
  // Default route redirecting to client login
  {
    path: "/",
    element: <Navigate to={absoluteUrls.client.auth.login} replace />,
  },

  // Engineer Auth Routes
  {
    path: BASE.AUTH,
    element: withSuspense(Layout),
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: urls.engineer.auth.login, element: withSuspense(SignInPage) },
      { path: urls.engineer.auth.signup, element: withSuspense(SignUpPage) },
      {
        path: urls.engineer.auth.profile_setup,
        element: withSuspense(MultiStepRegistrationForm),
      },
      {
        path: urls.engineer.auth.forget_password,
        element: withSuspense(ForgetPassword),
      },
      {
        path: urls.engineer.auth.reset_password,
        element: withSuspense(ResetPassword),
      },
      {
        path: urls.engineer.auth.set_password,
        element: withSuspense(SetPassword),
      },
      {
        path: urls.engineer.auth.background_verification,
        element: withSuspense(BackgroundVerification),
      },
    ],
  },

  // Engineer Main Routes
  {
    path: BASE.ENGINEER,
    element: withSuspense(RootLayout),
    children: [
      { index: true, element: withSuspense(MyJobsPage) },
      { path: urls.engineer.home.my_jobs, element: withSuspense(MyJobsPage) },
      {
        path: `${urls.engineer.home.my_jobs}/:jobId`,
        element: withSuspense(JobDetailsPage),
      },
      {
        path: urls.engineer.home.search_result,
        element: withSuspense(SearchResult),
      },
      {
        path: urls.engineer.home.privacy_policy,
        element: withSuspense(PrivacyPolicy),
      },
      {
        path: urls.engineer.home.terms_and_conditions,
        element: withSuspense(TermsAndConditions),
      },
      { path: urls.engineer.home.faq, element: withSuspense(FAQ) },
    ],
  },

  //client
  {
    path: BASE.CLIENT_AUTH,
    element: withSuspense(Layout),
    children: [
      { path: urls.client.auth.login, element: withSuspense(ClientSignInPage) },
      {
        path: urls.client.auth.signup,
        element: withSuspense(ClientSignUpPage),
      },
      {
        path: urls.client.auth.profile_setup,
        element: withSuspense(ClientProfileSettingPage),
      },
      {
        path: urls.client.auth.forget_password,
        element: withSuspense(ClientForgetPassword),
      },
      {
        path: urls.client.auth.reset_password,
        element: withSuspense(ClientResetPassword),
      },
      {
        path: urls.client.auth.set_password,
        element: withSuspense(ClientSetPassword),
      },
      {
        path: urls.client.auth.background_verification,
        element: withSuspense(ClientBackgroundVerification),
      },
      {
        path: urls.client.auth.forget_password,
        element: withSuspense(ForgetPassword),
      },
      {
        path: urls.client.auth.account_type,
        element: withSuspense(ClientAccountType),
      },
      {
        path: urls.client.auth.reset_password,
        element: withSuspense(ResetPassword),
      },
      {
        path: `${urls.client.auth.profile_setup}/:role`,
        element: withSuspense(CorporateMultiStepRegistration),
      },
    ],
  },

  // Client Main Routes
  {
    path: BASE.CLIENT,
    element: withSuspense(RootLayout), // Assuming clients share the same RootLayout
    children: [
      { index: true, element: withSuspense(ClientMyJobsPage) },
      {
        path: urls.client.home.my_jobs,
        element: withSuspense(ClientMyJobsPage),
      },
      {
        path: urls.client.home.dashboard,
        element: withSuspense(ClientDashboard),
      },
      {
        path: urls.client.home.explore_engineers,
        element: withSuspense(ClientExploreEngineers),
      },
      {
        path: urls.client.home.post_JobPage,
        element: withSuspense(ClientPostJobPage),
      },
      {
        path: urls.client.home.manage_proposal,
        element: withSuspense(ClientManageProposal),
      },
      {
        path: urls.client.home.search_result,
        element: withSuspense(ClientSearchResult),
      },
    ],
  },

  {
    path: absoluteUrls.engineer.auth.privacy_policy,
    element: withSuspense(PrivacyPolicy),
  },

  { path: "*", element: withSuspense(NotFound) },
]);
