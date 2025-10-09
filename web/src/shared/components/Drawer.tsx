import React, { useState } from "react";
import ProfileSideDrawer from "./ProfileSideDrawer";
import { IoCloseSharp } from "react-icons/io5";
import UserProfileSidebar from "@/pages/engineer/UserProfileSidebar";

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

  const [key, setKey] = useState<string>("");
  
   const handleSections=()=>{
        switch(key){
            case 'profile':
                return <div>Profile Section</div>;
            case 'jobs':
                return <div>Section 2</div>;
            case 'section3':
                return <div>Section 3</div>;
            default:
                return <div><UserProfileSidebar onMenuItemClick={(data) => setKey(data)} onClose={onClose}/></div>;
        }
    }


  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500">
        <div className="p-6">
          
          {handleSections()}
        </div>
      </div>
    </>
  );
};

export default Drawer;
