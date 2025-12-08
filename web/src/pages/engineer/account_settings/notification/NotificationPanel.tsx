import type { GroupedNotifications } from "../types";
import NotificationItem from "./NotificationItem";

/**
 * Displays notifications grouped by date (e.g., Today, Yesterday) using mock data.
 * Renders each notification through the NotificationItem component with proper grouping and layout.
 */
const NotificationPanel = ({ grouped }: { grouped: GroupedNotifications }) => {
  return (
    <div className="max-w-md w-full max-h-full overflow-y-auto">
      <div className="space-y-6">
        {Object.entries(grouped).map(([dateGroup, notifs]) => (
          <div key={dateGroup}>
            {dateGroup !== "Today" && (
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 dark:text-gray-200">
                {dateGroup}
              </h3>
            )}
            {notifs.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
