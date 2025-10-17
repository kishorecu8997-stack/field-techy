// ContactCard.tsx
import React from 'react';
import type { ContactItem } from '../types';

interface ContactCardProps {
  items: ContactItem[];
  className?: string; // optional for extra styling flexibility
}

const ContactCard: React.FC<ContactCardProps> = ({ items, className = '' }) => {
  return (
    <div className={`bg-blue-50 p-4 rounded-lg ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center ${index < items.length - 1 ? 'mb-4 pb-4 border-b border-gray-200' : ''}`}
        >
          <div className="bg-emerald-800 rounded-full p-2 mr-3 flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
            <p className="text-gray-600">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactCard;