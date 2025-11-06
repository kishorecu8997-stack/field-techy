import { absoluteUrls } from "@/config/urls";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import OTPModal from "@/shared/components/commonUI/inputs/OTPModal";
import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * AdminVerifyOTP component renders a form for entering and verifying a One Time Passcode (OTP).
 * Uses a fixed field name "otp" for simplicity.
 */
export default function AdminVerifyOTP() {
  const [, setVerified] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const onVerifySuccess = React.useCallback(() => {
    // const data = methods.getValues();
    // console.log("OTP Submitted:", data.otp);
    setVerified(true);
    toast.success("OTP Verified Successfully!");
    methods.reset();
    navigate(`${absoluteUrls.admin.auth.reset_password}`);
  }, [methods, navigate]);

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <FormContainer methods={methods}>
        <OTPModal
          header="Enter One Time Passcode"
          description="Please enter the 4 digit code that we’ve sent to your email."
          name="otp"
          onVerifySuccess={onVerifySuccess}
          isClose={true}
          footer={
            <div className="my-4 text-center">
              <NavLink
                className="dark:text-teal-400 text-center hover:underline text-sm text-gray-600 underline font-semibold"
                to={absoluteUrls.admin.auth.forget_password}
              >
                Back to Forgot Password
              </NavLink>
            </div>
          }
        />
      </FormContainer>
    </div>
  );
}
