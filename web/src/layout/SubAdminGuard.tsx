import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { absoluteUrls } from "@/config/urls";

interface SubAdminGuardProps {
  children: ReactNode;
}

/**
 * SubAdminGuard
 *
 * Route-level guard that prevents sub-admins from accessing pages that are
 * reserved for top-level admins only (e.g. Sub-Admin management).
 *
 * A sub-admin is identified by having a `regionId` in their session — this is
 * the value set when a scoped/regional admin logs in.
 *
 * If a sub-admin attempts to navigate directly to a restricted URL,
 * they are silently redirected to the admin dashboard.
 */
const SubAdminGuard: FC<SubAdminGuardProps> = ({ children }) => {
  const regionId = useUserSessionStore((s) => s.session?.regionId);

  if (regionId) {
    return <Navigate to={absoluteUrls.admin.home.dashboard} replace />;
  }

  return <>{children}</>;
};

export default SubAdminGuard;
