import React from "react";

type Option = {
  label: string;
  value: string;
};

interface FilterFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "select" | "input";
  placeholder?: string;
  options?: Option[];
  ariaLabel: string;
}

const FilterField: React.FC<FilterFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type,
  placeholder,
  options = [],
  ariaLabel,
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-sm font-semibold mb-1"
      >
        {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={ariaLabel}
          className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}
    </div>
  );
};

export default FilterField;
