import React from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { BASE, urls } from "@/config/urls";
import { withSuspense } from "./WithSuspense";

const Layout = React.lazy(() => import("@/layout/auth-pannel"));
const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
const ClientLayout = React.lazy(() => import("@/layout/ClientLayout"));

// Engineer components used in Client routes (based on original file)
const ForgetPassword = React.lazy(() => import("@/pages/engineer/auth/components/ForgetPassword"));
const ResetPassword = React.lazy(() => import("@/pages/engineer/auth/components/ResetPassword"));
const BackgroundVerification = React.lazy(() => import("@/pages/engineer/auth/components/profile_setup/BackgroundVerification"));
const SetPassword = React.lazy(() => import("@/pages/engineer/auth/components/profile_setup/SetPassword"));
const MultiStepRegistrationForm = React.lazy(() => import("@/pages/engineer/auth/components/profile_setup/MultiStepRegistrationForm "));
const EngineerChatPage = React.lazy(() => import("@/pages/engineer/chat"));
const JobDetailsPage = React.lazy(() => import("@/pages/engineer/my_job/JobDetailsPage"));
const SearchResult = React.lazy(() => import("@/pages/engineer/search_result"));

// Client Components
const ClientSignInPage = React.lazy(() => import("@/pages/client/auth/components/signin_pages/SignInPage"));
const ClientSignUpPage = React.lazy(() => import("@/pages/client/auth/components/signup_pages/SignUpPage"));
const ClientProfileSettingPage = React.lazy(() => import("@/pages/client/auth/components/profile_setup/ProfileSettingPage"));
const ClientForgetPassword = React.lazy(() => import("@/pages/client/auth/components/ForgetPassword"));
const ClientResetPassword = React.lazy(() => import("@/pages/client/auth/components/ResetPassword"));
const ClientAccountType = React.lazy(() => import("@/pages/client/auth/components/AccountType"));
const CorporateMultiStepRegistration = React.lazy(() => import("@/pages/client/auth/components/profile_setup/ProfileSettingPage"));
const ClientBackgroundVerification = React.lazy(() => import("@/pages/client/auth/components/profile_setup/BackgroundVerification"));
const ClientSetPassword = React.lazy(() => import("@/pages/client/auth/components/profile_setup/SetPassword"));

const ClientMyJobsPage = React.lazy(() => import("@/pages/client/my_job_client"));
const ClientMyProjectsPage = React.lazy(() => import("@/pages/client/my_projects/project"));
const ClientProjectDetailsPage = React.lazy(() => import("@/pages/client/my_projects/projectDetail"));
const ClientCreateProjectPage = React.lazy(() => import("@/pages/client/my_projects/createProject"));
const ClientDashboard = React.lazy(() => import("@/pages/client/dashboard/Dashboard"));
const ClientManageProposal = React.lazy(() => import("@/pages/client/manage_proposal"));
const ClientManageProposalDetails = React.lazy(() => import("@/pages/client/manage_proposal/ManageExploreEngineer"));
const ClientJobDetails = React.lazy(() => import("@/pages/client/manage_proposal/ClientJobDetails"));
const ClientPostJobPage = React.lazy(() => import("@/pages/client/post_job/MultiStepPostJob"));
const ClientSearchResult = React.lazy(() => import("@/pages/client/search_result"));
const ClientExploreEngineers = React.lazy(() => import("@/pages/client/explore_engineer"));
const ClientExploreEngDetails = React.lazy(() => import("@/pages/client/explore_engineer/components/profile/EngineerProfile"));
const ClientJobInvite = React.lazy(() => import("@/pages/client/explore_engineer/components/invite_job/InviteJob"));
const SelectEngineer = React.lazy(() => import("@/pages/client/manage_proposal/SelectEngineer"));
const ClientInviteEngineers = React.lazy(() => import("@/pages/client/my_job_client/components/ClientInviteJob/EngineerInviteListPage"));
const ClientFAQ = React.lazy(() => import("@/pages/client/privacy_policy/FAQ"));
const ClientTermsAndConditions = React.lazy(() => import("@/pages/client/privacy_policy/TermsAndConditions"));
const ClientPrivacyPolicy = React.lazy(() => import("@/pages/client/privacy_policy/PolicyPage"));
const PostAJobPage = React.lazy(() => import("@/pages/client/post_job/PostAJobComponent/PostJobPage"));
const MyJobsPage = React.lazy(() => import("@/pages/engineer/my_job")); // Used in the second client block? Wait, line 565 uses MyJobsPage which was imported from engineer/my_job in original file.

