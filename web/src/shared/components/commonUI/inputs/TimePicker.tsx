// TimePicker.tsx
import { useThemeHook } from "@/shared/hooks/useThemeHook";
import React, { useState, useEffect, useRef } from "react";

/**
 * Props for the TimePicker component.
 */
interface TimePickerProps {
  /** Optional label displayed above the time picker input. */
  label?: string;
  /** The current time value in "HH:mm" format (24-hour). This makes it a controlled component. */
  value?: string;
  /** Callback function that is called when the time is changed. Receives the new time as a string in "HH:mm" format. */
  onChange?: (time: string) => void;
  /** If true, a red asterisk is shown, and the label indicates it's a required field. */
  required?: boolean;
  /** Placeholder text to display when no time is selected. Defaults to 'Select Time'. */
  placeholder?: string;
  /** Optional CSS class name to apply to the root container element. */
  className?: string;
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
const TimePicker: React.FC<TimePickerProps> = ({
  label = "Start Time",
  value,
  onChange,
  required = false,
  placeholder = "Select Time",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(35);
  const isDarkMode = useThemeHook();
  const pickerRef = useRef<HTMLDivElement>(null);

  // Initialize with value if provided
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  // Handle clicks outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHourChange = (increment: boolean) => {
    let newHours = increment ? hours + 1 : hours - 1;
    if (newHours < 0) newHours = 23;
    if (newHours > 23) newHours = 0;
    setHours(newHours);
    emitChange(newHours, minutes);
  };

  const handleMinuteChange = (increment: boolean) => {
    let newMinutes = increment ? minutes + 1 : minutes - 1;
    if (newMinutes < 0) newMinutes = 59;
    if (newMinutes > 59) newMinutes = 0;
    setMinutes(newMinutes);
    emitChange(hours, newMinutes);
  };

  const emitChange = (h: number, m: number) => {
    const timeString = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    onChange?.(timeString);
  };

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          className={`block mb-1 text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        ref={pickerRef}
        className={`relative ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"} border rounded-lg cursor-pointer`}
      >
        <div
          onClick={togglePicker}
          className={`flex items-center justify-between px-3 py-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
        >
          <span>{formattedTime === "00:00" ? placeholder : formattedTime}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 11-2 0 1 1 0 012 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isOpen && (
          <div
            className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${isDarkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-center space-x-6">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleHourChange(true)}
                    className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                    aria-label="Increase hours"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div
                    className={`text-xl font-bold mt-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {hours.toString().padStart(2, "0")}
                  </div>
                  <button
                    onClick={() => handleHourChange(false)}
                    className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                    aria-label="Decrease hours"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Separator */}
                <div
                  className={`text-xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  :
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleMinuteChange(true)}
                    className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                    aria-label="Increase minutes"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div
                    className={`text-xl font-bold mt-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {minutes.toString().padStart(2, "0")}
                  </div>
                  <button
                    onClick={() => handleMinuteChange(false)}
                    className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"}`}
                    aria-label="Decrease minutes"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
