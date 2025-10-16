import AccountSettings from "@/pages/account_settings";
import MyAccountDrawerMenu from "@/pages/my_account";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import DrawerHeader from "./DrawerHeader";
import ChangePassword from "@/pages/account_settings/ChangePassword";
import BankAccountList from "@/pages/account_settings/BankAccountList";

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

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Drawer component that slides in from the right when opened.
 * Contains user profile info and action buttons.
 *
 * @param {DrawerProps} props - The props for the Drawer component.
 * @returns {JSX.Element | null} The rendered Drawer component or null if closed.
 */
const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [key, setKey] = useState<string>("myAccount");

  const commonProps = {
    onMenuItemClick: (data: string) => setKey(data),
    onClose: onClose,
  };

  const sectionConfig: Record<
    string,
    {
      component: React.ComponentType<any>;
      title: string;
      parent?: string;
    }
  > = {
    myAccount: { component: MyAccountDrawerMenu, title: "My Account" },
    profile: { component: () => <>test</>, title: "My Profile" },
    personalInfo: {
      component: () => <>test</>,
      title: "Personal Information",
      parent: "profile",
    },
    education: {
      component: () => <>test</>,
      title: "Education",
      parent: "profile",
    },
    addEducation: {
      component: () => <>test</>,
      title: "Add Education",
      parent: "education",
    },
    editEducation: {
      component: () => <>test</>,
      title: "Edit Education",
      parent: "education",
    },
    skillsAndTools: {
      component: () => <>test</>,
      title: "Skills & Tools",
      parent: "profile",
    },
    addSkills: {
      component: () => <>test</>,
      title: "Add Skills",
      parent: "skillsAndTools",
    },
    editSkills: {
      component: () => <>test</>,
      title: "Edit Skills",
      parent: "skillsAndTools",
    },
    addTools: {
      component: () => <>test</>,
      title: "Add Tools",
      parent: "skillsAndTools",
    },
    editTools: {
      component: () => <>test</>,
      title: "Edit Tools",
      parent: "skillsAndTools",
    },
    experiences: {
      component: () => <>test</>,
      title: "Experiences",
      parent: "profile",
    },
    addExperiences: {
      component: () => <>test</>,
      title: "Add Experience",
      parent: "experiences",
    },
    editExperiences: {
      component: () => <>test</>,
      title: "Edit Experience",
      parent: "experiences",
    },
    workPreference: {
      component: () => <>test</>,
      title: "Work Preference",
      parent: "profile",
    },
    documents: {
      component: () => <>test</>,
      title: "Documents",
      parent: "profile",
    },
    editDocument: {
      component: () => <>test</>,
      title: "Edit Document",
      parent: "documents",
    },
    jobs: { component: () => <div>Jobs Section</div>, title: "My Jobs" },
    earning: {
      component: () => <div>Earning Section</div>,
      title: "My Earning",
    },
    saved: { component: () => <div>Saved Section</div>, title: "Saved Jobs" },
    settings: { component: AccountSettings, title: "Account Settings" },
    changePassword: {
      component: ChangePassword,
      title: "Change Password",
      parent: "settings",
    },
    manageBankAccounts: {
      component: BankAccountList,
      title: "Manage Bank Accounts",
      parent: "settings",
    },
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

  const drawerContent = (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
        style={{ zIndex: 49 }} // Ensure backdrop is just below the drawer
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500 overflow-y-auto h-full">
        <div className="p-4">
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

  // Render into a portal to attach to the body
  return ReactDOM.createPortal(drawerContent, document.body);
};

export default Drawer;
