import { Navigate, Outlet } from "react-router-dom";

/**
 * AdminProtectedRoute
 * 
 * A route protection component that ensures only authenticated admin users can access
 * protected admin routes. Checks for the presence of an admin token in localStorage
 * to determine authentication status.
 * 
 * If authenticated: Renders the child routes using React Router's Outlet
 * If not authenticated: Redirects to the admin login page
 * 
 * @returns {JSX.Element} Either the protected route content or a redirect to login
 */
export default function AdminProtectedRoute() {
  const isAdminAuth = !!localStorage.getItem("adminToken");
  return isAdminAuth ? <Outlet /> : <Navigate to="/admin/auth/login" replace />;
}
