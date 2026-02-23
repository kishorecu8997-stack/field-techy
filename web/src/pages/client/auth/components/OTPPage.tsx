import { icons } from "@/config/icons";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { OTPValues } from "@/shared/components/commonUI/inputs/types";

export type { OTPValues } from "@/shared/components/commonUI/inputs/types";

interface OTPPageProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  onSubmit?: (data: OTPValues) => void;
  buttonText?: string;
  isSuccess?: boolean;
  /**
   * Initial time in seconds for the countdown timer.
   * @default 60
   */
  initialTimerSeconds?: number;
  /**
   * Maximum number of resend attempts allowed.
   * @default Infinity
   */
  maxResendAttempts?: number;
  /**
   * Callback function triggered when the resend button is clicked.
   */
  onResend?: () => void;
}

/**
 * A self-contained component for OTP (One-Time Password) verification, typically used within a modal or popup.
 *
 * This component provides a complete UI for OTP entry, including input fields, a countdown
 * timer for resending the code, and a submit button. It manages its own form state using
 * `react-hook-form`.
 *
 * It is used for various verification flows, such as email/phone confirmation during sign-up,
 * password resets, or two-factor authentication at login.
 *
 * @param {OTPPageProps} props - The props for the component.
 * @param {string} [props.header] - The main title displayed in the modal.
 * @param {string} [props.description] - A descriptive text shown below the header.
 * @param {() => void} [props.onClose] - Callback function to close the modal.
 * @param {function} [props.onSubmit] - Optional handler that receives the OTP value on submission.
 * @param {string} [props.buttonText="Submit"] - The text for the submit button.
 * @param {boolean} [props.isSuccess] - If true, hides the OTP input and timer.
 * @param {number} [props.initialTimerSeconds=60] - Initial time in seconds for the countdown timer.
 * @param {number} [props.maxResendAttempts=Infinity] - Maximum number of resend attempts allowed.
 * @param {() => void} [props.onResend] - Callback function triggered when the resend button is clicked.
 */

const isUniformOtp = (value: string) => /^(\d)\1{5}$/.test(value);

const OTPPage: React.FC<OTPPageProps> = ({
  header,
  description,
  onClose,
  onSubmit,
  buttonText,
  isSuccess,
  initialTimerSeconds = 60,
  maxResendAttempts = Infinity,
  onResend,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTimerSeconds);
  const [resendCount, setResendCount] = useState<number>(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const method = useForm<OTPValues>({
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = method.watch("otp");

  useEffect(() => {
    if (!otpValue || otpValue.length < 6) return;

    if (!isUniformOtp(otpValue)) {
      method.clearErrors("otp");
    }
  }, [otpValue, method]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async (data: OTPValues) => {
    if (!data.otp || data.otp.length !== 6) {
      method.setError("otp", {
        type: "validate",
        message: "Please enter the 6-digit OTP",
      });
      return;
    }

    if (isUniformOtp(data.otp)) {
      method.setError("otp", {
        type: "validate",
        message: "OTP can't be the same number",
      });
      return;
    }
    onSubmit?.({ ...data, otp: data.otp });
  };

  const handleResend = () => {
    if (resendCount >= maxResendAttempts) return;

    onResend?.();
    setTimeLeft(initialTimerSeconds);
    setResendCount((prev) => prev + 1);

    if (inputRefs.current && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <FormContainer
        methods={method}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative gap-3">
          <icons.closeFilled
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-7 w-7 cursor-pointer"
            onClick={onClose}
          />

          <div className="p-2 flex flex-col gap-2 items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {header}
            </h2>
            <p className="text-md text-center text-gray-600 dark:text-gray-300 mb-6 px-3">
              {description}
            </p>
          </div>

          {!isSuccess && (
            <div className="p-1">
              <OTPInput name="otp" length={6} errorAlign="center" />

              <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 p-5">
                <span>
                  {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
                </span>

                <Button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0 || resendCount >= maxResendAttempts}
                  className={`text-green-600 dark:text-green-400 font-medium ${
                    timeLeft > 0 || resendCount >= maxResendAttempts
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Resend
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {buttonText || "Submit"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default OTPPage;
