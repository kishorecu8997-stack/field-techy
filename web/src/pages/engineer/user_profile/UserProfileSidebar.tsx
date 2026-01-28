import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import {
  useClientProfile,
  useClientStore,
  useClientDisplayName,
} from "@/shared/store/useClientStore";
import {
  useEngineerProfile,
  useEngineerStore,
} from "@/shared/store/useEngineerStore";
import { useServiceCategories, type LookupItem } from "@/shared/hooks/useLookup";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaBriefcase,
  FaClipboardList,
  FaFile,
  FaGraduationCap,
  FaUser,
  FaWrench,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { MenuItem } from "./types";

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
  ];

  const session = useUserSessionStore((state) => state.session);
  const logout = useUserSessionStore((state) => state.logout);
  const isClient = session?.role === "CLIENT";

  // Engineer data
  const engineerProfile = useEngineerProfile();
  const engineerProfileImageUrl = useEngineerStore((state) => state.profileImageUrl);
  const clearEngineerProfile = useEngineerStore(
    (state) => state.clearEngineerProfile,
  );

  // Client data
  const clientProfile = useClientProfile();
  const clientProfileImageUrl = useClientStore((state) => state.profileImageUrl);
  const clearClientProfile = useClientStore(
    (state) => state.clearClientProfile,
  );

  const navigate = useNavigate();

  // Fetch service categories to find the label for the category ID
  const { data: serviceCategories } = useServiceCategories();

  const clientDisplayName = useClientDisplayName();

  const displayName = useMemo(() => {
    if (isClient) return clientDisplayName;
    return engineerProfile?.fullName || "";
  }, [isClient, clientDisplayName, engineerProfile]);

  const displayTitle = useMemo(() => {
    if (isClient) {
      if (!clientProfile) return "Client";
      return clientProfile.clientType === "CORPORATE" ? "Corporate Client" : "Home Client";
    }
    if (!engineerProfile?.serviceCategory || !serviceCategories) return "Engineer";
    const category = serviceCategories.find(
      (cat: LookupItem) => String(cat.id) === String(engineerProfile.serviceCategory),
    );
    return category ? category.name : "Engineer";
  }, [isClient, clientProfile, engineerProfile?.serviceCategory, serviceCategories]);

  const displayImageUrl = isClient ? clientProfileImageUrl : engineerProfileImageUrl;
  const displayRating = isClient ? (clientProfile?.rating || 0) : (engineerProfile?.averageRating || 0);

  return (
    <>
      <FormContainer methods={methods}>
        <div>
          <ProfileCard
            avatarUrl={
              displayImageUrl || assetsConfig.images.profile.defaultProfileImage
            }
            name={displayName}
            title={displayTitle}
            rating={displayRating}
            reviewCount={isClient ? (clientProfile?.reviewCount || 0) : 0}
            completionPercentage={0}
            flex="col"
          />

          <DrawerMenuSection items={menuItems} className="h-full" />
          <LogoutConfirmationPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => {
              logout();
              clearEngineerProfile();
              clearClientProfile();
              onClose();
              if (isClient) {
                navigate(absoluteUrls.client.auth.login);
              } else {
                navigate(absoluteUrls.engineer.auth.login);
              }
            }}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default UserProfileSidebar;
