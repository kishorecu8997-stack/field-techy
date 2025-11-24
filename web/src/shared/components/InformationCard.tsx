import React from 'react';
import type { InformationCardProps } from './type';

/**
 * A reusable card component to display information in a structured key-value format.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.title - The title to be displayed in the card header.
 * @param {string} props.description - A secondary header or description for the card content.
 * @param {Array<{label: string, value: string}>} props.details - An array of objects, where each object represents a row with a label and a value.
 * @param {string} [props.className=''] - Optional additional CSS classes to apply to the card container.
 * @returns {React.ReactElement} A React functional component that renders a structured information card.
 */
const InformationCard: React.FC<InformationCardProps> = ({ 
  title, 
  description,
  details, 
  className = '' 
}) => {
  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 ${className}`}
    >
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 ">        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
      {/* Description Header */}
      <div className="px-4 border-gray-200 dark:border-gray-700 ">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{description}</h2>
      </div>
      {/* Details Section */}
      <div className="px-4 py-3 space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex items-start">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
              {detail.label}:
            </span>
            <span className="ml-2 text-gray-900 dark:text-gray-200">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformationCard;