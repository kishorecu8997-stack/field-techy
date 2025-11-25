import React, { useState, useEffect, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { FiSearch, FiChevronDown } from "react-icons/fi";

interface Option {
  label: string;
  value: string | number;
}

interface AutoCompleteInputProps {
  name: string;
  control: Control;
  options: Option[];
  placeholder?: string;
  className?: string;
}

/**
 * An autocomplete input component integrated with `react-hook-form`.
 * It allows users to search and select from a predefined list of options.
 * @param {AutoCompleteInputProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered autocomplete input component.
 */
export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  name,
  control,
  options,
  placeholder,
  className,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter only if user types something
  const filteredOptions = options.filter((opt) =>
    search ? opt.label.toLowerCase().includes(search.toLowerCase()) : true
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={`relative ${className}`} ref={containerRef}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none" />
            <input
              type="text"
              value={search || field.value?.label || ""}
              onChange={(e) => {
                setSearch(e.target.value);
                field.onChange({ label: e.target.value, value: "" });
                setOpen(true);
              }}
              onClick={handleToggle}
              placeholder={placeholder}
              className="cursor-default w-full pl-8 pr-10 py-2 rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500
focus:outline-none focus:border-0 focus:ring-2 focus:ring-gray-50
dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <FiChevronDown
              onClick={handleToggle}
              className={`absolute right-3 top-1/2 text-xl -translate-y-1/2 text-gray-400 dark:text-gray-300 cursor-pointer transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {open && (
            <div
              className="absolute z-50 mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 max-h-56 overflow-auto
                    dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = field.value?.value === option.value;
                  return (
                    <div
                      key={option.value}
                      onClick={() => {
                        field.onChange(option);
                        setSearch("");
                        setOpen(false);
                      }}
                      className={`cursor-pointer px-3 py-2 ${
                        isSelected
                          ? "bg-emerald-100 text-gray-900 font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-gray-500"
                      }`}
                    >
                      {option.label}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-gray-400 dark:text-gray-400">
                  No options found
                </div>
              )}
            </div>
          )}
        </div>
      )}
    />
  );
};
