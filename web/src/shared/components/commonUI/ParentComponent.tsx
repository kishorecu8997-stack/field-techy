// In your parent file, e.g., DashboardLayout.tsx or MainPage.tsx

import React, { useState } from "react";
import DrawerMenu from "@/shared/components/DrawerMenu";
import ProfileSidebar from "@/pages/engineer/components/ProfileSidebar/ProfileSidebar";

const ParentComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const handleMenuItemClick = (key: string) => {
    switch (key) {
      case "profile":
        setShowProfileSidebar(true);
        setDrawerOpen(false);
        break;
      // handle other keys...
      default:
        setShowProfileSidebar(false);
        setDrawerOpen(true);
        break;
    }
  };

  return (
    <>
      <button onClick={() => setDrawerOpen(true)}>Open Drawer</button>
      {drawerOpen && <DrawerMenu onMenuItemClick={handleMenuItemClick} />}
      {showProfileSidebar && <ProfileSidebar />}
    </>
  );
};

export default ParentComponent;
