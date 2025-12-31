import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaChevronRight,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useClientFiles } from "@/shared/apiServices/client/clientService";
import { useCurrentClientProfile } from "@/shared/apiServices/profiles/client/clientProfileService";
import { ClientFilesProvider } from "./context/ClientFilesContext";
import { ClientAdapter } from "@/shared/apiServices/client/clientAdapter";

interface ClientDrawerMenuProps {
  onMenuItemClick: (key: string) => void;
  onClose: () => void;
}

export type ClientMenuItems = {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  key: string;
  isLogout?: boolean;
  onClick?: () => void;
};

/**
 * `ClientAccountDrawerMenu` component displays a side drawer menu for the client's account.
 * It includes a user profile card and a list of menu items for navigation within account settings.
 * It handles navigation for some items and calls a callback for others.
 * It also manages a logout confirmation popup.
 *
 * @param {ClientDrawerMenuProps} props The properties for the component.
 * @param {(key: string) => void} props.onMenuItemClick A callback function that is triggered when a menu item is clicked. It receives the item's key.
 * @param {() => void} props.onClose A callback function to close the drawer, used after certain actions like navigation.
 * @returns {React.ReactElement} The rendered client account drawer menu.
 *
 * @example
 * <ClientAccountDrawerMenu
 *   onMenuItemClick={(key) => console.log(`Clicked: ${key}`)}
 *   onClose={() => console.log('Drawer closed')}
 * />
 */
const ClientAccountDrawerMenu: React.FC<ClientDrawerMenuProps> = ({
  onMenuItemClick,
  onClose,
}) => {
  const logoutTrigger = useUserSessionStore((s) => s.logout);

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  // State for profile picture URL
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(
    assetsConfig.images.users.user
  );

  // State for loading profile picture
  const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState(false);

  const methods = useForm({
    defaultValues: {
      profileImage: profilePictureUrl,
    },
  });

  // Extract setValue for stable reference
  const { setValue } = methods;

  // Update form value when profile picture URL changes
  useEffect(() => {
    if (!isLoadingProfilePicture) {
      setValue("profileImage", profilePictureUrl, {
        shouldValidate: false,
      });
    }
  }, [profilePictureUrl, setValue, isLoadingProfilePicture]);

  // Get client ID from current client profile
  const { data: clientProfile } = useCurrentClientProfile();
  const clientId = clientProfile?.id || "9f034ed8-2ea5-44b6-a410-973e559e2c47"; // Fallback to hardcoded ID

  // Fetch client files - single API call for all files
  const {
    data: clientFiles = [],
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useClientFiles(clientId);

  // Separate profile picture from other documents
  const { profilePictureFile, documentFiles } = useMemo(() => {
    const profilePic = clientFiles.find(
      (file) => file.fileType === "PROFILE_PICTURE"
    );
    const documents = clientFiles.filter(
      (file) => file.fileType !== "PROFILE_PICTURE"
    );
    return {
      profilePictureFile: profilePic || null,
      documentFiles: documents,
    };
  }, [clientFiles]);

  // Download profile picture if available
  useEffect(() => {
    if (!profilePictureFile) {
      setIsLoadingProfilePicture(false);
      setProfilePictureUrl(assetsConfig.images.users.user);
      return;
    }

    let blobUrl: string | null = null;
    let isCancelled = false;

    const downloadProfilePicture = async () => {
      setIsLoadingProfilePicture(true);

      try {
        const downloadResponse = await ClientAdapter.downloadFileStream(
          profilePictureFile.fileKey
        );

        // Check if component is still mounted and file hasn't changed
        if (!isCancelled) {
          blobUrl = URL.createObjectURL(downloadResponse.blob);
          setProfilePictureUrl(blobUrl);
          setIsLoadingProfilePicture(false);
        } else {
          // Cleanup if cancelled - revoke the blob URL we just created
          const tempBlobUrl = URL.createObjectURL(downloadResponse.blob);
          URL.revokeObjectURL(tempBlobUrl);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to download profile picture:", error);
          setProfilePictureUrl(assetsConfig.images.users.user);
          setIsLoadingProfilePicture(false);
        }
      }
    };

    downloadProfilePicture();

    // Cleanup on unmount or when profilePictureFile changes
    return () => {
      isCancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      setIsLoadingProfilePicture(false);
    };
  }, [profilePictureFile]);

  // Prepare context value
  const filesContextValue = useMemo(
    () => ({
      files: documentFiles,
      profilePictureFile,
      isLoading: isLoadingFiles,
      refetch: refetchFiles,
    }),
    [documentFiles, profilePictureFile, isLoadingFiles, refetchFiles]
  );

  const menuItems: ClientMenuItems[] = [
    {
      label: "Manage Proposal",
      icon: IoDocumentText,
      key: "proposal",
      onClick: () => {
        onClose();
        navigate(absoluteUrls.client.home.manage_proposal);
      },
    },
    { label: "Company Information", icon: FaUser, key: "company" },
    { label: "Documents", icon: IoDocumentText, key: "document" },
    { label: "Payment Methods", icon: FaWallet, key: "payment" },
    { label: "Change Password", icon: RiLockPasswordFill, key: "changePwd" },
    { label: "Account Details", icon: FaCog, key: "clientAcc" },
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

  const handleConfirmationLogout = () => {
    logoutTrigger();
    navigate(absoluteUrls.root);
  };

  // Get display name from client profile
  const displayName = useMemo(() => {
    if (!clientProfile) return "Guest";
    if (clientProfile.clientType === "CORPORATE") {
      return (
        clientProfile.companyName || clientProfile.contactPersonName || "Client"
      );
    }
    return clientProfile.contactPersonName || "Client";
  }, [clientProfile]);

  return (
    <ClientFilesProvider value={filesContextValue}>
      <FormContainer methods={methods}>
        <div>
          <ProfileCard
            avatarUrl={profilePictureUrl}
            name={displayName}
            title={
              clientProfile?.clientType === "CORPORATE"
                ? "Corporate Client"
                : "Home Client"
            }
            rating={4}
            reviewCount={10}
            completionPercentage={39}
            isLoadingProfilePicture={isLoadingProfilePicture || isLoadingFiles}
          />
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-px">
          {menuItems.map((item, index, array) => (
            <React.Fragment key={item.key}>
              <div
                onClick={() => {
                  if (item.key === "logout") {
                    setIsOpen(true);
                    return;
                  }
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
              </div>
              {index < array.length - 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
              )}
            </React.Fragment>
          ))}
          <LogoutConfirmationPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleConfirmationLogout}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </FormContainer>
    </ClientFilesProvider>
  );
};

export default ClientAccountDrawerMenu;
