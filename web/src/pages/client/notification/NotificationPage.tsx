import NotificationPanel from "./NotificationPanel";

/**
 * NotificationPage component displays a notification panel with a list of notifications.
 * It includes a search bar and a button to create a new notification.
 *
 * @returns {JSX.Element} The NotificationPage component.
 */
function NotificationPage() {
  return (
    <div className="flex justify-center items-start min-h-screen p-4">
      <NotificationPanel />
    </div>
  );
}

export default NotificationPage;
