export interface DrawerMenuProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}

export type MenuItems = {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  key: string;
  isLogout?: boolean;
  onClick?: () => void;
};

import React, { useState } from "react";
import DrawerHeader from "./DrawerHeader";
import { sectionConfig } from "@/config/sideBarPagesconfig";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Drawer component that slides in from the right when opened.
 * Contains user profile info and action buttons.
 */
const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [key, setKey] = useState<string>("myAccount");

  const commonProps = {
    onMenuItemClick: (data: string) => setKey(data),
    onClose: onClose,
  };

  /**
   * Renders the section content based on the selected key.
   * @returns {React.ReactElement} The section to display in the drawer.
   */
  const renderSection = (): React.ReactElement => {
    const currentKey = key.split("-")[0];
    const config = sectionConfig[currentKey] || sectionConfig.myAccount;
    const Component = config.component;
    return <Component {...commonProps} id={key.split("-")[1]} />;
  };

  const currentKey = key.split("-")[0];
  const config = sectionConfig[currentKey] || sectionConfig.myAccount;
  const onBack = config.parent
    ? () => setKey(config.parent as string)
    : undefined;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500">
        <div className="p-6">
          <DrawerHeader
            title={config.title}
            onClose={onClose}
            onBack={onBack}
          />
          <div className="h-[90vh] overflow-y-auto">{renderSection()}</div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
