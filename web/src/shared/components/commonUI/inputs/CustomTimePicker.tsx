import React, { useEffect, useRef, useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { Clock } from "lucide-react";

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

/* -------- Helpers -------- */

const to24 = (time: string) => {
  if (!time) return "";
  const [hhmm, period] = time.split(" ");
  let [hour, minute] = hhmm.split(":").map(Number);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const combineTo24 = (h: string, m: string, p: string) =>
  to24(`${h}:${m} ${p}`);

const time24ToMinutes = (value24: string | null | undefined) => {
  if (!value24) return null;
  const [h, m] = value24.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

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
  inputClassName = "w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 bg-white flex items-center justify-between cursor-pointer hover:border-blue-400 shadow-sm",
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
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

  /* ---- Smart popup positioning ---- */
  useEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const dropdownH = 250;

      const spaceBelow = viewH - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownH && spaceAbove > spaceBelow) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    }
  }, [open]);

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
    // Range for this hour: [h:00, h:59]
    const earliest = combineTo24(hour12, "00", period);
    const latest = combineTo24(hour12, "59", period);
    const earliestM = time24ToMinutes(earliest)!;
    const latestM = time24ToMinutes(latest)!;

    const effMin = minMinutes ?? 0;
    const effMax = maxMinutes ?? (24 * 60 - 1);

    // no overlap between [earliestM, latestM] and [effMin, effMax]
    if (effMax < earliestM || effMin > latestM) return true;
    return false;
  };

  const isMinuteDisabled = (
    minute: string,
    hourDisplay: string,
    period: "AM" | "PM"
  ) => {
    const effectiveHour = hourDisplay !== "--" ? hourDisplay : "12";
    const candidate = combineTo24(effectiveHour, minute, period);
    return isValueDisabled(candidate);
  };

  const isPeriodDisabled = (p: "AM" | "PM") => {
    // AM => [00:00, 11:59], PM => [12:00, 23:59]
    const rangeStart = p === "AM" ? "12:00 AM" : "12:00 PM";
    const rangeEnd = p === "AM" ? "11:59 AM" : "11:59 PM";
    const startM = time24ToMinutes(to24(rangeStart))!;
    const endM = time24ToMinutes(to24(rangeEnd))!;

    const effMin = minMinutes ?? 0;
    const effMax = maxMinutes ?? (24 * 60 - 1);

    // no overlap between [startM, endM] and [effMin, effMax]
    if (effMax < startM || effMin > endM) return true;
    return false;
  };

  return (
    <div className={`${containerClassName} relative`} ref={wrapperRef}>
      {isShowLabel && (
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          const rawValue: string | undefined = field.value; // always 24h "HH:mm"

          // Convert 24h → 12h for display
          let displayHour = "--";
          let displayMinute = "--";
          let displayPeriod: "AM" | "PM" = "AM";

          if (rawValue) {
            const [h, m] = rawValue.split(":");
            const hour = Number(h);

            displayMinute = m;
            displayPeriod = hour >= 12 ? "PM" : "AM";

            if (hour === 0) displayHour = "12";
            else if (hour > 12) displayHour = String(hour - 12).padStart(2, "0");
            else displayHour = String(hour).padStart(2, "0");
          }

          const setValue = (h: string, m: string, p: "AM" | "PM") => {
            const newVal = combineTo24(h, m, p); // 24h
            // strict mode: but we already disable invalid values in UI
            field.onChange(newVal);
            onChange?.(newVal);
            // IMPORTANT: do NOT close on click; user closes via outside click/input
          };

          const handleInputClick = () => {
            if (disabled) return;
            setOpen((prev) => !prev);
          };

          return (
            <>
              {/* Input Box */}
              <button
                type="button"
                onClick={handleInputClick}
                disabled={disabled}
                className={`${inputClassName} ${
                  disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                }`}
              >
                <span className="text-gray-900 text-base">
                  {rawValue
                    ? `${displayHour}:${displayMinute} ${displayPeriod}`
                    : "--:--"}
                </span>
                <Clock className="w-5 h-5 text-gray-600" />
              </button>

              {/* Popup (always mounted for smooth transition) */}
              <div
                className={`
                  absolute z-50 bg-white shadow-lg border rounded-lg p-3 flex gap-4
                  transition-all duration-200 ease-out transform

                  ${direction === "down"
                    ? "top-full mt-2 origin-top"
                    : "bottom-full mb-2 origin-bottom"}

                  ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                `}
              >
                {/* HOURS */}
                <div className="flex flex-col max-h-48 overflow-y-auto">
                  {hours.map((h) => {
                    const disabledHour = isHourDisabled(h, displayPeriod);
                    const isActive = h === displayHour && !disabledHour;

                    const baseClass =
                      "px-3 py-1 rounded text-center text-sm";
                    const enabledClass = isActive
                      ? "bg-blue-600 text-white cursor-pointer"
                      : "text-gray-800 hover:bg-gray-200 cursor-pointer";
                    const disabledClass =
                      "bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed";

                    return (
                      <div
                        key={h}
                        onClick={() => {
                          if (disabledHour) return;
                          setValue(
                            h,
                            displayMinute !== "--" ? displayMinute : "00",
                            displayPeriod
                          );
                        }}
                        className={`${baseClass} ${
                          disabledHour ? disabledClass : enabledClass
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
                      displayPeriod
                    );
                    const isActive = m === displayMinute && !disabledMinute;

                    const baseClass =
                      "px-3 py-1 rounded text-center text-sm";
                    const enabledClass = isActive
                      ? "bg-blue-600 text-white cursor-pointer"
                      : "text-gray-800 hover:bg-gray-200 cursor-pointer";
                    const disabledClass =
                      "bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed";

                    return (
                      <div
                        key={m}
                        onClick={() => {
                          if (disabledMinute) return;
                          setValue(
                            displayHour !== "--" ? displayHour : "12",
                            m,
                            displayPeriod
                          );
                        }}
                        className={`${baseClass} ${
                          disabledMinute ? disabledClass : enabledClass
                        }`}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>

                {/* AM / PM */}
                <div className="flex flex-col max-h-48 overflow-y-auto">
                  {periods.map((p) => {
                    const disabledPeriod = isPeriodDisabled(p);
                    const isActive = p === displayPeriod && !disabledPeriod;

                    const baseClass =
                      "px-3 py-1 rounded text-center text-sm";
                    const enabledClass = isActive
                      ? "bg-blue-600 text-white cursor-pointer"
                      : "text-gray-800 hover:bg-gray-200 cursor-pointer";
                    const disabledClass =
                      "bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed";

                    return (
                      <div
                        key={p}
                        onClick={() => {
                          if (disabledPeriod) return;
                          setValue(
                            displayHour !== "--" ? displayHour : "12",
                            displayMinute !== "--" ? displayMinute : "00",
                            p
                          );
                        }}
                        className={`${baseClass} ${
                          disabledPeriod ? disabledClass : enabledClass
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
