import React, { useState } from "react";
import UserProfileSidebar from "@/pages/engineer/user_profile/UserProfileSidebar";
import MyAccountDrawerMenu from "@/pages/engineer/my_account/MyAccountDrawerMenu";
import PersonalInformation from "@/pages/engineer/user_profile/components/PersonalInformation/PersonalInformation";
import Education from "@/pages/engineer/user_profile/components/education/Education";
import AddEducation from "@/pages/engineer/user_profile/components/education/AddEducation";
import EditEducation from "@/pages/engineer/user_profile/components/education/EditEducation";
import SkillsAndTools from "@/pages/engineer/user_profile/components/skills_and_tools/SkillsAndTools";
import AddSkills from "@/pages/engineer/user_profile/components/skills_and_tools/components/AddSkills";
import AddTools from "@/pages/engineer/user_profile/components/skills_and_tools/components/AddTools";
import EditSkills from "@/pages/engineer/user_profile/components/skills_and_tools/components/EditSkills";
import EditTools from "@/pages/engineer/user_profile/components/skills_and_tools/components/EditTools";
import Experiences from "@/pages/engineer/user_profile/components/experiences/Experiences";
import AddExperiences from "@/pages/engineer/user_profile/components/experiences/components/AddExperiences";
import EditExperiences from "@/pages/engineer/user_profile/components/experiences/components/EditExperiences";
import WorkPreference from "@/pages/engineer/user_profile/components/WorkPreference/WorkPreference";
import Documents from "@/pages/engineer/user_profile/components/documents/Documents";
import EditDocument from "@/pages/engineer/user_profile/components/documents/components/EditDocument";
import DrawerHeader from "./DrawerHeader";
import ClientAccountDrawerMenu from "@/pages/client/my_account/ClientAccountDrawerMenu";
import ClientWalletComponent from "@/pages/client/my_wallet/components/WalletComponent";
import ClientAddFund from "@/pages/client/my_wallet/components/AddFund";
import ClientRecentTransactions from "@/pages/client/my_wallet/components/RecentTransactionsList";


/**
 * Props for the Drawer component.
 * @typedef {Object} DrawerProps
 * @property {boolean} isOpen - Whether the drawer is open.
 * @property {() => void} onClose - Function to close the drawer.
 */
interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Function to close the drawer */
  onClose: () => void;
  /** The key for the component to display */
  componentKey?: string;
}

/**
 * Drawer component that slides in from the right when opened.
 * Contains user profile info and action buttons.
 *
 * @param {DrawerProps} props - The props for the Drawer component. 
 * @returns {JSX.Element | null} The rendered Drawer component or null if closed.
 */
const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  componentKey = "clientAccount",
}) => {
  if (!isOpen) return null;

  const [key, setKey] = useState<string>(componentKey);

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
    profile: { component: UserProfileSidebar, title: "My Profile" },
    personalInfo: {
      component: PersonalInformation,
      title: "Personal Information",
      parent: "profile",
    },
    education: { component: Education, title: "Education", parent: "profile" },
    addEducation: {
      component: AddEducation,
      title: "Add Education",
      parent: "education",
    },
    editEducation: {
      component: EditEducation,
      title: "Edit Education",
      parent: "education",
    },
    skillsAndTools: {
      component: SkillsAndTools,
      title: "Skills & Tools",
      parent: "profile",
    },
    addSkills: {
      component: AddSkills,
      title: "Add Skills",
      parent: "skillsAndTools",
    },
    editSkills: {
      component: EditSkills,
      title: "Edit Skills",
      parent: "skillsAndTools",
    },
    addTools: {
      component: AddTools,
      title: "Add Tools",
      parent: "skillsAndTools",
    },
    editTools: {
      component: EditTools,
      title: "Edit Tools",
      parent: "skillsAndTools",
    },
    experiences: {
      component: Experiences,
      title: "Experiences",
      parent: "profile",
    },
    addExperiences: {
      component: AddExperiences,
      title: "Add Experience",
      parent: "experiences",
    },
    editExperiences: {
      component: EditExperiences,
      title: "Edit Experience",
      parent: "experiences",
    },
    workPreference: {
      component: WorkPreference,
      title: "Work Preference",
      parent: "profile",
    },
    documents: { component: Documents, title: "Documents", parent: "profile" },
    editDocument: {
      component: EditDocument,
      title: "Edit Document",
      parent: "documents",
    },
    settings: {
      component: () => <div>Settings Section</div>,
      title: "Settings",
    },
    jobs: { component: () => <div>Jobs Section</div>, title: "My Jobs" },
    earning: {
      component: () => <div>Earning Section</div>,
      title: "My Earning",
    },
    saved: { component: () => <div>Saved Section</div>, title: "Saved Jobs" },
    //client
    clientAccount: { component: ClientAccountDrawerMenu, title: "My Account" },    
    proposal: { component: () => <div>Manage Proposal</div>, title: "Manage Proposal", parent: "clientAccount" },
    company: { component: () => <div>Company Information</div>, title: "Company Information", parent: "clientAccount" },
    document: { component: () => <div>Documents</div>, title: "Documents", parent: "clientAccount" },
    payment: { component: () => <div>Payment Methods</div>, title: "Payment Methods", parent: "clientAccount" },
    changePwd: { component: () => <div>Change Password</div>, title: "Change Password", parent: "clientAccount" },      
    clientAcc: { component: () => <div>Account</div>, title: "Account Setting", parent: "clientAccount" },      
    clientWallet: { component: ClientWalletComponent, title: "My Wallet" },
    clientAddFund: { component:  ClientAddFund, title: "Add Fund", parent: "clientWallet" },
    recentTransactions: { component:  ClientRecentTransactions, title: "Recent Transactions", parent: "clientWallet" },
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
        className="fixed inset-0 z-40 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl dark:bg-gray-800">
        <div className="flex h-screen flex-col">
          <div className="shrink-0 py-5 px-6">
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
