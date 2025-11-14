import { Listbox, Transition, Portal } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

import type { SelectFieldProps } from "./types";

// Custom chevron-down icon
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
  disabled = false,
}: SelectFieldProps) => {
  const { control } = useFormContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, []);

  // Handle required: boolean → default message, string → custom message
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
    <div className="flex flex-col py-1">
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required !== false && <span className="text-red-600">*</span>}
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
          const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
          const selectedOption =
            options.find((opt) => opt.value === value) || null;

          return (
            <Listbox
              value={selectedOption}
              onChange={(opt) => onChange(opt?.value || "")}
              name={fieldName}
              disabled={disabled}
            >
              {({ open }: { open: boolean }) => {
                // Effect to handle reactive positioning ONLY when the dropdown is open
                useEffect(() => {
                  if (!open) return;

                  const updatePosition = () => {
                    if (buttonRef.current) {
                      setButtonRect(
                        buttonRef.current.getBoundingClientRect()
                      );
                    }
                  };

                  updatePosition(); // Set initial position

                  window.addEventListener("resize", updatePosition);
                  window.addEventListener("scroll", updatePosition, true);

                  return () => {
                    window.removeEventListener("resize", updatePosition);
                    window.removeEventListener("scroll", updatePosition, true);
                  };
                }, [open]);

                return (
                  <>
                    {/* INPUT BUTTON */}
                    <div className="relative cursor-pointer">
                      <Listbox.Button
                        ref={buttonRef}
                        className={`w-full rounded-md border ${
                          disabled
                            ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                            : "bg-white dark:bg-gray-800 cursor-pointer"
                        } ${
                          error && !disabled
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                        } py-3 px-4 text-left text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 transition shadow-sm`}
                      >
                        <div className="flex items-center">
                          {leftIcon && (
                            <span className="mr-3 flex-shrink-0 text-gray-400 dark:text-gray-500">
                              {leftIcon}
                            </span>
                          )}

                          <span
                            className={`block truncate ${
                              !value ? "text-gray-400 dark:text-gray-500" : ""
                            }`}
                          >
                            {value ? selectedOption?.label : placeholder}
                          </span>
                        </div>

                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDownIcon open={open} />
                        </span>
                      </Listbox.Button>
                    </div>

                    {/* DROPDOWN (PORTALLED, REACTIVE POSITIONING) */}
                    {open && buttonRect && (
                      <Portal>
                        <Listbox.Options
                          static
                          className="fixed z-50 max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          style={{
                            top: buttonRect.bottom + 4,
                            left: buttonRect.left,
                            width: buttonRect.width,
                          }}
                        >
                          {options.length === 0 ? (
                            <div className="cursor-default select-none py-2 px-4 text-gray-500">
                              No options
                            </div>
                          ) : (
                            options.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                className={({ active }) =>
                                  `cursor-pointer select-none py-2 pl-10 pr-4 ${
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
                                        ✔
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))
                          )}
                        </Listbox.Options>
                      </Portal>
                    )}

                    {error && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">
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
