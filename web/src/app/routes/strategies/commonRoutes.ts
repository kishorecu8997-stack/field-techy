import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { BASE, absoluteUrls } from "@/config/urls";
import { withSuspense } from "../WithSuspense";
import * as Components from "../utils/lazyComponents";
import React from "react";

/**
 * Common routes that don't belong to any specific role
 * These are public routes like landing pages, 404, etc.
 */
export class CommonRoutes {
  /**
   * Get common public routes
   */
  static getCommonRoutes(): RouteObject[] {
    return [
      // Default route redirecting to client login
      {
        path: "/",
        element: React.createElement(Navigate, {
          to: absoluteUrls.client.auth.login,
          replace: true,
        }),
      },
      // Landing page
      {
        path: BASE.LANDING,
        element: withSuspense(Components.FTLayout),
        children: [
          { index: true, element: withSuspense(Components.FTLanding) },
          {
            path: absoluteUrls.ft_landing.landing,
            element: withSuspense(Components.FTLanding),
          },
        ],
      },
      // 404 Not Found - should be last
      {
        path: "*",
        element: withSuspense(Components.NotFound),
      },
    ];
  }
}
