import React from "react";
import ProfileCard from "./commonUI/ProfileCard";
import { IoCloseSharp } from "react-icons/io5";
import img from "../../assets/img1.jpg";
import DrawerMenu from "./commonUI/DrawerMenu";

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

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Account</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoCloseSharp className="h-6 w-6 cursor-pointer" />
            </button>
          </div>

          <ProfileCard
            avatarUrl={img}
            name="Michel Brown"
            title="Software Engineer"
            rating={4}
            reviewCount={10}
            completionPercentage={39}
          />

          <DrawerMenu onMenuItemClick={() => {}} />
        </div>
      </div>
    </>
  );
};

export default Drawer;
