import React from "react";
import NotificationItem from "./NotificationItem";
import { mockNotifications } from "@/dummy_data/clientNotificationData";
import type { NotificationProps } from "@/pages/engineer/account_settings/types";

const groupNotificationsByDate = (
  notifications: NotificationProps[],
): { Today: NotificationProps[]; Yesterday: NotificationProps[] } => {
  return {
    Today: notifications.filter((notif) => notif.id <= 2),
    Yesterday: notifications.filter((notif) => notif.id > 2),
  };
};

/**
 * NotificationPanel component displays a list of notifications grouped by date.
 * It includes a search bar and a button to create a new notification.
 *
 * @returns {JSX.Element} The NotificationPanel component.
 */
const NotificationPanel: React.FC = () => {
  const grouped = groupNotificationsByDate(mockNotifications);

  return (
    <div className="max-w-md w-full max-h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Today Group */}
        <div>
          {grouped.Today.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
        </div>

        {/* Yesterday Group */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Yesterday
          </h3>
          {grouped.Yesterday.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
