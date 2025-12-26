import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useEffect, useRef } from "react";
import type { OTPInputProps } from "./type";

/**
 * OTPInput is a controlled React component that renders a set of single-digit input fields
 * for entering a one-time password (OTP). It integrates with `react-hook-form` and provides
 * automatic focus management, backspace navigation, paste handling, and validation.
 *
 * Features:
 * - Auto-focuses next input on digit entry
 * - Moves to previous input on backspace when current is empty
 * - Supports pasting a full OTP code (only if length matches)
 * - Validates completeness and required status
 * - Fully accessible with ARIA labels
 *
 * @component
 * @example
 * <OTPInput name="otp" length={6} required />
 *
 * @param {Object} props - Component props
 * @param {string} props.name - The field name registered with react-hook-form
 * @param {number} [props.length=6] - Number of OTP digits (default: 6)
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {import("react-hook-form").RegisterOptions} [props.rules] - Additional validation rules from react-hook-form
 * @param {"left" | "right" | "center"} [props.errorAlign="left"] - Text alignment for error message
 *
 * @returns {JSX.Element} Rendered OTP input fields with validation support
 */
export const OTPInput = ({
  name,
  length = 6,
  required = false,
  rules,
  errorAlign = "left",
}: OTPInputProps) => {
  const { control, setValue } = useFormContext();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Initialize array to avoid undefined issues
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const validationRules: RegisterOptions = {
    required: required ? "OTP is required" : false,
    validate: {
      isComplete: (value: string) =>
        value?.length === length || `Please enter ${length} digits`,
      ...rules?.validate,
    },
    ...rules,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);

    // Get current OTP value
    const currentOTP = inputRefs.current
      .map((ref) => ref?.value || "")
      .join("")
      .padEnd(length, "");
    const newOTP = currentOTP
      .split("")
      .map((c, i) => (i === idx ? val : c))
      .join("")
      .padEnd(length, "");

    setValue(name, newOTP);

    // Move to next input if there's a value
    if (val && idx < length - 1) {
      setTimeout(() => {
        inputRefs.current[idx + 1]?.focus();
        inputRefs.current[idx + 1]?.select();
      }, 0);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      // Move to previous input on backspace if current is empty
      setTimeout(() => {
        inputRefs.current[idx - 1]?.focus();
        inputRefs.current[idx - 1]?.select();
      }, 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === length) {
      setValue(name, paste);
      // Focus last input after paste
      setTimeout(() => {
        inputRefs.current[length - 1]?.focus();
      }, 0);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => {
        const otp = field.value?.toString().padEnd(length, "") || "";

        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 justify-center">
              {Array.from({ length }).map((_, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  id={`${name}-${idx}`}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={otp[idx] || ""}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  aria-label={`OTP digit ${idx + 1} of ${length}`}
                />
              ))}
            </div>
            {error && (
              <p
                className={`text-sm text-red-600 dark:text-red-500 ${
                  errorAlign === "left"
                    ? "text-left"
                    : errorAlign === "right"
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {error.message?.toString()}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
