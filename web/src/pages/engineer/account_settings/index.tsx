import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import DrawerMenuSection from "../../../shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "./types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import useDrawerStore from "@/shared/store/useDrawerStore";

/**
 * Main account settings page displaying a list of configurable options including security, bank details,
 * notifications toggle, support links, and logout. Integrates navigation, drawer control, and a logout confirmation modal.
 */
const AccountSettings: React.FC<DrawerMenuProps> = ({
  onMenuItemClick,
  onClose,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  // Handle drawer navigation
  const { setNavigationSource } = useDrawerStore();
  const menuItems: MenuItem[] = [
    {
      label: "Change Password",
      icon: icons.lock,
      id: "changePassword",
      onClick: () =>  {
        setNavigationSource("settings", "settings");
        onMenuItemClick("changePassword");
      },
    },
    {
      label: "Manage Bank Accounts",
      icon: icons.wallet,
      id: "manageBankAccounts",
      onClick: () => {
        setNavigationSource("settings", "settings");
        onMenuItemClick("manageBankAccounts");
    },
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: icons.notifications,
      onClick: () => onMenuItemClick("NotificationPreferences"),
    },
    {
      id: "activeSessions",
      label: "Active Sessions",
      icon: icons.sessions,
      onClick: () => onMenuItemClick("activeSessions")
    },
    {
      label: "Contact Us",
      icon: icons.contactSupport,
      id: "contactUs",
      onClick: () => onMenuItemClick("contactUs"),
    },
    {
      label: "FAQs",
      icon: icons.fileLines,
      id: "faqs",
      onClick: () => {
        navigate(`${absoluteUrls.engineer.home.faq}`);
        onClose();
      },
    },
    {
      label: "Terms & Conditions",
      icon: icons.fileLines,
      id: "termsConditions",
      onClick: () => {
        navigate(`${absoluteUrls.engineer.home.terms_and_conditions}`);
        onClose();
      },
    },
    {
      label: "About App",
      icon: icons.danger,
      id: "aboutApp",
      onClick: () => {
        navigate(`${absoluteUrls.engineer.home.about_app}`);
        onClose();
      },
    },
  ];

  return (
    <div>
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
  );
};

export default AccountSettings;
