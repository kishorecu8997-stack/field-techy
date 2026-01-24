import { assetsConfig } from "@/assets";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaBookmark,
  FaBriefcase,
  FaCog,
  FaFileDownload,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import DrawerMenuSection from "../../../shared/components/drawer/DrawerMenuSection";
import { useProfileFileDownload } from "@/shared/hooks/useProfileFileDownload";
import type { MenuItem } from "../account_settings/types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import { absoluteUrls } from "@/config/urls";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useNavigate } from "react-router-dom";
import {
  useAppDownloadProfileFile,
  useEngineerGetPersonalInfo,
  useEngineerGetWorkPreference,
  useLookupData,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { useEngineerStore } from "@/shared/store/useEngineerStore";

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

  /*
   * Use the profileImageUrl from the global store.
   * The fetching logic is now centralised in useEngineerStore.
   */
  const profileImageUrl = useEngineerStore((state) => state.profileImageUrl);
  const { data: personalInfo } = useEngineerGetPersonalInfo();
  const { data: workPreference } = useEngineerGetWorkPreference();
  const { data: serviceCategories } = useLookupData("serviceCategories");
  /*
   * Fetch the download URL for the profile picture if an ID exists.
   */
  const { data: downloadData } = useAppDownloadProfileFile("profilePicture");
  console.log(downloadData);

  const serviceCategoryName = serviceCategories?.find(
    (c: any) => c.id === workPreference?.serviceCategoryId,
  )?.name;

  const methods = useForm({
    defaultValues: {
      profileImage: assetsConfig.images.profile.defaultProfileImage,
    },
  });

  const { setValue } = methods;

  /*
   * Sync the profile image URL from the store to the form state.
   * This ensures the image uploader displays the correct image.
   */
  useEffect(() => {
    if (profileImageUrl) {
      setValue("profileImage", profileImageUrl);
    }
  }, [profileImageUrl, setValue]);

  const menuItems: MenuItem[] = [
    {
      label: "My Profile",
      icon: FaUser,
      id: "profile",
      onClick: () => onMenuItemClick("profile"),
    },
    {
      label: "My Jobs",
      icon: FaBriefcase,
      id: "jobs",
      onClick: () => {
        onClose();
        navigate(absoluteUrls.engineer.home.my_jobs);
      },
    },
    {
      label: "My Earning",
      icon: FaWallet,
      id: "earning",
      onClick: () => onMenuItemClick("earning"),
    },
    {
      label: "Saved Jobs",
      icon: FaBookmark,
      id: "saved",
      onClick: () => {
        onClose();
        navigate(absoluteUrls.engineer.home.saved_jobs);
      },
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
  const logout = useUserSessionStore((state) => state.logout);
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
              downloadData?.downloadUrl ||
              profileImageUrl ||
              assetsConfig.images.profile.defaultProfileImage
            }
            name={personalInfo?.name || ""}
            title={serviceCategoryName || ""}
            rating={0} // rating is currently not in API
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
