import type { RouteObject } from "react-router-dom";
import React from "react";
import { BASE, urls, absoluteUrls } from "@/config/urls";
import { UserRole } from "@/shared/enums/users";
import { withSuspense } from "../WithSuspense";
import ProtectedRoute from "@/layout/ProtectedRoute";
import AuthRedirect from "@/layout/AuthRedirect";
import type { RouteStrategy } from "../types/routeTypes";
import * as Components from "../utils/lazyComponents";

/**
 * Admin Route Strategy
 * Implements RouteStrategy for admin-specific routes
 */
export class AdminRouteStrategy implements RouteStrategy {
  /**
   * Get public routes (authentication pages)
   */
  getPublicRoutes(): RouteObject[] {
    return [
      {
        path: absoluteUrls.admin.auth.login,
        element: React.createElement(
          AuthRedirect,
          null,
          withSuspense(Components.AdminLogin),
        ),
      },
      {
        path: absoluteUrls.admin.auth.forget_password,
        element: withSuspense(Components.AdminForgotPassword),
      },
      {
        path: absoluteUrls.admin.auth.otp,
        element: withSuspense(Components.AdminVerifyOTP),
      },
      {
        path: absoluteUrls.admin.auth.reset_password,
        element: withSuspense(Components.AdminResetPassword),
      },
    ];
  }

  /**
   * Get private routes (protected dashboard pages)
   */
  getPrivateRoutes(): RouteObject[] {
    return [
      {
        path: BASE.ADMIN,
        element: React.createElement(ProtectedRoute, {
          requiredRole: UserRole.ADMIN,
          children: React.createElement(
            React.Fragment,
            null,
            withSuspense(Components.AdminLayout),
          ),
        }),
        children: [
          { index: true, element: withSuspense(Components.AdminDashboard) },
          {
            path: urls.admin.home.dashboard,
            element: withSuspense(Components.AdminDashboard),
          },
          {
            path: urls.admin.home.manage_engineer,
            element: withSuspense(Components.AdminManageEngineer),
          },
          {
            path: urls.admin.home.manage_engineer_add,
            element: withSuspense(Components.AdminManageEngineerAdd),
          },
          {
            path: urls.admin.home.manage_engineer_view,
            element: withSuspense(Components.AdminManageEngineerView),
          },
          {
            path: `${urls.admin.home.manage_engineer_edit}/:id?`,
            element: withSuspense(Components.AdminManageEngineerEdit),
          },
          {
            path: urls.admin.home.manage_client,
            element: withSuspense(Components.AdminManageClient),
          },
          {
            path: urls.admin.home.manage_jobs,
            element: withSuspense(Components.AdminManageJobs),
          },
          {
            path: urls.admin.home.manage_categories,
            element: withSuspense(Components.AdminManageJobCategory),
          },
          {
            path: urls.admin.home.manage_categories_add,
            element: withSuspense(Components.AdminManageJobCategoryAdd),
          },
          {
            path: `${urls.admin.home.manage_categories_edit}/:id?`,
            element: withSuspense(Components.AdminManageJobCategoryEdit),
          },
          {
            path: urls.admin.home.manage_rate_card,
            element: withSuspense(Components.AdminManageRateCard),
          },
          {
            path: urls.admin.home.edit_rate_card,
            element: withSuspense(Components.EditAdminRateCard),
          },
          {
            path: urls.admin.home.view_rate_card,
            element: withSuspense(Components.ViewAdminRateCard),
          },
          {
            path: urls.admin.home.add_rate_card,
            element: withSuspense(Components.AddAdminRateCard),
          },
          {
            path: urls.admin.home.manage_payment,
            element: withSuspense(Components.AdminManagePayment),
          },
          {
            path: urls.admin.home.manage_transactions,
            element: withSuspense(Components.AdminManageTransactions),
          },
          {
            path: urls.admin.home.wallet_overview,
            element: withSuspense(Components.WalletOverview),
          },
          {
            path: `${urls.admin.home.wallet_overview_view}/:id?`,
            element: withSuspense(Components.WalletView),
          },
          {
            path: urls.admin.home.wallet_transaction_requests,
            element: withSuspense(Components.WalletTransactionRequests),
          },
          {
            path: urls.admin.home.manage_notification,
            element: withSuspense(Components.ManageNotification),
          },
          {
            path: urls.admin.home.manage_notification_add,
            element: withSuspense(Components.ManageNotificationAdd),
          },
          {
            path: `${urls.admin.home.manage_notification_edit}/:id?`,
            element: withSuspense(Components.ManageNotificationEdit),
          },
          {
            path: urls.admin.home.manage_sub_admin,
            element: withSuspense(Components.ManageSubAdmin),
          },
          {
            path: urls.admin.home.manage_sub_admin_add,
            element: withSuspense(Components.AddSubAdmin),
          },
          {
            path: `${urls.admin.home.manage_sub_admin_edit}/:id?`,
            element: withSuspense(Components.EditSubAdmin),
          },
          {
            path: urls.admin.home.manage_cms,
            element: withSuspense(Components.ManageCMS),
          },
          {
            path: urls.admin.home.settings,
            element: withSuspense(Components.Settings),
          },
          {
            path: urls.admin.home.profile,
            element: withSuspense(Components.AdminProfile),
          },
          {
            path: urls.admin.home.received_notification,
            element: withSuspense(Components.ReceivedNotification),
          },
          {
            path: urls.admin.home.corporateClientAdd,
            element: withSuspense(Components.CorporateClientAdd),
          },
          {
            path: urls.admin.home.homeClientAdd,
            element: withSuspense(Components.HomeClientAdd),
          },
          {
            path: urls.admin.home.corporateClientEdit,
            element: withSuspense(Components.CorporateClientEdit),
          },
          {
            path: urls.admin.home.homeClientEdit,
            element: withSuspense(Components.HomeClientEdit),
          },
          {
            path: urls.admin.home.corporateClientView,
            element: withSuspense(Components.CorporateClientView),
          },
          {
            path: urls.admin.home.homeClientView,
            element: withSuspense(Components.HomeClientView),
          },
          {
            path: urls.admin.home.edit_role,
            element: withSuspense(Components.AdminEditRolePage),
          },
          {
            path: urls.admin.home.roleList,
            element: withSuspense(Components.RoleListPage),
          },
          {
            path: urls.admin.home.add_role,
            element: withSuspense(Components.AddRolePage),
          },
          {
            path: urls.admin.home.manage_jobs_view,
            element: withSuspense(Components.ManageJobView),
          },
        ],
      },
    ];
  }
}
