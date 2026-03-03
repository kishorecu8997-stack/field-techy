import NotificationPanel from "@/shared/components/notifications/NotificationPanel";
import {
  useAppNotifications,
  useAppMarkNotificationAsRead,
  useAppMarkAllNotificationsAsRead,
  useAppDeleteNotification,
} from "@/shared/apiServices/notifications/notificationOpenApiService";
import { groupNotificationsByDate } from "@/shared/apiServices/notifications/notificationAdapter";
import { usePopupStore } from "@/shared/store/popupStore";

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
  const { showPopup, closePopup } = usePopupStore();

  const { mutate: markAsRead } = useAppMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useAppMarkAllNotificationsAsRead();
  const { mutateAsync: deleteNotification } = useAppDeleteNotification();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">Loading notifications...</div>
    );
  }

  // Sort notifications newest-first so "last 20" picks the most recent ones
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const unread = sorted.filter((n) => !n.read);
  const hasUnread = unread.length > 0;

  // Always cap the visible list at MAX (20) so the panel never renders
  // an unbounded number of items. When unread alone exceeds MAX we surface
  // the overflow count so the panel can show a "View all unread" prompt.
  const MAX = 20;
  let visibleNotifications: typeof sorted;
  let unreadOverflow = 0;

  if (!hasUnread) {
    // No unread: show up to MAX most-recent notifications.
    visibleNotifications = sorted.slice(0, MAX);
  } else if (unread.length >= MAX) {
    // More unread than MAX: cap at MAX and record the hidden count.
    visibleNotifications = unread.slice(0, MAX);
    unreadOverflow = unread.length - MAX;
  } else {
    // Some unread: fill remaining slots with the most-recent read notifications.
    const remaining = MAX - unread.length;
    const readNotifications = sorted.filter((n) => n.read).slice(0, remaining);
    visibleNotifications = [...unread, ...readNotifications];
  }

  const grouped = groupNotificationsByDate(visibleNotifications);

  const handleDismiss = async (id: string | number) => {
    // Find the notification title for display in the confirmation popup
    const notif = notifications.find((n) => String(n.id) === String(id));

    await showPopup({
      title: "Delete Notification",
      body: (
        <div className="px-2 py-1">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this notification?
          </p>
          {notif && (
            <p className="text-sm text-gray-500 mt-1 font-medium">
              "{notif.title}"
            </p>
          )}
        </div>
      ),
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "secondary",
          action: () => closePopup(),
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async () => {
            await deleteNotification({ body: { id: id as number } });
            closePopup(true);
          },
        },
      ],
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
        unreadOverflow={unreadOverflow}
      />
    </div>
  );
};

export default CommonNotificationPage;
