import React, { useState } from "react";
import { icons } from "@/config/icons";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../../account_settings/types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
/**
 * Security UI: Manage 2FA (requires verified email & mobile).
 * Persist state to localStorage with error handling.
 * @returns [value, setValue]
 */

const SecurityPage: React.FC<DrawerMenuProps> = () => {

  const emailVerified = true; // Replace with actual check
  const mobileVerified = true; // Replace with actual check
  const isVerified = emailVerified && mobileVerified;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const menuItems: MenuItem[] = [
    {
      id: "two_factor_auth",
      label: "Two-Factor Authentication",
      icon: icons.security,
      isToggle: true,
      toggleValue: twoFactorEnabled,
      onToggleChange: setTwoFactorEnabled,
      disabled: !isVerified,
    },
  ];
  return (
    <div>
      {!isVerified && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <p className="text-sm">
            To enable Two-Factor Authentication, please verify your email and
            mobile number.
          </p>
          <p className="text-sm mt-1">
            Email Verified: {emailVerified ? "Yes" : "No"} <br /> Mobile
            Verified: {mobileVerified ? "Yes" : "No"}
          </p>
        </div>
      )}
      <DrawerMenuSection items={menuItems} ariaLabel="Security Settings" />
    </div>
  );
};

export default SecurityPage;
