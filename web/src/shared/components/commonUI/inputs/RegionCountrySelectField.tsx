import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import type { RegionCountryOption } from "@/dummy_data/regionsAndCountries";

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <MdOutlineKeyboardArrowDown
    className={`h-7 w-7 text-gray-500 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
  />
);

interface RegionCountrySelectFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean | string;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  options: RegionCountryOption[];
}

export const RegionCountrySelectField = ({
  name,
  label,
  isShowLabel = true,
  placeholder = "Select regions and countries",
  required = false,
  rules,
  leftIcon,
  disabled = false,
  options,
}: RegionCountrySelectFieldProps) => {
  const { control } = useFormContext();

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

  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

  const toggleRegion = (regionValue: string) => {
    setExpandedRegions((prev) =>
      prev.includes(regionValue)
        ? prev.filter((v) => v !== regionValue)
        : [...prev, regionValue]
    );
  };

  // NEW: Track if user clicked "Country"
  const [showGroupedOptions, setShowGroupedOptions] = useState(false);

  // NEW: Lazy grouping logic
  const groupedOptions = showGroupedOptions
    ? options.reduce((acc, option) => {
        if (option.type === "region") {
          acc[option.value] = {
            region: option,
            countries: [],
          };
        } else if (option.type === "subdivision" && option.region) {
          if (!acc[option.region]) {
            const regionOption = options.find(
              (o) => o.value === option.region && o.type === "region"
            );
            if (!regionOption) {
              console.warn(
                `RegionCountrySelectField: country "${option.label}" references unknown region "${option.region}".`
              );
              return acc;
            }
            acc[option.region] = {
              region: regionOption,
              countries: [],
            };
          }
          acc[option.region].countries.push(option);
        }
        return acc;
      }, {} as Record<string, { region: RegionCountryOption; countries: RegionCountryOption[] }>)
    : {};

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const dropdownHeight = 320;
    setPosition(
      spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
        ? "top"
        : "bottom"
    );
  };

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
          className={`block mb-1 text-md font-semibold ${
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
          const selectedValues: string[] = Array.isArray(value) ? value : [];
          const selectedOptions = options.filter((opt) =>
            selectedValues.includes(opt.value)
          );

          const handleSelect = (selected: RegionCountryOption[]) => {
            const values = selected.map((s) => s.value);
            onChange(values);

            const isCountrySelected = values.includes("Country");
            if (!isCountrySelected) {
              setShowGroupedOptions(false);
            }
          };

          const displayLabel =
            selectedOptions.length > 0
              ? selectedOptions.map((o) => o.label).join(", ")
              : placeholder;

          return (
            <Listbox
              multiple
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
                }

                return (
                  <div className="relative">
                    <Listbox.Button
                      ref={buttonRef}
                      className={`relative w-full rounded-md border text-base py-3 pl-5 pr-10 flex items-center justify-start text-left ${
                        disabled
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 cursor-pointer"
                      } ${
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
                            selectedValues.length === 0 ? "text-gray-400" : ""
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
                      <div
                        className={`absolute z-20 w-full ${
                          position === "bottom"
                            ? "top-full mt-1"
                            : "bottom-full mb-1"
                        } max-h-80 overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 focus:outline-none`}
                      >
                        <Listbox.Options as="div" static>
                          {/* Render "Country" option first */}
                          {options
                            .filter(
                              (o) =>
                                o.type === "option" && o.value === "Country"
                            )
                            .map((countryOption) => (
                              <Listbox.Option
                                key={countryOption.value}
                                value={countryOption}
                                className="relative flex items-center space-x-2 cursor-pointer select-none py-2 pl-5 pr-4 rounded-md hover:bg-green-100 dark:hover:bg-green-900"
                                onClick={() => setShowGroupedOptions(true)}
                              >
                                {({ selected }) => (
                                  <>
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      readOnly
                                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {countryOption.label}
                                    </span>
                                  </>
                                )}
                              </Listbox.Option>
                            ))}

                          {/* Grouped regions + countries */}
                          {showGroupedOptions &&
                            (Object.values(groupedOptions).length === 0 ? (
                              <div className="py-2 px-4 text-gray-500 dark:text-gray-400">
                                No results found
                              </div>
                            ) : (
                              Object.values(groupedOptions).map((group) => {
                                const allCountriesSelected =
                                  group.countries.length > 0 &&
                                  group.countries.every((c) =>
                                    selectedValues.includes(c.value)
                                  );
                                const someCountriesSelected =
                                  group.countries.some((c) =>
                                    selectedValues.includes(c.value)
                                  );
                                const isIndeterminate =
                                  !allCountriesSelected &&
                                  someCountriesSelected;

                                const isExpanded = expandedRegions.includes(
                                  group.region.value
                                );

                                return (
                                  <div key={group.region.value}>
                                    {/* Region Header */}
                                    <div
                                      className="px-3 py-2 bg-gray-50 dark:bg-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 cursor-pointer flex justify-between items-center"
                                      onClick={() =>
                                        toggleRegion(group.region.value)
                                      }
                                    >
                                      <span className="block truncate font-medium">
                                        {group.region.label}
                                      </span>
                                      <MdOutlineKeyboardArrowDown
                                        className={`h-7 w-7 text-gray-500 transition-transform duration-200 ${
                                          isExpanded ? "rotate-180" : ""
                                        }`}
                                      />
                                    </div>

                                    {/* Region Option (Select All Countries) */}
                                    {isExpanded && (
                                      <button
                                        type="button"
                                        className="relative flex w-full items-center space-x-2 select-none py-2 pl-6 pr-4 rounded-md text-left hover:bg-green-100 dark:hover:bg-green-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                        onClick={() => {
                                          if (allCountriesSelected) {
                                            onChange(
                                              selectedValues.filter(
                                                (v) =>
                                                  !group.countries.some(
                                                    (c) => c.value === v
                                                  )
                                              )
                                            );
                                          } else {
                                            onChange([
                                              ...new Set([
                                                ...selectedValues,
                                                ...group.countries.map(
                                                  (c) => c.value
                                                ),
                                              ]),
                                            ]);
                                          }
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={allCountriesSelected}
                                          readOnly
                                          ref={(el) => {
                                            if (el)
                                              el.indeterminate =
                                                isIndeterminate;
                                          }}
                                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 pointer-events-none"
                                        />
                                        <span className="block truncate font-medium">
                                          {group.region.label} (All Countries)
                                        </span>
                                      </button>
                                    )}

                                    {/* Country Options */}
                                    {isExpanded &&
                                      group.countries.map((country) => (
                                        <Listbox.Option
                                          key={country.value}
                                          value={country}
                                          className={({ active }) =>
                                            `relative flex items-center space-x-2 cursor-pointer select-none py-2 pl-9 pr-4 rounded-md ${
                                              active
                                                ? "bg-green-100 dark:bg-green-900"
                                                : ""
                                            }`
                                          }
                                        >
                                          {({ selected }) => (
                                            <>
                                              <input
                                                type="checkbox"
                                                checked={selected}
                                                readOnly
                                                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                              />
                                              <span
                                                className={`block truncate ${
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal"
                                                }`}
                                              >
                                                {country.label}
                                              </span>
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                  </div>
                                );
                              })
                            ))}
                        </Listbox.Options>
                      </div>
                    </Transition>

                    {error && (
                      <p className="mt-1 text-xs text-red-600">
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

export default RegionCountrySelectField;
