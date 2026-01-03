import type { RouteObject } from "react-router-dom";
import type { UserRole } from "@/shared/enums/users";

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  element:
    | React.LazyExoticComponent<React.ComponentType<any>>
    | React.ReactElement;
  children?: RouteConfig[];
  index?: boolean;
}

/**
 * Public route configuration (no authentication required)
 */
export interface PublicRouteConfig extends RouteConfig {
  isPublic: true;
}

/**
 * Private route configuration (authentication required)
 */
export interface PrivateRouteConfig extends RouteConfig {
  isPublic: false;
  requiredRole?: UserRole;
}

/**
 * Route strategy interface for different user roles
 */
export interface RouteStrategy {
  /**
   * Get public routes (auth routes, landing pages, etc.)
   */
  getPublicRoutes(): RouteObject[];

  /**
   * Get private routes (dashboard, protected pages, etc.)
   */
  getPrivateRoutes(): RouteObject[];
}
