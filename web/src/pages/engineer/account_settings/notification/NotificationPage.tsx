import CommonNotificationPage from "@/shared/components/notifications/CommonNotificationPage";
import { absoluteUrls } from "@/config/urls";

/**
 * Page component that centers the notification panel in the viewport for displaying grouped notifications.
 */
function NotificationPage() {
  return (
    <CommonNotificationPage
      viewAllLink={absoluteUrls.engineer.home.notifications}
      className="flex justify-center items-start"
    />
  );
}

export default NotificationPage;
