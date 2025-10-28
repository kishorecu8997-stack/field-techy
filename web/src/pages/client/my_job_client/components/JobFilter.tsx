import React from 'react';

interface JobFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = ['All Jobs', 'In-Progress', 'Completed', 'Posted', 'Hold'];
  
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 pb-2 pt-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-teal-800 dark:bg-teal text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobFilter;