import { useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

import { CountrySelect } from "./CountrySelect";
import type { Country, PhoneInputFieldProps } from "./type";



export const PhoneInputField = ({
  name,
  label,
  placeholder = "Enter mobile number",
  required = false,
  rules,
  disabled,
  inputClassName,
}: PhoneInputFieldProps) => {
  const { control, getValues, setValue, clearErrors } = useFormContext();

  const countries: Country[] = [
    {
      code: "+91",
      name: "India",
      flag: "https://flagcdn.com/w40/in.png", // ✅ Removed trailing spaces
      validationKey: "india",
    },
    {
      code: "+44",
      name: "UK",
      flag: "https://flagcdn.com/w40/gb.png", // ✅ Removed trailing spaces
      validationKey: "uk",
    },
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
      // ✅ CORRECTED: After +44, UK mobile = 10 digits, starting with 7, 8, or 9
      if (phoneNumber.length !== 10) {
        return "UK phone number must be exactly 10 digits long";
      }
      if (!/^[789]/.test(phoneNumber)) {
        return "UK mobile numbers must start with 7, 8, or 9";
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

          return (
            <>
              <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600">
                <CountrySelect
                  countries={countries}
                  value={countryCode}
                  onChange={(newCode) => {
                    field.onChange(`${newCode} ${numberValue}`);
                    clearErrors(name);
                  }}
                />
                <input
                  type="tel"
                  value={numberValue}
                  disabled={typeof disabled !== "undefined" ? disabled : false}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^\d*$/.test(newValue)) {
                      field.onChange(`${countryCode} ${newValue}`);
                    }
                  }}
                  onBlur={(e) => {
                    const trimmed = e.target.value.trim();
                    field.onChange(`${countryCode} ${trimmed}`);
                  }}
                  placeholder={placeholder}
                  className={`flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none ${
                    inputClassName || ""
                  }`}
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