import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import type { TagSelectFieldProps } from "./type";

// Custom chevron-down icon
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);



/**
 * A tag selection component for react-hook-form that allows users to select tags from a predefined list.
 * Selected tags are displayed as dismissible pills. It prevents duplicate selections and enforces a tag limit.
 */
export const TagSelectField = ({
  name,
  label,
  placeholder = "Select a tag...",
  required = false,
  rules,
  containerClassName = "flex flex-col py-1",
  maxTags = 10,
  options = [],
}: TagSelectFieldProps) => {
  const { control } = useFormContext();
  const [selectedOption, setSelectedOption] = useState("");

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const handleAddTag = (
    tagValue: string,
    onChange: (value: string[]) => void,
    value: string[]
  ) => {
    if (!tagValue) return;

    if (value.includes(tagValue)) {
      toast.error("This tag is already selected.");
      return;
    }

    if (value.length >= maxTags) {
      toast.error(`You can select up to ${maxTags} skills only.`);
      return;
    }

    const newValue = [...value, tagValue];
    onChange(newValue);
    setSelectedOption("");
  };

  const removeTag = (
    index: number,
    onChange: (value: string[]) => void,
    value: string[]
  ) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          const { onChange, value = [] } = field;

          const availableOptions = options.filter(
            (opt) => !value.includes(opt.value)
          );

          return (
            <>
              {/* Select wrapper */}
              <div className="relative">
                <select
                  value={selectedOption}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedOption(selected);
                    handleAddTag(selected, onChange, value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(selectedOption, onChange, value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-gray-500 focus:outline-none transition appearance-none"
                >
                  <option value="" disabled hidden>
                    {placeholder}
                  </option>
                  {availableOptions.length > 0 ? (
                    availableOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))
                  ) : (
                    <option disabled className="text-gray-400">
                      No more skills available
                    </option>
                  )}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </div>
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}

              {/* Render selected tags */}
              <div className="flex flex-wrap gap-2 py-2">
                {value.map((tagValue: string, index: number) => {
                  const tagLabel =
                    options.find((opt) => opt.value === tagValue)?.label ||
                    tagValue;

                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full border border-teal-300 dark:border-teal-700"
                    >
                      {tagLabel}
                      <button
                        type="button"
                        onClick={() => removeTag(index, onChange, value)}
                        className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 focus:outline-none"
                        aria-label={`Remove tag ${tagLabel}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default TagSelectField;