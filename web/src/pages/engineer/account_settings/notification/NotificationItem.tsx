import React from 'react';
import type { NotificationProps } from '../types';

interface NotificationItemProps {
  notification: NotificationProps;
}

/**
 * Renders a single notification item with an icon, title, message, optional job details,
 * timestamp, and action buttons (for job offers). Supports structured display based on notification type.
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { type, title, message, jobTitle, location, client, payment, duration, timestamp, icon } = notification;

  const renderJobDetails = () => {
    if (!jobTitle) return null;
    return (
      <div className="mt-2 space-y-1 text-sm text-gray-700">
        {jobTitle && <p><strong>Job Title:</strong> {jobTitle}</p>}
        {location && <p><strong>Location:</strong> {location}</p>}
        {client && <p><strong>Client:</strong> {client}</p>}
        {payment && duration && <p><strong>Payment:</strong> {payment} | <strong>Duration:</strong> {duration}</p>}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (type !== 'job_offer') return null;
    return (
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-medium transition">
          Accept
        </button>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition">
          Decline
        </button>
      </div>
    );
  };

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
            {renderJobDetails()}
            {renderActionButtons()}
          </div>
          <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;