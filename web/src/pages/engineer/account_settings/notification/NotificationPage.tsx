import { mockNotifications } from "@/dummy_data/notificationData";
import type { NotificationProps, GroupedNotifications } from "../types";
import NotificationPanel from "./NotificationPanel";

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
function NotificationPage() {
const grouped = groupNotificationsByDate(mockNotifications);

  return (
    <div className=" flex justify-center items-start">
      <NotificationPanel grouped={grouped} />
    </div>
  );
}

export default NotificationPage;
