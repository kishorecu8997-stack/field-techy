import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { absoluteUrls } from "@/config/urls";
import { UserRole } from "@/shared/enums/users";
import { config } from "@/shared/config/configService";

interface AuthRedirectProps {
  children: ReactNode;
}

/**
 * AuthRedirect component
 *
 * Redirects authenticated users away from auth pages (login, signup, etc.)
 * to their appropriate dashboard based on their role.
 *
 * If the user has a valid session, they are redirected to their dashboard.
 * If no session or expired session, the children (auth pages) are rendered.
 *
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Auth pages to render if not authenticated
 * @returns {JSX.Element} Redirect to dashboard or children
 */
const AuthRedirect: FC<AuthRedirectProps> = ({ children }) => {
  const session = useUserSessionStore((state) => state.session);

  // If no session, render auth pages
  if (!session || !session.initiatedAt) {
    return <>{children}</>;
  }

  // Check if token has expired
  const now = Date.now();
  const elapsed = now - session.initiatedAt;
  const isExpired = elapsed >= config.tokenExpirationDuration;

  // If expired, render auth pages (user needs to login again)
  if (isExpired) {
    return <>{children}</>;
  }

  // If authenticated and valid, redirect to appropriate dashboard
  if (session.role === UserRole.ENGINEER) {
    return <Navigate to={absoluteUrls.engineer.home.dashboard} replace />;
  } else if (session.role === UserRole.CLIENT) {
    return <Navigate to={absoluteUrls.client.home.dashboard} replace />;
  } else if (session.role === UserRole.ADMIN) {
    return <Navigate to={absoluteUrls.admin.home.dashboard} replace />;
  }

  // Default fallback - render auth pages
  return <>{children}</>;
};

export default AuthRedirect;

