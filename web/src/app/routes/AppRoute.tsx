import { absoluteUrls, BASE, urls } from "@/config/urls";
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { withSuspense } from "./WithSuspense";
// import AdminProtectedRoute from "@/layout/admin/AdminProtectedRoute";

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

// Layouts
const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
const ClientLayout = React.lazy(() => import("@/layout/ClientLayout"));

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
const AboutApp = React.lazy(
  () => import("@/pages/engineer/privacy_policy/AboutApp")
);
const Home = React.lazy(() => import("@/pages/engineer/home"));
const ExploreJobs = React.lazy(
  () => import("@/pages/engineer/home/components/ExploreJobs")
);

//client
const ClientSignInPage = React.lazy(
  () => import("@/pages/client/auth/components/signin_pages/SignInPage")
);
const ClientSignUpPage = React.lazy(
  () => import("@/pages/client/auth/components/signup_pages/SignUpPage")
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

const ClientAccountType = React.lazy(
  () => import("@/pages/client/auth/components/AccountType")
);
const CorporateMultiStepRegistration = React.lazy(
  () =>
    import("@/pages/client/auth/components/profile_setup/ProfileSettingPage")
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

//admin-dashboard-layout
const AdminLayout = React.lazy(() => import("@/layout/admin/AdminLayout"));
const AdminLogin = React.lazy(() => import("@/pages/admin/auth/login/Login"));
const AdminForgotPassword = React.lazy(
  () => import("@/pages/admin/auth/ForgotPassword")
);
const AdminResetPassword = React.lazy(
  () => import("@/pages/admin/auth/ResetPassword")
);
const AdminVerifyOTP = React.lazy(() => import("@/pages/admin/auth/VerifyOTP"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/dashboard"));
const AdminManageEngineer = React.lazy(() => import("@/pages/admin/engineer"));
const AdminManageEngineerAdd = React.lazy(
  () => import("@/pages/admin/engineer/addEngineer/AddEngineer")
);
const AdminManageEngineerView = React.lazy(
  () => import("@/pages/admin/engineer/userDetails")
);
const AdminManageEngineerEdit = React.lazy(
  () => import("@/pages/admin/engineer/editEngineer/EditEngineer")
);
const AdminManageClient = React.lazy(() => import("@/pages/admin/client"));
const AdminManageJobCategory = React.lazy(
  () => import("@/pages/admin/job_category")
);
const AdminManageJobCategoryAdd = React.lazy(
  () => import("@/pages/admin/job_category/AddCategory")
);
const AdminManageJobCategoryEdit = React.lazy(
  () => import("@/pages/admin/job_category/EditCategory")
);
const AdminManageJobs = React.lazy(() => import("@/pages/admin/jobs"));
const AdminManageRateCard = React.lazy(() => import("@/pages/admin/rate_card"));
const EditAdminRateCard = React.lazy(
  () => import("@/pages/admin/rate_card/components/EditRateCard")
);
const ViewAdminRateCard = React.lazy(
  () => import("@/pages/admin/rate_card/components/EditRateCard")
);
const AddAdminRateCard = React.lazy(
  () => import("@/pages/admin/rate_card/components/AddRateCard")
);

const AdminManagePayment = React.lazy(() => import("@/pages/admin/payment"));
const AdminManageTransactions = React.lazy(
  () => import("@/pages/admin/transactions")
);

const WalletOverview = React.lazy(
  () => import("@/pages/admin/wallet_management/wallet_overview")
);
const WalletView = React.lazy(
  () => import("@/pages/admin/wallet_management/wallet_overview/WalletView")
);
const WalletTransactionRequests = React.lazy(
  () => import("@/pages/admin/wallet_management/transaction_requests")
);
const ManageNotification = React.lazy(
  () => import("@/pages/admin/manage_notification")
);
const ManageNotificationAdd = React.lazy(
  () => import("@/pages/admin/manage_notification/AddNotification")
);
const ManageSubAdmin = React.lazy(() => import("@/pages/admin/sub_admin"));
const AddSubAdmin = React.lazy(
  () => import("@/pages/admin/sub_admin/AddSubAdmin")
);
const EditSubAdmin = React.lazy(
  () => import("@/pages/admin/sub_admin/EditSubAdmin")
);
const ManageCMS = React.lazy(() => import("@/pages/admin/manage_cms"));
const Settings = React.lazy(() => import("@/pages/admin/settings"));
const AdminProfile = React.lazy(() => import("@/pages/admin/profile"));
const ReceivedNotification = React.lazy(
  () => import("@/pages/admin/received_notification")
);
const corporateClientAdd = React.lazy(
  () => import("@/pages/admin/client/components/add_components/CorporateClientForm")
);
const homeClientAdd=React.lazy(
  () => import("@/pages/admin/client/components/add_components/HomeClientForm")
);
const corporateClientEdit = React.lazy(
  () => import("@/pages/admin/client/components/edit_components/CorporateClientEditForm")
);
const homeClientEdit=React.lazy(
  () => import("@/pages/admin/client/components/edit_components/HomeClientEditForm")
);

const corporateClientView = React.lazy(
  () => import("@/pages/admin/client/components/view_components/CorporateClientViewForm")
);
const homeClientView=React.lazy(
  () => import("@/pages/admin/client/components/view_components/HomeClientViewForm")
);
const adminEditRolePage = React.lazy(
  () => import("@/pages/admin/sub_admin/role_pages/PermissionList")
);
const roleListPage = React.lazy(
  () => import("@/pages/admin/sub_admin/role_pages/RolePage")
);
const ManageJobView = React.lazy(
  () => import("@/pages/admin/jobs/ManageJobView")
);
const OfferPages = React.lazy(() => import("@/pages/engineer/my_job/job_details_components/OfferPages"));

const ClientMyJobsPage = React.lazy(() => import("@/pages/client/my_job_client"));
const ClientDashboard = React.lazy(() => import("@/pages/client/dashboard/Dashboard"));
const ClientManageProposal = React.lazy(() => import("@/pages/client/manage_proposal"));
const ClientPostJobPage = React.lazy(() => import("@/pages/client/post_job/MultiStepPostJob"));
const ClientSearchResult = React.lazy(() => import("@/pages/client/search_result"));
const ClientExploreEngineers = React.lazy(() => import("@/pages/client/explore_engineer"));
const ClientExploreEngDetails = React.lazy(() => import("@/pages/client/explore_engineer/components/profile/EngineerProfile"));
const ClientJobInvite = React.lazy(() => import("@/pages/client/explore_engineer/components/invite_job/InviteJob"));


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
      { index: true, element: withSuspense(Home) },
      { path: urls.engineer.home.dashboard, element: withSuspense(Home) },
      {
        path: urls.engineer.home.explore_jobs,
        element: withSuspense(ExploreJobs),
      },
      { path: urls.engineer.home.my_jobs, element: withSuspense(MyJobsPage) },
      {
        path: `${urls.engineer.home.my_jobs}/:jobId`,
        element: withSuspense(JobDetailsPage),
      },
      {
        path: `${urls.engineer.home.my_jobs}/:jobId`,
        element: withSuspense(OfferPages),
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
    element: withSuspense(ClientLayout), // Assuming clients share the same RootLayout
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

  // Client Main Routes
  {
    path: BASE.CLIENT,
    element: withSuspense(RootLayout), // Assuming clients share the same RootLayout
    children: [
      { index: true, element: withSuspense(ClientMyJobsPage) },
      { path: urls.client.home.my_jobs, element: withSuspense(ClientMyJobsPage) },
      { path: urls.client.home.dashboard, element: withSuspense(ClientDashboard) },
      { path: urls.client.home.explore_engineers, element: withSuspense(ClientExploreEngineers) },
      { path: urls.client.home.post_JobPage, element: withSuspense(ClientPostJobPage) },
      { path: urls.client.home.manage_proposal, element: withSuspense(ClientManageProposal) },
      { path: urls.client.home.search_result, element: withSuspense(ClientSearchResult) },
      { path: urls.client.home.explore_engineers_details, element: withSuspense(ClientExploreEngDetails)},
      {path: urls.client.home.ClientJobInvite, element: withSuspense(ClientJobInvite)},      
    ],
  },

  {
    path: absoluteUrls.engineer.auth.privacy_policy,
    element: withSuspense(PrivacyPolicy),
  },

  { path: "*", element: withSuspense(NotFound) },

  //Admin
  {
    path: absoluteUrls.admin.auth.login,
    element: withSuspense(AdminLogin),
  },
  {
    path: absoluteUrls.admin.auth.forget_password,
    element: withSuspense(AdminForgotPassword),
  },
  {
    path: absoluteUrls.admin.auth.otp,
    element: withSuspense(AdminVerifyOTP),
  },
  {
    path: absoluteUrls.admin.auth.reset_password,
    element: withSuspense(AdminResetPassword),
  },
  {
    // element: <AdminProtectedRoute/>,
    children: [
      {
        path: BASE.ADMIN, // base path for admin layout
        element: withSuspense(AdminLayout),
        children: [
          { index: true, element: withSuspense(AdminDashboard) },
          {
            path: urls.admin.home.dashbaord,
            element: withSuspense(AdminDashboard),
          },
          {
            path: urls.admin.home.manage_engineer,
            element: withSuspense(AdminManageEngineer),
          },
          {
            path: urls.admin.home.manage_engineer_add,
            element: withSuspense(AdminManageEngineerAdd),
          },
          {
            path: urls.admin.home.manage_engineer_view,
            element: withSuspense(AdminManageEngineerView),
          },
          {
            path: `${urls.admin.home.manage_engineer_edit}/:id?`,
            element: withSuspense(AdminManageEngineerEdit),
          },
          {
            path: urls.admin.home.manage_client,
            element: withSuspense(AdminManageClient),
          },
          {
            path: urls.admin.home.manage_jobs,
            element: withSuspense(AdminManageJobs),
          },
          {
            path: urls.admin.home.manage_categories,
            element: withSuspense(AdminManageJobCategory),
          },
          {
            path: urls.admin.home.manage_categories_add,
            element: withSuspense(AdminManageJobCategoryAdd),
          },
          {
            path: `${urls.admin.home.manage_categories_edit}/:id?`,
            element: withSuspense(AdminManageJobCategoryEdit),
          },
          {
            path: urls.admin.home.manage_rate_card,
            element: withSuspense(AdminManageRateCard),
          },
          {
            path: urls.admin.home.edit_rate_card,
            element: withSuspense(EditAdminRateCard),
          },
          {
            path: urls.admin.home.view_rate_card,
            element: withSuspense(ViewAdminRateCard),
          },
          {
            path: urls.admin.home.add_rate_card,
            element: withSuspense(AddAdminRateCard),
          },
          {
            path: urls.admin.home.manage_payment,
            element: withSuspense(AdminManagePayment),
          },
          {
            path: urls.admin.home.manage_transactions,
            element: withSuspense(AdminManageTransactions),
          },
          {
            path: urls.admin.home.wallet_overview,
            element: withSuspense(WalletOverview),
          },
          {
            path: `${urls.admin.home.wallet_overview_view}/:id?`,
            element: withSuspense(WalletView),
          },
          {
            path: urls.admin.home.wallet_transaction_requests,
            element: withSuspense(WalletTransactionRequests),
          },
          {
            path: urls.admin.home.manage_notification,
            element: withSuspense(ManageNotification),
          },
          {
            path: urls.admin.home.manage_notification_add,
            element: withSuspense(ManageNotificationAdd),
          },
          {
            path: urls.admin.home.manage_sub_admin,
            element: withSuspense(ManageSubAdmin),
          },
          {
            path: urls.admin.home.manage_sub_admin_add,
            element: withSuspense(AddSubAdmin),
          },
          {
            path: `${urls.admin.home.manage_sub_admin_edit}/:id?`,
            element: withSuspense(EditSubAdmin),
          },
          {
            path: urls.admin.home.manage_cms,
            element: withSuspense(ManageCMS),
          },
          { path: urls.admin.home.settings, element: withSuspense(Settings) },
          {
            path: urls.admin.home.profile,
            element: withSuspense(AdminProfile),
          },
          {
            path: urls.admin.home.received_notification,
            element: withSuspense(ReceivedNotification),
          },
          {
            path: urls.admin.home.corporateClientAdd,
            element: withSuspense(corporateClientAdd),
          },
             {
            path: urls.admin.home.homeClientAdd,
            element: withSuspense(homeClientAdd),
          },  
          {
            path: urls.admin.home.corporateClientEdit,
            element: withSuspense(corporateClientEdit),
          },
             {
            path: urls.admin.home.homeClientEdit,
            element: withSuspense(homeClientEdit),
          },  
          {
            path: urls.admin.home.corporateClientView,
            element: withSuspense(corporateClientView),
          },
             {
            path: urls.admin.home.homeClientView,
            element: withSuspense(homeClientView),
          },  
             
 {
            path: urls.admin.home.edit_role,
            element: withSuspense(adminEditRolePage),
          },
          {
            path: urls.admin.home.roleList,
            element: withSuspense(roleListPage),
          },
          {
            path: urls.admin.home.manage_jobs_view,
            element: withSuspense(ManageJobView),
          }
        ],
      },
    ],
  },
]);
