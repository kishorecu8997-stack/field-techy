import { absoluteUrls, BASE, urls } from "@/config/urls";
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { withSuspense } from "./WithSuspense";

const Layout = React.lazy(() => import("@/pages/engineer/auth"));
const SignInPage = React.lazy(
  () => import("@/pages/engineer/auth/components/signin_pages/SignInPage")
);
const SignUpPage = React.lazy(
  () => import("@/pages/engineer/auth/components/signup_pages/SignUpPage")
);
// const ProfileSettingPage = React.lazy(
//   () => import("@/pages/auth/components/profile_setup/ProfileSettingPage")
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

//admin-dashboard-layout
const AdminLayout = React.lazy(() => import("@/layout/admin/AdminLayout"));
// const AdminLogin = React.lazy(() => import("@/pages/admin/auth/login"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/dashboard"));
const AdminManageEngineer = React.lazy(() => import("@/pages/admin/engineer"));
const AdminManageClient = React.lazy(() => import("@/pages/admin/client"));
const AdminManageJobCategory = React.lazy(() => import("@/pages/admin/job_category"));
const AdminManageJobs = React.lazy(() => import("@/pages/admin/jobs"));
const AdminManageRateCard = React.lazy(() => import("@/pages/admin/rate_card"));
const AdminManagePayment = React.lazy(() => import("@/pages/admin/payment"));
const AdminManageTransactions = React.lazy(() => import("@/pages/admin/transactions"));
const WalletOverview = React.lazy(() => import("@/pages/admin/wallet_management/wallet_overview"));
const WalletTransactionRequests = React.lazy(() => import("@/pages/admin/wallet_management/transaction_requests"));
const ManageNotification = React.lazy(() => import("@/pages/admin/notification"));
const ManageSubAdmin = React.lazy(() => import("@/pages/admin/sub_admin"));
const ManageCMS = React.lazy(() => import("@/pages/admin/manage_cms"));
const Settings = React.lazy(() => import("@/pages/admin/settings"));

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

  {
    path: absoluteUrls.engineer.auth.privacy_policy,
    element: withSuspense(PrivacyPolicy),
  },

  { path: "*", element: withSuspense(NotFound) },

  //Admin
  {
    path: "/admin", // base path for admin layout
    element: withSuspense(AdminLayout),
    children: [
      { index: true, element: withSuspense(AdminDashboard) },
      { path: urls.admin.dashbaord, element: withSuspense(AdminDashboard) },
      {
        path: urls.admin.manage_engineer,
        element: withSuspense(AdminManageEngineer),
      },
      {
        path: urls.admin.manage_client,
        element: withSuspense(AdminManageClient),
      },
      { path: urls.admin.manage_jobs, element: withSuspense(AdminManageJobs) },
      {
        path: urls.admin.manage_categories,
        element: withSuspense(AdminManageJobCategory),
      },
      {
        path: urls.admin.manage_rate_card,
        element: withSuspense(AdminManageRateCard),
      },
      {
        path: urls.admin.manage_payment,
        element: withSuspense(AdminManagePayment),
      },
      {
        path: urls.admin.manage_transactions,
        element: withSuspense(AdminManageTransactions),
      },
      {
        path: urls.admin.wallet_overview,
        element: withSuspense(WalletOverview),
      },
      {
        path: urls.admin.wallet_transaction_requests,
        element: withSuspense(WalletTransactionRequests),
      },
      {
        path: urls.admin.manage_notification,
        element: withSuspense(ManageNotification),
      },
      {
        path: urls.admin.manage_sub_admin,
        element: withSuspense(ManageSubAdmin),
      },
      { path: urls.admin.manage_cms, element: withSuspense(ManageCMS) },
      { path: urls.admin.settings, element: withSuspense(Settings) },
    ],
  },
  { path: "/admin/login", element: <Navigate to="login" replace /> },
]);
