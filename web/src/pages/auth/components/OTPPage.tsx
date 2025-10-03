import { Button } from "@/shared/components/Buttons";
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
}

export interface OTPValues {
  otp: string;
}


/**
 * OTP verification page component for handling one-time password authentication.
 * Provides an input field for entering OTP, countdown timer, and resend functionality.
 * Used in email/phone verification processes during registration or login.
 * 
 * @component
 * @param {VerifyEmailModalProps} props - Component properties
 * @param {string} [props.header] - Header text for the OTP modal
 * @param {string} [props.description] - Description text for the OTP process
 * @param {() => void} [props.onClose] - Function to close the modal
 * @param {() => void} [props.handleNavigate] - Function to navigate after successful verification
 * @example
 * return (
 *   <OTPPage 
 *     header="Verify Email" 
 *     description="Enter the code sent to your email" 
 *     onClose={() => setShowOTP(false)}
 *     handleNavigate={() => navigate('/dashboard')}
 *   />
 * )
 * 
 * @returns {JSX.Element} The rendered OTP verification component
 */
const OTPPage: React.FC<VerifyEmailModalProps> = ({
  header,
  description,
  onClose,
  handleNavigate,
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

  const handleSubmit = (data: OTPValues) => {
    console.log(data, "data from OTP Form");
    handleNavigate?.();
  };

  const handleResend = () => {
    setTimeLeft(60);
    inputRefs.current[0].focus();
  };

  return (
    <div className="flex items-center justify-center  ">
      <FormContainer
        methods={method}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="bg-white rounded-xl p-6  shadow-lg relative gap-3">
          <IoClose
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 h-7 w-7 cursor-pointer"
            onClick={onClose}
          />
          <div className="p-2 flex flex-col gap-2 items-center justify-center">
            <h2 className="text-3xl font-bold">{header}</h2>
            <p className="text-md text-center text-gray-600 mb-6 px-3">{description}</p>
          </div>
          <div className="p-2">
            <OTPInput name="otp" length={4} />
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500 p-5">
              <span>
                {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
              </span>
              <button
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={`text-green-600 font-medium ${
                  timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Resend
              </button>
            </div>
          </div>
          <Button
            type="submit"
             className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default OTPPage;
