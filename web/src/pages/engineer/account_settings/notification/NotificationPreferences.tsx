import React from "react";
import { icons } from "@/config/icons";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import { useEffect } from "react";

/** 
 * Notification preferences page allowing users to toggle email, SMS, and push notifications.
 * Utilizes DrawerMenuSection to present toggle options and manages state for each notification type.
 */


//Fetching stored preferences from localStorage
const storedPrefs = JSON.parse(
  localStorage.getItem("notificationPreferences") || "{}"
);

const NotificationPreferences: React.FC<DrawerMenuProps> = () => {
const [emailNotifications, setEmailNotifications] = React.useState(
  storedPrefs.email ?? true
);
const [smsNotifications, setSmsNotifications] = React.useState(
  storedPrefs.sms ?? false
);
const [pushNotifications, setPushNotifications] = React.useState(
  storedPrefs.push ?? true
);


//Updating localStorage whenever preferences change
  useEffect(() => {
  localStorage.setItem(
    "notificationPreferences",
    JSON.stringify({
      email: emailNotifications,
      sms: smsNotifications,
      push: pushNotifications,
    })
  );
}, [emailNotifications, smsNotifications, pushNotifications]);

  const menuItems: MenuItem[] = [
    {
      id: "email_notifications",
      label: "Email Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: emailNotifications,
      onToggleChange: setEmailNotifications,
    },
    {
      id: "sms_notifications",
      label: "SMS Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: smsNotifications,
      onToggleChange: setSmsNotifications,
    },
    {
      id: "push_notifications",
      label: "Push Notifications",
      icon: icons.notifications,
      isToggle: true,
      toggleValue: pushNotifications,
      onToggleChange: setPushNotifications,
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
