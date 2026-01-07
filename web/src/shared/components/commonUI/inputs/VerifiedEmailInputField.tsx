import { useState, useMemo, useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { MdOutlineMailOutline, MdCheckCircle } from "react-icons/md";
import Popup from "../../Popup";
import OTPPage from "@/shared/components/commonUI/inputs/OTPModal";
import { validateEmail } from "@/shared/components/commonUI/emailValidation";
import type { VerifiedEmailInputFieldProps } from "./type";

/**
 * A reusable and self-contained input field for email addresses that require OTP verification.
 *
 * This component integrates with `react-hook-form` and manages its own verification flow,
 * including displaying an OTP modal and updating its verified status. It can be used in
 * either a controlled manner (by passing `verified` and `setVerified` props) or an
 * uncontrolled manner (managing its own internal state).
 *
 * @param {VerifiedEmailInputFieldProps} props - The props for the component.
 * @param {string} props.name - The name of the field for `react-hook-form`.
 * @param {string} [props.label="Email ID"] - The text label for the input field.
 * @param {string} [props.placeholder] - The placeholder text for the input.
 * @param {boolean} [props.required=false] - Whether the field is mandatory.
 * @param {boolean} [props.disabled=false] - Disables the input field externally.
 * @param {string} [props.inputClassName] - Custom CSS classes to apply to the input element.
 * @param {() => void} [props.onVerifySuccess] - A callback function executed upon successful OTP verification.
 * @param {boolean} [props.verified] - A boolean to control the verified state from a parent component.
 * @param {(isVerified: boolean) => void} [props.setVerified] - A function to update the verified state in the parent component.
 */
export const VerifiedEmailInputField = ({
  name,
  label = "Email ID",
  isShowLabel = true,
  placeholder,
  required = false,
  disabled: externalDisabled = false,
  inputClassName = "w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
  onVerifySuccess,
  verified: parentVerified,
  setVerified: parentSetVerified,
}: VerifiedEmailInputFieldProps) => {
  const { control, watch, clearErrors, setValue, trigger } = useFormContext();
  const [showOTP, setShowOTP] = useState(false);
  const [localVerified, setLocalVerified] = useState(false);

  const verified = typeof parentVerified === "boolean" ? parentVerified : localVerified;
  const setVerified = parentSetVerified || setLocalVerified;

  const verifiedRef = useRef(verified);
  useEffect(() => {
    verifiedRef.current = verified;
  }, [verified]);

  const isInputDisabled = verified || externalDisabled;
  const emailValue = watch(name);

  const isValidEmail = useMemo(() => {
    if (!emailValue || verified) return false;
    return validateEmail(emailValue) === true;
  }, [emailValue, verified]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (verified) {
      setVerified(false);
      clearErrors(name);
    }
    return newValue;
  };

  const getInputClassName = () => {
    let baseClasses = inputClassName;

    if (isInputDisabled) {
      baseClasses = baseClasses
        .replace(/bg-white/g, 'bg-gray-100')
        .replace(/dark:bg-gray-800/g, 'dark:bg-gray-700')
        .replace(/text-gray-900/g, 'text-gray-500')
        .replace(/dark:text-gray-100/g, 'dark:text-gray-400');
    }

    baseClasses = `${baseClasses} pl-10 ${verified ? "pr-10" : ""}`;

    if (isInputDisabled) {
      baseClasses += " cursor-not-allowed border-gray-300 dark:border-gray-600";
    }

    return baseClasses;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col py-1">
        {isShowLabel && (
          <label className="block mb-1 text-md font-semibold text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}

        <Controller
          name={name}
          control={control}
          rules={{
            validate: (value: string) => {
              const trimmed = value?.trim();
              if (!trimmed) {
                return required ? `${label} is required` : true;
              }

              const emailValid = validateEmail(trimmed);
              if (emailValid !== true) return emailValid;

              // ✅ Use verifiedRef to ensure we have the latest state
              if (!verifiedRef.current) return "Please verify your email address";

              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <MdOutlineMailOutline className="text-lg" />
                  </div>
                  <input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const newValue = handleEmailChange(e);
                      field.onChange(newValue);
                    }}
                    type="email"
                    placeholder={placeholder || "Enter your email"}
                    disabled={isInputDisabled}
                    className={getInputClassName()}
                  />

                  {verified && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                      <MdCheckCircle className="text-green-500 text-lg" />
                    </div>
                  )}
                </div>

                {!verified && (
                  <Button
                    type="button"
                    className="h-11 min-w-[104px] px-5 rounded-lg bg-gradient-to-r from-teal-700 to-teal-900 text-white text-base font-semibold flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-200 disabled:cursor-not-allowed"
                    disabled={!isValidEmail}
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
          )}
        />
      </div>

      <Popup open={showOTP} onClose={() => setShowOTP(false)}>
        <OTPPage
          header="Verify Email"
          description="A verification OTP has been sent to your email. Please check your inbox."
          name="emailOTP"
          onClose={() => setShowOTP(false)}
          onVerifySuccess={() => {
            setVerified(true);
            onVerifySuccess?.();

            // Re-validate the email field via react-hook-form using the updated verified state
            const currentValue = watch(name);
            setValue(name, currentValue, { shouldValidate: true });
            setValue("emailOTP", ""); // Clear the OTP field
            clearErrors(name);
            trigger(name);
            setShowOTP(false);
          }}
        />
      </Popup>
    </div>
  );
};

export default VerifiedEmailInputField;
