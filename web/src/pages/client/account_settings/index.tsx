import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmationPopup from "@/shared/components/LogoutConfirmationPopup";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import DrawerMenuSection from "../../../shared/components/drawer/DrawerMenuSection";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import type { MenuItem } from "@/pages/engineer/account_settings/types";

/**
 * Main account settings page displaying a list of configurable options including security, bank details,
 * notifications toggle, support links, and logout. Integrates navigation, drawer control, and a logout confirmation modal.
 */
const AccountSettingsDrawerMenu: React.FC<DrawerMenuProps> = ({ onClose }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const location = useLocation();
  const isClient = location.pathname.includes("client");
  const [isOpen, setIsOpen] = React.useState(false);
  const logout = useUserSessionStore((state) => state.logout);
  const navigate = useNavigate();
  const menuItems: MenuItem[] = [
    {
      label: "FAQs",
      icon: icons.fileLines,
      id: "faqs",
      onClick: () => {
        navigate(
          isClient
            ? absoluteUrls.client.home.faq
            : absoluteUrls.engineer.home.faq,
        );
        onClose();
      },
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
      label: "Terms & Conditions",
      icon: icons.fileLines,
      id: "termsConditions",
      onClick: () => {
        navigate(
          isClient
            ? absoluteUrls.client.home.terms_and_conditions
            : absoluteUrls.engineer.home.terms_and_conditions,
        );
        onClose();
      },
    },

    // {
    //   label: "Logout",
    //   icon: icons.signOut,
    //   id: "logout",
    //   onClick: () => {
    //     setIsOpen(true);
    //   },
    // },
  ];

  return (
    <div>
      <DrawerMenuSection items={menuItems} className="h-full" />
      <LogoutConfirmationPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          logout();
          onClose();
          navigate(
            isClient
              ? absoluteUrls.client.auth.login
              : absoluteUrls.engineer.auth.login,
          );
        }}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};

export default AccountSettingsDrawerMenu;
