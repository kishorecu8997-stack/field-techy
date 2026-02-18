import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type {
  NotificationProps,
  GroupedNotifications,
} from "@/shared/types/notification";

dayjs.extend(relativeTime);

export const mapApiNotification = (notif: {
  id: number | string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}): NotificationProps => ({
  id: notif.id,
  type: "info", // Fallback to info, can be refined if API provides more specific types
  title: notif.title,
  message: notif.body,
  timestamp: dayjs(notif.createdAt).fromNow(),
  createdAt: notif.createdAt,
  icon: "🔔",
  read: notif.isRead,
});

export const groupNotificationsByDate = (
  notifications: NotificationProps[],
): GroupedNotifications => {
  const grouped: GroupedNotifications = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");

  notifications.forEach((notif) => {
    const notifDate = dayjs(notif.createdAt);
    if (notifDate.isSame(today, "day")) {
      grouped.Today.push(notif);
    } else if (notifDate.isSame(yesterday, "day")) {
      grouped.Yesterday.push(notif);
    } else {
      grouped.Earlier.push(notif);
    }
  });

  return grouped;
};
