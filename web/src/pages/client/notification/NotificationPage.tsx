import NotificationPanel from "@/shared/components/notifications/NotificationPanel";
import { absoluteUrls } from "@/config/urls";
import {
  useAppNotifications,
  useAppMarkNotificationAsRead,
  useAppMarkAllNotificationsAsRead,
  useAppDeleteNotification,
} from "@/shared/apiServices/notifications/notificationOpenApiService";
import { groupNotificationsByDate } from "@/shared/apiServices/notifications/notificationAdapter";

/**
 * NotificationPage component displays a notification panel with a list of notifications.
 * It includes a search bar and a button to create a new notification.
 *
 * @returns {JSX.Element} The NotificationPage component.
 */
function NotificationPage() {
  const { notifications, isLoading } = useAppNotifications();

  if (isLoading) {
    return <div className="flex justify-center p-10">Loading notifications...</div>;
  }

  const { mutate: markAsRead } = useAppMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useAppMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useAppDeleteNotification();

  const grouped = groupNotificationsByDate(notifications);

  const handleDismiss = (id: number) => {
    deleteNotification({
      body: {
        id
      }
    });
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead({
      body: {
        id
      }
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead({});
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4">
      <NotificationPanel
        grouped={grouped}
        onDismiss={handleDismiss}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        viewAllLink={absoluteUrls.client.home.notifications}
      />
    </div>
  );
}

export default NotificationPage;
