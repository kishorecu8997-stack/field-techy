import { useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";

interface TagOption {
  value: string;
  label: string;
}

interface TagSelectFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  maxTags?: number;
  options: TagOption[];
  isTagCloseable?: boolean;
  disabled?: boolean;
}

/*
 * TagSelectField Component
 *
 * This component is used to select tags from a dropdown menu.
 *
 * Props:
 *
 * - name (string): The name of the input field.
 * - label (string): The label for the input field.
 * - isShowLabel (boolean): Whether to show the label.
 * - placeholder (string): The placeholder text for the input field.
 * - required (boolean): Whether the input field is required.
 * - rules (RegisterOptions): The validation rules for the input field.
 * - leftIcon (React.ReactNode): The left icon to be displayed next to the input field.
 * - containerClassName (string): The class name for the container element.
 * - inputClassName (string): The class name for the input field.
 * - maxTags (number): The maximum number of tags that can be selected.
 * - options (TagOption[]): The options for the dropdown menu.
 * - isTagCloseable (boolean): Whether to show a close icon next to each tag.
 * - disabled (boolean): Whether the input field is disabled.
 */
export const TagSelectField = ({
  name,
  label,
  isShowLabel = true,
  placeholder = "Select a tag...",
  required = false,
  rules,
  leftIcon,
  containerClassName = "flex flex-col py-1",
  inputClassName = `
    w-full rounded-md border border-gray-300 dark:border-gray-600
    py-3 pl-5 bg-white dark:bg-gray-800 
    text-base text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    transition
  `,
  maxTags = 10,
  options = [],
  disabled = false,
  isTagCloseable = true,
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
      toast.error(`You can select up to ${maxTags} ${name} only.`);
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
      {isShowLabel && (
        <label
          className={`
            block mb-1 text-md font-semibold
            ${disabled ? "text-gray-400" : "text-gray-700"} 
            ${disabled ? "dark:text-gray-500" : "dark:text-gray-300"}
          `}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          /** FIX: Always ensure value is an array */
          const onChange = field.onChange;
          const value: string[] = Array.isArray(field.value) ? field.value : [];

          const availableOptions = options.filter(
            (opt) => !value.includes(opt.value)
          );

          return (
            <>
              <div className="relative">
                {leftIcon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                    {leftIcon}
                  </div>
                )}

                <select
                  value={selectedOption}
                  disabled={disabled}
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
                  className={`
                    ${inputClassName}
                     ${
                       error && !disabled
                         ? "border-red-500 focus:ring-1 focus:ring-red-400"
                         : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
                     }
                    ${leftIcon ? "pl-10" : ""}
                    pr-10 appearance-none cursor-pointer
                    disabled:bg-gray-100 disabled:text-gray-400 
                    dark:disabled:bg-gray-700 dark:disabled:text-gray-500
                    [&>*:disabled]:text-gray-400 
                    dark:[&>*:disabled]:text-gray-500
                  `}
                >
                  <option value="" disabled hidden>
                    {placeholder}
                  </option>

                  {availableOptions.length ? (
                    availableOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No item found
                    </option>
                  )}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FaChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}

              {/* TAG LIST */}
              <div
                className={`flex flex-wrap gap-2 ${value.length ? "py-2" : ""}`}
              >
                {value.map((tagValue: string, index: number) => {
                  const tagLabel =
                    options.find((opt) => opt.value === tagValue)?.label ||
                    tagValue;

                  return (
                    <span
                      key={index}
                      className="
                        inline-flex items-center gap-1 px-3 py-1 text-sm 
                        bg-teal-100 dark:bg-teal-900 
                        text-teal-800 dark:text-teal-200 
                        rounded-full border border-teal-300 dark:border-teal-700
                      "
                    >
                      {tagLabel}
                      {isTagCloseable && !disabled && (
                        <button
                          type="button"
                          onClick={() => removeTag(index, onChange, value)}
                          className="
                            ml-1 text-teal-600 dark:text-teal-400 
                            hover:text-teal-800 dark:hover:text-teal-200
                            focus:outline-none
                          "
                        >
                          ×
                        </button>
                      )}
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
