import { sectionConfig } from "@/config/sideBarPagesconfig";
import { useEffect, Suspense } from "react";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import DrawerHeader from "./DrawerHeader";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useClientProfile } from "@/shared/store/useClientStore";

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
  const {
    activeKey,
    setActiveKey,
    navigationSource,
    returnToKey,
    resetNavigationSource,
    immediateParentKey,
    setImmediateParentKey,
  } = useDrawerStore();

  // Get client profile for dynamic title
  const clientProfile = useClientProfile();

  // Escape key & scroll lock effect
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.documentElement.classList.add("drawer-open");
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
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

  const onBack = () => {
    if (immediateParentKey) {
      setActiveKey(immediateParentKey);
      setImmediateParentKey(undefined);
      return;
    }

    if (activeKey === "addBankdetails" || activeKey === "editBankdetails") {
      const { previousShowBack } = useDrawerStore.getState();
      setActiveKey("manageBankAccounts", previousShowBack);
      return;
    }

    if (navigationSource !== "sidebar" && returnToKey) {
      setActiveKey(returnToKey);
      resetNavigationSource();
      return;
    }

    if (config.parent) {
      setActiveKey(config.parent as string);
      return;
    }

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl dark:bg-gray-800"
        role="dialog"
        aria-modal="true"
        aria-label={typeof config.title === "function" ? config.title(clientProfile?.clientType) : config.title}
      >
        <div className="flex h-screen flex-col">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <LoaderComponent />
              </div>
            }
          >
            <div className="shrink-0 py-6 px-6">
              <DrawerHeader
                title={typeof config.title === "function" ? config.title(clientProfile?.clientType) : config.title}
                onClose={onClose}
                onBack={onBack}
                showBack={!!config.parent || !!immediateParentKey}
                actions={config.actions}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {renderSection()}
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Drawer;
