import React from "react";
import LeftPanel from "./LeftPannel";
import RightPanel from "./RightPannel";

/**
 * Main layout component that divides the screen into two panels.
 * On desktop, displays a left panel with 30% width and a right panel with 70% width.
 * On mobile, both panels stack vertically with full width.
 * Provides a responsive split-screen layout for authentication flows.
 *
 * @component
 * @example
 * return (
 *   <Layout />
 * )
 *
 * @returns {JSX.Element} The rendered Layout component with left and right panels
 */
const Layout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:min-h-screen overflow-hidden bg-white  md:bg-gradient-to-b from-emerald-800 to-blue-950">
      <div className="w-full hidden md:block  md:w-[30%] flex-shrink-0">
        <LeftPanel />
      </div>
      <div className="flex-1 w-full overflow-y-auto rounded-t-xl md:rounded-none ">
        <RightPanel />
      </div>
    </div>
  );
};

export default Layout;
