import { createBrowserRouter } from "react-router-dom";
import { RouteFactory } from "./factory/routeFactory";

/**
 * Configures the application's routing structure using React Router.
 * 
 * Uses Strategy Pattern to organize routes by role:
 * - Engineer routes (public auth + private dashboard)
 * - Client routes (public auth + private dashboard)
 * - Admin routes (public auth + private dashboard)
 * - Common routes (landing, 404, etc.)
 * 
 * Routes are separated into:
 * - Public routes: Authentication pages, landing pages
 * - Private routes: Protected dashboard pages requiring authentication
 * 
 * @module routes
 * @see {@link https://reactrouter.com|React Router Documentation}
 */
const routeFactory = new RouteFactory();
export const routes = createBrowserRouter(routeFactory.getAllRoutes());
