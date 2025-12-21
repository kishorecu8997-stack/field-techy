import { icons } from "@/config/icons";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useVerifyEmailOTP, useVerifyPhoneOTP } from "@/shared/apiServices/engineer/engineerService";

interface EngineerOTPPageProps {
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
 * Engineer-specific OTP verification component with API integration.
 * 
 * This component handles OTP verification for both email and phone, making
 * actual API calls to verify the entered OTP code. It manages its own form
 * state, countdown timer, and loading/error states.
 * 
 * @param {EngineerOTPPageProps} props - Component props
 * @param {string} [props.header] - Modal title
 * @param {string} [props.description] - Description text
 * @param {() => void} [props.onClose] - Close modal callback
 * @param {() => void} [props.handleNavigate] - Success navigation callback
 * @param {string} [props.buttonText="Submit"] - Submit button text
 * @param {"email" | "phone"} props.verificationType - Type of verification
 * @param {string} props.contact - Email address or phone number to verify
 * @param {() => void} [props.onResendOTP] - Optional resend OTP callback
 */
const EngineerOTPPage: React.FC<EngineerOTPPageProps> = ({
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
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const method = useForm<OTPValues>({
        defaultValues: {
            otp: "",
        },
    });

    // Select appropriate verification hook based on type
    const { mutate: verifyEmailOTP, isPending: isVerifyingEmail } = useVerifyEmailOTP({
        onSuccess: (data) => {
            console.log("Email OTP verified:", data);
            handleNavigate?.();
        },
        onError: (error) => {
            console.error("Email OTP verification failed:", error);
            method.setError("otp", {
                type: "manual",
                message: error.message || "Invalid OTP. Please try again."
            });
        },
    });

    const { mutate: verifyPhoneOTP, isPending: isVerifyingPhone } = useVerifyPhoneOTP({
        onSuccess: (data) => {
            console.log("Phone OTP verified:", data);
            handleNavigate?.();
        },
        onError: (error) => {
            console.error("Phone OTP verification failed:", error);
            method.setError("otp", {
                type: "manual",
                message: error.message || "Invalid OTP. Please try again."
            });
        },
    });

    const isPending = isVerifyingEmail || isVerifyingPhone;

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleSubmit = (data: OTPValues) => {
        if (verificationType === "email") {
            verifyEmailOTP({ email: contact, otp: data.otp });
        } else {
            verifyPhoneOTP({ phoneNumber: contact, otp: data.otp });
        }
    };

    const handleResend = () => {
        setTimeLeft(60);
        method.reset();
        inputRefs.current[0]?.focus();
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
                    <icons.closeFilled
                        className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-7 w-7 cursor-pointer"
                        onClick={onClose}
                    />
                    <div className="p-2 flex flex-col gap-2 items-center justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{header}</h2>
                        <p className="text-md text-center text-gray-600 dark:text-gray-300 mb-6 px-3">{description}</p>
                    </div>
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

export default EngineerOTPPage;
