import React, { useState, useEffect } from "react";
import { icons } from "@/config/icons";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../../account_settings/types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
/**
 * Custom hook for managing localStorage with error handling.
 * @param key - The localStorage key.
 * @param defaultValue - Default value if key is missing or invalid.
 * @returns [value, setValue] tuple.
 */
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);
  return [value, setValue];
}
/**
 * Security page allowing users to enable 2FA if email and mobile are verified.
 * Displays verification status and a toggle for 2FA.
 */
const SecurityPage: React.FC<DrawerMenuProps> = () => {
  //I Currently Assume verification status as true for both email and mobile.
  //Should be replaced with actual verification logic when available.
  const emailVerified = true; // Replace with actual check
  const mobileVerified = true; // Replace with actual check
  const isVerified = emailVerified && mobileVerified;
  const [twoFactorEnabled, setTwoFactorEnabled] = useLocalStorage(
    "twoFactorEnabled",
    false
  );
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
