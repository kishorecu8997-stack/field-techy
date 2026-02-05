import { useSendEmailOTP } from "@/shared/apiServices/engineer/engineerService";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmail } from "@/shared/components/commonUI/emailValidation";
import type { VerifiedEmailInputFieldProps } from "@/shared/components/commonUI/inputs/type";
import { useMemo, useState, useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MdCheckCircle, MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";

/**
 * Password OTP Verification component
 * here we are using react-hook-form to validate the email
 * @returns JSX.Element
 */
export const PasswordOTPVerification = ({
  name,
  label = "Email ID",
  isShowLabel = true,
  placeholder,
  required = false,
  disabled: externalDisabled = false,
  inputClassName = "w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
  verified: parentVerified,
  setVerified: parentSetVerified,
}: VerifiedEmailInputFieldProps) => {
  const { trigger, control, watch, clearErrors, setError } = useFormContext();
  const [localVerified, setLocalVerified] = useState(false);

  const verified =
    typeof parentVerified === "boolean" ? parentVerified : localVerified;
  const setVerified = parentSetVerified || setLocalVerified;

  const verifiedRef = useRef(verified);
  useEffect(() => {
    verifiedRef.current = verified;
  }, [verified]);

  const { mutateAsync: sendEmailOTP, isPending: isSendingOtp } =
    useSendEmailOTP();

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

  const handleRequestOTP = async () => {
    if (!isValidEmail) return;
    try {
      await sendEmailOTP(emailValue);
      toast.success("OTP sent successfully to your email.");
      clearErrors(name); // Clear any previous errors
      setVerified(true);
      trigger(name);
    } catch (error: unknown) {
      const errorObj = GlobalApiErrorHandler.handle(error);
      toast.error(errorObj.message);
      setError(name, {
        type: "manual",
        message: errorObj.message,
      });
    }
  };

  const getInputClassName = () => {
    let baseClasses = inputClassName;

    if (isInputDisabled) {
      baseClasses = baseClasses
        .replace(/bg-white/g, "bg-gray-100")
        .replace(/dark:bg-gray-800/g, "dark:bg-gray-700")
        .replace(/text-gray-900/g, "text-gray-500")
        .replace(/dark:text-gray-100/g, "dark:text-gray-400");
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

              // ✅ Use verifiedRef to ensure constant access to the latest state
              if (!verifiedRef.current)
                return "Please verify your email address";

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
                    disabled={!isValidEmail || isSendingOtp}
                    onClick={handleRequestOTP}
                  >
                    {isSendingOtp ? "Sending..." : "Verify"}
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
    </div>
  );
};

export default PasswordOTPVerification;
