import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface OTPInputProps {
  name: string;
  length?: number;
  required?: boolean;
  rules?: RegisterOptions;
  errorAlign?: "left" | "right" | "center";
}

/**
 * OTPInput - A reusable OTP input component for react-hook-form.
 *
 * Features:
 * - Supports multi-digit OTP input.
 * - Automatically focuses next input on typing.
 * - Validation via react-hook-form.
 */
export const OTPInput = ({
  name,
  length = 6,
  required = false,
  rules,
  errorAlign = "left",
}: OTPInputProps) => {
  const { control, setValue } = useFormContext();

  const validationRules: RegisterOptions = {
    required: required ? "OTP is required" : false,
    ...rules,
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => {
        const otp = field.value || "".padStart(length, "");

        const handleChange = (
          e: React.ChangeEvent<HTMLInputElement>,
          idx: number
        ) => {
          const val = e.target.value.replace(/\D/g, ""); // only digits
          if (!val) return;

          const newOTP = otp
            .split("")
            .map((c: string, i: number) => (i === idx ? val[0] : c))
            .join("");

          setValue(name, newOTP);

          // Move focus to next input
          const nextInput = document.getElementById(`${name}-${idx + 1}`);
          if (nextInput) (nextInput as HTMLInputElement).focus();
        };

        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4  justify-evenly">
              {Array.from({ length }).map((_, idx) => (
                <input
                  key={idx}
                  id={`${name}-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otp[idx] || ""}
                  onChange={(e) => handleChange(e, idx)}
                  className="w-18 h-18 text-center text-xl rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary outline-none"
                />
              ))}
            </div>
            {error && (
              <p
                className={`text-sm text-red-600 dark:text-red-500 text-${errorAlign}`}
              >
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
