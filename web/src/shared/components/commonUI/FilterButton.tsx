import React from 'react';

interface FilterButtonProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[];
}

/**
 * `FilterButton` is a component that displays a horizontal list of filter buttons.
 * It highlights the currently active filter and allows users to switch between different filters.
 *
 * @param {FilterButtonProps} props The properties for the component.
 * @param {string} props.activeFilter The currently selected filter string.
 * @param {(filter: string) => void} props.onFilterChange A callback function that is triggered when a filter button is clicked. It receives the selected filter string.
 * @param {string[]} props.filters An array of strings representing the filter options to display.
 */
const FilterButton: React.FC<FilterButtonProps> = ({ activeFilter, onFilterChange, filters }) => {
  return (
    <div className="overflow-x-auto py-3">
      <div className="flex gap-2">
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

export default FilterButton;