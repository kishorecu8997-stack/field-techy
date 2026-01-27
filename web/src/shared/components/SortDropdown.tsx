import {
  SORT_OPTIONS,
  type SortOption,
} from "@/pages/engineer/search_result/types";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./commonUI/Buttons";
import { useLayoutEffect } from "react";

interface SortDropdownProps {
  currentSort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

/**
 * SortDropdown Component
 * Renders a dropdown menu to sort jobs by criteria (e.g., Newest, Oldest).
 * Renders a dropdown menu to sort jobs by criteria (e.g., Relevance, Date, Salary, Distance).
 * @param {Object} props - Component props
 * @param {SortOption} props.currentSort - Current sort value
 * @param {(sort: SortOption) => void} props.onSortChange - Callback when sort option is selected
 * @returns {JSX.Element} Rendered dropdown
 */
const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort = SORT_OPTIONS.RELEVANCE,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>(currentSort as SortOption);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const options = [
    { value: SORT_OPTIONS.RELEVANCE, label: "Relevance" },
    { value: SORT_OPTIONS.DATE, label: "Date" },
    { value: SORT_OPTIONS.SALARY, label: "Salary" },
    { value: SORT_OPTIONS.DISTANCE, label: "Distance" },
  ];
  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };
    if (isOpen) {
      updatePosition(); // initial calculation
      window.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const dropdown = isOpen ? (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 border border-gray-200 rounded-md shadow-lg z-10"
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          variant="no_style"
          fullWidth
          className={`text-left px-4 py-2 text-sm justify-start ${
            sort === option.value
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-600 dark:text-emerald-50"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
          onClick={() => {
            setSort(option.value);
            onSortChange?.(option.value);
            setIsOpen(false);
          }}
        >
          {option.label}
        </Button>
      ))}
    </div>
  ) : null;
  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:text-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      {createPortal(dropdown, document.body)}
    </div>
  );
};

export default SortDropdown;
