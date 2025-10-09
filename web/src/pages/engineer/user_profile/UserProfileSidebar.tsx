
import React, { useState } from "react";
import {
  FaBriefcase,
  FaClipboardList,
  FaCog,
  FaFile,
  FaGraduationCap,
  FaSignOutAlt,
  FaUser,
  FaWrench,
} from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import LogoutConfirmationPopup from "@/pages/auth/LogoutConfirmationPopup";
import { assetsConfig } from "@/assets";
import DrawerHeader from "@/shared/components/DrawerHeader";
import ProfileHeader from "@/shared/components/commonUI/ProfileHeader";

/**
 * Props for the UserProfileSidebar component.
 * @typedef {Object} DrawerMenuProps
 * @property {(key: string) => void} onMenuItemClick - Callback when a menu item is clicked.
 * @property {() => void} onClose - Callback to close the sidebar.
 */
interface DrawerMenuProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * Type for sidebar menu items.
 * @typedef {Object} MenuItems
 * @property {string} label - The label of the menu item.
 * @property {React.FC<React.SVGProps<SVGSVGElement>>} icon - The icon component for the menu item.
 * @property {string} key - Unique key for the menu item.
 * @property {boolean} [isLogout] - If true, marks the item as a logout action.
 * @property {() => void} [onClick] - Optional click handler for the menu item.
 */
export type MenuItems = {
  /** The label of the menu item */
  label: string;
  /** The icon component for the menu item */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  /** Unique key for the menu item */
  key: string;
  /** If true, marks the item as a logout action */
  isLogout?: boolean;
  /** Optional click handler for the menu item */
  onClick?: () => void;
};



/**
 * UserProfileSidebar component displays a vertical list of user profile menu items with icons and borders.
 * Features dark mode support, a profile header, and a logout confirmation popup.
 *
 * @component
 * @param {DrawerMenuProps} props - Component props
 * @returns {JSX.Element} The rendered sidebar component
 *
 * @example
 * <UserProfileSidebar onMenuItemClick={(key) => console.log(key)} onClose={() => {}} />
 */
const UserProfileSidebar: React.FC<DrawerMenuProps> = ({
  onMenuItemClick,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * User profile information for the sidebar header.
   */
  const user = {
    name: "Michel Brown",
    role: "Software Engineer",
    rating: 4,
    reviews: 10,
    completion: 39,
    avatarUrl: assetsConfig.images.profile.defaultProfileImage,
  };

  /**
   * List of menu items for the sidebar.
   */
  const menuItems: MenuItems[] = [
   { label: "Personal Information", icon: FaUser, key: "personalInfo" },
       { label: "Education", icon: FaGraduationCap, key: "education" },
       { label: "Skills & Tool", icon: FaWrench, key: "skills" },
       { label: "Experiences", icon: FaBriefcase, key: "experiences" },
       { label: "Work Preference", icon: FaClipboardList, key: "workPreference" },
       { label: "Documents", icon: FaFile, key: "documents" },
       { label: "Settings", icon: FaCog, key: "settings" },
    {
      label: "Logout",
      icon: FaSignOutAlt,
      key: "logout",
      isLogout: true,
      onClick: () => {
        setIsOpen(true);
      },
    },
  ];

  return (
    <>
      <DrawerHeader title="My Profile" onClose={onClose} />
      <ProfileHeader user={user} />
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
              
        {menuItems.map((item, index, array) => (
          <React.Fragment key={item.key}>
            <button
              onClick={() => {
                onMenuItemClick(item.key);
                item.onClick?.();
              }}
              className={`
              w-full flex items-center justify-between px-4 py-4 
              transition-all duration-300 cursor-pointer 
              text-gray-700 dark:text-gray-200 
              hover:bg-gray-50 dark:hover:bg-gray-700 
              hover:pl-6 
              hover:text-teal-600 dark:hover:text-teal-400
              ${
                item.isLogout
                  ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  : ""
              }
            `}
            >
              <div className="flex items-center space-x-3">
                <item.icon
                  className={`
                  h-5 w-5 transition-colors 
                  ${
                    item.isLogout
                      ? "text-red-600 dark:text-red-400 "
                      : "text-gray-600 dark:text-gray-300 "
                  }
                `}
                />
                <span
                  className={`
                ${
                  item.isLogout
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-200"
                }
                `}
                >
                  {item.label}
                </span>
              </div>
              <FaChevronRight
                className={`
                text-gray-400 dark:text-gray-500 
                transition-colors
              `}
              />
            </button>
            {index < array.length - 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
            )}
          </React.Fragment>
        ))}
        <LogoutConfirmationPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => console.log("confirm")}
          onCancel={() => setIsOpen(false)}
        />
      </div>
    </>
  );
};

export default UserProfileSidebar;
