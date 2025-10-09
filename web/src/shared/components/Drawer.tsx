import React, { useState } from "react";
import UserProfileSidebar from "@/pages/engineer/user_profile/UserProfileSidebar";
import MyAccountDrawerMenu from "@/pages/engineer/my_account/MyAccountDrawerMenu";
import PersonalInformation from "@/pages/engineer/user_profile/PersonalInformation";
import Education from "@/pages/engineer/user_profile/components/education/Education";


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
    switch (key) {
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
          // <Education    
          // onMenuItemClick={(data) => setKey(data)} 
          //   onClose={onClose}
          // />
          <div>Add Education Form</div>
        );
        case "editEducation":
         return (          
          // <Education    
          // onMenuItemClick={(data) => setKey(data)} 
          //   onClose={onClose}
          // />
          <div>Edit Education Form</div>
        );
      case "skills":
        return <div>Skills Section</div>;
      case "experiences":
        return <div>Experiences Section</div>;
      case "workPreference":
        return <div>Work Preference Section</div>;
      case "documents":
        return <div>Documents Section</div>;
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
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500 h-screen">
        <div className="p-6">{handleSections()}</div>
      </div>
    </>
  );
};

export default Drawer;
