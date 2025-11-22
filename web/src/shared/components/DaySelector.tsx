import React from "react";
import { Controller } from "react-hook-form";
import type { FieldValues, UseControllerProps } from "react-hook-form";

interface DaySelectorProps {
  label?: string;
  required?: boolean;
  className?: string;
  isShowLabel?: boolean;
}

const DaySelectorInner: React.FC<{
  selectedDays: string[];
  onChange: (days: string[]) => void;
  label?: string;
  required?: boolean;
  isShowLabel?: boolean;
  className?: string;
}> = ({
  selectedDays,
  onChange,
  label,
  required = false,
  isShowLabel = true,
  className = "",
}) => {
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

  // Only show asterisk if label is shown, exists, and field is required
  const showAsterisk = isShowLabel && Boolean(label) && required;

  return (
    <div className={`mb-4 ${className}`.trim()}>
      {isShowLabel && label && (
        <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
          {label}
          {showAsterisk && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-wrap gap-3">
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
                disabled={false} // can be made dynamic if needed later
              />
              <div
                className={`flex items-center justify-center h-4 w-4 rounded border ${
                  isSelected
                    ? "bg-teal-900 border-teal-900"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {isSelected && <span className="text-xs text-white">✓</span>}
              </div>
              <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">
                {day}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// Main component: React Hook Form compatible
const DaySelector = <T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  className,
  isShowLabel = true,
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
          isShowLabel={isShowLabel}
          className={className}
        />
      )}
      {...props}
    />
  );
};

export default DaySelector;
