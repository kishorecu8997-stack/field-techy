import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect, useMemo } from "react";
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
/**
 * RegionCountrySelectField
 *
 * A multi-select dropdown field built with Headless UI's Listbox and integrated
 * with react-hook-form via Controller. It supports hierarchical selection of
 * regions and their associated countries (subdivisions), including:
 *
 * - Expandable regions with nested country checkboxes
 * - "Select all" behavior per region with indeterminate state support
 * - Dynamic dropdown positioning (top or bottom) based on viewport space
 * - Truncated display labels for long selections
 * - Optional grouped view toggled via a top-level "Country" option
 *
 * The selected value stored in the form state is an array of option `value` strings.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name used by react-hook-form
 * @param {string} [props.label] - Label text displayed above the field
 * @param {boolean} [props.isShowLabel=true] - Whether to render the label
 * @param {string} [props.placeholder="Select regions and countries"] - Placeholder text when no value is selected
 * @param {boolean|string} [props.required=false] - Whether the field is required; string value will be used as the error message
 * @param {RegisterOptions} [props.rules] - Additional react-hook-form validation rules
 * @param {React.ReactNode} [props.leftIcon] - Optional icon displayed inside the select button
 * @param {boolean} [props.disabled=false] - Disables the select field and interactions
 * @param {RegionCountryOption[]} props.options - Available options including regions, countries, and control options
 *
 * @returns {JSX.Element} A controlled region/country multi-select field
 *
 */
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
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [showGroupedOptions, setShowGroupedOptions] = useState(false);
  const [overrideDisplayLabel, setOverrideDisplayLabel] = useState<
    string | null
  >(null);

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

  const toggleRegion = (regionValue: string) => {
    setExpandedRegions((prev) =>
      prev.includes(regionValue)
        ? prev.filter((v) => v !== regionValue)
        : [...prev, regionValue],
    );
  };

  const truncateLabel = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.slice(0, maxLength) + "...";

  const groupedOptions = useMemo(() => {
    if (!showGroupedOptions) return {};
    return options.reduce(
      (acc, option) => {
        if (option.type === "region") {
          acc[option.value] = { region: option, countries: [] };
        } else if (option.type === "subdivision" && option.region) {
          if (!acc[option.region]) {
            const regionOption = options.find(
              (o) => o.value === option.region && o.type === "region",
            );
            if (regionOption)
              acc[option.region] = { region: regionOption, countries: [] };
          }
          acc[option.region]?.countries.push(option);
        }
        return acc;
      },
      {} as Record<
        string,
        { region: RegionCountryOption; countries: RegionCountryOption[] }
      >,
    );
  }, [options, showGroupedOptions]);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 320;
    setPosition(
      spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
        ? "top"
        : "bottom",
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
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedValues: string[] = Array.isArray(value) ? value : [];

          // ===== Updated display label logic =====
          const selectedCountryLabels = selectedValues.map(
            (val) => options.find((o) => o.value === val)?.label ?? val,
          );

          const fullySelectedRegionLabels = Object.values(groupedOptions)
            .filter(
              (group) =>
                group.countries.length > 0 &&
                group.countries.every((c) => selectedValues.includes(c.value)),
            )
            .map((group) => group.region.label);

          const partiallySelectedRegionLabels = Object.values(groupedOptions)
            .filter(
              (group) =>
                selectedValues.includes(group.region.value) &&
                !group.countries.every((c) => selectedValues.includes(c.value)),
            )
            .map((group) => group.region.label);

          const finalDisplayLabels = [
            ...fullySelectedRegionLabels,
            ...partiallySelectedRegionLabels,
            ...selectedCountryLabels.filter(
              (label) =>
                !fullySelectedRegionLabels.includes(label) &&
                !partiallySelectedRegionLabels.includes(label),
            ),
          ];

          const displayLabel = overrideDisplayLabel
            ? truncateLabel(overrideDisplayLabel, 200)
            : finalDisplayLabels.length > 0
              ? truncateLabel(finalDisplayLabels.join(", "), 200)
              : placeholder;

          const selectedOptions = options.filter((o) =>
            selectedValues.includes(o.value),
          );

          const handleSelect = (selected: RegionCountryOption[]) => {
            const values = selected.map((s) => s.value);
            onChange(values);
            if (!values.includes("Country")) setShowGroupedOptions(false);
            setOverrideDisplayLabel(null);
          };

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
                } else if (!open && openRef.current) openRef.current = false;

                return (
                  <div className="relative">
                    <Listbox.Button
                      ref={buttonRef}
                      className={`relative w-full rounded-md border text-base py-3 pl-5 pr-10 flex items-center justify-start text-left
                        ${
                          disabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }
                        ${
                          error && !disabled
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      onClick={() => (openRef.current = !openRef.current)}
                    >
                      <div className="flex items-center w-full space-x-2">
                        {leftIcon && (
                          <span className="text-gray-400">{leftIcon}</span>
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
                        } max-h-80 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/10`}
                      >
                        <Listbox.Options as="div" static>
                          {/* Country Toggle */}
                          {options
                            .filter(
                              (o) =>
                                o.type === "option" && o.value === "Country",
                            )
                            .map((countryOption) => (
                              <div
                                key={countryOption.value}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  setShowGroupedOptions((prev) => !prev)
                                }
                                onKeyDown={(e) => {
                                  if (["Enter", " "].includes(e.key)) {
                                    e.preventDefault();
                                    setShowGroupedOptions((prev) => !prev);
                                  }
                                }}
                                className="flex justify-between items-center cursor-pointer py-2 pl-5 pr-4 rounded-md hover:bg-green-100 font-medium text-gray-700"
                              >
                                <span>{countryOption.label}</span>
                                <MdOutlineKeyboardArrowDown
                                  className={`h-6 w-6 transition-transform ${
                                    showGroupedOptions ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            ))}

                          {/* Grouped Regions & Countries */}
                          {showGroupedOptions &&
                            Object.values(groupedOptions).length === 0 && (
                              <div className="py-2 px-4 text-gray-500">
                                No results found
                              </div>
                            )}

                          {showGroupedOptions &&
                            Object.values(groupedOptions).map((group) => {
                              const allSelected =
                                group.countries.length > 0 &&
                                group.countries.every((c) =>
                                  selectedValues.includes(c.value),
                                );
                              const someSelected = group.countries.some((c) =>
                                selectedValues.includes(c.value),
                              );
                              const indeterminate =
                                !allSelected && someSelected;
                              const isExpanded = expandedRegions.includes(
                                group.region.value,
                              );

                              return (
                                <div key={group.region.value}>
                                  {/* Region Header */}
                                  <button
                                    type="button"
                                    className="w-full px-3 py-2 bg-gray-50 font-semibold text-sm flex justify-between items-center text-left cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      toggleRegion(group.region.value);
                                      setOverrideDisplayLabel(
                                        group.region.label,
                                      );
                                    }}
                                    aria-expanded={isExpanded}
                                  >
                                    <span className="truncate">
                                      {group.region.label}
                                    </span>
                                    <MdOutlineKeyboardArrowDown
                                      className={`h-7 w-7 transition-transform ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>

                                  {/* Select All Button */}
                                  {isExpanded && (
                                    <button
                                      type="button"
                                      className="flex w-full items-center space-x-2 py-2 pl-6 pr-4 text-left hover:bg-green-100"
                                      onClick={() => {
                                        const nextValues = allSelected
                                          ? selectedValues.filter(
                                              (v) =>
                                                !group.countries.some(
                                                  (c) => c.value === v,
                                                ),
                                            )
                                          : [
                                              ...new Set([
                                                ...selectedValues,
                                                ...group.countries.map(
                                                  (c) => c.value,
                                                ),
                                              ]),
                                            ];
                                        onChange(nextValues);
                                        setOverrideDisplayLabel(
                                          group.region.label,
                                        );
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={allSelected}
                                        readOnly
                                        ref={(el) => {
                                          if (el)
                                            el.indeterminate = indeterminate;
                                        }}
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded pointer-events-none"
                                      />
                                      <span className="truncate">
                                        {group.region.label} (All States)
                                      </span>
                                    </button>
                                  )}

                                  {/* Individual Countries */}
                                  {isExpanded && (
                                    <Listbox.Options
                                      as="div"
                                      static
                                      className="ml-4"
                                    >
                                      {group.countries.map((country) => (
                                        <Listbox.Option
                                          key={country.value}
                                          value={country}
                                          className={({ active }) =>
                                            `flex items-center space-x-2 py-2 pl-5 pr-4 cursor-pointer ${
                                              active ? "bg-green-100" : ""
                                            }`
                                          }
                                        >
                                          {({ selected }) => (
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation();

                                                let nextValues: string[];
                                                if (selected) {
                                                  nextValues =
                                                    selectedValues.filter(
                                                      (v) =>
                                                        v !== country.value,
                                                    );
                                                } else {
                                                  nextValues = [
                                                    ...selectedValues,
                                                    country.value,
                                                  ];
                                                }

                                                onChange(nextValues);
                                                setOverrideDisplayLabel(null);
                                              }}
                                              className="flex items-center space-x-2 w-full"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={selected}
                                                readOnly
                                                className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                              />
                                              <span
                                                className={`truncate ${
                                                  selected
                                                    ? "font-semibold"
                                                    : "font-normal"
                                                }`}
                                              >
                                                {country.label}
                                              </span>
                                            </div>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  )}
                                </div>
                              );
                            })}
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
