import { NavLink } from "react-router-dom";
import type { GroupedNotifications } from "../types";
import NotificationItem from "./NotificationItem";
import { absoluteUrls } from "@/config/urls";
import useNotificationGate from "@/shared/store/useNotificationGate";

/**
 * Displays notifications grouped by date (e.g., Today, Yesterday) using mock data.
 * Renders each notification through the NotificationItem component with proper grouping and layout.
 */
const NotificationPanel = ({ grouped }: { grouped: GroupedNotifications }) => {
  const { isPaused, pendingId } = useNotificationGate();
  const groupedLast20 = Object.fromEntries(
    Object.entries(grouped).map(([group, notifs]) => [
      group,
      notifs.slice(0, 20),
    ])
  );

  return (
    <div className="absolute max-w-md w-full max-h-full overflow-y-auto">
      <div className="space-y-6 pb-20">
        {Object.entries(groupedLast20).map(([dateGroup, notifs]) => (
          <div key={dateGroup}>
            {dateGroup !== "Today" && (
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 dark:text-gray-200">
                {dateGroup}
              </h3>
            )}
            {notifs.map((notif) => {
              const isBlocked =
                isPaused &&
                notif.type !== "job_offer" &&
                notif.id !== pendingId;
              if (isBlocked) return null;

              return (
                <div>
                  {!notif.read && (
                    <div className="relative bg-blue-400 shadow-sm top-3 size-2 rounded-full left-1"></div>
                  )}
                  <NotificationItem key={notif.id} notification={notif} />
                </div>
              );
            })}
          </div>
        ))}
        <NavLink to={absoluteUrls.engineer.home.notifications}>
          <div className="text-end underline text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer">
            View All
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default NotificationPanel;
