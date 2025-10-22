import { Button } from "@/shared/components/commonUI/Buttons";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import type { VerifyEmailModalProps } from "./type";

/**
 * A modal component for entering and verifying a One-Time Password (OTP).
 *
 * This component provides a user interface for OTP input, including a countdown
 * timer for resending the code and a submit button. It integrates with
 * `react-hook-form` for validation and is designed to be used within a `Popup`.
 *
 * @param {VerifyEmailModalProps} props - The props for the component.
 * @param {string} props.header - The main title of the modal.
 * @param {string} props.description - A descriptive text shown below the header.
 * @param {() => void} props.onClose - Callback function to close the modal.
 * @param {() => void} [props.onVerifySuccess] - Callback executed on successful OTP validation.
 * @param {string} [props.buttonText="Submit"] - The text for the submit button.
 * @param {boolean} [props.isSuccess] - If true, hides the OTP input and timer.
 * @param {string} [props.name="otp"] - The name of the OTP field in the `react-hook-form` context.
 */
const OTPModal: React.FC<VerifyEmailModalProps> = ({
  header,
  description,
  onClose,
  onVerifySuccess,
  buttonText,
  isSuccess,
  name = "otp",
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const ctx = useFormContext();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    const isValid = await ctx.trigger(name);
    if (isValid) {
      onVerifySuccess?.();
    } else {
      // Optional: focus first input or show toast
      inputRefs.current[0]?.focus();
    }
  };
  const handleResend = () => {
    setTimeLeft(60);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative gap-3">
        <IoClose
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
          <div className="p-2">
            <OTPInput name="otp" length={4} errorAlign="center" />
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 p-5">
              <span>
                {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
              </span>
              <button
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={`text-green-600 dark:text-green-400 font-medium ${
                  timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Resend
              </button>
            </div>
          </div>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {buttonText || "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default OTPModal;
