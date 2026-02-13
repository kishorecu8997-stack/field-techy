import React, { useState, useEffect, useRef, type FC } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
  type FieldError,
} from "react-hook-form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import type { DatePickerInputProps } from "./types";

/**
 * A custom date picker input component.
 *
 * Wraps internal logic with Controller. Accepts `name` instead of `value`/`onChange`.
 * Displays error messages and required indicator.
 */
export const DatePickerInput: FC<DatePickerInputProps> = ({
  name,
  label,
  isShowLabel = true,
  minDate,
  maxDate,
  placeholder = "Select date",
  className = "",
  disabled = false,
  required = false,
  rules,
  containerClassName = "flex flex-col py-1 w-full",
}) => {
  const { control, trigger } = useFormContext();

  let requiredMessage: string | false = false;
  if (typeof required === "string") requiredMessage = required;
  else if (required === true) requiredMessage = `${label || name} is required`;

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => (
        <DatePickerRender
          name={name}
          onChange={(date) => field.onChange(date)}
          value={field.value}
          error={error}
          triggerField={() => trigger(name)}
          minDate={minDate}
          maxDate={maxDate}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          containerClassName={containerClassName}
          label={label}
          isShowLabel={isShowLabel}
          required={required}
        />
      )}
    />
  );
};

const isValidDateObj = (date: Date | null | undefined): date is Date =>
  date instanceof Date && !Number.isNaN(date.getTime());

const formatDate = (date: Date | null): string => {
  if (!isValidDateObj(date)) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (str: string): Date | null => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return null;
  const [day, month, year] = str.split("/").map(Number);
  const d = new Date(year, month - 1, day);
  return d.getDate() === day && d.getMonth() === month - 1 ? d : null;
};

const isDateValid = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
};

