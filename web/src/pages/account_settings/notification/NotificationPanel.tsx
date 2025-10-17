import React from 'react';
import NotificationItem from './NotificationItem';
import type { GroupedNotifications, NotificationProps } from '../types';
import { mockNotifications } from '@/dummy_data/notificationData';

const groupNotificationsByDate = (notifications: NotificationProps[]): GroupedNotifications => {
  const grouped: GroupedNotifications = {
    Today: [],
    Yesterday: [],
  };

  notifications.forEach((notif) => {
    if (notif.id <= 2) {
      grouped.Today.push(notif);
    } else {
      grouped.Yesterday.push(notif);
    }
  });

  return grouped;
};

/**
 * Displays notifications grouped by date (e.g., Today, Yesterday) using mock data.
 * Renders each notification through the NotificationItem component with proper grouping and layout.
 */
const NotificationPanel: React.FC = () => {
  const grouped = groupNotificationsByDate(mockNotifications);

  return (
    <div className="max-w-md w-full max-h-full overflow-y-auto">
      <div className="space-y-6">
        {Object.entries(grouped).map(([dateGroup, notifs]) => (
          <div key={dateGroup}>
            {dateGroup !== 'Today' && (
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{dateGroup}</h3>
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