import type { RouteObject } from "react-router-dom";
import React from "react";
import { BASE, urls } from "@/config/urls";
import { UserRole } from "@/shared/enums/users";
import { withSuspense } from "../WithSuspense";
import ProtectedRoute from "@/layout/ProtectedRoute";
import AuthRedirect from "@/layout/AuthRedirect";
import type { RouteStrategy } from "../types/routeTypes";
import * as Components from "../utils/lazyComponents";

/**
 * Client Route Strategy
 * Implements RouteStrategy for client-specific routes
 */
export class ClientRouteStrategy implements RouteStrategy {
  /**
   * Get public routes (authentication pages)
   */
  getPublicRoutes(): RouteObject[] {
    return [
      {
        path: BASE.CLIENT_AUTH,
        element: React.createElement(
          AuthRedirect,
          null,
          withSuspense(Components.Layout)
        ),
        children: [
          {
            path: urls.client.auth.login,
            element: withSuspense(Components.ClientSignInPage),
          },
          {
            path: urls.client.auth.signup,
            element: withSuspense(Components.ClientSignUpPage),
          },
          {
            path: urls.client.auth.forget_password,
            element: withSuspense(Components.ClientForgetPassword),
          },
          {
            path: urls.client.auth.reset_password,
            element: withSuspense(Components.ClientResetPassword),
          },
          {
            path: urls.client.auth.set_password,
            element: withSuspense(Components.ClientSetPassword),
          },
          {
            path: urls.client.auth.background_verification,
            element: withSuspense(Components.ClientBackgroundVerification),
          },
          {
            path: urls.client.auth.account_type,
            element: withSuspense(Components.ClientAccountType),
          },
          {
            path: `${urls.client.auth.profile_setup}/:role`,
            element: withSuspense(Components.ClientProfileSetup),
          },
          {
            path: urls.client.auth.documents,
            element: withSuspense(Components.ClientDocuments),
          },
          {
            path: urls.client.auth.verification,
            element: withSuspense(Components.ClientContactVerification),
          },
        ],
      },
    ];
  }

  /**
   * Get private routes (protected dashboard pages)
   */
  getPrivateRoutes(): RouteObject[] {
    return [
      {
        path: BASE.CLIENT,
        element: React.createElement(ProtectedRoute, {
          requiredRole: UserRole.CLIENT,
          children: [
            withSuspense(Components.ClientLayout),
            withSuspense(Components.LiveChatWidget),
          ],
        }),
        // element: withSuspense(Components.ClientLayout),
        children: [
          { index: true, element: withSuspense(Components.ClientMyJobsPage) },
          {
            path: urls.client.home.my_jobs,
            element: withSuspense(Components.ClientMyJobsPage),
          },
          {
            path: `${urls.client.home.my_jobs}/:jobId`,
            element: withSuspense(Components.ClientJobDetails),
          },
          {
            path: urls.client.home.my_projects,
            element: withSuspense(Components.ClientMyProjectsPage),
          },
          {
            path: `${urls.client.home.my_projects}/:projectId`,
            element: withSuspense(Components.ClientProjectDetailsPage),
          },
          {
            path: urls.client.home.create_project,
            element: withSuspense(Components.ClientCreateProjectPage),
          },
          {
            path: urls.client.home.dashboard,
            element: withSuspense(Components.ClientDashboard),
          },
          {
            path: urls.client.home.client_Explore_engineers,
            element: withSuspense(Components.ClientExploreEngineers),
          },
          {
            path: urls.client.home.post_JobPage,
            element: withSuspense(Components.ClientPostJobPage),
          },
          {
            path: urls.client.home.manage_proposal,
            element: withSuspense(Components.ClientManageProposal),
          },
          {
            path: `${urls.client.home.manage_proposal}/:id`,
            element: withSuspense(Components.ClientManageProposalDetails),
          },
          {
            path: `${urls.client.home.job_details}/:id`,
            element: withSuspense(Components.ClientJobDetails),
          },
          {
            path: urls.client.home.search_result,
            element: withSuspense(Components.ClientSearchResult),
          },
          {
            path: urls.client.home.post_a_job,
            element: withSuspense(Components.PostAJobPage),
          },
          {
            path: urls.client.home.client_Explore_engineers_details,
            element: withSuspense(Components.ClientExploreEngDetails),
          },
          {
            path: urls.client.home.Client_Job_Details,
            element: withSuspense(Components.ClientJobDetails),
          },
          {
            path: urls.client.home.ClientSelectEngineers,
            element: withSuspense(Components.ClientInviteEngineers),
          },
          {
            path: urls.client.home.faq,
            element: withSuspense(Components.ClientFAQ),
          },
          {
            path: urls.client.home.terms_and_conditions,
            element: withSuspense(Components.ClientTermsAndConditions),
          },
          {
            path: urls.client.home.privacy_policy,
            element: withSuspense(Components.ClientPrivacyPolicy),
          },
          {
            path: urls.client.home.ClientJobInvite,
            element: withSuspense(Components.ClientJobInvite),
          },
          {
            path: urls.client.home.SelectEngineer,
            element: withSuspense(Components.ClientSelectEngineer),
          },
          {
            path: urls.client.home.chat,
            element: withSuspense(Components.EngineerChatPage),
          },
        ],
      },
    ];
  }
}

