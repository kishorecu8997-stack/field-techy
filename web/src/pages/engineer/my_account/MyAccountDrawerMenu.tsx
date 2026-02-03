import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import {
  useEngineerProfile,
  useEngineerStore,
} from "@/shared/store/useEngineerStore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaBookmark,
  FaBriefcase,
  FaChevronRight,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface DrawerMenuProps {
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
const MyAccountDrawerMenu: React.FC<DrawerMenuProps> = ({
  onMenuItemClick,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      profileImage: assetsConfig.images.profile.defaultProfileImage,
    },
  });

  const menuItems: MenuItems[] = [
    { label: "My Profile", icon: FaUser, key: "profile" },
    { label: "My Jobs", icon: FaBriefcase, key: "jobs" },
    { label: "My Earnings", icon: FaWallet, key: "earning" },
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

  const logout = useUserSessionStore((state) => state.logout);
  const engineerProfile = useEngineerProfile();
  const profileImageUrl = useEngineerStore((state) => state.profileImageUrl);
  const clearEngineerProfile = useEngineerStore(
    (state) => state.clearEngineerProfile,
  );
  const navigate = useNavigate();
  return (
    <>
      <FormContainer methods={methods}>
        <div>
          <ProfileCard
            avatarUrl={
              profileImageUrl || assetsConfig.images.profile.defaultProfileImage
            }
            name={engineerProfile?.fullName || ""}
            title={String(engineerProfile?.serviceCategory || "")}
            rating={engineerProfile?.averageRating || 0}
            reviewCount={10}
            completionPercentage={39}
            engineerId={engineerProfile?.id}
          />
        </div>
        {menuItems.map((item, index, array) => (
          <React.Fragment key={item.key}>
            <div
              onClick={() => {
                onMenuItemClick(item.key);
                console.log(item.key);
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
            </div>
            {index < array.length - 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
            )}
          </React.Fragment>
        ))}
        <LogoutConfirmationPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            logout();
            clearEngineerProfile();
            onClose();
            navigate(absoluteUrls.engineer.auth.login);
          }}
          onCancel={() => setIsOpen(false)}
        />
      </FormContainer>
    </>
  );
};

export default MyAccountDrawerMenu;
