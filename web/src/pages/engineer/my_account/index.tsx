import { assetsConfig } from "@/assets";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaBookmark,
  FaBriefcase,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import DrawerMenuSection from "../../../shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../account_settings/types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import { absoluteUrls } from "@/config/urls";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import { useNavigate } from "react-router-dom";

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

  const menuItems: MenuItem[] = [
    {
      label: "My Profile",
      icon: FaUser,
      id: "profile",
      onClick: () => onMenuItemClick("profile"),
    },
    { label: "My Jobs", icon: FaBriefcase, id: "jobs" },
    { label: "My Earning", icon: FaWallet, id: "earning" },
    { label: "Saved Jobs", icon: FaBookmark, id: "saved" },
    {
      label: "Settings",
      icon: FaCog,
      id: "settings",
      onClick: () => onMenuItemClick("settings"),
    },
    {
      label: "Logout",
      icon: FaSignOutAlt,
      id: "logout",
      onClick: () => {
        setIsOpen(true);
      },
    },
  ];
  const navigate = useNavigate();
  return (
    <>
      <FormContainer methods={methods}>
        <div>
          <ProfileCard
            avatarUrl={assetsConfig.images.profile.defaultProfileImage}
            name="Michel Brown"
            title="Software Engineer"
            rating={4}
            reviewCount={10}
            completionPercentage={39}
          />
        </div>
        <DrawerMenuSection
          items={menuItems}
          key={"myAccount"}
          className="h-full"
        />
        <LogoutConfirmationPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
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
