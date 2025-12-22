import { sectionConfig } from "@/config/sideBarPagesconfig";
import { useEffect } from "react";
import DrawerHeader from "./DrawerHeader";
import useDrawerStore from "@/shared/store/useDrawerStore";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

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

/**
 * Drawer component that slides in from the right when opened.
 * Contains user profile info and action buttons.
 */
const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  // Modified to get navigation to source  from the store 
  const { 
    activeKey, 
    setActiveKey,
    navigationSource,
    returnToKey,
    resetNavigationSource 
  } = useDrawerStore();

  // Escape key & scroll lock effect
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Lock scroll & enable Escape
      document.documentElement.classList.add("drawer-open");
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      // Clean up: unlock scroll & remove listener
      document.documentElement.classList.remove("drawer-open");
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commonProps = {
    onMenuItemClick: (data: string) => setActiveKey(data),
    onClose,
  };

  const renderSection = (): React.ReactElement => {
    const currentKey = activeKey.split("-")[0];
    const config = sectionConfig[currentKey] || sectionConfig.myAccount;
    const Component = config.component;
    return <Component {...commonProps} id={activeKey.split("-")[1]} />;
  };

  const currentKey = activeKey.split("-")[0];
  const config = sectionConfig[currentKey] || sectionConfig.myAccount;
// modified onBack function to handle navigation Source  
  const onBack =
    navigationSource === "profilecompletion" && returnToKey
      ? () => {
          setActiveKey(returnToKey);
          resetNavigationSource();
        }
      : config.parent
      ? () => {
          setActiveKey(config.parent as string);
        }
      : undefined; 
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl dark:bg-gray-800"
        role="dialog"
        aria-modal="true"
        aria-label={config.title}
      >
        <div className="flex h-screen flex-col">
          <div className="shrink-0 py-6 px-6">
            <DrawerHeader
              title={config.title}
              onClose={onClose}
              onBack={onBack}
              actions={config.actions}
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