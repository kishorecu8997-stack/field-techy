import React from "react";

/**
 * Admin-related lazy-loaded components
 * All components specific to admin role
 */

// Admin Auth Components
export const AdminLogin = React.lazy(
  () => import("@/pages/admin/auth/login/Login"),
);
export const AdminForgotPassword = React.lazy(
  () => import("@/pages/admin/auth/ForgotPassword"),
);
export const AdminResetPassword = React.lazy(
  () => import("@/pages/admin/auth/ResetPassword"),
);
export const AdminVerifyOTP = React.lazy(
  () => import("@/pages/admin/auth/VerifyOTP"),
);

// Admin Dashboard Components
export const AdminDashboard = React.lazy(
  () => import("@/pages/admin/dashboard"),
);
export const AdminManageEngineer = React.lazy(
  () => import("@/pages/admin/engineer"),
);
export const AdminManageEngineerAdd = React.lazy(
  () => import("@/pages/admin/engineer/addEngineer/AddEngineer"),
);
export const AdminManageEngineerView = React.lazy(
  () => import("@/pages/admin/engineer/userDetails"),
);
export const AdminManageEngineerEdit = React.lazy(
  () => import("@/pages/admin/engineer/editEngineer/EditEngineer"),
);
export const AdminManageClient = React.lazy(
  () => import("@/pages/admin/client"),
);
export const AdminManageJobCategory = React.lazy(
  () => import("@/pages/admin/job_category"),
);
export const AdminManageJobCategoryAdd = React.lazy(
  () => import("@/pages/admin/job_category/AddCategory"),
);
export const AdminManageJobCategoryEdit = React.lazy(
  () => import("@/pages/admin/job_category/EditCategory"),
);
export const AdminManageJobs = React.lazy(() => import("@/pages/admin/jobs"));
export const AdminManageRateCard = React.lazy(
  () => import("@/pages/admin/rate_card"),
);
export const EditAdminRateCard = React.lazy(
  () => import("@/pages/admin/rate_card/components/EditRateCard"),
);
export const ViewAdminRateCard = React.lazy(
  () => import("@/pages/admin/rate_card/components/EditRateCard"),
);
export const AddAdminRateCard = React.lazy(
  () => import("@/pages/admin/rate_card/components/AddRateCard"),
);
export const AdminManagePayment = React.lazy(
  () => import("@/pages/admin/payment"),
);
export const AdminManageTransactions = React.lazy(
  () => import("@/pages/admin/transactions"),
);
export const WalletOverview = React.lazy(
  () => import("@/pages/admin/wallet_management/wallet_overview"),
);
export const WalletView = React.lazy(
  () => import("@/pages/admin/wallet_management/wallet_overview/WalletView"),
);
export const WalletTransactionRequests = React.lazy(
  () => import("@/pages/admin/wallet_management/transaction_requests"),
);
export const ManageNotification = React.lazy(
  () => import("@/pages/admin/manage_notification"),
);
export const ManageNotificationAdd = React.lazy(
  () => import("@/pages/admin/manage_notification/AddNotification"),
);
export const ManageNotificationEdit = React.lazy(
  () => import("@/pages/admin/manage_notification/EditNotification"),
);
export const ManageSubAdmin = React.lazy(
  () => import("@/pages/admin/sub_admin"),
);
export const AddSubAdmin = React.lazy(
  () => import("@/pages/admin/sub_admin/AddSubAdmin"),
);
export const EditSubAdmin = React.lazy(
  () => import("@/pages/admin/sub_admin/EditSubAdmin"),
);
export const ManageCMS = React.lazy(() => import("@/pages/admin/manage_cms"));
export const Settings = React.lazy(() => import("@/pages/admin/settings"));
export const AdminProfile = React.lazy(() => import("@/pages/admin/profile"));
export const ReceivedNotification = React.lazy(
  () => import("@/pages/admin/received_notification"),
);
export const CorporateClientAdd = React.lazy(
  () =>
    import("@/pages/admin/client/components/add_components/CorporateClientForm"),
);
export const HomeClientAdd = React.lazy(
  () => import("@/pages/admin/client/components/add_components/HomeClientForm"),
);
export const CorporateClientEdit = React.lazy(
  () =>
    import("@/pages/admin/client/components/edit_components/CorporateClientEditForm"),
);
export const HomeClientEdit = React.lazy(
  () =>
    import("@/pages/admin/client/components/edit_components/HomeClientEditForm"),
);
export const CorporateClientView = React.lazy(
  () =>
    import("@/pages/admin/client/components/view_components/CorporateClientViewForm"),
);
export const HomeClientView = React.lazy(
  () =>
    import("@/pages/admin/client/components/view_components/HomeClientViewForm"),
);
export const ManageJobView = React.lazy(
  () => import("@/pages/admin/jobs/ManageJobView"),
);
