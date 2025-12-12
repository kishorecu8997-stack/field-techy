import { Navigate, Outlet } from 'react-router-dom';
import { useUserSessionStore } from '../store/useUserSessionStore';
import { absoluteUrls } from '@/config/urls';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

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
