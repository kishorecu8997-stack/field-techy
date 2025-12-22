import React, { useState, useRef, useEffect } from "react";
import { CgDanger } from "react-icons/cg";
import { ChevronDown } from "lucide-react"; 

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
    "All Jobs", "Notified", 
    "Unallocated", "Partially Assigned", "Assigned", "Selected", 
    "Draft","Canceled","Escalation In Progress", "Work In Progress", "Closed", "Hold",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        {/* Custom Dropdown (Matching SortDropdown Pattern) */}
        <div className="relative w-full max-w-[20rem]" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium border transition-all outline-none shadow-sm ${
              isSpecificActive
                ? "bg-teal-800 text-white border-teal-900"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{currentLabel}</span>
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <div className="absolute left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onFilterChange(option === "All Jobs" ? "" : option);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    (activeFilter === option || (!activeFilter && option === "All Jobs"))
                      ? "bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative inline-block group">
          <CgDanger className="bg-gray-200 p-2 rounded-full text-5xl size-10 text-gray-500 cursor-pointer hover:bg-gray-300 transition-colors" />
          <div
            className="absolute left-1/2 md:left-full -translate-x-1/2 mt-2
                hidden group-hover:block
                whitespace-nowrap
                bg-gray-900 text-white text-xs
                px-3 py-1 rounded shadow-lg z-50"
          >
           Job Status Guide <br/>
            ---------------------- <br/>
            Applied = Blue <br/>
            In Progress = Yellow <br/>
            Completed = Green <br/>
            Notified = Blue <br/>
            Unallocated = Gray<br/>
            Partially Assigned = Yellow<br/>
            Assigned = Green <br/>
            Selected = Purple<br/>
            Hold = Orange<br/>
            Draft = Light Gray<br/>
            Canceled = Red<br/>
            Escalation In Progress = Red/Warning<br/>
            Work In Progress = Blue (active)<br/>
            Closed = Gray (inactive)<br/><br/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;