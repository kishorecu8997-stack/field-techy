import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import type { DrawerMenuProps } from "@/shared/components/Drawer";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationPopup from "@/pages/engineer/auth/LogoutConfirmationPopup";
import DrawerMenuSection from "./DrawerMenuSection";
import type { MenuItem } from "./types";

/**
 * Main account settings page displaying a list of configurable options including security, bank details,
 * notifications toggle, support links, and logout. Integrates navigation, drawer control, and a logout confirmation modal.
 */
const AccountSettings: React.FC<DrawerMenuProps> = ({
  onMenuItemClick,
  onClose,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const menuItems: MenuItem[] = [
    {
      label: "Change Password",
      icon: icons.lock,
      id: "changePassword",
      onClick: () => onMenuItemClick("changePassword"),
    },
    {
      label: "Manage Bank Accounts",
      icon: icons.wallet,
      id: "manageBankAccounts",
      onClick: () => onMenuItemClick("manageBankAccounts"),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: notificationsEnabled,
      onToggleChange: setNotificationsEnabled,
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
    {
      label: "Logout",
      icon: icons.signOut,
      id: "logout",
      onClick: () => {
        setIsOpen(true);
      },
    },
  ];

  return (
    <div>
      <DrawerMenuSection items={menuItems} className="h-full" />
      <LogoutConfirmationPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => console.log("confirm")}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};

export default AccountSettings;
