import { icons } from "@/config/icons";
import {
  useVerifyOtp,
} from "@/shared/apiServices/commonOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import type { AppVerifyOtpData } from "@/api";

interface ClientOTPPageProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  handleNavigate?: () => void;
  buttonText?: string;
  verificationType: "email" | "phone";
  contact: string; // email or phone number
  onResendOTP?: () => void;
}

export interface OTPValues {
  otp: string;
}

/**
 * Client-specific OTP verification component with API integration.
 *
 * This component handles OTP verification for both email and phone, making
 * actual API calls to verify the entered OTP code. It manages its own form
 * state, countdown timer, and loading/error states.
 *
 * @param {ClientOTPPageProps} props - Component props
 * @param {string} [props.header] - Modal title
 * @param {string} [props.description] - Description text
 * @param {() => void} [props.onClose] - Close modal callback
 * @param {() => void} [props.handleNavigate] - Success navigation callback
 * @param {string} [props.buttonText="Submit"] - Submit button text
 * @param {"email" | "phone"} props.verificationType - Type of verification
 * @param {string} props.contact - Email address or phone number to verify
 * @param {() => void} [props.onResendOTP] - Optional resend OTP callback
 */
const ClientOTPPage: React.FC<ClientOTPPageProps> = ({
  header,
  description,
  onClose,
  handleNavigate,
  buttonText,
  verificationType,
  contact,
  onResendOTP,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const method = useForm<OTPValues>({
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });

  const { mutateAsync: verifyOTP, isPending } = useVerifyOtp();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async (data: OTPValues) => {
    try {
      const body = verificationType === "email"
        ? { type: "email" as const, email: contact, otp: data.otp }
        : { type: "phone" as const, phone: contact, otp: data.otp };

      await verifyOTP({
        body: body as AppVerifyOtpData["body"] & { email?: string; phone?: string; otp: string },
        headers: { authorization: "" },
      });
      handleNavigate?.();
    } catch (error: unknown) {
      method.setError("otp", {
        type: "manual",
        message: GlobalApiErrorHandler.handle(error).message,
      });
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    method.reset();
    onResendOTP?.();
  };

  return (
    <div className="flex items-center justify-center">
      <FormContainer
        methods={method}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative gap-3">
          <Button
            type="button"
            variant="no_style"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400
             hover:text-gray-700 dark:hover:text-gray-300
             focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            <icons.closeFilled className="h-7 w-7" aria-hidden="true" />
          </Button>
          <div className="p-2 flex flex-col gap-2 items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {header}
            </h2>
            <p className="text-md text-center text-gray-600 dark:text-gray-300 mb-6 px-3">
              {description}
            </p>
          </div>
          <div className="p-2">
            <OTPInput name="otp" length={6} errorAlign="center" />
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 p-5">
              <span>
                {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={`text-green-600 dark:text-green-400 font-medium ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Resend
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isPending ? "Verifying..." : buttonText || "Submit"}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default ClientOTPPage;
