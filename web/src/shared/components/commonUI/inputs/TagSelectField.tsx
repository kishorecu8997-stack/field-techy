import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";

interface TagOption {
  value: string | number;
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
  disabled?: boolean;
}

/**
 * A tag selection component for react-hook-form that allows users to select tags from a predefined list.
 * It uses Headless UI Listbox for a premium experience and displays selected tags as dismissible pills.
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
  inputClassName = "w-full rounded-md border text-base py-3 pl-5 pr-10 flex items-center justify-start text-left bg-white dark:bg-gray-800 transition",
  maxTags = 20,
  options = [],
  disabled = false,
}: TagSelectFieldProps) => {
  const { control } = useFormContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const dropdownHeight = 250;

    if (spaceBelow < dropdownHeight && buttonRect.top > dropdownHeight) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  };

  const removeTag = (
    index: number,
    onChange: (value: string[]) => void,
    value: string[],
  ) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className={containerClassName}>
      {isShowLabel && (
        <label
          className={`block mb-1 text-md font-semibold ${disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        disabled={disabled}
        render={({ field, fieldState: { error } }) => {
          const { onChange, value = [] } = field;
          const currentValues = Array.isArray(value) ? value : [];
          const selectedOptions = options.filter((opt) =>
            currentValues.map(String).includes(String(opt.value)),
          );

          return (
            <>
              <Listbox
                value={selectedOptions} // We handle selection manually to support tagging
                onChange={(vals: TagOption[]) => {
                  const newValues = vals.map((v) => String(v.value));
                  if (newValues.length > maxTags) {
                    toast.error(`You can select up to ${maxTags} tags only.`);
                    return;
                  }
                  onChange(newValues);
                }}
                disabled={disabled}
                multiple
              >
                {({ open }) => {
                  if (open) {
                    requestAnimationFrame(updatePosition);
                  }

                  return (
                    <div className="relative">
                      <Listbox.Button
                        ref={buttonRef}
                        className={`${inputClassName} ${
                          leftIcon ? "pl-10" : ""
                        } ${
                          error && !disabled
                            ? "border-red-500 focus:ring-1 focus:ring-red-400"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center w-full space-x-2">
                          {leftIcon && (
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              {leftIcon}
                            </span>
                          )}
                          <span className="block truncate text-gray-400">
                            {placeholder}
                          </span>
                        </div>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <FaChevronDown
                            className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Listbox.Options
                          className={`absolute z-30 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 ${
                            position === "top"
                              ? "bottom-full mb-1"
                              : "top-full mt-1"
                          }`}
                        >
                          {options.map((option) => {
                            const isSelected = currentValues
                              .map(String)
                              .includes(String(option.value));
                            return (
                              <Listbox.Option
                                key={option.value}
                                value={option}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2.5 pl-4 pr-4 transition-colors ${
                                    isSelected
                                      ? "bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-200"
                                      : active
                                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        : "text-gray-700 dark:text-gray-300"
                                  }`
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`block truncate ${isSelected ? "font-semibold" : "font-normal"}`}
                                  >
                                    {option.label}
                                  </span>
                                  {isSelected && (
                                    <span className="text-teal-600 dark:text-teal-400 text-sm">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </Listbox.Option>
                            );
                          })}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  );
                }}
              </Listbox>

              {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              )}

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {currentValues.map((tagValue: string, index: number) => {
                  const tagLabel =
                    options.find(
                      (opt) => String(opt.value) === String(tagValue),
                    )?.label || tagValue;
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 rounded-full border border-teal-300 dark:border-teal-700/50 animate-in fade-in zoom-in duration-200"
                    >
                      {tagLabel}
                      <button
                        type="button"
                        onClick={() =>
                          removeTag(index, onChange, currentValues)
                        }
                        className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
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
