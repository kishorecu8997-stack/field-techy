import { absoluteUrls } from "@/config/urls";
import CommonNotificationPage from "@/shared/components/notifications/CommonNotificationPage";

/**
 * NotificationPage component displays a notification panel with a list of notifications.
 * It includes a search bar and a button to create a new notification.
 *
 * @returns {JSX.Element} The NotificationPage component.
 */
function NotificationPage() {
  return (
    <CommonNotificationPage
      className="flex justify-center items-start min-h-screen pt-0 px-4"
      viewAllLink={absoluteUrls.client.home.notifications}
    />
  );
}

export default NotificationPage;
