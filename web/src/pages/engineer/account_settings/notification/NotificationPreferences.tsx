import { icons } from "@/config/icons";
import type { MenuItem } from "../types";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import TimePicker from "@/shared/components/commonUI/inputs/CustomTimePicker";

export interface TabsitemProps {
  label: string;
  value: string;
}
export interface NotificationFormdata {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  sla: string;
  mutenotifications: string;
}

/**
 * NotificationPreferences Component
 * ---------------------------------
 * Allows users to configure how and when they receive notifications.
 *
 * Features:
 * - Enable or disable Email, SMS, and Push notifications
 * - Select SLA (notification frequency) using predefined time options
 * - Temporarily mute notifications until a selected date
 * - Submit preferences using a unified form container
 *
 * Implementation Notes:
 * - Uses `react-hook-form` for form state management
 * - Uses local React state for toggle and SLA UI interactions
 * - Wraps all inputs inside `FormContainer` for centralized submit handling
 * - Designed to be API-ready for saving user preferences
 *
 * Form Fields:
 * - emailEnabled: Toggle email notifications
 * - smsEnabled: Toggle SMS notifications
 * - pushEnabled: Toggle push notifications
 * - sla: Selected notification frequency (e.g. "4h", "6h", "next-day")
 * - mutenotifications: Date until notifications are muted
 *
 * Submission:
 * - On submit, all preference values are collected
 * - API integration can be added inside `handlesubmit`
 */
const NotificationPreferences = () => {
  const handlesubmit = (_: NotificationFormdata) => {
    // TODO: Implement submission logic (e.g., call an API to persist notification preferences).
    // This placeholder keeps the handler intentionally empty while the integration is pending.
  };
  const method = useForm<NotificationFormdata>({
    defaultValues: {
      emailEnabled: false,
      smsEnabled: false,
      pushEnabled: false,
      sla: "4h",
      mutenotifications: "",
    },
  });
  const { watch, setValue } = method;
  const menuItems: MenuItem[] = [
    {
      id: "emailnotifications",
      label: "Email Notifications",
      icon: icons.email,
      isToggle: true,
      toggleValue: watch("emailEnabled"),
      onToggleChange: (val: boolean) => {
        setValue("emailEnabled", val);
      },
    },
    {
      id: "smsnotifications",
      label: "SMS Notifications",
      icon: icons.message,
      isToggle: true,
      toggleValue: watch("smsEnabled"),
      onToggleChange: (val: boolean) => {
        setValue("smsEnabled", val);
      },
    },
    {
      id: "pushnotifications",
      label: "Push Notifications",
      icon: icons.checkCircle,
      isToggle: true,
      toggleValue: watch("pushEnabled"),
      onToggleChange: (val: boolean) => {
        setValue("pushEnabled", val);
      },
    },
  ];
  const tabsItem: TabsitemProps[] = [
    { label: "4 Hours", value: "4h" },
    { label: "6 Hours", value: "6h" },
    { label: "Next Day", value: "next-day" },
    //  { label: "After Response", value: "after-response" },
  ];

  return (
    <FormContainer methods={method} onSubmit={handlesubmit}>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col justify-center items-center py-5 gap-4">
          <div className="p-4 bg-teal-900 rounded-full">
            <icons.notifications className="h-8 w-8 text-gray-100" />
          </div>
          <h1 className="text-2xl font-bold">Notification Preferences</h1>
          <p className="text-center text-gray-600">
            Control how and when you receive job notifications.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl p-6 space-y-6">
          <DrawerMenuSection items={menuItems} className="h-full" />
          <div className="flex flex-row gap-2">
            {tabsItem.map((item: TabsitemProps) => {
              return (
                <Button onClick={() => setValue("sla", item.value)}>
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div>
            <TimePicker
              name="mutenotifications"
              label="Mute Notifications Until"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default NotificationPreferences;
