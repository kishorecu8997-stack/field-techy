// src/shared/components/commonUI/inputs/VerifiedPhoneInputField.tsx

import { useState, useEffect, useRef } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MdCheckCircle } from "react-icons/md";
import Popup from "../../Popup";
import OTPModal from "@/shared/components/commonUI/inputs/OTPModal";
import { CountrySelect } from "./CountrySelect";
import type { VerifiedPhoneInputFieldProps } from "./type";
import { PHONE_COUNTRIES } from "@/dummy_data/phoneInput";


/**
 * A composite input field for entering and verifying a mobile phone number with an OTP.
 *
 * This component combines a country code selector with a phone number input. It integrates
 * with `react-hook-form` for validation and state management. It handles its own
 * verification flow by displaying an OTP modal and can operate in both controlled
 * (via `verified` and `setVerified` props) and uncontrolled modes.
 *
 * @param {VerifiedPhoneInputFieldProps} props - The props for the component.
 * @param {string} props.name - The name of the field for `react-hook-form`.
 * @param {string} [props.label="Mobile Number"] - The text label for the input field.
 * @param {boolean} [props.isShowLabel=false] - Toggles the visibility of the label.
 * @param {string} [props.placeholder="Enter mobile number"] - The placeholder text for the input.
 * @param {boolean} [props.required=false] - Whether the field is mandatory.
 * @param {boolean} [props.disabled=false] - Disables the input field externally.
 * @param {string} [props.inputClassName] - Custom CSS classes for the input element.
 * @param {() => void} [props.onVerifySuccess] - Callback executed on successful OTP verification.
 * @param {boolean} [props.verified] - A boolean to control the verified state from a parent component.
 * @param {(isVerified: boolean) => void} [props.setVerified] - A function to update the verified state in the parent.
 */
export const VerifiedPhoneInputField = ({
  name,
  label = "Mobile Number",
  isShowLabel = false,
  placeholder = "Enter mobile number",
  required = false,
  disabled: externalDisabled = false,
  inputClassName,
  onVerifySuccess,
  verified: parentVerified,
  setVerified: parentSetVerified,
}: VerifiedPhoneInputFieldProps) => {
  const { control, getValues, setValue, clearErrors, watch, trigger } = useFormContext();
  const [showOTP, setShowOTP] = useState(false);
  const [localVerified, setLocalVerified] = useState(false);

  const verified = typeof parentVerified === "boolean" ? parentVerified : localVerified;
  const setVerified = parentSetVerified || setLocalVerified;

  const verifiedRef = useRef(verified);
  useEffect(() => {
    verifiedRef.current = verified;
  }, [verified]);

  const isInputDisabled = verified || externalDisabled;
  const phoneValue = watch(name);

  useEffect(() => {
    const currentValue = getValues(name);
    if (!currentValue) {
      setValue(name, `${PHONE_COUNTRIES[0].code} `, { shouldValidate: false });
    }
  }, [name, getValues, setValue]);

  // ✅ Full validation (used by RHF)
  const validatePhone = (fullValue: string): true | string => {
    if (!fullValue?.trim()) {
      return required ? `${label} is required` : true;
    }

    const parts = fullValue.trim().split(" ");
    if (parts.length < 2) {
      return "Please enter a valid phone number";
    }

    const countryCode = parts[0];
    const phoneNumber = parts.slice(1).join("").trim();

    const selectedCountry = PHONE_COUNTRIES.find((c) => c.code === countryCode);
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

  // ✅ Simplified check for "Verify" button by reusing the main validator.
  const canVerify = !verified && validatePhone(phoneValue) === true;

  // ✅ Unified validation with verification enforcement
  const validationRules: RegisterOptions = {
    validate: (value: string) => {
      if (required && (!value || !value.trim())) {
        return `${label} is required`;
      }
      if (!value || !value.trim()) {
        return true;
      }

      const formatValid = validatePhone(value);
      if (formatValid !== true) {
        return formatValid;
      }

      if (!verifiedRef.current) {
        return "Please verify your mobile number";
      }

      return true;
    },
  };

  const getInputClassName = () => {
    const baseClasses = `flex-1 px-5 py-3 text-base placeholder-gray-400 dark:placeholder-gray-500 outline-none ${
      inputClassName || ""
    } ${verified ? "pr-10" : ""}`;
    if (isInputDisabled) {
      return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed rounded-md`;
    }
    return `${baseClasses} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col py-1">
        {isShowLabel && (
          <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field, fieldState: { error } }) => {
            const [countryCode = PHONE_COUNTRIES[0].code, ...rest] = (field.value || "").split(" ");
            const numberValue = rest.join(" ");

            return (
              <>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex flex-1 min-w-0">
                    <div className="relative w-full">
                      <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-600">
                        <div className="shrink-0">
                          <CountrySelect
                            countries={PHONE_COUNTRIES}
                            value={countryCode}
                            onChange={(newCode) => {
                              if (!isInputDisabled) {
                                field.onChange(`${newCode} ${numberValue}`);
                                clearErrors(name);
                                setVerified(false);
                              }
                            }}
                            disabled={isInputDisabled}
                          />
                        </div>
                        <input
                          type="tel"
                          value={numberValue}
                          disabled={isInputDisabled}
                          onChange={(e) => {
                            const inputVal = e.target.value;
                            if (/^\d*$/.test(inputVal)) {
                              field.onChange(`${countryCode} ${inputVal}`);
                              if (verified) setVerified(false);
                            }
                          }}
                          onBlur={() => {
                            field.onChange(`${countryCode} ${numberValue.trim()}`);
                          }}
                          placeholder={placeholder}
                          className={getInputClassName()}
                          style={{ minWidth: 0 }}
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
                      className="h-[44px] min-w-[104px] px-5 rounded-lg bg-gradient-to-r from-teal-700 to-teal-900 text-white text-base font-semibold flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-200 disabled:cursor-not-allowed whitespace-nowrap"
                      disabled={!canVerify}
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
        <OTPModal
          header="Verify Mobile Number"
          description="A verification OTP has been sent to your mobile. Please check your mobile."
          name="mobileOTP"
          onClose={() => setShowOTP(false)}
          onVerifySuccess={() => {
            setVerified(true);
            onVerifySuccess?.();
            // ✅ CRITICAL: Re-validate to clear "Please verify..." error
            setValue("mobileOTP", ""); // Clear the OTP field
            trigger(name);
            setShowOTP(false);
          }}
        />
      </Popup>
    </div>
  );
};

export default VerifiedPhoneInputField;
