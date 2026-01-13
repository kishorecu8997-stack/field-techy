/**
 * Centralized lazy component exports
 *
 * This file re-exports all lazy-loaded components from their respective modules
 * for convenient importing. Components are organized by domain/role.
 *
 * Usage:
 * ```ts
 * import * as Components from './lazyComponents';
 * // or
 * import { EngineerHome, ClientDashboard } from './lazyComponents';
 * ```
 */

// Common components (layouts, shared components)
export * from "./common";

// Engineer components
export * from "./engineer";

// Client components
export * from "./client";

// Admin components
export * from "./admin";

// Landing pages
export * from "./landing";
