import React, { useState, useRef } from "react";
import { ArrowUpDown, ListFilter, Check, ChevronRight } from "lucide-react";
import { icons } from "@/config/icons";
import { Button } from "./commonUI/Buttons";

interface AdminFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: FilterDataProps) => void;
}
export interface FilterDataProps {
  sortBy: string;
  date: string;
  filters: string[];
}

/**
 * AdminFilter Component
 * * A sliding sidebar component used by administrators to sort and filter report data.
 * Features include a programmatically triggered native date picker, multi-level
 * status filtering, and full support for light/dark themes.
 * * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the sidebar panel and backdrop.
 * @param {Function} props.onClose - Callback function triggered when the backdrop, close icon, or cancel button is clicked.
 * @param {Function} props.onApply - Callback function that returns the filter state object.
 * @param {Object} props.onApply.data - The selected filter data.
 * @param {('Date & Time'|'Priority')} props.onApply.data.sortBy - Selected sorting criteria.
 * @param {string[]} props.onApply.data.filters - Array of selected priority levels (e.g., ['Level 1']).
 * @param {string} props.onApply.data.date - ISO date string selected via the hidden date input.
 * * @example
 * <AdminFilter
 * isOpen={isFilterOpen}
 * onClose={() => setFilterOpen(false)}
 * onApply={(data) => console.log("Filters Applied:", data)}
 * />
 */
const AdminFilter: React.FC<AdminFilterProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [sortBy, setSortBy] = useState("Date & Time");
  const [selectedDate, setSelectedDate] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (level: string) => {
    setFilters((prev) =>
      prev.includes(level) ? prev.filter((i) => i !== level) : [...prev, level],
    );
  };

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleReset = () => {
    setSortBy("Date & Time");
    setSelectedDate("");
    setFilters([]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
        bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex flex-row justify-between border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              View Option
            </h2>
            <icons.close
              onClick={onClose}
              className="text-2xl cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            />
          </div>

          <div className="p-6 flex flex-col gap-8">
            {/* 1. Sort Section */}
            <div>
              <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 mb-6">
                <ArrowUpDown size={22} />
                <span className="text-lg font-bold">Sort by</span>

                {/* Date Selection Trigger */}
                <div
                  onClick={handleDateClick}
                  className="ml-auto flex items-center gap-1 cursor-pointer group"
                >
                  {sortBy === "Date & Time" && (
                    <span className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
                      {selectedDate || "Date...."}
                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                      />
                    </span>
                  )}

                  <input
                    type="date"
                    ref={dateInputRef}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {["Date & Time", "Priority"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setSortBy(option)}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        sortBy === option
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                    >
                      {sortBy === option && (
                        <Check size={16} className="text-white stroke-[4px]" />
                      )}
                    </div>
                    <span className="text-md font-semibold text-gray-700 dark:text-gray-300">
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* 2. Filter Section */}
            <div>
              <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 mb-6">
                <ListFilter size={22} />
                <span className="text-lg font-bold">Filter</span>
              </div>

              <div className="space-y-4">
                {["Level 1", "Level 2"].map((level) => (
                  <div
                    key={level}
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => toggleFilter(level)}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        filters.includes(level)
                          ? "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      {filters.includes(level) && (
                        <Check
                          size={16}
                          className="text-gray-600 dark:text-gray-300 stroke-[4px]"
                        />
                      )}
                    </div>
                    <span className="text-md font-semibold text-gray-700 dark:text-gray-300">
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Footer Buttons */}
          <div className="mt-auto p-8 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-end gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reset
              </Button>
              <Button
                size="lg"
                variant="primary"
                onClick={() => onApply({ sortBy, filters, date: selectedDate })}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFilter;
