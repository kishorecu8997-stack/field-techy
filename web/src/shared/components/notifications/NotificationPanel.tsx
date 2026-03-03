import { NavLink } from "react-router-dom";
import type { NotificationPanelProps } from "@/shared/types/notification";
import NotificationItem from "./NotificationItem";
import useNotificationGate from "@/shared/store/useNotificationGate";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { Button } from "../commonUI/Buttons";

/**
 * Displays notifications grouped by date (e.g., Today, Yesterday).
 * Renders each notification through the shared NotificationItem component with proper grouping and layout.
 */
const NotificationPanel = ({
  grouped,
  onDismiss,
  onMarkAsRead,
  onMarkAllAsRead,
  viewAllLink,
}: NotificationPanelProps) => {
  const { setISOpenSidebar } = useDrawerStore();
  const { isPaused, pendingId } = useNotificationGate();

  const allGroupsEmpty = Object.values(grouped).every(
    (notifs) => notifs.length === 0,
  );

  const hasUnread = Object.values(grouped).some((list) =>
    list.some((n) => !n.read),
  );

  return (
    <div className="max-w-md w-full max-h-full overflow-y-auto relative">
      <div className="flex justify-end gap-2 mb-2 pr-2 sticky top-0 bg-white dark:bg-gray-800 z-10 py-1">
        {onMarkAllAsRead && hasUnread && (
          <Button
            variant="no_style"
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer h-4"
          >
            Mark all as read
          </Button>
        )}
        {viewAllLink && (
          <NavLink to={viewAllLink}>
            <div
              onClick={() => setISOpenSidebar(false)}
              className="text-xs font-medium text-teal-600 hover:text-teal-800 underline transition-colors dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer"
            >
              View All
            </div>
          </NavLink>
        )}
      </div>

      <div className="space-y-6 mt-1">
        {allGroupsEmpty ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 dark:bg-gray-800/50 dark:border-gray-700">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-gray-500 font-medium dark:text-gray-400">
              No notifications received yet
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateGroup, notifs]) => {
            if (notifs.length === 0) return null;
            return (
              <div key={dateGroup}>
                {dateGroup !== "Today" && (
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 dark:text-gray-200 pl-1">
                    {dateGroup}
                  </h3>
                )}
                {notifs.map((notif) => {
                  const isBlocked =
                    isPaused &&
                    notif.type !== "job_offer" &&
                    String(notif.id) !== String(pendingId);
                  if (isBlocked) return null;

                  return (
                    <div key={notif.id} className="relative group">
                      <div>
                        <NotificationItem
                          notification={notif}
                          onDismiss={onDismiss}
                          onMarkAsRead={onMarkAsRead}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
