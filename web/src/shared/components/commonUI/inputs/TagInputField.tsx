import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useState } from "react";
import type { KeyboardEvent } from "react";

interface TagInputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  maxTags?: number;
}

/**
 * TagInputField - A reusable tag/chip input component for react-hook-form.
 * Users can type a value and press Enter to create a tag.
 * Tags are displayed as pills with an '×' to remove.
 */
export const TagInputField = ({
  name,
  label,
  placeholder = "Add a tag...",
  required = false,
  rules,
  leftIcon,
  containerClassName = "flex flex-col py-1",
  inputClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition",
  maxTags = 10,
}: TagInputFieldProps) => {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  // Default validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    onChange: (value: string[]) => void,
    value: string[]
  ) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (maxTags && value.length >= maxTags) return;

      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue("");
    }
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

          return (
            <>
              <div className="relative">
                {/* Input container with icon */}
                <div className="relative">
                  {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                      {leftIcon}
                    </div>
                  )}
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, onChange, value)}
                    placeholder={placeholder}
                    className={`${inputClassName} ${leftIcon ? "pl-10" : ""}`}
                  />
                </div>
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}
              {/* Tags container */}
              <div className="flex flex-wrap gap-2 py-2">
                {value.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full border border-teal-300 dark:border-teal-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index, onChange, value)}
                      className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};
