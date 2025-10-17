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

import { sectionConfig } from "@/config/sideBarPagesconfig";
import React from "react";
import useDrawerStore from "../store/useDrawerStore";
import DrawerHeader from "./DrawerHeader";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Drawer component that slides in from the right when opened.
 * Contains user profile info and action buttons.
 */
const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { activeKey, setActiveKey } = useDrawerStore();
  if (!isOpen) return null;

  const commonProps = {
    onMenuItemClick: (data: string) => setActiveKey(data),
    onClose: onClose,
  };

  const renderSection = (): React.ReactElement => {
    const currentKey = activeKey.split("-")[0];
    const config = sectionConfig[currentKey] || sectionConfig.myAccount;
    const Component = config.component;
    return <Component {...commonProps} id={activeKey.split("-")[1]} />;
  };

  const currentKey = activeKey.split("-")[0];
  const config = sectionConfig[currentKey] || sectionConfig.myAccount;
  const onBack = config.parent
    ? () => setActiveKey(config.parent as string)
    : undefined;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl dark:bg-gray-800">
        <div className="flex h-screen flex-col">
          <div className="shrink-0 py-6 px-6">
            <DrawerHeader
              title={config.title}
              onClose={onClose}
              onBack={onBack}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {renderSection()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
