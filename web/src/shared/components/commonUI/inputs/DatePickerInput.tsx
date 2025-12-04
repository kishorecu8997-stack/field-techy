import React, { useState, useEffect, useRef, type FC } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import type { DatePickerInputProps } from "./types";


/**
 * A react-hook-form compatible date picker input component.
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
  required = false,
  rules,
  containerClassName = "flex flex-col py-1 w-full",
}) => {
  const { control } = useFormContext();

  // Build required validation message
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

  // --- Internal date utils (same as before) ---
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // DD/MM/YYYY
  };

  const parseDate = (dateString: string): Date | null => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
    const [day, month, year] = dateString.split("/").map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const date = new Date(year, month - 1, day);
    return date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
      ? date
      : null;
  };

  const isDateValid = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // --- Render with Controller ---
  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [currentMonth, setCurrentMonth] = useState(value || new Date());
        const [view, setView] = useState<"day" | "month" | "year">("day");
        const datePickerRef = useRef<HTMLDivElement>(null);
        const [inputValue, setInputValue] = useState(formatDate(value));

        // Sync input when value changes externally (e.g., reset)
        useEffect(() => {
          setInputValue(formatDate(value));
          if (isOpen && value) {
            setCurrentMonth(value);
          }
        }, [value, isOpen]);

        // Close on outside click
        useEffect(() => {
          const handleClickOutside = (e: MouseEvent) => {
            if (
              datePickerRef.current &&
              !datePickerRef.current.contains(e.target as Node)
            ) {
              setIsOpen(false);
            }
          };
          if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
              document.removeEventListener("mousedown", handleClickOutside);
          }
        }, [isOpen]);

        // Handle manual input
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const text = e.target.value;
          const sanitized = text.replace(/[^0-9/]/g, "");
          setInputValue(sanitized);
          const parsed = parseDate(sanitized);
          if (parsed && isDateValid(parsed)) {
            onChange(parsed);
          } else if (text === "") {
            onChange(null);
          }
        };

        const handleInputBlur = () => {
          setInputValue(formatDate(value));
        };

        const handleDateSelect = (date: Date) => {
          if (isDateValid(date)) {
            onChange(date);
            setIsOpen(false);
          }
        };

        // --- Calendar logic (simplified for brevity; reuse your original functions as needed) ---
        const getDaysInMonth = (date: Date): Date[] => {
          const year = date.getFullYear();
          const month = date.getMonth();
          const days = [];
          for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
            days.push(new Date(year, month, i));
          }
          return days;
        };

        const getPreviousMonthDays = (date: Date): Date[] => {
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const days = [];
          for (let i = firstDay.getDay() - 1; i >= 0; i--) {
            days.push(
              new Date(
                date.getFullYear(),
                date.getMonth() - 1,
                new Date(date.getFullYear(), date.getMonth(), 0).getDate() - i
              )
            );
          }
          return days;
        };

        const getNextMonthDays = (date: Date): Date[] => {
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          const days = [];
          for (let i = 1; i <= 6 - lastDay.getDay(); i++) {
            days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
          }
          return days;
        };

        const formatMonthName = (d: Date) =>
          d.toLocaleDateString("en-US", { month: "long" });
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

        const goToPrevMonth = () =>
          setCurrentMonth(
            (p: Date) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
          );
        const goToNextMonth = () =>
          setCurrentMonth(
            (p: Date) => new Date(p.getFullYear(), p.getMonth() + 1, 1)
          );
        const goToMonthView = () => setView("month");
        const goToYearView = () => setView("year");
        const selectMonth = (m: number) => {
          setCurrentMonth((p: Date) => new Date(p.getFullYear(), m, 1));
          setView("day");
        };
        const selectYear = (y: number) => {
          setCurrentMonth((p: Date) => new Date(y, p.getMonth(), 1));
          setView("month");
        };

        const getMonthsForPicker = () => {
          const year = currentMonth.getFullYear();
          return Array.from({ length: 12 }, (_, i) => i).filter((m) => {
            const d = new Date(year, m, 1);
            return (!minDate || d >= minDate) && (!maxDate || d <= maxDate);
          });
        };

        const getYearsForPicker = () => {
          const start = Math.floor(currentMonth.getFullYear() / 10) * 10;
          return Array.from({ length: 10 }, (_, i) => start + i).filter((y) => {
            const d = new Date(y, 0, 1);
            return (!minDate || d >= minDate) && (!maxDate || d <= maxDate);
          });
        };

        useEffect(() => {
          if (isOpen) {
            setCurrentMonth(value || new Date());
            setView("day");
          }
        }, [isOpen, value]);

        // --- JSX ---
        return (
          <div className={containerClassName}>
            {isShowLabel && (
              <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
                {label}{" "}
                {required !== false && <span className="text-red-600">*</span>}
              </label>
            )}

            <div className={`relative ${className}`} ref={datePickerRef}>
              <div
                className="flex items-center h-[50.23px] px-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <input
                  type="text"
                  value={inputValue}
                  placeholder={placeholder}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 text-base"
                />
                <FiCalendar className="w-5 h-5 text-gray-400" />
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={
                        view === "day"
                          ? goToPrevMonth
                          : () =>
                              setCurrentMonth(
                                (p: Date) =>
                                  new Date(
                                    p.getFullYear() - 10,
                                    p.getMonth(),
                                    1
                                  )
                              )
                      }
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {/* Left arrow */}
                      <FaChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {view === "day" && (
                      <div className="flex space-x-2">
                        <span
                          onClick={goToMonthView}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          {formatMonthName(currentMonth)}
                        </span>
                        <span
                          onClick={goToYearView}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          {currentMonth.getFullYear()}
                        </span>
                      </div>
                    )}
                    {view === "month" && (
                      <div>{currentMonth.getFullYear()}</div>
                    )}
                    {view === "year" && (
                      <div>
                        {Math.floor(currentMonth.getFullYear() / 10) * 10}–
                        {Math.floor(currentMonth.getFullYear() / 10) * 10 + 9}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={
                        view === "day"
                          ? goToNextMonth
                          : () =>
                              setCurrentMonth(
                                (p: Date) =>
                                  new Date(
                                    p.getFullYear() + 10,
                                    p.getMonth(),
                                    1
                                  )
                              )
                      }
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {/* Right arrow*/}
                      <FaChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Views */}
                  {view === "day" && (
                    <div className="grid grid-cols-7 gap-1">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div
                          key={d}
                          className="text-xs font-medium text-center py-1 text-gray-500 dark:text-gray-400"
                        >
                          {d}
                        </div>
                      ))}
                      {getPreviousMonthDays(currentMonth).map((d, i) => (
                        <div
                          key={`prev-${i}`}
                          className="text-xs text-center py-1 text-gray-400 cursor-pointer"
                        >
                          {d.getDate()}
                        </div>
                      ))}
                      {getDaysInMonth(currentMonth).map((d, i) => {
                        const isSelected =
                          value?.toDateString() === d.toDateString();
                        const isToday =
                          new Date().toDateString() === d.toDateString();
                        const disabled = !isDateValid(d);
                        return (
                          <div
                            key={`curr-${i}`}
                            onClick={() => !disabled && handleDateSelect(d)}
                            className={`text-xs text-center py-1 rounded-full cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : disabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                            } ${isToday ? "border border-blue-500" : ""}`}
                          >
                            {d.getDate()}
                          </div>
                        );
                      })}
                      {getNextMonthDays(currentMonth).map((d, i) => (
                        <div
                          key={`next-${i}`}
                          className="text-xs text-center py-1 text-gray-400 cursor-pointer"
                        >
                          {d.getDate()}
                        </div>
                      ))}
                    </div>
                  )}

                  {view === "month" && (
                    <div className="grid grid-cols-3 gap-2">
                      {getMonthsForPicker().map((m) => (
                        <div
                          key={m}
                          onClick={() => selectMonth(m)}
                          className={`text-sm text-center py-2 rounded-md cursor-pointer ${
                            value?.getMonth() === m &&
                            value.getFullYear() === currentMonth.getFullYear()
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {monthNames[m]}
                        </div>
                      ))}
                    </div>
                  )}

                  {view === "year" && (
                    <div className="grid grid-cols-2 gap-2">
                      {getYearsForPicker().map((y) => (
                        <div
                          key={y}
                          onClick={() => selectYear(y)}
                          className={`text-sm text-center py-2 rounded-md cursor-pointer ${
                            value?.getFullYear() === y
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
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
      }}
    />
  );
};
