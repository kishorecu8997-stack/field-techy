import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import type { SelectFieldProps, SelectOption } from "./types";

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
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

export const SelectField = ({
  name,
  label,
  isShowLabel = true,
  placeholder = "Select",
  required = false,
  options = [],
  rules,
  leftIcon,
  multiple = false,
  disabled = false,
}: SelectFieldProps & { multiple?: boolean }) => {
  const { control } = useFormContext();
  const [search, setSearch] = useState("");

  const requiredMessage =
    typeof required === "string"
      ? required
      : required
      ? `${label || name} is required`
      : false;

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  const filteredOptions = multiple
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div className="flex flex-col">
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label}
          {(required === true || typeof required === "string") && (
            <span className="text-red-600">*</span>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedOptions: SelectOption[] | SelectOption | null = multiple
            ? options.filter(
                (opt) => Array.isArray(value) && value.includes(opt.value)
              )
            : options.find((opt) => opt.value === value) ?? null;

          const handleSelect = (selected: any) => {
            if (multiple) {
              onChange(selected.map((s: SelectOption) => s.value));
            } else {
              onChange(selected?.value ?? "");
            }
          };

          const displayLabel = multiple
            ? Array.isArray(selectedOptions) && selectedOptions.length > 0
              ? selectedOptions.map((o) => o.label).join(", ")
              : placeholder
            : (selectedOptions as SelectOption | null)?.label || placeholder;

          return (
            <Listbox
              multiple={multiple}
              value={selectedOptions}
              onChange={handleSelect}
              disabled={disabled}
            >
              {({ open }) => {
                // ✅ CLEAR SEARCH WHEN DROPDOWN CLOSES
                if (!open && search !== "") {
                  setTimeout(() => setSearch(""), 0);
                }

                return (
                  <>
                    {/* BUTTON */}
                    <div className="relative">
                      <Listbox.Button
                        className={`relative w-full rounded-md border text-base
              py-3 pl-5 pr-10 flex items-center justify-start text-left
              ${
                disabled
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 cursor-pointer"
              }
              ${
                error && !disabled
                  ? "border-red-500 focus:ring-1 focus:ring-red-400"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
              }`}
                      >
                        <div className="flex items-center w-full space-x-2">
                          {leftIcon && (
                            <span className="text-gray-400 dark:text-gray-500">
                              {leftIcon}
                            </span>
                          )}

                          <span
                            className={`block truncate w-full ${
                              !value ? "text-gray-400" : ""
                            }`}
                          >
                            {displayLabel}
                          </span>
                        </div>

                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <ChevronDownIcon open={open} />
                        </span>
                      </Listbox.Button>

                      {/* OPTIONS */}
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 p-2 focus:outline-none">
                          {/* SEARCH BAR — MULTISELECT ONLY */}
                          {multiple && (
                            <div className="flex items-center px-2 mb-2">
                              <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()} // ← FIX SPACE ISSUE
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm focus:ring-primary/40 focus:border-primary/40 dark:bg-gray-700"
                              />
                            </div>
                          )}

                          {filteredOptions.length === 0 ? (
                            <div className="py-2 px-4 text-gray-500 dark:text-gray-400">
                              No matching results
                            </div>
                          ) : (
                            filteredOptions.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                value={option}
                                className={({ active }) =>
                                  `relative flex items-center space-x-2 cursor-pointer select-none py-2 pl-3 pr-4 rounded-md
                                  ${
                                    active
                                      ? "bg-green-100 dark:bg-green-900"
                                      : ""
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    {multiple && (
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        readOnly
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                      />
                                    )}

                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {option.label}
                                    </span>
                                  </>
                                )}
                              </Listbox.Option>
                            ))
                          )}
                        </Listbox.Options>
                      </Transition>
                    </div>

                    {error && (
                      <p className="mt-1 text-xs text-red-600">
                        {error.message}
                      </p>
                    )}
                  </>
                );
              }}
            </Listbox>
          );
        }}
      />
    </div>
  );
};

export default SelectField;
