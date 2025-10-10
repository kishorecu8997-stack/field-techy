import { useEffect } from "react";
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
  validationKey: "india" | "uk"; // used for validation mapping
}

export const PhoneInputField = ({
  name,
  label,
  placeholder = "Enter phone number",
  required = false,
  rules,
}: PhoneInputFieldProps) => {
  const { control, getValues, setValue,  clearErrors } = useFormContext();

  const countries: Country[] = [
    { code: "+91", name: "IN", flag: "🇮🇳", validationKey: "india" },
    { code: "+44", name: "UK", flag: "🇬🇧", validationKey: "uk" },
  ];

  // Ensure default value is set
  useEffect(() => {
    const currentValue = getValues(name);
    if (!currentValue) {
      setValue(name, `${countries[0].code} `, { shouldValidate: false });
    }
  }, [name, getValues, setValue]);

  // Custom validation function that ignores country code
  const validatePhone = (fullValue: string): true | string => {
    if (!fullValue) {
      return required ? `${label || name} is required` : true;
    }

    const parts = fullValue.trim().split(" ");
    if (parts.length < 2) {
      return "Please enter a valid phone number";
    }

    const countryCode = parts[0];
    const phoneNumber = parts.slice(1).join("").trim();

    // Find matching country
    const selectedCountry = countries.find(c => c.code === countryCode);
    if (!selectedCountry) {
      return "Invalid country code";
    }

    // Validation: digits only
    if (!/^\d+$/.test(phoneNumber)) {
      return "Phone number must contain only digits (0-9)";
    }

    const country = selectedCountry.validationKey;

    if (country === "india") {
      if (phoneNumber.length !== 10) {
        return "Indian phone number must be exactly 10 digits long";
      }
      if (!/^[6-9]/.test(phoneNumber)) {
        return "Indian mobile numbers must start with 6, 7, 8, or 9";
      }
    } else if (country === "uk") {
      if (phoneNumber.length !== 11) {
        return "UK phone number must be exactly 11 digits long";
      }
      if (phoneNumber[0] !== '0') {
        return "UK phone number must start with 0";
      }
      if (phoneNumber[1] === '0') {
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
          const [countryCode, ...rest] = (field.value || "").split(" ");
          const numberValue = rest.join(" ");

          return (
            <>
              <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                <select
                  value={countryCode || countries[0].code}
                  onChange={(e) => {
                    const newFullValue = `${e.target.value} ${numberValue}`;
                    field.onChange(newFullValue);
                    // Clear error when country changes (optional UX improvement)
                    clearErrors(name);
                  }}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-3 border-r border-gray-300 dark:border-gray-600 outline-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={numberValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Allow only digits (prevent non-numeric input)
                    if (/^\d*$/.test(newValue)) {
                      field.onChange(
                        `${countryCode || countries[0].code} ${newValue}`
                      );
                    }
                  }}
                  placeholder={placeholder}
                  className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition"
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