import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { withSuspense } from "./WithSuspense";
import { engineerRoutes } from "./engineerRoutes";
import { clientRoutes } from "./clientRoutes";
import { adminRoutes } from "./adminRoutes";
import AppLandingRoute from "@/layout/AppLandingRoute";

const NotFound = React.lazy(() => import("@/shared/components/NotFound"));

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
    element: <AppLandingRoute />,
  },
  ...engineerRoutes,
  ...clientRoutes,
  ...adminRoutes,

  { path: "*", element: withSuspense(NotFound) },
]);
