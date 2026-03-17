import { createBrowserRouter, Outlet } from "react-router-dom";
import { RouteFactory } from "./factory/routeFactory";
import GlobalErrorBoundary, {
  RouteErrorBoundary,
} from "@/shared/components/commonUI/GlobalErrorBoundary";

/**
 * Configures the application's routing structure using React Router.
 *
 * Uses Strategy Pattern to organize routes by role:
 * - Engineer routes (public auth + private dashboard)
 * - Client routes (public auth + private dashboard)
 * - Admin routes (public auth + private dashboard)
 * - Common routes (landing, 404, etc.)
 */
const routeFactory = new RouteFactory();

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <GlobalErrorBoundary>
        <Outlet />
      </GlobalErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary />,
    children: routeFactory.getAllRoutes(),
  },
]);
