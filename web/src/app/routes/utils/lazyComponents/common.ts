import React from "react";

/**
 * Common lazy-loaded components
 * Shared components used across the application
 */

// Common Components
export const LiveChatWidget = React.lazy(
  () => import("@/shared/components/Support/LiveChatWidget"),
);

export const NotFound = React.lazy(
  () => import("@/shared/components/NotFound"),
);

// Layouts
export const Layout = React.lazy(() => import("@/layout/auth-pannel"));
export const RootLayout = React.lazy(() => import("@/layout/RootLayout"));
export const ClientLayout = React.lazy(() => import("@/layout/ClientLayout"));
export const AdminLayout = React.lazy(
  () => import("@/layout/admin/AdminLayout"),
);
export const FTLayout = React.lazy(() => import("@/layout/FTLayout"));
