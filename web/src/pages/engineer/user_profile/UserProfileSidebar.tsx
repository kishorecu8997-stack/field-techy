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
import { assetsConfig } from "@/assets";
import { useForm } from "react-hook-form";
import type { MenuItem } from "./types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";

/**
 * UserProfileSidebar Component
 * 
 * A comprehensive sidebar navigation component for the engineer's user profile section.
 * Displays user profile information with a rating card and provides navigation menu items
 * for accessing different profile sections including personal info, education, skills,
 * experiences, work preferences, documents, and settings.
 * 
 * @component
 * @param {DrawerMenuProps} props - The drawer menu configuration props
 * @param {Function} props.onMenuItemClick - Callback function triggered when a menu item is clicked
 * @param {Function} props.onClose - Callback function triggered to close the drawer
 * 
 * @returns {React.ReactElement} A sidebar component containing profile card and navigation menu
 * 
 * @example
 * <UserProfileSidebar
 *   onMenuItemClick={(menuId) => handleMenuClick(menuId)}
 *   onClose={() => setDrawerOpen(false)}
 * />
 */
const UserProfileSidebar: React.FC<DrawerMenuProps> = ({
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
      label: "Personal Information",
      icon: FaUser,
      id: "personalInfo",
      onClick: () => onMenuItemClick("personalInfo"),
    },
    {
      label: "Education",
      icon: FaGraduationCap,
      id: "education",
      onClick: () => onMenuItemClick("education"),
    },
    {
      label: "Skills & Tool",
      icon: FaWrench,
      id: "skillsAndTools",
      onClick: () => onMenuItemClick("skillsAndTools"),
    },
    {
      label: "Experiences",
      icon: FaBriefcase,
      id: "experiences",
      onClick: () => onMenuItemClick("experiences"),
    },
    {
      label: "Work Preference",
      icon: FaClipboardList,
      id: "workPreference",
      onClick: () => onMenuItemClick("workPreference"),
    },
    {
      label: "Documents",
      icon: FaFile,
      id: "documents",
      onClick: () => onMenuItemClick("documents"),
    },
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
            name="Nick Wilson"
            title="Software Engineer"
            rating={4}
            reviewCount={10}
            completionPercentage={39}
            flex="col"
          />

          <DrawerMenuSection items={menuItems} className="h-full" />
          <LogoutConfirmationPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => {
              onClose();
              navigate(absoluteUrls.engineer.auth.login);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default UserProfileSidebar;
