import type { RouteObject } from "react-router-dom";
import type { RouteStrategy } from "../types/routeTypes";
import { EngineerRouteStrategy } from "../strategies/engineerRoutes";
import { ClientRouteStrategy } from "../strategies/clientRoutes";
import { AdminRouteStrategy } from "../strategies/adminRoutes";
import { CommonRoutes } from "../strategies/commonRoutes";

/**
 * Route Factory
 * Uses Strategy Pattern to combine all route strategies
 */
export class RouteFactory {
  private strategies: RouteStrategy[];

  constructor() {
    // Initialize all route strategies
    this.strategies = [
      new EngineerRouteStrategy(),
      new ClientRouteStrategy(),
      new AdminRouteStrategy(),
    ];
  }

  /**
   * Get all public routes from all strategies
   */
  getPublicRoutes(): RouteObject[] {
    const publicRoutes: RouteObject[] = [];

    // Get public routes from each strategy
    this.strategies.forEach((strategy) => {
      publicRoutes.push(...strategy.getPublicRoutes());
    });

    // Add common routes (landing, 404, etc.)
    publicRoutes.push(...CommonRoutes.getCommonRoutes());

    return publicRoutes;
  }

  /**
   * Get all private routes from all strategies
   */
  getPrivateRoutes(): RouteObject[] {
    const privateRoutes: RouteObject[] = [];

    // Get private routes from each strategy
    this.strategies.forEach((strategy) => {
      privateRoutes.push(...strategy.getPrivateRoutes());
    });

    return privateRoutes;
  }

  /**
   * Get all routes (public + private) combined
   */
  getAllRoutes(): RouteObject[] {
    return [...this.getPublicRoutes(), ...this.getPrivateRoutes()];
  }
}

