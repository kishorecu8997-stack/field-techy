import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";

interface PhoneInputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
}

interface Country {
  code: string;
  name: string;
  flag: string; // emoji flag
}

export const PhoneInputField = ({
  name,
  label,
  placeholder = "Enter phone number",
  required = false,
  rules,
}: PhoneInputFieldProps) => {
  const { control } = useFormContext();

  const countries: Country[] = [
    { code: "+1", name: "US", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+91", name: "IN", flag: "🇮🇳" },
  ];

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  return (
    <div className="flex flex-col py-1">
      {label && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          // Split value into code + number
          const [countryCode, ...rest] = (field.value || "").split(" ");
          const numberValue = rest.join(" ");

          return (
            <>
              <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                {/* Native select for country */}
                <select
                  value={countryCode || countries[0].code}
                  onChange={(e) => field.onChange(`${e.target.value} ${numberValue}`)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-3 border-r border-gray-300 dark:border-gray-600 outline-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                {/* Phone input */}
                <input
                  type="tel"
                  value={numberValue}
                  onChange={(e) => field.onChange(`${countryCode || countries[0].code} ${e.target.value}`)}
                  placeholder={placeholder || label}
                  className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error.message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
