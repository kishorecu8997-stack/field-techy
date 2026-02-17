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
 * Page component that centers the notification panel in the viewport for displaying grouped notifications.
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
    <div className="flex justify-center items-start">
      <NotificationPanel
        grouped={grouped}
        onDismiss={handleDismiss}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        viewAllLink={absoluteUrls.engineer.home.notifications}
      />
    </div>
  );
}

export default NotificationPage;
