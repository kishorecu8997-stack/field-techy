import { SORT_OPTIONS, type SortOption } from "@/pages/search_result/types";
import React, { useState } from "react";
import type { SortDropdownProps } from "./type";



/**
 * SortDropdown Component
 * Renders a dropdown menu to sort jobs by criteria (e.g., Newest, Oldest).
 *
 * @param {Object} props - Component props
 * @param {string} props.currentSort - Current sort value
 * @param {(sort: string) => void} props.onSortChange - Callback when sort option is selected
 * @returns {JSX.Element} Rendered dropdown
 */
const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>(currentSort as SortOption);

  const options = [
    { value: SORT_OPTIONS.NEWEST, label: "Newest" },
    { value: SORT_OPTIONS.OLDEST, label: "Oldest" },
  ];
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Sort by: {options.find((option) => option.value === sort)?.label}
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSort(option.value);
                onSortChange?.(option.value);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === option.label
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-gray-700 hover:bg-gray-100"
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
