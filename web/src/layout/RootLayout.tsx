import type { JSX } from "react";
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
  return (
    <div className="w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1080px] mx-auto h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
