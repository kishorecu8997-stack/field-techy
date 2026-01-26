import React, { useState, useRef, useEffect } from "react";
import { CgDanger } from "react-icons/cg";
import { ChevronDown } from "lucide-react";
import { JOB_STATUS_INFO } from "@/utils/jobStatusUtils";
import { Button } from "@/shared/components/commonUI/Buttons";

interface StatusFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    "All Jobs",
    "Notified",
    "Unallocated",
    "Partially Assigned",
    "Assigned",
    "Selected",
    "Draft",
    "Canceled",
    "Escalation In Progress",
    "Work In Progress",
    "Closed",
    "Hold",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = activeFilter || "All Jobs";
  const isSpecificActive = activeFilter && activeFilter !== "All Jobs";

  return (
    <div className="mb-6 mt-5">
      <div className="flex items-center gap-x-4">
        {/* Status Dropdown */}
        <div className="relative w-full max-w-[20rem]" ref={dropdownRef}>
          <Button
            variant="no_style"
            fullWidth
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between px-6 py-2 rounded-lg text-sm font-medium border transition-all shadow-sm ${
              isSpecificActive
                ? "bg-teal-800 text-white border-teal-900"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 "
            }`}
          >
            <span className="flex items-center gap-1">
              {currentLabel}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </Button>

          {isOpen && (
            <div className="absolute left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              {statusOptions.map((option) => {
                const isActive =
                  activeFilter === option ||
                  (!activeFilter && option === "All Jobs");

                return (
                  <Button
                    key={option}
                    variant="no_style"
                    fullWidth
                    onClick={() => {
                      onFilterChange(option === "All Jobs" ? "" : option);
                      setIsOpen(false);
                    }}
                    className={`text-left px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Tooltip */}
        <div className="relative inline-block group">
          <CgDanger className="bg-gray-200 p-2 rounded-full text-5xl size-10 text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600" />
          <div className="absolute left-1/2 md:left-full -translate-x-1/2 mt-2 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg z-50">
            <ul className="list-disc pl-4">
              {Object.values(JOB_STATUS_INFO).map((status) => (
                <li key={status.label}>
                  <strong>{status.label}</strong> = {status.color}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
