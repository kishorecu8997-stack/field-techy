import React from "react";
import LeftPanel from "./components/LeftPannel";
import RightPanel from "./components/RightPannel";

/**
 * The main layout component for authentication-related pages.
 *
 * This component provides a responsive two-panel layout. On larger screens (md and up),
 * it displays a `LeftPanel` (30% width) and a `RightPanel` (70% width) side-by-side.
 * On smaller screens, both panels stack vertically, each taking full width.
 *
 * It serves as the entry point for the authentication routes, providing a consistent
 * visual structure for sign-in, sign-up, and password management flows.
 * @returns {JSX.Element} The rendered layout with the LeftPanel and RightPanel.
 */
const Layout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white  md:bg-gradient-to-b from-emerald-800 to-blue-950">
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