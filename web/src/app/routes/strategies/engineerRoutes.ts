import { BASE, urls } from "@/config/urls";
import AuthRedirect from "@/layout/AuthRedirect";
import ProtectedRoute from "@/layout/ProtectedRoute";
import { UserRole } from "@/shared/enums/users";
import React from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import type { RouteStrategy } from "../types/routeTypes";
import * as Components from "../utils/lazyComponents";
import { withSuspense } from "../WithSuspense";

/**
 * Engineer Route Strategy
 * Implements RouteStrategy for engineer-specific routes
 */
export class EngineerRouteStrategy implements RouteStrategy {
  /**
   * Get public routes (authentication pages)
   */
  getPublicRoutes(): RouteObject[] {
    return [
      {
        path: BASE.AUTH,
        element: React.createElement(
          AuthRedirect,
          null,
          withSuspense(Components.Layout),
        ),
        children: [
          {
            index: true,
            element: React.createElement(Navigate, {
              to: "login",
              replace: true,
            }),
          },
          {
            path: urls.engineer.auth.login,
            element: withSuspense(Components.EngineerSignInPage),
          },
          {
            path: urls.engineer.auth.signup,
            element: withSuspense(Components.EngineerProfileSetup),
          },
          {
            path: urls.engineer.auth.verification,
            element: withSuspense(Components.EngineerContactVerification),
          },
          {
            path: urls.engineer.auth.updated_basic_details,
            element: withSuspense(Components.EngineerProfileSetup),
          },
          {
            path: urls.engineer.auth.updated_documents,
            element: withSuspense(Components.EngineerDocuments),
          },
          {
            path: urls.engineer.auth.forget_password,
            element: withSuspense(Components.EngineerForgetPassword),
          },
          {
            path: urls.engineer.auth.reset_password,
            element: withSuspense(Components.EngineerResetPassword),
          },
          {
            path: urls.engineer.auth.set_password,
            element: withSuspense(Components.EngineerSetPassword),
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
        path: BASE.ENGINEER,
        element: React.createElement(ProtectedRoute, {
          requiredRole: UserRole.ENGINEER,
          children: React.createElement(
            React.Fragment,
            null,
            React.createElement(Components.RootLayout),
            withSuspense(Components.LiveChatWidget),
          ),
        }),
        children: [
          { index: true, element: withSuspense(Components.EngineerHome) },
          {
            path: urls.engineer.home.dashboard,
            element: withSuspense(Components.EngineerHome),
          },
          {
            path: urls.engineer.home.explore_jobs,
            element: withSuspense(Components.EngineerExploreJobs),
          },
          {
            path: urls.engineer.home.saved_jobs,
            element: withSuspense(Components.EngineerExploreSavedJobs),
          },
          {
            path: urls.engineer.home.my_jobs,
            element: withSuspense(Components.EngineerMyJobsPage),
          },
          {
            path: urls.engineer.home.application_history,
            element: withSuspense(Components.EngineerApplicationHistoryPage),
          },
          {
            path: `${urls.engineer.home.my_jobs}/:jobId`,
            element: withSuspense(Components.EngineerJobDetailsPage),
          },
          {
            path: `${urls.engineer.home.my_jobs}/:jobId/break-details`,
            element: withSuspense(Components.EngineerBreakDetails),
          },
          {
            path: `${urls.engineer.home.my_jobs}/:jobId`,
            element: withSuspense(Components.EngineerOfferPages),
          },
          {
            path: urls.engineer.home.search_result,
            element: withSuspense(Components.EngineerSearchResult),
          },
          //Planned to remove search analytics feature.
          // {
          //   path: urls.engineer.home.search_analytics,
          //   element: withSuspense(Components.EngineerSearchAnalyticsPage),
          // },
          {
            path: urls.engineer.home.privacy_policy,
            element: withSuspense(Components.EngineerPrivacyPolicy),
          },
          {
            path: urls.engineer.home.chat,
            element: withSuspense(Components.EngineerChatPage),
          },
          {
            path: urls.engineer.home.notifications,
            element: withSuspense(Components.EngineerNotificationListPage),
          },
        ],
      },
    ];
  }
}
