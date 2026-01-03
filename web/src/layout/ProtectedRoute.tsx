import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { absoluteUrls } from "@/config/urls";
import { UserRole } from "@/shared/enums/users";

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * Optional role requirement. If provided, only users with this role can access.
   * If not provided, any authenticated user can access.
   */
  requiredRole?: UserRole;
}

/**
 * ProtectedRoute component.
 *
 * Wraps child components and ensures that only authenticated users can access them.
 * Redirects to the appropriate login page if the user is not authenticated.
 * Optionally restricts access to users with a specific role.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Child components to render if authenticated.
 * @param {UserRole} [props.requiredRole] - Optional role requirement for access.
 * @returns {JSX.Element} The child components or a redirect to login.
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const session = useUserSessionStore((state) => state.session);

  // If no session, redirect to login
  if (!session) {
    // Default to client login, but could be made configurable
    return <Navigate to={absoluteUrls.client.auth.login} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && session.role !== requiredRole) {
    // Redirect based on user's role to their appropriate login
    if (session.role === UserRole.ENGINEER) {
      return <Navigate to={absoluteUrls.engineer.auth.login} replace />;
    } else if (session.role === UserRole.CLIENT) {
      return <Navigate to={absoluteUrls.client.auth.login} replace />;
    }
    // Default fallback
    return <Navigate to={absoluteUrls.client.auth.login} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
