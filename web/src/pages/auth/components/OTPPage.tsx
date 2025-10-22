import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";

interface VerifyEmailModalProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  handleNavigate?: () => void;
  buttonText?: string;
  isSuccess?: boolean;
}

export interface OTPValues {
  otp: string;
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
 * @param {VerifyEmailModalProps} props - The props for the component.
 * @param {string} [props.header] - The main title displayed in the modal.
 * @param {string} [props.description] - A descriptive text shown below the header.
 * @param {() => void} [props.onClose] - Callback function to close the modal.
 * @param {() => void} [props.handleNavigate] - Callback executed on successful OTP submission to proceed.
 * @param {string} [props.buttonText="Submit"] - The text for the submit button.
 * @param {boolean} [props.isSuccess] - If true, hides the OTP input and timer.
 */
const OTPPage: React.FC<VerifyEmailModalProps> = ({
  header,
  description,
  onClose,
  handleNavigate,
  buttonText,
  isSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const method = useForm({
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = () => {
    handleNavigate?.();
  };

  const handleResend = () => {
    setTimeLeft(60);
    inputRefs.current[0].focus();
  };

  return (
    <div className="flex items-center justify-center">
      <FormContainer
        methods={method}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative gap-3">
          <IoClose
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-7 w-7 cursor-pointer"
            onClick={onClose}
          />
          <div className="p-2 flex flex-col gap-2 items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{header}</h2>
            <p className="text-md text-center text-gray-600 dark:text-gray-300 mb-6 px-3">{description}</p>
          </div>
          {!isSuccess && (
            <div className="p-2">
              <OTPInput
                name="otp"
                length={4}
                errorAlign="center"
              />
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