// Shared/Other
const TermsAndConditions = React.lazy(() => import("@/pages/engineer/privacy_policy/TermsAndConditions"));
const FAQ = React.lazy(() => import("@/pages/engineer/privacy_policy/FAQ"));


export const clientRoutes: RouteObject[] = [
  // Client Auth Routes
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
      // Duplicates/Overrides from original file
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
    element: withSuspense(ClientLayout),
    children: [
      { index: true, element: withSuspense(ClientMyJobsPage) },
      {
        path: urls.client.home.my_jobs,
        element: withSuspense(ClientMyJobsPage),
      },
      {
        path: `${urls.client.home.my_jobs}/:jobId`,
        element: withSuspense(ClientJobDetails),
      },
      {
        path: urls.client.home.my_projects,
        element: withSuspense(ClientMyProjectsPage),
      },
      {
        path: `${urls.client.home.my_projects}/:projectId`,
        element: withSuspense(ClientProjectDetailsPage),
      },
      {
        path: urls.client.home.create_project,
        element: withSuspense(ClientCreateProjectPage),
      },
      {
        path: urls.client.home.dashboard,
        element: withSuspense(ClientDashboard),
      },
      {
        path: urls.client.home.client_Explore_engineers,
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
        path: `${urls.client.home.manage_proposal}/:id`,
        element: withSuspense(ClientManageProposalDetails),
      },
      {
        path: `${urls.client.home.job_details}/:id`,
        element: withSuspense(ClientJobDetails),
      },
      {
        path: urls.client.home.search_result,
        element: withSuspense(ClientSearchResult),
      },
      {
        path: urls.engineer.home.terms_and_conditions,
        element: withSuspense(TermsAndConditions),
      },
      { path: urls.engineer.home.faq, element: withSuspense(FAQ) },
      {
        path: urls.client.home.post_a_job,
        element: withSuspense(PostAJobPage),
      },
      {
        path: urls.client.home.client_Explore_engineers_details,
        element: withSuspense(ClientExploreEngDetails),
      },
      {
        path: urls.client.home.Client_Job_Details,
        element: withSuspense(ClientJobDetails),
      },
      {
        path: urls.client.home.ClientSelectEngineers,
        element: withSuspense(ClientInviteEngineers),
      },
      {
        path: urls.client.home.faq,
        element: withSuspense(ClientFAQ),
      },
      {
        path: urls.client.home.terms_and_conditions,
        element: withSuspense(ClientTermsAndConditions),
      },
      {
        path: urls.client.home.privacy_policy,
        element: withSuspense(ClientPrivacyPolicy),
      },
      {
        path: urls.client.home.ClientJobInvite,
        element: withSuspense(ClientJobInvite),
      },
      {
        path: urls.client.home.SelectEngineer,
        element: withSuspense(SelectEngineer),
      },
      {
        path: urls.client.home.chat,
        element: withSuspense(EngineerChatPage),
      },
    ],
  },

  // Second Client Auth Block (from original file)
  {
    path: BASE.AUTH, // Note: This might conflict with Engineer Auth if BASE.AUTH is the same
    element: withSuspense(Layout),
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: urls.client.auth.login, element: withSuspense(ClientSignInPage) },
      { path: urls.client.auth.signup, element: withSuspense(ClientSignUpPage) },
      {
        path: urls.client.auth.profile_setup,
        element: withSuspense(MultiStepRegistrationForm),
      },
      {
        path: urls.client.auth.forget_password,
        element: withSuspense(ForgetPassword),
      },
      {
        path: urls.client.auth.reset_password,
        element: withSuspense(ResetPassword),
      },
      {
        path: urls.client.auth.set_password,
        element: withSuspense(SetPassword),
      },
      {
        path: urls.client.auth.background_verification,
        element: withSuspense(BackgroundVerification),
      },
    ],
  },

  // Second Client Main Block (from original file)
  {
    path: BASE.CLIENT,
    element: withSuspense(RootLayout),
    children: [
      { index: true, element: withSuspense(MyJobsPage) },
      { path: urls.client.home.my_jobs, element: withSuspense(MyJobsPage) },
      {
        path: `${urls.client.home.my_jobs}/:jobId`,
        element: withSuspense(JobDetailsPage),
      },
      {
        path: urls.client.home.search_result,
        element: withSuspense(SearchResult),
      },
      {
        path: urls.client.home.privacy_policy,
        element: withSuspense(ClientPrivacyPolicy),
      },
      {
        path: urls.client.home.terms_and_conditions,
        element: withSuspense(ClientTermsAndConditions),
      },
      { path: urls.client.home.faq, element: withSuspense(ClientFAQ) },
      { path: urls.client.home.chat, element: withSuspense(EngineerChatPage) },
    ],
  },
];
