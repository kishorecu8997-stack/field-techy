import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component.
 *
 * Wraps child components and ensures that only authenticated users can access them.
 * Redirects to login page if the user is not authenticated.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - Child components to render if authenticated.
 * @returns {JSX.Element} The child components or a redirect to login.
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  //TODO Replace this with your actual authentication logic
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
