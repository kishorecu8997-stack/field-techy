import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { useAdminGetById } from "@/shared/apiServices/admin/adminService";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useAdminProfileStore } from "@/shared/store/useAdminProfileStore";
import type { getAdminByIdResponse } from "@/shared/apiServices/admin/adminTypes";

/**
 * AdminLayout
 *
 * Root layout component for the admin section. Renders a responsive layout with
 * collapsible sidebar navigation, header bar, and main content area using
 * React Router's Outlet for child route rendering.
 *
 * @returns {JSX.Element} Admin dashboard layout structure
 */
export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /**
   * toggleSidebar
   *
   * Toggles the sidebar's collapsed state. Used by the Header component
   * to allow users to expand/collapse the navigation sidebar.
   */
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  /* ---------- Admin Profile Integration ---------- */
  const { session } = useUserSessionStore();
  const { setAdminProfile } = useAdminProfileStore();
  const { mutate: getAdminById } = useAdminGetById({
    onSuccess: (data: getAdminByIdResponse) => {
      setAdminProfile({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profilePicture: data.profilePicture,
      });
    },
  });

  useEffect(() => {
    if (session?.userId) {
      getAdminById(session.userId);
    }
  }, [session?.userId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden h-screen ">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <main className="flex flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-800 h-full w-full justify-center items-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