const DatePickerRender: FC<{
  name: string;
  onChange: (date: Date | null) => void;
  value: Date | null;
  error?: FieldError;
  triggerField: () => Promise<boolean>;
  minDate?: Date;
  maxDate?: Date;
  placeholder: string;
  disabled: boolean;
  className: string;
  containerClassName: string;
  label?: string;
  isShowLabel: boolean;
  required: boolean | string;
}> = ({
  // name,
  onChange,
  value,
  error,
  minDate,
  maxDate,
  placeholder,
  disabled,
  className,
  containerClassName,
  label,
  isShowLabel,
  required,
  triggerField,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [currentMonth, setCurrentMonth] = useState(
    isValidDateObj(value) ? value : new Date(),
  );
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(formatDate(value));

  // Sync input on external change
  useEffect(() => {
    setInputValue(formatDate(value));
    if (isOpen && isValidDateObj(value)) setCurrentMonth(value);
  }, [value, isOpen]);

  // Detect available space & auto-position dropdown
  useEffect(() => {
    if (isOpen && datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 330; // adjust if needed

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    const parsed = parseDate(text);
    if (parsed && isDateValid(parsed, minDate, maxDate)) {
      onChange(parsed);
      void triggerField();
    } else if (text === "") {
      onChange(null);
      void triggerField();
    }
  };

  const handleInputBlur = () => setInputValue(formatDate(value));

  const handleDateSelect = (date: Date) => {
    if (isDateValid(date, minDate, maxDate)) {
      onChange(date);
      setIsOpen(false);
      void triggerField();
    }
  };

  const getDaysInMonth = (date: Date): Date[] => {
    if (!isValidDateObj(date)) return [];
    const year = date.getFullYear();
    const month = date.getMonth();
    return Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => new Date(year, month, i + 1),
    );
  };

  const getPreviousMonthDays = (date: Date): Date[] => {
    if (!isValidDateObj(date)) return [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return Array.from({ length: firstDay.getDay() }, (_, i) => {
      const prevMonthLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0,
      ).getDate();
      return new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        prevMonthLastDay - (firstDay.getDay() - 1 - i),
      );
    });
  };

  const getNextMonthDays = (date: Date): Date[] => {
    if (!isValidDateObj(date)) return [];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from(
      { length: 6 - lastDay.getDay() },
      (_, i) => new Date(date.getFullYear(), date.getMonth() + 1, i + 1),
    );
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonthsForPicker = () => {
    const year = currentMonth.getFullYear();
    return [...Array(12).keys()].filter((m) => {
      const d = new Date(year, m, 1);
      return (!minDate || d >= minDate) && (!maxDate || d <= maxDate);
    });
  };

  const getYearsForPicker = () => {
    const start = Math.floor(currentMonth.getFullYear() / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => start + i);
  };

  return (
    <div className={containerClassName}>
      {isShowLabel && (
        <label className="block mb-1 text-md font-semibold text-gray-700 dark:text-gray-300">
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className={`relative ${className}`} ref={datePickerRef}>
        <div
          className={`flex items-center h-[50px] px-3 border rounded-lg shadow-sm
          bg-white dark:bg-gray-800 cursor-pointer
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"}
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <input
            type="text"
            value={inputValue}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200"
          />
          <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-300 ml-2" />
        </div>

        {/* DROPDOWN WITH AUTO-POSITION */}
        {isOpen && (
          <div
            className={`absolute z-50 w-full bg-white dark:bg-gray-800 border
              border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4
              ${position === "bottom" ? "top-full mt-1" : "bottom-full mb-1"}
          `}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    (p: Date) => new Date(p.getFullYear(), p.getMonth() - 1, 1),
                  )
                }
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex space-x-2">
                <span
                  onClick={() => setView("month")}
                  className="cursor-pointer hover:text-blue-600"
                >
                  {monthNames[currentMonth.getMonth()]}
                </span>
                <span
                  onClick={() => setView("year")}
                  className="cursor-pointer hover:text-blue-600"
                >
                  {currentMonth.getFullYear()}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentMonth(
                    (p: Date) => new Date(p.getFullYear(), p.getMonth() + 1, 1),
                  )
                }
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* DAY VIEW */}
            {view === "day" && (
              <div className="grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div
                    key={d}
                    className="text-xs text-center text-gray-500 dark:text-gray-400"
                  >
                    {d}
                  </div>
                ))}

                {/* Previous month */}
                {getPreviousMonthDays(currentMonth).map((d, i) => (
                  <div key={i} className="text-xs text-center text-gray-400">
                    {d.getDate()}
                  </div>
                ))}

                {/* Current month */}
                {getDaysInMonth(currentMonth).map((d, i) => {
                  const selectedValue = isValidDateObj(value) ? value : null;
                  const isSelected = selectedValue?.toDateString() === d.toDateString();
                  const isToday =
                    new Date().toDateString() === d.toDateString();
                  const invalid = !isDateValid(d, minDate, maxDate);

                  return (
                    <div
                      key={i}
                      onClick={() => !invalid && handleDateSelect(d)}
                      className={`text-xs text-center py-1 rounded-full cursor-pointer
                        ${isSelected ? "bg-blue-600 text-white" : ""}
                        ${
                          invalid
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }
                        ${isToday ? "border border-blue-500" : ""}
                      `}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}

                {/* Next month */}
                {getNextMonthDays(currentMonth).map((d, i) => (
                  <div key={i} className="text-xs text-center text-gray-400">
                    {d.getDate()}
                  </div>
                ))}
              </div>
            )}

            {/* MONTH VIEW */}
            {view === "month" && (
              <div className="grid grid-cols-3 gap-2">
                {getMonthsForPicker().map((m) => (
                  <div
                    key={m}
                    onClick={() => {
                      setCurrentMonth(
                        (p: Date) => new Date(p.getFullYear(), m, 1),
                      );
                      setView("day");
                    }}
                    className="text-sm text-center py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                  >
                    {monthNames[m]}
                  </div>
                ))}
              </div>
            )}

            {/* YEAR VIEW */}
            {view === "year" && (
              <div className="grid grid-cols-2 gap-2">
                {getYearsForPicker().map((y) => (
                  <div
                    key={y}
                    onClick={() => {
                      setCurrentMonth(
                        (p: Date) => new Date(y, p.getMonth(), 1),
                      );
                      setView("month");
                    }}
                    className="text-sm text-center py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};
