import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useEffect, useRef } from "react";

interface OTPInputProps {
  name: string;
  length?: number;
  required?: boolean;
  rules?: RegisterOptions;
  errorAlign?: "left" | "right" | "center";
}

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
    const currentOTP = inputRefs.current.map(ref => ref?.value || "").join("").padEnd(length, "");
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
                  className="w-12 h-12 text-center text-xl rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  aria-label={`OTP digit ${idx + 1} of ${length}`}
                />
              ))}
            </div>
            {error && (
              <p
                className={`text-sm text-red-600 dark:text-red-500 text-${errorAlign}`}
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