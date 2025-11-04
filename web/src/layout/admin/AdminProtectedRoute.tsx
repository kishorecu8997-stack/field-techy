// AdminProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const isAdminAuth = !!localStorage.getItem("adminToken");
  return isAdminAuth ? <Outlet /> : <Navigate to="/admin/auth/login" replace />;
}
