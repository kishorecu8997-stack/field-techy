import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { urls } from "@/config/urls";

import { withSuspense } from "./WithSuspense";

const Layout = React.lazy(() => import("@/pages/auth"));
const SignInpage = React.lazy(
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
const SearchResult = React.lazy(() => import("@/pages/serch_result"));
const MyJobPrivacyPolicy = React.lazy(
  () => import("@/pages/privacy_policy/PolicyPage")
);
const PolicyPage = React.lazy(
  () => import("@/pages/privacy_policy/PrivacyPolicy")
);
const TermsAndConditions = React.lazy(
  () => import("@/pages/privacy_policy/TermsAndConditions")
);
const FAQ = React.lazy(() => import("@/pages/privacy_policy/FAQ"));

export const routes = createBrowserRouter([
  {
    path: urls.auth.login,
    element: withSuspense(Layout),
    children: [
      { index: true, element: withSuspense(SignInpage) },
      { path: urls.auth.signUp, element: withSuspense(SignUpPage) },
      { path: urls.auth.profile_setup, element: withSuspense(ProfileSettingPage) },
      { path: urls.auth.forgetPassword, element: withSuspense(ForgetPassword) },
      { path: urls.auth.resetPassword, element: withSuspense(ResetPassword) },
      { path: urls.auth.background_verification, element: withSuspense(BackgroundVerification) },
      { path: urls.auth.set_password, element: withSuspense(SetPassword) },
    ],
  },
  { path: urls.privacy_policy, element: withSuspense(PolicyPage) },
  {
    path: urls.root,
    element: withSuspense(RootLayout),
    children: [
      { path: urls.home.my_jobs, element: withSuspense(MyJobsPage) },
      {
        path: `${urls.home.my_jobs}/:jobId`,
        element: withSuspense(JobDetailsPage),
      },
      { path: urls.home.search_result, element: withSuspense(SearchResult) },
      {
        path: urls.home.privacy_policy,
        element: withSuspense(MyJobPrivacyPolicy),
      },
      {
        path: urls.home.terms_and_conditions,
        element: withSuspense(TermsAndConditions),
      },
      { path: urls.home.faq, element: withSuspense(FAQ) },
    ],
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
]);
