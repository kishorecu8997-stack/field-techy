// src/components/RightPanel.tsx
import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Right Panel component that serves as a container for dynamic content.
 * Renders the current route's component using React Router's Outlet,
 * providing a consistent layout structure with proper spacing and alignment.
 *
 * @component
 * @example
 * return (
 *   <RightPanel />
 * )
 *
 * @returns {JSX.Element} The rendered Right Panel container with outlet for routing
 */
const RightPanel: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto dark:bg-gray-800 text-gray-900 bg-white dark:text-gray-100 flex flex-col items-center justify-center">
      <div className="p-4 md:p-6 lg:p-8 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-start md:justify-center min-h-full w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
