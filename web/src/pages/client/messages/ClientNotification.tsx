import { mockClientNotificationsData } from "@/dummy_data/notificationData";
import NotificationPanel from "@/pages/engineer/account_settings/notification/NotificationPanel";
import type { NotificationProps } from "@/pages/engineer/account_settings/types";
import type { GroupedNotifications } from "../type";

const groupNotificationsByDate = (
  notifications: NotificationProps[]
): GroupedNotifications => {
  const grouped: GroupedNotifications = {
    Today: [],
    Yesterday: [],
  };

  notifications.forEach((notif) => {
    if (notif.id <= 2) {
      grouped.Today.push(notif);
    } else {
      grouped.Yesterday.push(notif);
    }
  });

  return grouped;
};

/**
 * Page component that centers the notification panel in the viewport for displaying grouped notifications.
 */
function ClientNotification() {
const grouped = groupNotificationsByDate(mockClientNotificationsData);

  return (
    <div className=" flex justify-center items-start">
      <NotificationPanel grouped={grouped} />
    </div>
  );
}

export default ClientNotification;
