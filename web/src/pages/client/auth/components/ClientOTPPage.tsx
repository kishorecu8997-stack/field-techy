import { icons } from "@/config/icons";
import { useVerifyOtp } from "@/shared/apiServices/commonOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import type { AppVerifyOtpData } from "@/api";
import type { OTPValues } from "@/shared/components/commonUI/inputs/types";

export type { OTPValues } from "@/shared/components/commonUI/inputs/types";

interface ClientOTPPageProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  handleNavigate?: (otp?: string) => void;
  buttonText?: string;
  verificationType: "email" | "phone";
  contact: string; // email or phone number
  onResendOTP?: () => void;
}

/**
 * ClientOTPPage
 *
 * A compact OTP verification component for client authentication flows.
 * Supports email and phone verification, handles 6‑digit OTP input, countdown
 * timer, resend functionality, and performs OTP validation using `useVerifyOtp`.
 * Manages form state with react-hook-form and provides masked contact info,
 * error handling, and loading states.
 *
 * @param {ClientOTPPageProps} props - Component properties.
 * @param {string} [props.header] - Title text displayed at the top.
 * @param {string} [props.description] - Description shown under the title.
 * @param {() => void} [props.onClose] - Triggered when closing the modal.
 * @param {(otp?: string) => void} [props.handleNavigate] - Called on successful OTP verification.
 * @param {string} [props.buttonText] - Custom text for the submit button.
 * @param {"email" | "phone"} props.verificationType - Determines OTP type.
 * @param {string} props.contact - Email or phone number receiving the OTP.
 * @param {() => void} [props.onResendOTP] - Fired when requesting a new OTP.
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
      await verifyOTP({
        body: {
          type: verificationType,
          code: data.otp,
        } as AppVerifyOtpData["body"] & {
          email?: string;
          phone?: string;
          otp: string;
        },
        headers: { authorization: "" },
      });
      handleNavigate?.(data.otp);
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
              {contact && (
                <span className="block mt-2 font-medium text-teal-700 dark:text-teal-400">
                  {verificationType === "email"
                    ? contact.split("@")[0].slice(0, 2) +
                      "***@" +
                      contact.split("@")[1]
                    : "***" + contact.slice(-4)}
                </span>
              )}
            </p>
          </div>
          <div className="p-2">
            <OTPInput name="otp" length={6} errorAlign="center" />
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 p-5">
              <span>
                {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
              </span>
              <Button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                className="text-green-600 dark:text-green-400 font-medium bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer disabled:opacity-50"
              >
                Resend
              </Button>
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
