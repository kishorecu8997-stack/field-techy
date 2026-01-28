import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import type { SelectFieldProps, SelectOption } from "./types";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

/**
 * A chevron icon that rotates based on the open state.
 * @param {{ open: boolean }} props - The props for the component.
 * @returns {JSX.Element} The rendered chevron icon.
 */
const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <MdOutlineKeyboardArrowDown
    className={`h-7 w-7 text-gray-500 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
  />
);

/**
 * A highly customizable select field component integrated with React Hook Form.
 * It supports single and multiple selections, search, validation, and automatic
 * dropdown positioning. Built with Headless UI for accessibility.
 *
 * @param {SelectFieldProps & { multiple?: boolean }} props The props for the component.
 * @param {string} props.name - The name of the field, used for form registration.
 * @param {string} [props.label] - The label text for the input field.
 * @param {boolean} [props.isShowLabel=true] - Whether to display the label.
 * @param {string} [props.placeholder="Select"] - The placeholder text when no value is selected.
 * @param {boolean | string} [props.required=false] - Marks the field as required. Can be a boolean or a custom error message string.
 * @param {SelectOption[]} [props.options=[]] - The array of options to display in the dropdown.
 * @param {RegisterOptions} [props.rules] - Additional validation rules for React Hook Form.
 * @param {React.ReactNode} [props.leftIcon] - An optional icon to display on the left side of the input.
 * @param {boolean} [props.multiple=false] - Enables multi-select functionality.
 * @param {boolean} [props.disabled=false] - Disables the select field.
 * @returns {JSX.Element} The rendered select field component.
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
  multiple = false,
  disabled = false,
}: SelectFieldProps & { multiple?: boolean }) => {
  const { control, trigger } = useFormContext();
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");

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
        opt.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();

    let scrollContainer: HTMLElement | null = null;
    let parent = buttonRef.current.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      const isOverflowingY =
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        parent.scrollHeight > parent.clientHeight;

      const isOverflowingX =
        (style.overflowX === "auto" || style.overflowX === "scroll") &&
        parent.scrollWidth > parent.clientWidth;

      if (isOverflowingY || isOverflowingX) {
        scrollContainer = parent;
        break;
      }

      parent = parent.parentElement;
    }

    const containerRect = scrollContainer
      ? scrollContainer.getBoundingClientRect()
      : { top: 0, bottom: window.innerHeight };

    const spaceBelow = containerRect.bottom - buttonRect.bottom;
    const spaceAbove = buttonRect.top - containerRect.top;
    const dropdownHeight = 240; // approx max-h-60

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  };

  // Optional: recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (openRef.current) updatePosition();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col">
      {isShowLabel && (
        <label
          className={` block mb-1 text-md font-semibold
            ${
              disabled
                ? "text-gray-400 dark:text-gray-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
        >
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedOptions: SelectOption[] | SelectOption | null = multiple
            ? options.filter(
                (opt) => Array.isArray(value) && value.includes(opt.value),
              )
            : (options.find((opt) => opt.value === value) ?? null);

          const handleSelect = (
            selected: SelectOption | SelectOption[] | null,
          ) => {
            if (multiple) {
              if (Array.isArray(selected)) {
                onChange(selected.map((s) => s.value));
              } else {
                onChange([]); // fallback if null or invalid
              }
            } else {
              if (selected && !Array.isArray(selected)) {
                onChange(selected.value);
              } else {
                onChange("");
              }
            }
            void trigger(name);
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
                if (open && !openRef.current) {
                  openRef.current = true;
                  requestAnimationFrame(updatePosition);
                } else if (!open && openRef.current) {
                  openRef.current = false;
                  // Reset to bottom on close (optional)
                  // setPosition("bottom");
                }

                if (!open && search !== "") {
                  setTimeout(() => setSearch(""), 0);
                }

                return (
                  <div className="relative">
                    <Listbox.Button
                      ref={buttonRef}
                      className={`relative w-full rounded-md border text-base py-3 pl-5 pr-10 flex items-center justify-start text-left
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
                            !value
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {displayLabel}
                        </span>
                      </div>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDownIcon open={open} />
                      </span>
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      show={open}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      {/*Position-aware wrapper */}
                      <div
                        className={`absolute z-20 w-full ${
                          position === "bottom"
                            ? "top-full mt-1"
                            : "bottom-full mb-1"
                        } max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 focus:outline-none`}
                      >
                        {/*Explicitly render as div to avoid Fragment error */}
                        <Listbox.Options as="div" static>
                          {multiple && (
                            <div className="flex items-center px-2 mb-2">
                              <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm focus:ring-primary/40 focus:border-primary/40 dark:bg-gray-700"
                              />
                            </div>
                          )}

                          {filteredOptions.length === 0 ? (
                            <div className="py-2 px-4 text-gray-500 dark:text-gray-400">
                              No results found
                            </div>
                          ) : (
                            filteredOptions.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                value={option}
                                className={({ active }) =>
                                  `relative flex items-center space-x-2 cursor-pointer select-none py-2 pl-3 pr-4 rounded-md ${
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
                                      className={`block truncate text-gray-900 dark:text-white ${
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
                      </div>
                    </Transition>

                    {error && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                        {error.message}
                      </p>
                    )}
                  </div>
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
