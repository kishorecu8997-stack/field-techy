import { combineTo24, time24ToMinutes, to24 } from "@/utils";
import { Clock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface TimePickerProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  required?: boolean | string;
  rules?: RegisterOptions;
  disabled?: boolean;
  minTime?: string; // "09:30 AM"
  maxTime?: string; // "05:00 PM"
  onChange?: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
}

/**
 * A custom time picker component that allows users to select hours and minutes.
 *
 * Features:
 * - A simple, intuitive UI with up/down arrows for hours and minutes.
 * - Automatically detects and applies dark mode styling based on system preferences.
 * - Can be used as a controlled component by passing `value` and `onChange` props.
 * - Closes automatically when clicking outside the component.
 * - Supports a label, placeholder, and required indicator.
 *
 * @component
 * @example
 * const [time, setTime] = useState('14:30');
 * return (
 *   <TimePicker
 *     label="Appointment Time"
 *     value={time}
 *     onChange={setTime}
 *     required
 *   />
 * );
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  name,
  label = "Select Time",
  isShowLabel = true,
  required = false,
  rules,
  disabled = false,
  minTime,
  maxTime,
  onChange,
  containerClassName = "w-full",
  inputClassName = "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md px-4 py-3 bg-white flex items-center justify-between cursor-pointer shadow-sm",
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const periods = ["AM", "PM"] as const;

  const min24 = minTime ? to24(minTime) : null;
  const max24 = maxTime ? to24(maxTime) : null;
  const minMinutes = time24ToMinutes(min24);
  const maxMinutes = time24ToMinutes(max24);

  /* ---- Close on outside click ---- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---- Required message ---- */
  let requiredMessage: string | false = false;
  if (typeof required === "string") requiredMessage = required;
  else if (required === true) requiredMessage = `${label} is required`;

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    validate: (value: string) => {
      if (!value) return true;
      const currentMins = time24ToMinutes(value);
      if (currentMins == null) return true;

      if (minMinutes != null && currentMins < minMinutes)
        return `Time must be after ${minTime}`;
      if (maxMinutes != null && currentMins > maxMinutes)
        return `Time must be before ${maxTime}`;

      return true;
    },
    ...rules,
  };

  /* ---- Utility for disabling checks ---- */

  const isValueDisabled = (val24: string) => {
    const mins = time24ToMinutes(val24);
    if (mins == null) return false;
    if (minMinutes != null && mins < minMinutes) return true;
    if (maxMinutes != null && mins > maxMinutes) return true;
    return false;
  };

  const isHourDisabled = (hour12: string, period: "AM" | "PM") => {
    const earliest = combineTo24(hour12, "00", period);
    const latest = combineTo24(hour12, "59", period);
    const earliestM = time24ToMinutes(earliest)!;
    const latestM = time24ToMinutes(latest)!;

    const effMin = minMinutes ?? 0;
    const effMax = maxMinutes ?? 24 * 60 - 1;

    if (effMax < earliestM || effMin > latestM) return true;
    return false;
  };

  const isMinuteDisabled = (
    minute: string,
    hourDisplay: string,
    period: "AM" | "PM",
  ) => {
    const effectiveHour = hourDisplay !== "--" ? hourDisplay : "12";
    const candidate = combineTo24(effectiveHour, minute, period);
    return isValueDisabled(candidate);
  };

  const isPeriodDisabled = (p: "AM" | "PM") => {
    const rangeStart = p === "AM" ? "12:00 AM" : "12:00 PM";
    const rangeEnd = p === "AM" ? "11:59 AM" : "11:59 PM";
    const startM = time24ToMinutes(to24(rangeStart))!;
    const endM = time24ToMinutes(to24(rangeEnd))!;

    const effMin = minMinutes ?? 0;
    const effMax = maxMinutes ?? 24 * 60 - 1;

    if (effMax < startM || effMin > endM) return true;
    return false;
  };

  return (
    <div className={`${containerClassName} relative`} ref={wrapperRef}>
      {isShowLabel && (
        <label
          className={`block mb-1 text-md font-semibold 
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
        render={({ field, fieldState: { error } }) => {
          const rawValue = field.value as string | undefined;

          let displayHour = "--";
          let displayMinute = "--";
          let displayPeriod: "AM" | "PM" = "AM";

          if (rawValue) {
            const [h, m] = rawValue.split(":");
            const hour = Number(h);

            displayMinute = m;
            displayPeriod = hour >= 12 ? "PM" : "AM";

            if (hour === 0) displayHour = "12";
            else if (hour > 12)
              displayHour = String(hour - 12).padStart(2, "0");
            else displayHour = String(hour).padStart(2, "0");
          }

          const setValue = (h: string, m: string, p: "AM" | "PM") => {
            const newVal = combineTo24(h, m, p);
            field.onChange(newVal);
            onChange?.(newVal);
          };

          const handleInputClick = () => {
            if (disabled) return;
            setOpen((prev) => !prev);
          };

          return (
            <>
              <button
                type="button"
                onClick={handleInputClick}
                disabled={disabled}
                className={`${inputClassName} 
                ${
                  disabled
                    ? " cursor-not-allowed opacity-60 border-gray-400 dark:border-gray-600 focus:ring-0"
                    : "cursor-text bg-white dark:bg-gray-800"
                } 
                 ${
                   error && !disabled
                     ? "border-red-500 focus:ring-1 focus:ring-red-400"
                     : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
                 }`}
              >
                <span className="text-gray-900 text-base dark:text-gray-200">
                  {rawValue
                    ? `${displayHour}:${displayMinute} ${displayPeriod}`
                    : "--:--"}
                </span>
                <Clock className="w-5 h-5 text-gray-400" />
              </button>

              {/* ---- POPUP ALWAYS OPENS ABOVE ---- */}
              <div
                className={`
                  absolute z-50 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-600 rounded-lg p-3 flex gap-4
                  transition-all duration-200 ease-out transform

                  bottom-full mb-2 origin-bottom

                  ${
                    open
                      ? "opacity-100 scale-100 overflow-visible pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none overflow-hidden"
                  }
                `}
              >
                {/* HOURS */}
                <div className="flex flex-col max-h-48 overflow-y-auto">
                  {hours.map((h) => {
                    const disabledHour = isHourDisabled(h, displayPeriod);
                    const isActive = h === displayHour && !disabledHour;

                    return (
                      <div
                        key={h}
                        onClick={() => {
                          if (disabledHour) return;
                          setValue(
                            h,
                            displayMinute !== "--" ? displayMinute : "00",
                            displayPeriod,
                          );
                        }}
                        className={`px-3 py-1 rounded text-center text-sm ${
                          disabledHour
                            ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-40 cursor-not-allowed"
                            : isActive
                              ? "bg-blue-600 text-white cursor-pointer"
                              : "text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        }`}
                      >
                        {h}
                      </div>
                    );
                  })}
                </div>

                {/* MINUTES */}
                <div className="flex flex-col max-h-48 overflow-y-auto">
                  {minutes.map((m) => {
                    const disabledMinute = isMinuteDisabled(
                      m,
                      displayHour,
                      displayPeriod,
                    );
                    const isActive = m === displayMinute && !disabledMinute;

                    return (
                      <div
                        key={m}
                        onClick={() => {
                          if (disabledMinute) return;
                          setValue(
                            displayHour !== "--" ? displayHour : "12",
                            m,
                            displayPeriod,
                          );
                        }}
                        className={`px-3 py-1 rounded text-center text-sm ${
                          disabledMinute
                            ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-40 cursor-not-allowed"
                            : isActive
                              ? "bg-blue-600 text-white cursor-pointer"
                              : "text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        }`}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>

                {/* PERIODS */}
                <div className="flex flex-col max-h-48 overflow-y-auto">
                  {periods.map((p) => {
                    const disabledPeriod = isPeriodDisabled(p);
                    const isActive = p === displayPeriod && !disabledPeriod;

                    return (
                      <div
                        key={p}
                        onClick={() => {
                          if (disabledPeriod) return;
                          setValue(
                            displayHour !== "--" ? displayHour : "12",
                            displayMinute !== "--" ? displayMinute : "00",
                            p,
                          );
                        }}
                        className={`px-3 py-1 rounded text-center text-sm ${
                          disabledPeriod
                            ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-40 cursor-not-allowed"
                            : isActive
                              ? "bg-blue-600 text-white cursor-pointer"
                              : "text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        }`}
                      >
                        {p}
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-1">{error.message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default TimePicker;
