import React, { useState } from "react";
import {
  FaBookmark,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import LogoutConfirmationPopup from "@/pages/auth/LogoutConfirmationPopup";
import { useNavigate } from "react-router";
import { urls } from "@/config/urls";

interface DrawerMenuProps {
  onMenuItemClick: (key: string) => void;
}

export type MenuItems = {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  key: string;
  isLogout?: boolean;
  onClick?: () => void;
};

/**
 * DrawerMenu component displays a vertical list of menu items with borders.
 * Features dark mode support, each item has an icon, label, and right-chevron arrow.
 * Borders separate items and frame the container. Logout item opens a confirmation popup.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onMenuItemClick - Function called when a menu item is clicked
 *
 * @example
 * <DrawerMenu onMenuItemClick={(key) => console.log(key)} />
 */
const DrawerMenu: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems: MenuItems[] = [
    { label: "My Profile", icon: FaUser, key: "profile" },
    { label: "My Jobs", icon: FaBriefcase, key: "jobs" },
    { label: "My Earning", icon: FaWallet, key: "earning" },
    { label: "Saved Jobs", icon: FaBookmark, key: "saved" },
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

  const navigate = useNavigate()

  return (
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
        onConfirm={() => navigate(urls.auth.login)}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};

export default DrawerMenu;
