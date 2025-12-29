import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import {
  useSendEmailOTP,
  useSendPhoneOTP,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
} from "@/shared/apiServices/engineer/engineerService";

import { Button } from "@/shared/components/commonUI/Buttons";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import { absoluteUrls } from "@/config/urls";
import { buildQuery } from "@/utils";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";

interface VerificationCardProps {
  type: "email" | "phone";
  contact: string;
  isVerified: boolean;
  onVerifySuccess: () => void;
}

const VerificationCard = ({
  type,
  contact,
  isVerified,
  onVerifySuccess,
}: VerificationCardProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Start with 0 to allow immediate send if needed
  const [isOtpSent, setIsOtpSent] = useState(false);

  const methods = useForm({
    defaultValues: { otp: "" },
    mode: "onChange",
  });

  const { isPending: isSendingEmail, mutate: sendEmail } = useSendEmailOTP({
    onSuccess: () => {
      toast.success("OTP sent to email");
      setIsOtpSent(true);
      setTimeLeft(60);
    },
    onError: () => toast.error("Failed to send email OTP"),
  });

  const { isPending: isSendingPhone, mutate: sendPhone } = useSendPhoneOTP({
    onSuccess: () => {
      toast.success("OTP sent to mobile");
      setIsOtpSent(true);
      setTimeLeft(60);
    },
    onError: () => toast.error("Failed to send mobile OTP"),
  });

  const { isPending: isVerifyingEmail, mutate: verifyEmail } =
    useVerifyEmailOTP({
      onSuccess: () => {
        toast.success("Email verified successfully");
        onVerifySuccess();
      },
      onError: () => toast.error("Invalid Email OTP"),
    });

  const { isPending: isVerifyingPhone, mutate: verifyPhone } =
    useVerifyPhoneOTP({
      onSuccess: () => {
        toast.success("Mobile number verified successfully");
        onVerifySuccess();
      },
      onError: () => toast.error("Invalid Mobile OTP"),
    });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSendOtp = () => {
    if (type === "email") sendEmail(contact);
    else sendPhone(contact);
  };

  const onSubmit = (data: { otp: string }) => {
    if (type === "email") verifyEmail({ email: contact, otp: data.otp });
    else verifyPhone({ phoneNumber: contact, otp: data.otp });
  };

  const isPending =
    isSendingEmail || isSendingPhone || isVerifyingEmail || isVerifyingPhone;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative gap-3 border border-gray-100 dark:border-gray-700">
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {type === "email" ? "Email Verification" : "Mobile Verification"}
        </h2>
        <p className="text-md text-center text-gray-600 dark:text-gray-300 mb-2 px-3">
          {isVerified
            ? `Your ${type} is verified.`
            : `Verify your ${type} to continue.`}
        </p>
        <p className="text-sm font-medium text-gray-500">{contact}</p>
      </div>

      {isVerified ? (
        <div className="flex justify-center p-4">
          <span className="text-green-500 font-bold text-lg">✓ Verified</span>
        </div>
      ) : (
        <FormContainer methods={methods} onSubmit={onSubmit} className="w-full">
          <div className="p-2">
            {!isOtpSent ? (
              <Button
                onClick={handleSendOtp}
                type="button"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white"
              >
                {isPending ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <>
                <OTPInput name="otp" length={6} errorAlign="center" />

                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 p-5 px-1">
                  <span>
                    {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
                  </span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={timeLeft > 0 || isPending}
                    className={`text-green-600 dark:text-green-400 font-medium ${
                      timeLeft > 0 || isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Resend
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {isPending ? "Verifying..." : "Verify"}
                </Button>
              </>
            )}
          </div>
        </FormContainer>
      )}
    </div>
  );
};

const ContactVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const engineerId = searchParams.get("id");

  const {
    email,
    phone,
    setEngineerId,
    setSignupData,
    emailVerified: storeEmailVerified,
    mobileVerified: storePhoneVerified,
  } = useEngineerRegistrationStore();

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Sync with store
  useEffect(() => {
    if (storeEmailVerified) setIsEmailVerified(true);
    if (storePhoneVerified) setIsPhoneVerified(true);
    if (engineerId) setEngineerId(engineerId);
  }, [storeEmailVerified, storePhoneVerified, engineerId, setEngineerId]);

  const handleContinue = () => {
    // Navigate to Documents
    const param = buildQuery({ id: engineerId || "" });
    navigate(`${absoluteUrls.engineer.auth.updated_documents}?${param}`);

    // Note: Use toast if strict verification is required but optional here allows proceeding?
    // Client flow requires both. Engineer flow requested "verify email and mobile" so logic stands.
    if (!isEmailVerified && !isPhoneVerified) {
      toast.warning("Please verify your contact details.");
      // Allow continue? "verify... to continue" in UI suggests required.
      // Client side required both. I'll require both to match strict client flow.
      return;
    }
    // Check strictness:
    if (!isEmailVerified || !isPhoneVerified) {
      toast.error("Please verify both email and mobile number.");
      return;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="shrink-0 p-4 flex flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verification
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Please verify your contact details to proceed.
        </p>
      </div>

      <div className="flex-1 overflow-auto mx-auto w-full flex flex-col items-center gap-6 py-6 px-4">
        <div className="w-full md:w-1/2">
          <VerificationCard
            type="email"
            contact={email || ""}
            isVerified={isEmailVerified}
            onVerifySuccess={() => {
              setIsEmailVerified(true);
              setSignupData({ emailVerified: true });
            }}
          />
        </div>

        <div className="w-full md:w-1/2">
          <VerificationCard
            type="phone"
            contact={phone || ""}
            isVerified={isPhoneVerified}
            onVerifySuccess={() => {
              setIsPhoneVerified(true);
              setSignupData({ mobileVerified: true });
            }}
          />
        </div>
      </div>

      <div className="shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-20">
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r mb-8 from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            disabled={!isEmailVerified || !isPhoneVerified}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactVerification;
