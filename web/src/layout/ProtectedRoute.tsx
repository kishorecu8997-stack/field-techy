import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { absoluteUrls } from "@/config/urls";
import { UserRole } from "@/shared/enums/users";
import { toast } from "react-toastify";

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
 * If an authenticated user doesn't have the required role, they are logged out,
 * shown an error message, and redirected to login. A console error is logged
 * indicating the permission issue.
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
  const logout = useUserSessionStore((state) => state.logout);

  // Check if user lacks required role
  const hasInsufficientPermissions =
    session && requiredRole && session.role !== requiredRole;

  // Handle logout and error notification for insufficient permissions
  useEffect(() => {
    if (hasInsufficientPermissions && session && requiredRole) {
      console.error(
        `Access denied: User with role "${session.role}" does not have required permission "${requiredRole}"`
      );
      toast.error("Something went wrong. Please log in again.");
      logout();
    }
  }, [hasInsufficientPermissions, session, requiredRole, logout]);

  // If no session, redirect to login
  if (!session) {
    // Default to client login, but could be made configurable
    return <Navigate to={absoluteUrls.client.auth.login} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && session.role !== requiredRole) {
    // Determine which login page to redirect to based on user's role
    let loginUrl: string = absoluteUrls.client.auth.login;
    if (session.role === UserRole.ENGINEER) {
      loginUrl = absoluteUrls.engineer.auth.login;
    } else if (session.role === UserRole.ADMIN) {
      loginUrl = absoluteUrls.admin.auth.login;
    }

    return <Navigate to={loginUrl} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
