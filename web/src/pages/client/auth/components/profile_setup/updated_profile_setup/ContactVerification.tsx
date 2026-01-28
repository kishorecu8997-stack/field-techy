import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import { Button } from "@/shared/components/commonUI/Buttons";
import { OTPInput } from "@/shared/components/commonUI/inputs/OTPInput";
import { absoluteUrls } from "@/config/urls";
import { buildQuery } from "@/utils";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import {
  useSendOtp,
  useVerifyOtp,
} from "@/shared/apiServices/engineer/engineerOpenApiService";

interface VerificationCardProps {
  type: "email" | "phone";
  contact: string;
  isVerified: boolean;
  onVerifySuccess: () => void;
  token: string | null;
}

/**
 * A component representing the verification card for email or mobile number.
 *
 * This component renders a verification card that allows users to verify their email or mobile number.
 * It utilizes the reusable `OTPInput` component for handling the OTP input.
 * 
 * NOTE: OTP API integration is enabled.
 * Uses the new OpenAPI-based OTP hooks that require JWT authorization.
 *
 * This component is designed to be rendered within a `FormContainer` from `react-hook-form`
 * to connect the OTP input to the main form state.
 *
 * @param {VerificationCardProps} props - The props for the VerificationCard component.
 * @param {string} props.type - The type of verification (email or phone).
 * @param {string} props.contact - The contact email or phone number.
 * @param {boolean} props.isVerified - Whether the contact is verified.
 * @param {() => void} props.onVerifySuccess - The function to call when the verification is successful.
 * @param {string | null} props.token - The JWT token from registration for API authorization.
 * 
 * @returns {JSX.Element} The verification card for email or mobile number.
 */
const VerificationCard = ({
  type,
  contact,
  isVerified,
  onVerifySuccess,
  token,
}: VerificationCardProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0); // Start with 0 to allow immediate send if needed
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPendingLocal, setIsPendingLocal] = useState(false);

  const methods = useForm({
    defaultValues: { otp: "" },
    mode: "onChange",
  });

  // Use new OpenAPI-based OTP hooks
  const { mutateAsync: sendOtp, isPending: isSending } = useSendOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!contact) {
      toast.error(`Please provide a valid ${type}`);
      return;
    }

    if (!token) {
      toast.error("Authorization token not found. Please register again.");
      return;
    }

    setIsPendingLocal(true);

    try {
      if (type === "email") {
        await sendOtp({
          body: { type: "email" },
          headers: { authorization: token }
        });
        toast.success(`OTP sent to email: ${contact}`);
      } else {
        await sendOtp({
          body: { type: "phone" },
          headers: { authorization: token }
        });
        toast.success(`OTP sent to mobile: ${contact}`);
      }

      setIsOtpSent(true);
      setTimeLeft(60);
    } catch (error) {
      console.error(error);
      toast.error(
        `Failed to send ${type === "email" ? "email" : "mobile"} OTP`,
      );
    } finally {
      setIsPendingLocal(false);
    }
  };

  const onSubmit = async (data: { otp: string }) => {
    if (!token) {
      toast.error("Authorization token not found. Please register again.");
      return;
    }

    setIsPendingLocal(true);

    try {
      if (type === "email") {
        await verifyOtp({
          body: { type: "email", code: data.otp },
          headers: { authorization: token }
        });
      } else {
        await verifyOtp({
          body: { type: "phone", code: data.otp },
          headers: { authorization: token }
        });
      }

      toast.success(
        `${type === "email" ? "Email" : "Mobile number"} verified successfully`,
      );
      onVerifySuccess();

    } catch (error) {
      console.error(error);
      toast.error(`Invalid ${type === "email" ? "Email" : "Mobile"} OTP`);
    } finally {
      setIsPendingLocal(false);
    }
  };

  const isPending = isSending || isVerifying || isPendingLocal;

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
                <div className="flex flex-col w-full justify-center items-center ">
                  <OTPInput name="otp" length={6} errorAlign="center" />
                </div>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 p-5 px-1">
                  <span>
                    {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
                  </span>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={timeLeft > 0 || isPending}
                    className={`text-green-600 dark:text-green-400 font-medium ${timeLeft > 0 || isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    Resend
                  </Button>
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

/**
 * ContactVerification
 *
 * This component renders a verification card for email and phone number verification.
 * It uses the `useClientRegistrationStore` hook to access the client's email and phone number.
 * It uses the `useSendOtp` and `useVerifyOtp` hooks to send and verify OTPs via OpenAPI.
 *
 * The component handles the verification process, including sending and verifying OTPs.
 * It also handles the case where the user needs to resend the OTP.
 *
 * @returns {JSX.Element} The rendered ContactVerification component.
 */
const ContactVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlClientId = searchParams.get("id");

  const {
    email,
    phone,
    clientId,
    token, // Get token from store
    setClientId,
    setSignupData,
    emailVerified,
    mobileVerified,
  } = useClientRegistrationStore();

  // Sync clientId from URL if needed
  useEffect(() => {
    if (urlClientId && urlClientId !== clientId) {
      setClientId(urlClientId);
    }
  }, [urlClientId, clientId, setClientId]);

  const handleContinue = () => {
    if (emailVerified && mobileVerified) {
      const finalId = clientId || urlClientId || "";
      const param = buildQuery({ id: finalId });
      navigate(`${absoluteUrls.client.auth.documents}?${param}`);
    } else {
      toast.error("Please verify both email and mobile number");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="shrink-0 p-4 flex flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verification
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Please verify your contact details to proceed.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 max-w-4xl mx-auto w-full flex flex-col items-center gap-6  justify-center">
        <div className="w-full md:w-1/2">
          <VerificationCard
            type="email"
            contact={email}
            isVerified={emailVerified}
            onVerifySuccess={() => {
              setSignupData({ emailVerified: true });
            }}
            token={token}
          />
        </div>

        <div className="w-full md:w-1/2">
          <VerificationCard
            type="phone"
            contact={phone}
            isVerified={mobileVerified}
            onVerifySuccess={() => {
              setSignupData({ mobileVerified: true });
            }}
            token={token}
          />
        </div>
      </div>

      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r mb-8 from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            disabled={!emailVerified || !mobileVerified}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactVerification;
