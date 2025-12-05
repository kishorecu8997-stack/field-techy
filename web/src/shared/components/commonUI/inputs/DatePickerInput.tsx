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
  disabled = false,
  required = false,
  rules,
  containerClassName = "flex flex-col py-1 w-full",
}) => {
  const { control, watch } = useFormContext();

  // --- Validation message ---
  let requiredMessage: string | false = false;
  if (typeof required === "string") requiredMessage = required;
  else if (required === true) requiredMessage = `${label || name} is required`;

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  // --- Utility functions ---
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString: string): Date | null => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return null;
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    )
      return null;
    return date;
  };

  const isDateValid = (date: Date): boolean => {
    if (!date || isNaN(date.getTime())) return false;
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // --- Component state (top level) ---
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const datePickerRef = useRef<HTMLDivElement>(null);

  const value = watch(name);

  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  // --- Sync selectedDate with inputValue and currentMonth ---
  useEffect(() => {
    setInputValue(formatDate(selectedDate));
    if (selectedDate) setCurrentMonth(selectedDate);
  }, [selectedDate]);

  // --- Close on outside click ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Calendar helper functions ---
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days: Date[] = [];
    for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getPreviousMonthDays = (date: Date): Date[] => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const days: Date[] = [];
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
    const days: Date[] = [];
    for (let i = 1; i <= 6 - lastDay.getDay(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
    }
    return days;
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
  const formatMonthName = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long" });

  const goToPrevMonth = () => {
    setCurrentMonth((p) => {
      const newDate = new Date(p.getFullYear(), p.getMonth() - 1, 1);
      if (minDate && newDate < minDate) return p;
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((p) => {
      const newDate = new Date(p.getFullYear(), p.getMonth() + 1, 1);
      if (maxDate && newDate > maxDate) return p;
      return newDate;
    });
  };

  const goToMonthView = () => setView("month");
  const goToYearView = () => setView("year");

  const selectMonth = (m: number) => {
    setCurrentMonth((p) => {
      const newDate = new Date(p.getFullYear(), m, 1);
      if (!isDateValid(newDate)) return p;
      return newDate;
    });
    setView("day");
  };

  const selectYear = (y: number) => {
    setCurrentMonth((p) => {
      const newDate = new Date(y, p.getMonth(), 1);
      if (!isDateValid(newDate)) return p;
      return newDate;
    });
    setView("month");
  };

  const getMonthsForPicker = () =>
    Array.from({ length: 12 }, (_, i) => i).filter((m) =>
      isDateValid(new Date(currentMonth.getFullYear(), m, 1))
    );
  const getYearsForPicker = () => {
    const start = Math.floor(currentMonth.getFullYear() / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => start + i).filter((y) =>
      isDateValid(new Date(y, 0, 1))
    );
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field: { onChange }, fieldState: { error } }) => {
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (disabled) return;
          const val = e.target.value;
          setInputValue(val);
          const parsed = parseDate(val);
          if (parsed && isDateValid(parsed)) {
            setSelectedDate(parsed);
            onChange(parsed);
          } else if (val === "") {
            setSelectedDate(null);
            onChange(null);
          }
        };

        const handleInputBlur = () => setInputValue(formatDate(selectedDate));

        const handleDateSelect = (date: Date) => {
          setSelectedDate(date);
          onChange(date);
          setIsOpen(false);
        };

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
                className={`flex items-center h-[50px] px-3 border rounded-lg shadow-sm bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary cursor-pointer ${
                  disabled
                    ? "opacity-60 cursor-not-allowed border-gray-300 dark:border-gray-600"
                    : "border-gray-300 dark:border-gray-600 focus-within:border-primary"
                }`}
                onClick={toggleOpen}
              >
                <input
                  type="text"
                  value={inputValue}
                  placeholder={placeholder}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={disabled}
                  className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 text-base"
                />
                <FiCalendar className="w-5 h-5 text-gray-400" />
              </div>

              {isOpen && !disabled && (
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
                                (p) =>
                                  new Date(
                                    p.getFullYear() - 10,
                                    p.getMonth(),
                                    1
                                  )
                              )
                      }
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
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
                                (p) =>
                                  new Date(
                                    p.getFullYear() + 10,
                                    p.getMonth(),
                                    1
                                  )
                              )
                      }
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Day view */}
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
                          className="text-xs text-center py-1 text-gray-300 cursor-default"
                        >
                          {d.getDate()}
                        </div>
                      ))}
                      {getDaysInMonth(currentMonth).map((d, i) => {
                        const isSelected =
                          selectedDate?.toDateString() === d.toDateString();
                        const isToday =
                          new Date().toDateString() === d.toDateString();
                        const isDisabled = !isDateValid(d);
                        return (
                          <div
                            key={`curr-${i}`}
                            onClick={() => !isDisabled && handleDateSelect(d)}
                            className={`text-xs text-center py-1 rounded-full cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : isDisabled
                                ? "text-gray-300 cursor-not-allowed"
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
                          className="text-xs text-center py-1 text-gray-300 cursor-default"
                        >
                          {d.getDate()}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Month view */}
                  {view === "month" && (
                    <div className="grid grid-cols-3 gap-2">
                      {getMonthsForPicker().map((m) => (
                        <div
                          key={m}
                          onClick={() => selectMonth(m)}
                          className={`text-sm text-center py-2 rounded-md cursor-pointer ${
                            selectedDate?.getMonth() === m &&
                            selectedDate.getFullYear() ===
                              currentMonth.getFullYear()
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {monthNames[m]}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Year view */}
                  {view === "year" && (
                    <div className="grid grid-cols-2 gap-2">
                      {getYearsForPicker().map((y) => (
                        <div
                          key={y}
                          onClick={() => selectYear(y)}
                          className={`text-sm text-center py-2 rounded-md cursor-pointer ${
                            selectedDate?.getFullYear() === y
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
