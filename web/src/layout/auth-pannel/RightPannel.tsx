// src/components/RightPanel.tsx
import React from "react";
import { Outlet } from "react-router-dom";

/**
 * A layout component that serves as the main content area for authentication pages.
 *
 * This component creates a consistent, centered layout for the right-hand side of the screen.
 * It uses React Router's `<Outlet />` component to render the content of the currently
 * active nested route (e.g., Login, SignUp, ResetPassword).
 *
 * @returns {JSX.Element} The rendered right panel containing the active route's component.
 */
const RightPanel: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto dark:bg-gray-800 text-gray-900 bg-white dark:text-gray-100 flex flex-col items-center justify-center">
      <div className=" w-full  mx-auto">
        <div className="flex flex-col items-center justify-start md:justify-center min-h-full w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
