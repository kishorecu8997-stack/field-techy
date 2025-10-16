/**
 * @file DatePickerInput.tsx
 * @description A custom, lightweight date picker component built with React and Tailwind CSS.
 * It supports day, month, and year views, date range constraints (min/max), and does not rely on any external date libraries.
 */

import React, { useState, useEffect, useRef } from "react";

/**
 * Props for the DatePickerInput component.
 */
interface DatePickerInputProps {
  /** Optional label to display above the input field. */
  label?: string;
  /** The currently selected date. Can be `null` if no date is selected. */
  isLabelShow?: boolean;
  value: Date | null;
  /** The minimum selectable date. Dates before this will be disabled. */
  minDate?: Date;
  /** The maximum selectable date. Dates after this will be disabled. */
  maxDate?: Date;
  /** Callback function triggered when a date is selected. */
  onChange: (date: Date | null) => void;
  /** Placeholder text for the input field when no date is selected. */
  placeholder?: string;
  /** Optional additional CSS classes to apply to the root container. */
  className?: string;
}

/**
 * A custom date picker input component.
 *
 * It provides a user-friendly interface for selecting dates, including navigation
 * through months and years, and different views for picking days, months, or years.
 *
 * @param {DatePickerInputProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered date picker component.
 */
export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  isLabelShow = true,
  value,
  minDate,
  maxDate,
  onChange,
  placeholder = "Select date",
  className = "",
}) => {
  /** State to manage the visibility of the date picker popover. */
  const [isOpen, setIsOpen] = useState(false);
  /** State to track the month/year currently displayed in the calendar view. */
  const [currentMonth, setCurrentMonth] = useState(new Date());
  /** State to control the current view ('day', 'month', or 'year'). */
  const [view, setView] = useState<"day" | "month" | "year">("day");
  /** Ref to the main date picker element for detecting outside clicks. */
  const datePickerRef = useRef<HTMLDivElement>(null);

  /** Formats a Date object into a DD/MM/YYYY string. */
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /** Parses a DD/MM/YYYY string into a Date object. Returns null on failure. */
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;
    return date;
  };

  /** Generates an array of Date objects for each day in the given month. */
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  /** Gets the trailing days from the previous month to fill the calendar grid. */
  const getPreviousMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthDays - i));
    }

    return days;
  };

  /** Gets the leading days from the next month to fill the calendar grid. */
  const getNextMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfWeek = lastDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  /** Checks if a given date is within the optional min/max date range. */
  const isDateValid = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  /** Handles the selection of a date from the calendar. */
  const handleDateSelect = (date: Date) => {
    if (isDateValid(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  /** Navigates the calendar to the previous month. */
  const goToPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  /** Navigates the calendar to the next month. */
  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  /** Navigates to the previous decade in the year view. */
  const goToPrevYearGroup = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear() - 10, prev.getMonth(), 1)
    );
  };

  /** Navigates to the next decade in the year view. */
  const goToNextYearGroup = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear() + 10, prev.getMonth(), 1)
    );
  };

  /** Switches the calendar display to the month selection view. */
  const goToMonthView = () => {
    setView("month");
  };

  /** Switches the calendar display to the year selection view. */
  const goToYearView = () => {
    setView("year");
  };

  /** Switches the calendar display back to the default day view. */
  const goToDayView = () => {
    setView("day");
  };

  /** Sets the selected month and switches back to the day view. */
  const selectMonth = (monthIndex: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setView("day");
  };

  /** Sets the selected year and switches back to the month view. */
  const selectYear = (year: number) => {
    setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1));
    setView("month");
  };

  /** Generates a decade of years for the year picker, respecting min/max date constraints. */
  const getYearsForPicker = (): number[] => {
    let startYear = Math.floor(currentMonth.getFullYear() / 10) * 10;
    let endYear = startYear + 9;

    // Adjust if minDate or maxDate is set
    if (minDate) {
      const minYear = minDate.getFullYear();
      if (endYear < minYear) {
        startYear = Math.floor(minYear / 10) * 10;
        endYear = startYear + 9;
      }
    }

    if (maxDate) {
      const maxYear = maxDate.getFullYear();
      if (startYear > maxYear) {
        startYear = Math.floor(maxYear / 10) * 10;
        endYear = startYear + 9;
      }
    }

    const years = [];
    for (let i = 0; i < 10; i++) {
      const year = startYear + i;
      if (minDate && year < minDate.getFullYear()) continue;
      if (maxDate && year > maxDate.getFullYear()) continue;
      years.push(year);
    }

    return years;
  };

  /** Generates an array of month indices for the month picker, respecting min/max date constraints. */
  const getMonthsForPicker = (): number[] => {
    const currentYear = currentMonth.getFullYear();
    const months = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, i, 1);
      if (minDate && monthDate < minDate) continue;
      if (maxDate && monthDate > maxDate) continue;
      months.push(i);
    }

    return months;
  };

  /** Effect to reset the view to the selected date's month/year when opening. */
  useEffect(() => {
    if (isOpen) {
      // If a date is selected, open the calendar to that month and year.
      // Otherwise, open to the current month and year.
      setCurrentMonth(value || new Date());
      // Always reset to the day view when opening.
      setView("day");
    }
  }, [isOpen, value]);

  /** Effect to handle clicks outside the component to close the popover. */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /** Formats a date to its full month name (e.g., "January"). */
  const formatMonthName = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  /** Formats a date to its four-digit year string. */
  const formatYear = (date: Date): string => {
    return date.getFullYear().toString();
  };

  /** Abbreviated month names for the month picker view. */
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

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      {isLabelShow && (
        <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        className="flex items-center h-[50.23px] px-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          value={value ? formatDate(value) : ""}
          placeholder={placeholder}
          readOnly
          className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 text-base"
        />
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={
                view === "day"
                  ? goToPrevMonth
                  : view === "month"
                  ? goToPrevYearGroup
                  : goToPrevYearGroup
              }
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {view === "day" && (
              <div className="flex items-center space-x-2">
                <span
                  onClick={goToMonthView}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600"
                >
                  {formatMonthName(currentMonth)}
                </span>
                <span
                  onClick={goToYearView}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600"
                >
                  {formatYear(currentMonth)}
                </span>
              </div>
            )}

            {view === "month" && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatYear(currentMonth)}
              </div>
            )}

            {view === "year" && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.floor(currentMonth.getFullYear() / 10) * 10} -{" "}
                {Math.floor(currentMonth.getFullYear() / 10) * 10 + 9}
              </div>
            )}

            <button
              type="button"
              onClick={
                view === "day"
                  ? goToNextMonth
                  : view === "month"
                  ? goToNextYearGroup
                  : goToNextYearGroup
              }
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Calendar Content Based on View */}
          {view === "day" && (
            <>
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-1"
                  >
                    {day}
                  </div>
                ))}

                {/* Previous month days */}
                {getPreviousMonthDays(currentMonth).map((date, index) => (
                  <div
                    key={`prev-${index}`}
                    className="text-xs text-gray-400 dark:text-gray-500 text-center py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {date.getDate()}
                  </div>
                ))}

                {/* Current month days */}
                {getDaysInMonth(currentMonth).map((date, index) => {
                  const isSelected =
                    value &&
                    date.getDate() === value.getDate() &&
                    date.getMonth() === value.getMonth() &&
                    date.getFullYear() === value.getFullYear();

                  const isToday =
                    new Date().toDateString() === date.toDateString();
                  const isValid = isDateValid(date);

                  return (
                    <div
                      key={`curr-${index}`}
                      onClick={() => handleDateSelect(date)}
                      className={`text-xs text-center py-1 rounded-full cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : isValid
                          ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          : "text-gray-400 cursor-not-allowed"
                      } ${isToday ? "border border-blue-500" : ""}`}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}

                {/* Next month days */}
                {getNextMonthDays(currentMonth).map((date, index) => (
                  <div
                    key={`next-${index}`}
                    className="text-xs text-gray-400 dark:text-gray-500 text-center py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {date.getDate()}
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "month" && (
            <div className="grid grid-cols-3 gap-2">
              {getMonthsForPicker().map((monthIndex) => {
                const monthDate = new Date(
                  currentMonth.getFullYear(),
                  monthIndex,
                  1
                );
                const isSelected =
                  value &&
                  value.getMonth() === monthIndex &&
                  value.getFullYear() === currentMonth.getFullYear();
                const isValid = isDateValid(monthDate);

                return (
                  <div
                    key={monthIndex}
                    onClick={() => selectMonth(monthIndex)}
                    className={`text-sm text-center py-2 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : isValid
                        ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {monthNames[monthIndex]}
                  </div>
                );
              })}
            </div>
          )}

          {view === "year" && (
            <div className="grid grid-cols-2 gap-2">
              {getYearsForPicker().map((year) => {
                const yearDate = new Date(year, 0, 1);
                const isSelected = value && value.getFullYear() === year;
                const isValid = isDateValid(yearDate);

                return (
                  <div
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`text-sm text-center py-2 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : isValid
                        ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {year}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
