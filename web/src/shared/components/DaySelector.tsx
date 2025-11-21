import React from "react";
import { Controller } from "react-hook-form";
import type { FieldValues, UseControllerProps } from "react-hook-form";

interface DaySelectorProps {
  label?: string;
  required?: boolean;
  className?: string;
}

/**
 * The inner component for rendering the day selector UI.
 * It is not intended to be used directly in forms, but rather wrapped by the main DaySelector component.
 * @param {object} props - The component props.
 * @param {string[]} props.selectedDays - An array of currently selected day strings.
 * @param {(days: string[]) => void} props.onChange - Callback function triggered when the selection changes.
 * @param {string} [props.label] - The label to display above the day selector.
 * @param {boolean} [props.required=false] - Whether the field is required, displays an asterisk.
 * @param {string} [props.className=""] - Additional CSS classes for the container.
 * @returns {React.ReactElement} The rendered day selector UI.
 */
const DaySelectorInner: React.FC<{
  selectedDays: string[];
  onChange: (days: string[]) => void;
  label?: string;
  required?: boolean;
  className?: string;
}> = ({ selectedDays, onChange, label, required = false, className = "" }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleToggle = (day: string) => {
    const newSelected = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange(newSelected);
  };

  return (
    <div className={`mb-4 ${className}`.trim()}>
      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-lg p-3 flex flex-wrap gap-3">
        {days.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <label
              key={day}
              className="flex items-center cursor-pointer dark:text-white"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(day)}
                className="sr-only"
              />
              <div
                className={`flex items-center justify-center h-4 w-4 rounded border ${
                  isSelected ? "bg-teal-900 border-teal-900" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <div className="inline-flex items-center justify-center p-1 text-xs text-white">
                    ✓
                  </div>
                )}
              </div>
              <span className="ml-2 dark:text-white text-sm text-gray-800">
                {day}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// Main exported component — React Hook Form ready
const DaySelector = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
  ...props
}: UseControllerProps<T> & DaySelectorProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <DaySelectorInner
          selectedDays={value || []}
          onChange={onChange}
          label={label}
          required={required}
          className={className}
        />
      )}
      {...props}
    />
  );
};

export default DaySelector;
