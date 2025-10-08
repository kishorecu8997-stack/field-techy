// src/components/SortDropdown.tsx

import React, { useState } from 'react';
import type { SortOption } from '../types';

/**
 * SortDropdown component for sorting job listings
 * 
 * @param {Object} props - Component props
 * @param {SortOption} props.currentSort - Current sort option
 * @param {Function} props.onSortChange - Callback function when sort changes
 * @returns {JSX.Element} Rendered sort dropdown component
 */
const SortDropdown: React.FC<{
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggle dropdown visibility
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handle sort option selection
   * @param {SortOption} option - Selected sort option
   */
  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  // Sort options mapping
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highestPay', label: 'Highest Pay' },
    { value: 'lowestPay', label: 'Lowest Pay' }
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span>Sort by: {sortOptions.find(o => o.value === currentSort)?.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`block px-4 py-2 text-sm w-full text-left ${
                currentSort === option.value
                  ? 'bg-green-100 text-green-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;