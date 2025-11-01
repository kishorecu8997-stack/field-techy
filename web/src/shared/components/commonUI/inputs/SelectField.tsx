import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

import type { SelectFieldProps } from "./types";

// Custom chevron-down icon
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const SelectField = ({
  name,
  label,
  isShowLabel = true,
  placeholder = "Select",
  required = false,
  options = [],
  rules,
  leftIcon,
}: SelectFieldProps) => {
  const { control } = useFormContext();

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };
  return (
    <div className="flex flex-col py-1">
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
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
          // Find selected option for display
          const selectedOption =
            options.find((opt) => opt.value === value) || null;

          return (
            <Listbox
              value={selectedOption}
              onChange={(opt) => onChange(opt?.value || "")}
              name={fieldName}
            >
              {({ open }) => (
                <>
                  <div className="relative cursor-pointer">
                    <Listbox.Button
                      className={`w-full rounded-md border cursor-pointer ${
                        error
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                      } bg-white dark:bg-gray-800 py-3 px-4 text-left text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 transition shadow-sm`}
                    >
                      <div className="flex items-center">
                        {leftIcon && (
                          <span className="mr-3 flex-shrink-0 text-gray-400 dark:text-gray-500">
                            {leftIcon}
                          </span>
                        )}
                        <span
                          className={`block truncate ${
                            !value ? "text-gray-400 dark:text-gray-500 " : ""
                          }`}
                        >
                          {value ? selectedOption?.label : placeholder}
                        </span>
                      </div>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon />
                      </span>
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => {}}
                    >
                      <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.length === 0 ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                            No options
                          </div>
                        ) : (
                          options.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              className={({ active }) =>
                                `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
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
                                  {selected ? (
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
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))
                        )}
                      </Listbox.Options>
                    </Transition>
                  </div>

                  {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
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
