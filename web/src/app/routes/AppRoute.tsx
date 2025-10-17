import { absoluteUrls, BASE, urls } from "@/config/urls";
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { withSuspense } from "./WithSuspense";

const Layout = React.lazy(() => import("@/pages/auth"));
const SignInPage = React.lazy(
  () => import("@/pages/auth/components/signin_pages/SignInPage")
);
const SignUpPage = React.lazy(
  () => import("@/pages/auth/components/signup_pages/SignUpPage")
);
const ProfileSettingPage = React.lazy(
  () => import("@/pages/auth/components/profile_setup/ProfileSettingPage")
);
const ForgetPassword = React.lazy(
  () => import("@/pages/auth/components/ForgetPassword")
);
const ResetPassword = React.lazy(
  () => import("@/pages/auth/components/ResetPassword")
);
const BackgroundVerification = React.lazy(
  () => import("@/pages/auth/components/profile_setup/BackgroundVerification")
);
const SetPassword = React.lazy(
  () => import("@/pages/auth/components/profile_setup/SetPassword")
);
const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
const NotFound = React.lazy(() => import("@/shared/components/NotFound"));
const MyJobsPage = React.lazy(() => import("@/pages/my_job"));
const JobDetailsPage = React.lazy(
  () => import("@/pages/my_job/JobDetailsPage")
);
const SearchResult = React.lazy(() => import("@/pages/search_result"));
const PrivacyPolicy = React.lazy(
  () => import("@/pages/privacy_policy/PolicyPage")
);
const TermsAndConditions = React.lazy(
  () => import("@/pages/privacy_policy/TermsAndConditions")
);
const FAQ = React.lazy(() => import("@/pages/privacy_policy/FAQ"));
const AboutApp = React.lazy(() => import("@/pages/privacy_policy/AboutApp"));

/**
 * Configures the application's routing structure using React Router.
 * Defines all public and authenticated routes, including lazy-loaded page components
 * wrapped with Suspense for code-splitting and performance optimization.
 *
 * Routes are grouped under:
 * - Authentication flow (`/auth`)
 * - Engineer dashboard (`/engineer`)
 * - Standalone public pages (e.g., Privacy Policy)
 * - Catch-all 404 route
 *
 * @module routes
 * @see {@link https://reactrouter.com|React Router Documentation}
 */
export const routes = createBrowserRouter([
  {
    path: BASE.AUTH,
    element: withSuspense(Layout),
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: urls.engineer.auth.login, element: withSuspense(SignInPage) },
      { path: urls.engineer.auth.signup, element: withSuspense(SignUpPage) },
      {
        path: urls.engineer.auth.profile_setup,
        element: withSuspense(ProfileSettingPage),
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
      { path: urls.engineer.home.about_app, element: withSuspense(AboutApp) },
    ],
  },

  {
    path: absoluteUrls.engineer.auth.privacy_policy,
    element: withSuspense(PrivacyPolicy),
  },

  { path: "*", element: withSuspense(NotFound) },
]);
