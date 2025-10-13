import Drawer from "@/shared/components/Drawer";
import Header from "@/shared/components/Header";
import { useState, type JSX } from "react";
import { Outlet } from "react-router-dom";

/**
 * Root layout component for the application.
 *
 * Provides a centered container with responsive max-widths
 * and renders nested routes via `Outlet`.
 *
 * @component
 * @returns {JSX.Element} The layout wrapper for child routes.
 */
const RootLayout = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900">
      <div className=" xl:container w-full mx-auto h-screen flex flex-col  dark:text-gray-100 transition-colors p-1">
        <div className="flex-1 overflow-auto">
          <Header
            onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
            isDrawerOpen={isDrawerOpen}
          />
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
