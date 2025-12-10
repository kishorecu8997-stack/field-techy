import React from "react";
import { absoluteUrls, BASE, urls } from "@/config/urls";
import { withSuspense } from "./WithSuspense";
import type { RouteObject } from "react-router-dom";

const AdminLayout = React.lazy(() => import("@/layout/admin/AdminLayout"));
const AdminLogin = React.lazy(() => import("@/pages/admin/auth/login/Login"));
const AdminForgotPassword = React.lazy(() => import("@/pages/admin/auth/ForgotPassword"));
const AdminResetPassword = React.lazy(() => import("@/pages/admin/auth/ResetPassword"));
const AdminVerifyOTP = React.lazy(() => import("@/pages/admin/auth/VerifyOTP"));
const AdminDashboard = React.lazy(() => import("@/pages/admin/dashboard"));
const AdminManageEngineer = React.lazy(() => import("@/pages/admin/engineer"));
const AdminManageEngineerAdd = React.lazy(() => import("@/pages/admin/engineer/addEngineer/AddEngineer"));
const AdminManageEngineerView = React.lazy(() => import("@/pages/admin/engineer/userDetails"));
const AdminManageEngineerEdit = React.lazy(() => import("@/pages/admin/engineer/editEngineer/EditEngineer"));
const AdminManageClient = React.lazy(() => import("@/pages/admin/client"));
const AdminManageJobCategory = React.lazy(() => import("@/pages/admin/job_category"));
const AdminManageJobCategoryAdd = React.lazy(() => import("@/pages/admin/job_category/AddCategory"));
const AdminManageJobCategoryEdit = React.lazy(() => import("@/pages/admin/job_category/EditCategory"));
const AdminManageJobs = React.lazy(() => import("@/pages/admin/jobs"));
const AdminManageRateCard = React.lazy(() => import("@/pages/admin/rate_card"));
const EditAdminRateCard = React.lazy(() => import("@/pages/admin/rate_card/components/EditRateCard"));
const ViewAdminRateCard = React.lazy(() => import("@/pages/admin/rate_card/components/EditRateCard"));
const AddAdminRateCard = React.lazy(() => import("@/pages/admin/rate_card/components/AddRateCard"));
const AdminManagePayment = React.lazy(() => import("@/pages/admin/payment"));
const AdminManageTransactions = React.lazy(() => import("@/pages/admin/transactions"));
const WalletOverview = React.lazy(() => import("@/pages/admin/wallet_management/wallet_overview"));
const WalletView = React.lazy(() => import("@/pages/admin/wallet_management/wallet_overview/WalletView"));
const WalletTransactionRequests = React.lazy(() => import("@/pages/admin/wallet_management/transaction_requests"));
const ManageNotification = React.lazy(() => import("@/pages/admin/manage_notification"));
const ManageNotificationAdd = React.lazy(() => import("@/pages/admin/manage_notification/AddNotification"));
const ManageSubAdmin = React.lazy(() => import("@/pages/admin/sub_admin"));
const AddSubAdmin = React.lazy(() => import("@/pages/admin/sub_admin/AddSubAdmin"));
const EditSubAdmin = React.lazy(() => import("@/pages/admin/sub_admin/EditSubAdmin"));
const ManageCMS = React.lazy(() => import("@/pages/admin/manage_cms"));
const Settings = React.lazy(() => import("@/pages/admin/settings"));
const AdminProfile = React.lazy(() => import("@/pages/admin/profile"));
const ReceivedNotification = React.lazy(() => import("@/pages/admin/received_notification"));
const corporateClientAdd = React.lazy(() => import("@/pages/admin/client/components/add_components/CorporateClientForm"));
const homeClientAdd = React.lazy(() => import("@/pages/admin/client/components/add_components/HomeClientForm"));
const corporateClientEdit = React.lazy(() => import("@/pages/admin/client/components/edit_components/CorporateClientEditForm"));
const homeClientEdit = React.lazy(() => import("@/pages/admin/client/components/edit_components/HomeClientEditForm"));
const corporateClientView = React.lazy(() => import("@/pages/admin/client/components/view_components/CorporateClientViewForm"));
const homeClientView = React.lazy(() => import("@/pages/admin/client/components/view_components/HomeClientViewForm"));
const adminEditRolePage = React.lazy(() => import("@/pages/admin/sub_admin/role_pages/PermissionList"));
const roleListPage = React.lazy(() => import("@/pages/admin/sub_admin/role_pages/RolePage"));
const AddRolePage = React.lazy(() => import("@/pages/admin/sub_admin/role_pages/PermissionList"));
const ManageJobView = React.lazy(() => import("@/pages/admin/jobs/ManageJobView"));

export const adminRoutes: RouteObject[] = [
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
            path: urls.admin.home.dashboard,
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
            path: urls.admin.home.add_role,
            element: withSuspense(AddRolePage),
          },
          {
            path: urls.admin.home.manage_jobs_view,
            element: withSuspense(ManageJobView),
          },
        ],
      },
    ],
  },
];
