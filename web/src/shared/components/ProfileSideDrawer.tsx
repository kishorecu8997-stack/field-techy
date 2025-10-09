import { type UserProfile } from "@/pages/engineer/components/ProfileSidebar/types";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import ProfileHeader from "./commonUI/ProfileHeader";
import ProfileSideDrawerMenu from "./commonUI/ProfileSideDrawerMenu";

interface DrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: UserProfile;
  onClick?: (data:string) => void;
}

/**
 * Drawer component that slides in from the right when opened.
 * Contains user profile info and action buttons.
 */
const ProfileSideDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, onClick }) => {
  if (!isOpen) return null;

  const user: UserProfile = {
    name: "Nick Wilson",
    role: "Software Engineer",
    rating: 4.2,
    reviews: 23,
    completion: 50,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-[rgba(61,63,66,0.6)] animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-[90%] md:w-[30rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out dark:bg-gray-500">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoCloseSharp className="h-6 w-6 cursor-pointer" />
            </button>
          </div>
          <ProfileHeader user={user} />
          <ProfileSideDrawerMenu onMenuItemClick={(data) => onClick?.(data)} />
        </div>
      </div>
    </>
  );
};

export default ProfileSideDrawer;
