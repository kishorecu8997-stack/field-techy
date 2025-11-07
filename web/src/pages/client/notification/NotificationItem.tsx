import React from 'react';
import type { NotificationProps } from '@/dummy_data/clientNotificationData';

interface NotificationItemProps {
  notification: NotificationProps;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { title, message, timestamp, icon } = notification;

  return (
    <div className="flex items-start p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-4 shadow-sm">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-700">{message}</p>
          </div>
          <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;