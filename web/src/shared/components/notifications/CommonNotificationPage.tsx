import NotificationPanel from "@/shared/components/notifications/NotificationPanel";
import {
  useAppNotifications,
  useAppMarkNotificationAsRead,
  useAppMarkAllNotificationsAsRead,
  useAppDeleteNotification,
} from "@/shared/apiServices/notifications/notificationOpenApiService";
import { groupNotificationsByDate } from "@/shared/apiServices/notifications/notificationAdapter";

interface CommonNotificationPageProps {
  viewAllLink?: string;
  className?: string;
}

/**
 * Shared Notification Page component that handles data fetching, manipulation, and rendering.
 * Can be used by both Client and Engineer modules.
 */
const CommonNotificationPage: React.FC<CommonNotificationPageProps> = ({
  viewAllLink,
  className = "flex justify-center items-start",
}) => {
  const { notifications, isLoading } = useAppNotifications();

  const { mutate: markAsRead } = useAppMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useAppMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useAppDeleteNotification();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">Loading notifications...</div>
    );
  }

  const grouped = groupNotificationsByDate(notifications);

  const handleDismiss = (id: string | number) => {
    deleteNotification({
      body: {
        id: id as number,
      },
    });
  };

  const handleMarkAsRead = (id: string | number) => {
    markAsRead({
      body: {
        id: id as number,
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead({});
  };

  return (
    <div className={className}>
      <NotificationPanel
        grouped={grouped}
        onDismiss={handleDismiss}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        viewAllLink={viewAllLink}
      />
    </div>
  );
};

export default CommonNotificationPage;
