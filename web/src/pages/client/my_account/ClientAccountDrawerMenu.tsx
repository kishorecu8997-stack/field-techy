import React, { useState } from "react";
import { FaCog, FaSignOutAlt, FaUser, FaWallet } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import LogoutConfirmationPopup from "@/pages/client/auth/LogoutConfirmationPopup";
import ProfileCard from "@/shared/components/commonUI/ProfileCard";
import { assetsConfig } from "@/assets";
import { useForm } from "react-hook-form";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";
import { useHomeNavigation } from "@/shared/hooks/useHomeNavigation";

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
  const navigate = useNavigate();
  const { goToLogin } = useHomeNavigation();

  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      profileImage: assetsConfig.images.profile.defaultProfileImage,
    },
  });

  const menuItems: ClientMenuItems[] = [
    {
      label: "Manage Proposal",
      icon: IoDocumentText,
      key: "proposal",
      onClick: () => {
        navigate(absoluteUrls.client.home.manage_proposal);
        onClose();
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
        console.log("Logout clicked");
        setIsOpen(true);
      },
    },
  ];

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
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-px">
          {menuItems.map((item, index, array) => (
            <React.Fragment key={item.key}>
              <button
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
              </button>
              {index < array.length - 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
              )}
            </React.Fragment>
          ))}
          <LogoutConfirmationPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => goToLogin()}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default ClientAccountDrawerMenu;
