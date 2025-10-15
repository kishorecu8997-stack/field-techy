import React, { useState } from "react";
import ReactDOM from "react-dom";
import UserProfileSidebar from "@/pages/engineer/user_profile/UserProfileSidebar";
import MyAccountDrawerMenu from "@/pages/engineer/my_account/MyAccountDrawerMenu";
import PersonalInformation from "@/pages/engineer/user_profile/PersonalInformation";
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

  const sectionComponents: Record<string, React.ComponentType<any>> = {
    myAccount: MyAccountDrawerMenu,
    profile: UserProfileSidebar,
    personalInfo: PersonalInformation,
    education: Education,
    addEducation: AddEducation,
    editEducation: EditEducation,
    skillsAndTools: SkillsAndTools,
    addSkills: AddSkills,
    editSkills: EditSkills,
    addTools: AddTools,
    editTools: EditTools,
    experiences: Experiences,
    addExperiences: AddExperiences,
    editExperiences: EditExperiences,
    workPreference: WorkPreference,
    documents: Documents,
    editDocument: EditDocument,
    settings: () => <div>Settings Section</div>,
    jobs: () => <div>Jobs Section</div>,
    earning: () => <div>Earning Section</div>,
    saved: () => <div>Saved Section</div>,
  };

  /**
   * Renders the section content based on the selected key.
   * @returns {React.ReactElement} The section to display in the drawer.
   */
  const handleSections = (): React.ReactElement => {
    const keyVal = key.split("-")[0];
    const Component = sectionComponents[keyVal] || MyAccountDrawerMenu;
    return <Component {...commonProps} />;
  };

  const drawerContent = (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
        style={{ zIndex: 49 }} // Ensure backdrop is just below the drawer
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500 h-full overflow-y-auto">
        <div className="p-6 ">{handleSections()}</div>
      </div>
    </>
  );

  // Render into a portal to attach to the body
  return ReactDOM.createPortal(drawerContent, document.body);
};

export default Drawer;
