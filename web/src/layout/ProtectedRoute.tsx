import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { absoluteUrls, BASE } from "@/config/urls";
import { UserRole } from "@/shared/enums/users";
import { toast } from "react-toastify";

/**
 * Determines the appropriate login URL based on the current pathname.
 * This ensures users are redirected to the correct module's login page.
 *
 * @param pathname - The current URL pathname
 * @returns The login URL for the appropriate module
 */
const getModuleLoginUrl = (pathname: string): string => {
  if (pathname.startsWith(BASE.ENGINEER)) {
    return absoluteUrls.engineer.auth.login;
  }
  if (pathname.startsWith(BASE.ADMIN)) {
    return absoluteUrls.admin.auth.login;
  }
  return absoluteUrls.client.auth.login;
};

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

/**
 * ProtectedRoute component.
 *
 * Wraps child components and ensures that only authenticated users can access them.
 * Redirects to the appropriate login page based on the module being accessed
 * if the user is not authenticated.
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
  const location = useLocation();

  const hasInsufficientPermissions =
    session && requiredRole && session.role !== requiredRole;

  useEffect(() => {
    if (hasInsufficientPermissions && session && requiredRole) {
      console.error(
        `Access denied: User with role "${session.role}" does not have required permission "${requiredRole}"`,
      );
      toast.error("Something went wrong. Please log in again.");
      logout();
    }
  }, [hasInsufficientPermissions, session, requiredRole, logout]);

  if (!session) {
    return <Navigate to={getModuleLoginUrl(location.pathname)} replace />;
  }

  if (requiredRole && session.role !== requiredRole) {
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
