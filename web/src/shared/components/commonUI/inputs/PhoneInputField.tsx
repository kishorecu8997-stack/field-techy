import { useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

import { CountrySelect } from "./CountrySelect";
import type { PhoneInputFieldProps } from "./type";
import { PHONE_COUNTRIES } from "@/dummy_data/phoneInput";
/**
 * A reusable phone number input field with a country code selector.
 *
 * This component integrates with `react-hook-form` and provides a composite
 * input for entering international phone numbers. It includes a dropdown for
 * selecting the country code and validates the phone number format based on
 * the selected country.
 *
 * @param {PhoneInputFieldProps} props - The props for the component.
 * @param {string} props.name - The name of the field for `react-hook-form`.
 * @param {string} [props.label] - The text label displayed above the input field.
 * @param {string} [props.placeholder="Enter mobile number"] - The placeholder text for the number input.
 * @param {boolean} [props.required=false] - Whether the field is mandatory.
 * @param {RegisterOptions} [props.rules] - Additional validation rules for `react-hook-form`.
 * @param {boolean} [props.disabled] - Disables the entire input field.
 * @param {string} [props.inputClassName] - Custom CSS classes for the phone number input element.
 */
// --- Added ENUM-LIKE Object + Type ---
export const COUNTRIES = {
  india: "india",
  uk: "uk",
  australia: "australia",
  brazil: "brazil",
  china: "china",
  egypt: "egypt",
  france: "france",
  germany: "germany",
  japan: "japan",
  spain: "spain",
  usa: "usa",
  uae: "uae",
} as const;

export type CountriesType = (typeof COUNTRIES)[keyof typeof COUNTRIES];

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

  useEffect(() => {
    const currentValue = getValues(name);
    if (!currentValue) {
      setValue(name, `${PHONE_COUNTRIES[0].code} `, { shouldValidate: false });
    }
  }, [name, getValues, setValue]);

  const validatePhone = (fullValue: string): true | string => {
    if (!fullValue?.trim()) {
      return required ? `${label || name} is required` : true;
    }

    const parts = fullValue.trim().split(" ");
    if (parts.length < 2) {
      return "Please enter a valid mobile number";
    }

    const countryCode = parts[0];
    const phoneNumber = parts.slice(1).join("").trim();

    const selectedCountry = PHONE_COUNTRIES.find((c) => c.code === countryCode);
    if (!selectedCountry) {
      return "Invalid country code";
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return "Mobile number must contain only digits (0-9)";
    }

    const { validationKey } = selectedCountry;

    if (validationKey === COUNTRIES.india) {
      if (phoneNumber.length !== 10) {
        return "India mobile number must be exactly 10 digits long";
      }
      if (!/^[6-9]/.test(phoneNumber)) {
        return "India mobile numbers must start with 6, 7, 8, or 9";
      }
    } else if (validationKey === COUNTRIES.uk) {
      if (phoneNumber.length !== 10) {
        return "UK mobile number must be exactly 10 digits long";
      }
      if (!/^[789]/.test(phoneNumber)) {
        return "UK mobile numbers must start with 7, 8, or 9";
      }
    } else if (validationKey === COUNTRIES.australia) {
      if (phoneNumber.length !== 9) {
        return "Australia mobile number must be exactly 9 digits long";
      }
    } else if (validationKey === COUNTRIES.brazil) {
      if (phoneNumber.length !== 11) {
        return "Brazil mobile number must be exactly 11 digits long";
      }
    } else if (validationKey === COUNTRIES.china) {
      if (phoneNumber.length !== 11) {
        return "China mobile number must be exactly 11 digits long";
      }
    } else if (validationKey === COUNTRIES.egypt) {
      if (phoneNumber.length !== 10) {
        return "Egypt mobile number must be exactly 10 digits long";
      }
    } else if (validationKey === COUNTRIES.france) {
      if (phoneNumber.length !== 9) {
        return "France mobile number must be exactly 9 digits long";
      }
      if (!/^[67]/.test(phoneNumber)) {
        return "France mobile numbers must start with 6 or 7";
      }
    } else if (validationKey === COUNTRIES.germany) {
      if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        return "Germany mobile number must be 10 to 11 digits long";
      }
    } else if (validationKey === COUNTRIES.japan) {
      if (phoneNumber.length !== 10) {
        return "Japan mobile number must be exactly 10 digits long";
      }
    } else if (validationKey === COUNTRIES.spain) {
      if (phoneNumber.length !== 9) {
        return "Spain mobile number must be exactly 9 digits long";
      }
    } else if (validationKey === COUNTRIES.usa) {
      if (phoneNumber.length !== 10) {
        return "United States mobile number must be exactly 10 digits long";
      }
    } else if (validationKey === COUNTRIES.uae) {
      if (phoneNumber.length !== 9) {
        return "UAE mobile number must be exactly 9 digits long";
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
        <label className="block mb-1 text-md font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          const [countryCode = PHONE_COUNTRIES[0].code, ...rest] = (
            field.value || ""
          ).split(" ");
          const numberValue = rest.join(" ");

          const selectedCountry = PHONE_COUNTRIES.find(
            (c) => c.code === countryCode
          );

          let maxLength = 20;

          if (selectedCountry) {
            if (
              selectedCountry.validationKey === COUNTRIES.india ||
              selectedCountry.validationKey === COUNTRIES.uk ||
              selectedCountry.validationKey === COUNTRIES.japan ||
              selectedCountry.validationKey === COUNTRIES.egypt ||
              selectedCountry.validationKey === COUNTRIES.usa
            ) {
              maxLength = 10;
            } else if (
              selectedCountry.validationKey === COUNTRIES.australia ||
              selectedCountry.validationKey === COUNTRIES.uae ||
              selectedCountry.validationKey === COUNTRIES.spain ||
              selectedCountry.validationKey === COUNTRIES.france
            ) {
              maxLength = 9;
            } else if (
              selectedCountry.validationKey === COUNTRIES.brazil ||
              selectedCountry.validationKey === COUNTRIES.china
            ) {
              maxLength = 11;
            } else if (selectedCountry.validationKey === COUNTRIES.germany) {
              maxLength = 11;
            }
          }

          return (
            <>
              <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600">
                <CountrySelect
                  countries={PHONE_COUNTRIES}
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
                    if (/^\d*$/.test(newValue) && newValue.length <= maxLength) {
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
