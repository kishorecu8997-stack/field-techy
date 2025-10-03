// src/components/RightPanel.tsx
import React from "react";
import { Outlet } from "react-router-dom";

const RightPanel: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-white flex flex-col items-center justify-center">
      <div className="p-4 md:p-6 lg:p-8 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-start md:justify-center min-h-full w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;