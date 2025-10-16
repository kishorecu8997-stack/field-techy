// src/shared/components/commonUI/inputs/VerifiedPhoneInputField.tsx

import { useState, useEffect } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { CountrySelect } from "./CountrySelect";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MdCheckCircle } from "react-icons/md";
import Popup from "../../Popup";
import OTPPage from "@/pages/auth/components/OTPModal";
import type { VerifiedPhoneInputFieldProps } from "./type";

interface Country {
  code: string;
  name: string;
  flag: string;
  validationKey: "india" | "uk";
}

export const VerifiedPhoneInputField = ({
  name,
  label = "Mobile Number",
  placeholder = "Enter mobile number",
  required = false,
  rules,
  disabled: externalDisabled = false,
  inputClassName,
  onVerifySuccess,
  verified: parentVerified,
  setVerified: parentSetVerified,
}: VerifiedPhoneInputFieldProps) => {
  const { control, getValues, setValue, clearErrors, watch } = useFormContext();
  const [showOTP, setShowOTP] = useState(false);
  const [localVerified, setLocalVerified] = useState(false);

  const verified = typeof parentVerified === "boolean" ? parentVerified : localVerified;
  const setVerified = parentSetVerified || setLocalVerified;

  // Visual & functional disabled state
  const isInputDisabled = verified || externalDisabled;

  const phoneValue = watch(name);

  const countries: Country[] = [
    {
      code: "+91",
      name: "India",
      flag: "https://flagcdn.com/w40/in.png",
      validationKey: "india",
    },
    {
      code: "+44",
      name: "UK",
      flag: "https://flagcdn.com/w40/gb.png",
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
      if (phoneNumber.length !== 10) {
        return "UK phone number must be exactly 10 digits long";
      }
      if (!/^[789]/.test(phoneNumber)) {
        return "UK mobile numbers must start with 7, 8, or 9";
      }
    }

    return true;
  };

  const isValidPhone = (() => {
    if (!phoneValue || verified) return false;

    let validationKey = "india";
    let countryCode = "+91";
    for (const c of countries) {
      if (phoneValue.startsWith(c.code)) {
        validationKey = c.validationKey;
        countryCode = c.code;
        break;
      }
    }

    const number = phoneValue.replace(countryCode, "").replace(/\s/g, "");
    if (!/^\d+$/.test(number)) return false;

    if (validationKey === "india") {
      if (number.length !== 10) return false;
      if (!/^[6-9]/.test(number)) return false;
    }
    if (validationKey === "uk") {
      if (number.length !== 10) return false;
      if (!/^[789]/.test(number)) return false;
    }
    return true;
  })();

  const validationRules: RegisterOptions = {
    required: required ? `${label} is required` : false,
    validate: validatePhone,
    ...rules,
  };

  const getInputClassName = () => {
    const baseClasses = `flex-1 px-5 py-3 text-base placeholder-gray-400 dark:placeholder-gray-500 outline-none ${
      inputClassName || ""
    } ${verified ? "pr-10" : ""}`;
    if (isInputDisabled) {
      return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed`;
    }
    return `${baseClasses} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`;
  };

  return (
    <div className="w-full">
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
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      {/* Unified border container */}
                      <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600">
                        <CountrySelect
                          countries={countries}
                          value={countryCode}
                          onChange={(newCode) => {
                            if (!isInputDisabled) {
                              field.onChange(`${newCode} ${numberValue}`);
                              clearErrors(name);
                            }
                          }}
                          disabled={isInputDisabled}
                        />
                        <input
                          type="tel"
                          value={numberValue}
                          disabled={isInputDisabled}
                          onChange={(e) => {
                            if (!isInputDisabled && /^\d*$/.test(e.target.value)) {
                              field.onChange(`${countryCode} ${e.target.value}`);
                            }
                          }}
                          onBlur={(e) => {
                            const trimmed = e.target.value.trim();
                            field.onChange(`${countryCode} ${trimmed}`);
                          }}
                          placeholder={placeholder}
                          className={getInputClassName()}
                        />
                      </div>

                      {verified && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                          <MdCheckCircle className="text-green-500 text-lg" />
                        </div>
                      )}
                    </div>
                  </div>

                  {!verified && (
                    <Button
                      type="button"
                      className="h-[44px] min-w-[104px] px-5 rounded-lg bg-gradient-to-r from-teal-700 to-teal-900 text-white text-base font-semibold flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-200 disabled:cursor-not-allowed"
                      disabled={!isValidPhone}
                      onClick={() => setShowOTP(true)}
                    >
                      Verify
                    </Button>
                  )}
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

      <Popup open={showOTP} onClose={() => setShowOTP(false)}>
        <OTPPage
          header="Verify Mobile Number"
          description="A verification OTP has been sent to your mobile. Please check your mobile."
          onClose={() => setShowOTP(false)}
          onVerifySuccess={() => {
            setVerified(true);
            onVerifySuccess?.();
            setShowOTP(false);
          }}
        />
      </Popup>
    </div>
  );
};

export default VerifiedPhoneInputField;