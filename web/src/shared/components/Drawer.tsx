import React, { useState } from "react";
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

  const [key, setKey] = useState<string>("");

  /**
   * Renders the section content based on the selected key.
   * @returns {React.ReactElement} The section to display in the drawer.
   */
  const handleSections = (): React.ReactElement => {
    let keyVal = key;
    if (key.includes("-")) {
      const keyParts = key.split("-");
      keyVal = keyParts[0];
    }
    switch (keyVal) {
      case "profile":
        return (
          <UserProfileSidebar
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "personalInfo":
        return (
          <PersonalInformation
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "education":
        return (
          <Education
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "addEducation":
        return (
          <AddEducation
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "editEducation":
        return (
          <EditEducation
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "skillsAndTools":
        return (
          <SkillsAndTools
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "addSkills":
        return (
          <AddSkills
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "editSkills":
        return (
          <EditSkills
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "addTools":
        return (
          <AddTools
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "editTools":
        return (
          <EditTools
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );

      case "experiences":
        return (
          <Experiences
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "addExperiences":
        return (
          <AddExperiences
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "editExperiences":
        return (
          <EditExperiences
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "workPreference":
        return (
          <WorkPreference
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "documents":
       return (
          <Documents
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
        case "editDocument":
       return (
          <EditDocument
            onMenuItemClick={(data) => setKey(data)}
            onClose={onClose}
          />
        );
      case "settings":
        return <div>Settings Section</div>;
      case "jobs":
        return <div>Jobs Section</div>;
      case "earning":
        return <div>Earning Section</div>;
      case "saved":
        return <div>Saved Section</div>;
      case "settings":
        return <div>Settings Section</div>;
      default:
        return (
          <div>
            <MyAccountDrawerMenu
              onMenuItemClick={(data) => setKey(data)}
              onClose={onClose}
            />
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500 h-full overflow-y-auto">
        <div className="p-6 ">{handleSections()}</div>
      </div>
    </>
  );
};

export default Drawer;
