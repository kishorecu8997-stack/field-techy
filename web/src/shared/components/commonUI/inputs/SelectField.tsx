import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

import type { SelectFieldProps } from "./types";

// Chevron icon with rotation
const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

/**
 * SelectField Component
 *
 * A reusable dropdown field integrated with React Hook Form.
 * Supports labels, validation, disabled state, and dynamic options.
 *
 * @param {SelectFieldProps} props - Props for the select field.
 * @returns {JSX.Element} The SelectField component.
 *
 * @example
 * <SelectField
 *   name="country"
 *   label="Country"
 *   required
 *   options={[
 *     { label: "USA", value: "us" },
 *     { label: "Canada", value: "ca" },
 *   ]}
 * />
 */

export const SelectField = ({
  name,
  label,
  isShowLabel = true,
  placeholder = "Select",
  required = false,
  options = [],
  rules,
  leftIcon,
  disabled = false,
}: SelectFieldProps) => {
  const { control } = useFormContext();

  // Handle required rule
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  return (
    <div className="flex flex-col p-1">
      {isShowLabel && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({
          field: { onChange, value, name: fieldName },
          fieldState: { error },
        }) => {
          const selectedOption =
            options.find((opt) => opt.value === value) || null;

          return (
            <Listbox
              value={selectedOption}
              onChange={(opt) => onChange(opt?.value || "")}
              name={fieldName}
              disabled={disabled}
            >
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button
                      className={`relative w-full rounded-md border text-sm pl-3 pr-10 text-left transition-all duration-150
                        h-10 flex items-center
                        ${
                          disabled
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-white dark:bg-gray-800 cursor-pointer"
                        }
                        ${
                          error && !disabled
                            ? "border-red-500 focus:ring-1 focus:ring-red-400"
                            : "border-gray-300 dark:border-gray-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                        }
                        text-gray-900 dark:text-gray-100 outline-none shadow-sm focus:outline-none`}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        {leftIcon && (
                          <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                            {leftIcon}
                          </span>
                        )}
                        <span
                          className={`block truncate w-full ${
                            !value
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {value ? selectedOption?.label : placeholder}
                        </span>
                      </div>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDownIcon open={open} />
                      </span>
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none">
                        {options.length === 0 ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-500 dark:text-gray-400">
                            No options
                          </div>
                        ) : (
                          options.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              className={({ active }) =>
                                `relative select-none py-2 pl-10 pr-4 cursor-pointer transition ${
                                  active
                                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                                    : "text-gray-900 dark:text-gray-100"
                                }`
                              }
                              value={option}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))
                        )}
                      </Listbox.Options>
                    </Transition>
                  </div>

                  {error && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-500">
                      {error.message}
                    </p>
                  )}
                </>
              )}
            </Listbox>
          );
        }}
      />
    </div>
  );
};

export default SelectField;
