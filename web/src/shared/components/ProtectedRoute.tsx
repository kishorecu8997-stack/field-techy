import { Navigate, Outlet } from "react-router-dom";
import { useUserSessionStore } from "../store/useUserSessionStore";
import { absoluteUrls } from "@/config/urls";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * A component representing the protected route.
 *
 * This component renders a protected route that allows users to access the route only if they are authenticated.
 * It utilizes the reusable `Navigate` component for handling the navigation.
 *
 * This component is designed to be rendered within a `Route` from `react-router-dom`
 * to connect the protected route to the main route.
 *
 * @param {ProtectedRouteProps} props - The props for the ProtectedRoute component.
 * @param {string} props.redirectPath - The path to redirect to if the user is not authenticated.
 * @param {React.ReactNode} props.children - The children to render if the user is authenticated.
 *
 * @returns {JSX.Element} The protected route.
 *
 * @example
 * <ProtectedRoute>
 *   <MyJobsPage />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  redirectPath = absoluteUrls.client.auth.login,
  children,
}: ProtectedRouteProps) => {
  const session = useUserSessionStore((state) => state.session);

  if (!session) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
