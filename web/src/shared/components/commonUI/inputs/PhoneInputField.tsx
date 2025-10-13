import { useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

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
  flag: string; // SVG path
  validationKey: "india" | "uk";
}

export const PhoneInputField = ({
  name,
  label,
  placeholder = "Enter phone number",
  required = false,
  rules,
}: PhoneInputFieldProps) => {
  const { control, getValues, setValue, clearErrors } = useFormContext();

  const countries: Country[] = [
    { code: "+91", name: "IN", flag: "src/assets/flags/in.svg", validationKey: "india" },
    { code: "+44", name: "UK", flag: "src/assets/flags/gb.svg", validationKey: "uk" },
  ];

  useEffect(() => {
    const currentValue = getValues(name);
    if (!currentValue) {
      setValue(name, `${countries[0].code} `, { shouldValidate: false });
    }
  }, [name, getValues, setValue]);

  const validatePhone = (fullValue: string): true | string => {
    if (!fullValue?.trim()) {
      return required ? `${label || name} is required` : true;
    }

    const parts = fullValue.trim().split(" ");
    if (parts.length < 2) {
      return "Please enter a valid phone number";
    }

    const countryCode = parts[0];
    const phoneNumber = parts.slice(1).join("").trim();

    const selectedCountry = countries.find((c) => c.code === countryCode);
    if (!selectedCountry) {
      return "Invalid country code";
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return "Phone number must contain only digits (0-9)";
    }

    const { validationKey } = selectedCountry;

    if (validationKey === "india") {
      if (phoneNumber.length !== 10) {
        return "Indian phone number must be exactly 10 digits long";
      }
      if (!/^[6-9]/.test(phoneNumber)) {
        return "Indian mobile numbers must start with 6, 7, 8, or 9";
      }
    } else if (validationKey === "uk") {
      if (phoneNumber.length !== 11) {
        return "UK phone number must be exactly 11 digits long";
      }
      if (phoneNumber[0] !== "0") {
        return "UK phone number must start with 0";
      }
      if (phoneNumber[1] === "0") {
        return "UK phone number cannot have 0 as the second digit";
      }
    }

    return true;
  };

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    validate: validatePhone,
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
          const [countryCode = countries[0].code, ...rest] = (
            field.value || ""
          ).split(" ");
          const numberValue = rest.join(" ");

          const currentCountry = countries.find(c => c.code === countryCode);

          return (
            <>
              <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                {/* Custom dropdown button */}
                <div className="relative bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-3 border-r border-gray-300 dark:border-gray-600 cursor-pointer">
                  {currentCountry && (
                    <div className="flex items-center gap-1">
                      <img
                        src={currentCountry.flag}
                        alt={currentCountry.name}
                        className="w-5 h-5"
                        onError={(e) => {
                          // Fallback if SVG fails
                          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDQgMyI+PHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iMyIgZmlsbD0iI0ZGNjkzMyIvPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIHk9IjEiIGZpbGw9IiNGRkZGRkYiLz48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiB5PSIyIiBmaWxsPSIjMTM4ODA4Ii8+PGNpcmNsZSBjeD0iMS41IiBjeT0iMS41IiByPSIwLjUiIGZpbGw9IiMwMDAwODAiLz48L3N2Zz4=";
                        }}
                      />
                      <span>{currentCountry.code}</span>
                    </div>
                  )}
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      field.onChange(`${e.target.value} ${numberValue}`);
                      clearErrors(name);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="tel"
                  value={numberValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^\d*$/.test(newValue)) {
                      field.onChange(`${countryCode} ${newValue}`);
                    }
                  }}
                  placeholder={placeholder}
                  className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                />
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default PhoneInputField;