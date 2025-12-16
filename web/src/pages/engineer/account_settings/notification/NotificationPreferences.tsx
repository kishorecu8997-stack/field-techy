import React, { useState, useEffect } from "react";
import { icons } from "@/config/icons";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";

/**
 * Custom hook for managing localStorage with error handling.
 * @param key - The localStorage key.
 * @param defaultValue - Default value if key is missing or invalid.
 * @returns [value, setValue] tuple.
 */
function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
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
 * Notification preferences page allowing users to toggle email, SMS, and push notifications.
 * Utilizes DrawerMenuSection to present toggle options and manages state for each notification type.
 */
const NotificationPreferences: React.FC<DrawerMenuProps> = () => {
  const [preferences, setPreferences] = useLocalStorage("notificationPreferences", {
    email: false,
    sms: false,
    push: false,
  });

  const updatePreference = (key: keyof typeof preferences) => (value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const menuItems: MenuItem[] = [
    {
      id: "email_notifications",
      label: "Email Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: preferences.email,
      onToggleChange: updatePreference("email"),
    },
    {
      id: "sms_notifications",
      label: "SMS Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: preferences.sms,
      onToggleChange: updatePreference("sms"),
    },
    {
      id: "push_notifications",
      label: "Push Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: preferences.push,
      onToggleChange: updatePreference("push"),
    },
  ];

  return (
    <DrawerMenuSection
      items={menuItems}
      ariaLabel="Notification Settings"
    />
  );
};

export default NotificationPreferences;