import NotificationPanel from "./NotificationPanel";

/**
 * Page component that centers the notification panel in the viewport for displaying grouped notifications.
 */
function NotificationPage() {
  return (
    <div className=" flex justify-center items-start">
      <NotificationPanel />
    </div>
  );
}

export default NotificationPage;
