import React from 'react';
import type { ContactCardProps } from '../types';

/**
 * Displays a list of contact information items with icons, labels, and values in a styled card layout.
 * Each item is separated by a bottom border except the last one.
 */
const ContactCard: React.FC<ContactCardProps> = ({ items, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700  ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-start ${index < items.length - 1 ? 'mb-5 pb-5 border-b border-gray-200 dark:border-gray-700' : ''}`}
        >
          <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg p-2.5 mr-4 flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-0.5">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactCard;